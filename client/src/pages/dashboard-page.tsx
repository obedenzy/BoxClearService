import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import UserProfile from "@/components/dashboard/user-profile";
import BookingHistory from "@/components/dashboard/booking-history";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings"],
    enabled: !!user
  });
  
  return (
    <>
      <Helmet>
        <title>Dashboard | BoxClear</title>
        <meta name="description" content="Manage your BoxClear account, bookings, and profile" />
      </Helmet>
      
      <div className="bg-[#FFFFF0] min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#37474F]">Dashboard</h1>
          <p className="text-[#37474F]/70 mt-2 mb-8">Manage your account and bookings</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl text-[#00C853]">
                  Welcome, {user?.firstName || user?.username}
                </CardTitle>
                <CardDescription>
                  Manage your BoxClear account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="bookings"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  orientation="vertical"
                  className="w-full"
                >
                  <TabsList className="flex flex-col items-start w-full h-auto space-y-2">
                    <TabsTrigger value="bookings" className="w-full justify-start">
                      Booking History
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="w-full justify-start">
                      Profile Settings
                    </TabsTrigger>
                    {user?.role === "admin" && (
                      <TabsTrigger value="admin" className="w-full justify-start">
                        Admin Panel
                      </TabsTrigger>
                    )}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="bookings" className="mt-0">
                  <BookingHistory bookings={bookings} isLoading={bookingsLoading} />
                </TabsContent>
                
                <TabsContent value="profile" className="mt-0">
                  <UserProfile user={user} />
                </TabsContent>
                
                {user?.role === "admin" && (
                  <TabsContent value="admin" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl text-[#00C853]">Admin Panel</CardTitle>
                        <CardDescription>
                          Manage all user bookings and accounts
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Admin functionality coming soon</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
