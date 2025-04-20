import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { format } from "date-fns";

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CalendarIcon, CheckCircle } from "lucide-react";

// Initialize Stripe
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

// Service types and prices with box range
const services = [
  { id: "small", name: "Small Move Cleanup", price: 75, boxRange: "1-5 boxes" },
  { id: "standard", name: "Standard Home Clearout", price: 120, boxRange: "6-15 boxes" },
  { id: "large", name: "Large Estate Purge", price: 200, boxRange: "16-30 boxes" },
  { id: "business", name: "Business Box Haul", price: 350, boxRange: "30+ boxes" }
];

// Time slots
const timeSlots = [
  { id: "morning", label: "Morning (8am - 12pm)" },
  { id: "afternoon", label: "Afternoon (12pm - 4pm)" },
  { id: "evening", label: "Evening (4pm - 7pm)" }
];

// Form schema
const bookingFormSchema = z.object({
  serviceType: z.string().min(1, { message: "Please select a service" }),
  addons: z.array(z.string()).optional(),
  date: z.date({ required_error: "Please select a date" }),
  timeSlot: z.string({ required_error: "Please select a time slot" }),
  email: z.string().email({ message: "Valid email is required" }).min(1, { message: "Email is required for booking confirmations" }),
  addressLine1: z.string().min(3, { message: "Address line 1 is required" }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid zip code is required" }),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required for notifications" }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

// Booking Form Component (with Stripe integration)
function BookingFormContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const queryClient = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);

  // Initialize form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceType: "standard",
      addons: [],
      date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
      timeSlot: "",
      email: user?.email || "", // Auto-populate for logged-in users
      addressLine1: "", // User might have these values when we implement address storage
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: user?.phone || "", // Use existing phone field if available
    },
  });

  // Watch form values to calculate price
  const serviceType = form.watch("serviceType");
  const selectedAddons = form.watch("addons") || [];

  // Calculate price whenever selections change
  useEffect(() => {
    const selectedService = services.find(s => s.id === serviceType);
    const basePrice = selectedService ? selectedService.price : 0;

    const addonCost = selectedAddons.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return total + (addon ? addon.price : 0);
    }, 0);

    setCalculatedPrice(basePrice + addonCost);
  }, [serviceType, selectedAddons]);

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      // Format address from separate fields for storage
      const formattedAddress = `${data.addressLine1}${data.addressLine2 ? ', ' + data.addressLine2 : ''}, ${data.city}, ${data.state} ${data.zipCode}`;

      const bookingData = {
        serviceType: data.serviceType,
        date: data.date,
        timeSlot: data.timeSlot,
        address: formattedAddress,
        phoneNumber: data.phoneNumber,
        email: data.email, // Add email for guest bookings and notifications
        price: calculatedPrice,
        userId: user?.id, // Will be null for guest bookings
        status: "booked",
        paymentStatus: "paid",
        addons: selectedAddons.map(id => {
          const addon = addons.find(a => a.id === id);
          return { id, name: addon?.name, price: addon?.price };
        }),
      };

      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return await res.json();
    },
    onSuccess: (booking) => {
      setBookingId(booking.id);
      // Create payment intent
      createPaymentIntent(booking.id, calculatedPrice);
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message || "There was an error creating your booking",
        variant: "destructive",
      });
    },
  });

  // Create payment intent
  const createPaymentIntent = async (bookingId: number, amount: number) => {
    try {
      const isSubscription = services.find(s => s.id === serviceType)?.subscription;

      if (isSubscription) {
        // For subscription (Business Box Haul)
        const res = await apiRequest("POST", "/api/get-or-create-subscription", { 
          priceId: import.meta.env.STRIPE_PRICE_ID || "price_default"
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } else {
        // For one-time payments
        const res = await apiRequest("POST", "/api/create-payment-intent", { 
          amount,
          bookingId,
          email: form.getValues("email")
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to create payment");
        }
        setClientSecret(data.clientSecret);
        return data;
      }
    } catch (error: any) {
      toast({
        title: "Payment setup failed",
        description: error.message || "Could not initialize payment",
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const onSubmit = async (data: BookingFormValues) => {
    // Allow booking without login - proceed directly to creating the booking
    // The backend will handle anonymous bookings (userId will be null)
    createBookingMutation.mutate(data);
  };

  // Handle payment submission
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessingPayment(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessingPayment(false);
      return;
    }

    // Get the email either from user account or from the booking form
    const guestEmail = form.getValues("email");
    const guestName = form.getValues("phoneNumber"); // Use phone number as name for guest bookings if no user profile

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: user?.firstName && user?.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : (user?.username || guestName),
          email: user?.email || guestEmail, // Use guest email for non-logged in users
        },
      },
    });

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message || "Your payment was not successful, please try again.",
        variant: "destructive",
      });
    } else if (paymentIntent.status === "succeeded") {
        const bookingData = {
          service: services.find(s => s.id === serviceType)?.name,
          date: form.getValues("date"),
          timeSlot: form.getValues("timeSlot"),
          address: `${form.getValues("addressLine1")}${form.getValues("addressLine2") ? ', ' + form.getValues("addressLine2") : ''}, ${form.getValues("city")}, ${form.getValues("state")} ${form.getValues("zipCode")}`,
          email: form.getValues("email"),
          phone: form.getValues("phoneNumber"),
        };
        setConfirmedBooking(bookingData);

        // Send data to webhook
        try {
          await fetch('https://n8n.leadluxedigital.com/webhook-test/bookingform', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              service: services.find(s => s.id === serviceType)?.name,
              date: form.getValues("date"),
              timeSlot: form.getValues("timeSlot"),
              address: `${form.getValues("addressLine1")}${form.getValues("addressLine2") ? ', ' + form.getValues("addressLine2") : ''}, ${form.getValues("city")}, ${form.getValues("state")} ${form.getValues("zipCode")}`,
              email: form.getValues("email"),
              phone: form.getValues("phoneNumber")
            })
          });

          // Show success notification
          toast({
            title: "Booking confirmed",
            description: "Your booking has been successfully processed!",
          });
          setShowConfirmation(true);

        } catch (error) {
          console.error('Error sending booking data to webhook:', error);
          toast({
            title: "Booking completed",
            description: "Your booking is confirmed but there was an issue with notifications.",
            variant: "destructive",
          });
          setShowConfirmation(true);
        }
    }

    setIsProcessingPayment(false);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "PPP");
  };

  if (showConfirmation && confirmedBooking) {
    return (
      <Card className="bg-white rounded-xl shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-[#00C853]/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-[#00C853]" />
          </div>
          <CardTitle className="text-2xl text-[#00C853]">Booking Confirmed!</CardTitle>
          <CardDescription>Thank you for choosing BoxClear</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Service Details</h3>
              <p className="text-[#37474F]">{confirmedBooking.service}</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Date & Time</h3>
              <p className="text-[#37474F]">
                {format(confirmedBooking.date, "PPP")} - {" "}
                {timeSlots.find(slot => slot.id === confirmedBooking.timeSlot)?.label}
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Pickup Address</h3>
              <p className="text-[#37474F]">{confirmedBooking.address}</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-[#37474F]">{confirmedBooking.email}</p>
              <p className="text-[#37474F]">{confirmedBooking.phone}</p>
            </div>
            <div className="bg-[#00C853]/5 p-4 rounded-lg">
              <p className="text-sm text-center">
                A confirmation email has been sent to your email address.
                Our team will call you shortly to confirm your booking details.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-[#00C853] hover:bg-[#76FF03]"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-lg">
      {!clientSecret ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00C853]">Book Your Service</CardTitle>
              <CardDescription>Choose your service type and preferences</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Service Selection */}
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold">Select Service</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                      >
                        {services.map((service) => (
                          <div key={service.id} className="relative">
                            <RadioGroupItem
                              value={service.id}
                              id={`service-${service.id}`}
                              className="peer sr-only"
                            />
                            <label
                              htmlFor={`service-${service.id}`}
                              className="block border border-gray-200 rounded-lg p-3 text-center cursor-pointer transition-all hover:border-[#00C853] peer-checked:border-[#00C853] peer-checked:bg-[#00C853]/5"
                            >
                              <span className="block font-medium">{service.name}</span>
                              <span className="block text-sm text-slate-600 mt-1">
                                {service.boxRange}
                              </span>
                              <span className="block text-sm font-semibold text-[#00C853] mt-1">
                                ${service.price}
                              </span>
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              {/* Date/Time selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-base font-semibold">Pickup Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                formatDate(field.value)
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < new Date(new Date().setHours(0, 0, 0, 0)) // Disable past dates
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Preferred Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map(slot => (
                            <SelectItem key={slot.id} value={slot.id}>{slot.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold">Contact Information</h3>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="For booking confirmations" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="For notifications and confirmations" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold">Address Information</h3>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="Street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Apartment, suite, unit, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Zip code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-[#00C853]/5 p-4 rounded-lg">
                <h4 className="font-semibold text-[#37474F] mb-3">Order Summary</h4>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between font-bold">
                    <span>{services.find(s => s.id === serviceType)?.name || "Selected service"}</span>
                    <span className="text-[#00C853]">${services.find(s => s.id === serviceType)?.price || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-[#00C853] hover:bg-[#76FF03] text-white"
                disabled={createBookingMutation.isPending}
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      ) : (
        <form onSubmit={handlePayment}>
          <CardHeader>
            <CardTitle className="text-2xl text-[#00C853]">Payment Information</CardTitle>
            <CardDescription>Complete your payment to confirm your booking</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-[#00C853]/5 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-[#37474F] mb-3">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div>
                    <span>{services.find(s => s.id === serviceType)?.name}</span>
                    <div className="text-sm text-[#37474F]/70">
                      {services.find(s => s.id === serviceType)?.boxRange}
                    </div>
                  </div>
                  <span className="text-[#00C853] font-bold">${calculatedPrice}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="block text-[#37474F] font-semibold mb-4">Card Details</label>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#37474F',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#ef4444',
                    },
                  },
                }}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-[#00C853] hover:bg-[#76FF03] text-white"
              disabled={!stripe || !clientSecret || isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                "Complete Booking"
              )}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}

// Wrapper component that provides Stripe context
export default function BookingForm() {
  if (!stripePromise) {
    return (
      <Card className="bg-white rounded-xl shadow-lg p-8 text-center">
        <CardContent>
          <p className="text-red-500 mb-2">Stripe API key is not configured.</p>
          <p>Please set the VITE_STRIPE_PUBLIC_KEY environment variable.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <BookingFormContent />
    </Elements>
  );
}