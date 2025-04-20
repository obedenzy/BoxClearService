import { useState } from "react";
import { Helmet } from "react-helmet";
import BookingForm from "@/components/booking-form";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function BookingPage() {
  const { user } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>Book Your Pickup | BoxClear</title>
        <meta name="description" content="Book your box removal service with BoxClear. Fast, eco-friendly cardboard pickup for homes and businesses." />
        <meta name="keywords" content="book box removal online, schedule cardboard pickup" />
      </Helmet>
      
      <section id="booking" className="py-16 md:py-24 bg-[#FFFFF0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#00C853] mb-4">Book Your Box Removal</h1>
            <p className="text-[#37474F] text-lg max-w-2xl mx-auto">Tell us about your needs and we'll take care of the rest.</p>
          </div>
          
          <BookingForm />
        </div>
      </section>
    </>
  );
}
