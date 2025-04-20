import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceProps {
  service: {
    id: string;
    name: string;
    price: number;
    popular: boolean;
    description: string;
    features: string[];
  };
}

export default function ServiceCard({ service }: ServiceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`overflow-hidden border border-gray-100 ${service.popular ? 'lg:scale-105 z-10' : ''}`}>
        <CardHeader className={`p-6 ${service.popular ? 'bg-[#00C853] text-white' : 'bg-[#00C853]/10'}`}>
          {service.popular && (
            <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-2">
              POPULAR
            </div>
          )}
          <h3 className={`text-xl font-semibold ${service.popular ? 'text-white' : 'text-[#00C853]'}`}>
            {service.name}
          </h3>
          <div className={`mt-4 text-3xl font-bold ${service.popular ? 'text-white' : 'text-[#37474F]'}`}>
            ${service.price}
          </div>
          <p className={`${service.popular ? 'text-white/80' : 'text-[#37474F]/70'} mt-2`}>
            {service.description}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-3">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="text-[#00C853] mt-1 mr-2 h-5 w-5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button asChild className="w-full bg-[#00C853] hover:bg-[#76FF03]">
            <Link href="/booking">
              {service.id === 'business' ? 'Subscribe' : 'Book Now'}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
