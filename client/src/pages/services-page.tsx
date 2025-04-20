import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import ServiceCard from "@/components/service-card";
import ServiceAreaSection from "@/components/service-area-section";
import { Helmet } from "react-helmet";

const services = [
  {
    id: "small",
    name: "Small Move Cleanup",
    price: 75,
    popular: false,
    description: "One-time service",
    features: [
      "Up to 10 boxes",
      "Studio to 1-bedroom",
      "Basic recycling",
      "48hr pickup window"
    ]
  },
  {
    id: "standard",
    name: "Standard Home Clearout",
    price: 120,
    popular: true,
    description: "One-time service",
    features: [
      "Up to 25 boxes",
      "2-3 bedroom home",
      "Premium recycling guarantee",
      "24hr pickup window"
    ]
  },
  {
    id: "large",
    name: "Large Estate Purge",
    price: 200,
    popular: false,
    description: "One-time service",
    features: [
      "Up to 50 boxes",
      "4+ bedroom home",
      "Premium recycling guarantee",
      "Same-day availability"
    ]
  },
  {
    id: "business",
    name: "Business Box Haul",
    price: 350,
    popular: false,
    description: "One-time service",
    features: [
      "Unlimited boxes",
      "Office or retail space",
      "Weekly scheduled pickup",
      "Recycling certificate provided"
    ]
  }
];

const addons = [
  {
    id: "sameday",
    name: "Same-Day Service",
    price: 25,
    description: "Get your boxes removed on the same day when you book before noon."
  },
  {
    id: "recycling",
    name: "Premium Recycling",
    price: 15,
    description: "Receive a detailed recycling certificate for your environmental records."
  },
  {
    id: "materials",
    name: "Packing Materials",
    price: 20,
    description: "We'll remove additional packing materials like bubble wrap and packing peanuts."
  }
];

export default function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Our Services | BoxClear</title>
        <meta name="description" content="Choose the right box removal plan for your needs, whether it's a small apartment or a large business." />
        <meta name="keywords" content="residential box removal, commercial cardboard pickup, affordable moving box disposal" />
      </Helmet>
      
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-[#00C853] mb-4">Our Services</h1>
            <p className="text-[#37474F] text-lg max-w-2xl mx-auto">
              Choose the right box removal plan for your needs, whether it's a small apartment or a large business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard 
                key={service.id}
                service={service}
              />
            ))}
          </div>
          
          {/* How It Works */}
          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-[#00C853] text-center mb-8">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border border-gray-100">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#00C853]/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-[#00C853] font-bold text-lg">1</span>
                    </div>
                    <h4 className="font-semibold text-lg">Choose Your Service</h4>
                  </div>
                  <p className="text-sm text-[#37474F]/80">Select the service that best fits your needs based on how many boxes you need removed. We have options for small apartments to large business spaces.</p>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-100">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#00C853]/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-[#00C853] font-bold text-lg">2</span>
                    </div>
                    <h4 className="font-semibold text-lg">Schedule Pickup</h4>
                  </div>
                  <p className="text-sm text-[#37474F]/80">Book a convenient date and time slot for our team to arrive. Our simple booking system makes it quick and easy to set up your pickup.</p>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-100">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#00C853]/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-[#00C853] font-bold text-lg">3</span>
                    </div>
                    <h4 className="font-semibold text-lg">Enjoy a Cleaner Space</h4>
                  </div>
                  <p className="text-sm text-[#37474F]/80">We'll arrive on time, remove all your boxes, and ensure they're properly recycled. All you have to do is enjoy your newly decluttered space!</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-[#00C853] hover:bg-[#76FF03] text-white">
              <Link href="/booking">Schedule Your Pickup</Link>
            </Button>
          </div>
        </div>
      </section>
      <ServiceAreaSection />
    </>
  );
}
