import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative bg-[#37474F] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/cardboard-boxes.jpg" 
          alt="Stacked cardboard boxes ready for recycling" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#37474F] via-[#37474F]/90 to-[#37474F]/60 opacity-90"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-3/5"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FFFFF0] leading-tight mb-6">
            Clear Your Boxes Today
          </h1>
          <p className="text-lg md:text-xl text-[#FFFFF0]/90 mb-8 max-w-lg">
            BoxClear provides eco-friendly cardboard and box removal services for homes and businesses. We recycle responsibly so you don't have to worry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-[#00C853] hover:bg-[#76FF03] text-white shadow-lg transition-transform hover:-translate-y-1">
              <Link href="/booking">Book Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-[#FFFFF0] text-[#37474F] hover:bg-[#FFFFF0]/90 transition-all">
              <Link href="/services">See Our Services</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
