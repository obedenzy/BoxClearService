import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Booking } from "@shared/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Package } from "lucide-react";

const lookupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LookupFormValues = z.infer<typeof lookupSchema>;

export default function LookupBookingPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const form = useForm<LookupFormValues>({
    resolver: zodResolver(lookupSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: LookupFormValues) {
    setIsLoading(true);
    try {
      const response = await apiRequest(
        "GET",
        `/api/guest-bookings?email=${encodeURIComponent(data.email)}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to find bookings");
      }
      
      const bookingsData = await response.json();
      setBookings(bookingsData);
      setSearched(true);
      
      if (bookingsData.length === 0) {
        toast({
          title: "No bookings found",
          description: "No bookings were found for this email address.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while looking up bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(date: string | Date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getServiceName(serviceType: string) {
    const serviceMap: Record<string, string> = {
      standard: "Standard Box Pickup",
      express: "Express Box Pickup",
      business: "Business Box Haul",
      moving: "Moving Box Collection",
    };
    return serviceMap[serviceType] || serviceType;
  }
  
  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Booking Lookup</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email to find your BoxClear booking details
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Find Your Booking</CardTitle>
            <CardDescription>
              Enter the email address you used when booking our service.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Find Bookings"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {searched && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              {bookings.length > 0
                ? `Found ${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`
                : "No bookings found"}
            </h2>

            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{getServiceName(booking.serviceType)}</CardTitle>
                        <CardDescription>Booking #{booking.id}</CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 opacity-70" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 opacity-70" />
                          <span>{booking.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 opacity-70" />
                          <span>{booking.address}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Package className="h-4 w-4 opacity-70 mt-1" />
                          <div>
                            <p className="font-medium">Service Details</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.notes || "No special instructions"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="font-medium">Total</span>
                          <span className="font-bold">${booking.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Payment Status</span>
                          <span className={`text-sm ${
                            booking.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                          }`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Created on {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      toast({
                        title: "Contact Support",
                        description: "Please call (555) 123-4567 for booking changes or questions.",
                      });
                    }}>
                      Need Help?
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}