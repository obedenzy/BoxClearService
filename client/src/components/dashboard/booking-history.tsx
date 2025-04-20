import { useState } from "react";
import { format } from "date-fns";
import { Booking } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Calendar, Clock, MapPin, Package, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface BookingHistoryProps {
  bookings?: Booking[];
  isLoading: boolean;
}

export default function BookingHistory({ bookings, isLoading }: BookingHistoryProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  
  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const res = await apiRequest("PATCH", `/api/bookings/${bookingId}`, { 
        status: "cancelled" 
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setCancelDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation failed",
        description: error.message || "There was an error cancelling your booking",
        variant: "destructive",
      });
    },
  });
  
  const handleCancelBooking = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setCancelDialogOpen(true);
  };
  
  const confirmCancelBooking = () => {
    if (selectedBookingId) {
      cancelBookingMutation.mutate(selectedBookingId);
    }
  };
  
  // Format date for display
  const formatBookingDate = (dateStr: Date | string) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return format(date, "MMMM d, yyyy");
  };
  
  // Get time slot label
  const getTimeSlotLabel = (slot: string) => {
    switch (slot) {
      case "morning": return "Morning (8am - 12pm)";
      case "afternoon": return "Afternoon (12pm - 4pm)";
      case "evening": return "Evening (4pm - 7pm)";
      default: return slot;
    }
  };
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get payment status badge
  const getPaymentBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Payment Pending</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Payment Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Check if booking can be cancelled (48 hours cancellation policy)
  const canCancelBooking = (booking: Booking) => {
    if (booking.status === "cancelled" || booking.status === "completed") return false;
    
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const diffTime = bookingDate.getTime() - now.getTime();
    const diffHours = diffTime / (1000 * 3600);
    
    return diffHours >= 48;
  };
  
  // Get service type name
  const getServiceName = (serviceType: string) => {
    switch (serviceType) {
      case "small": return "Small Move Cleanup";
      case "standard": return "Standard Home Clearout";
      case "large": return "Large Estate Purge";
      case "business": return "Business Box Haul";
      default: return serviceType;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#00C853]">Booking History</CardTitle>
          <CardDescription>
            View and manage your bookings
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#00C853]" />
        </CardContent>
      </Card>
    );
  }
  
  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#00C853]">Booking History</CardTitle>
          <CardDescription>
            View and manage your bookings
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
          <p className="text-muted-foreground mb-6">You haven't made any bookings yet. Ready to schedule a pickup?</p>
          <Button asChild className="bg-[#00C853] hover:bg-[#76FF03]">
            <Link href="/booking">Book Now</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#00C853]">Booking History</CardTitle>
          <CardDescription>
            View and manage your bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="border-l-4 pl-4 py-4 border-l-[#00C853]">
                  <div className="flex flex-wrap items-center justify-between px-4">
                    <div>
                      <h3 className="text-lg font-medium">
                        {getServiceName(booking.serviceType)}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatBookingDate(booking.date)}
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeSlotLabel(booking.timeSlot)}
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="font-medium text-[#00C853]">
                          {booking.serviceType === "small" ? "Up to 10 boxes" : 
                           booking.serviceType === "standard" ? "Up to 25 boxes" : 
                           booking.serviceType === "large" ? "Up to 50 boxes" : 
                           booking.serviceType === "business" ? "Unlimited boxes" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      {getStatusBadge(booking.status)}
                      {getPaymentBadge(booking.paymentStatus)}
                    </div>
                  </div>
                  
                  <div className="px-4 mt-4">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{booking.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-between items-center px-4 mt-4 pt-4 border-t">
                    <div className="flex items-center">
                      <span className="font-medium">Total:</span>
                      <span className="ml-2 text-[#00C853] font-bold">${booking.price}</span>
                    </div>
                    
                    {canCancelBooking(booking) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Cancel Booking Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelBookingMutation.isPending}
            >
              Keep Booking
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmCancelBooking}
              disabled={cancelBookingMutation.isPending}
            >
              {cancelBookingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
