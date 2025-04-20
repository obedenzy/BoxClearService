import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CtaSection() {
  return (
    <section className="bg-[#37474F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-lg overflow-hidden shadow-lg aspect-video"
          >
            <img 
              src="/images/recycling.jpg" 
              alt="Eco-friendly cardboard recycling process" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#37474F] via-transparent to-transparent opacity-60"></div>
            <p className="absolute bottom-2 w-full text-sm text-center text-[#FFFFF0] font-medium">
              Eco-friendly cardboard recycling process
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFF0] mb-6">Get a Cleaner Space. Help the Planet.</h2>
            <p className="text-[#FFFFF0]/80 text-lg mb-8">
              Our professional team will remove all your boxes and ensure they're properly recycled, not sent to a landfill. Every pickup helps save trees and reduces waste.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-[#00C853] mb-1">98%</div>
                <p className="text-[#FFFFF0]/70 text-sm">Recycling Rate</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-[#00C853] mb-1">Instant</div>
                <p className="text-[#FFFFF0]/70 text-sm">Response Time</p>
              </div>
            </div>
            <Button asChild size="lg" className="bg-[#00C853] hover:bg-[#76FF03] text-white shadow-lg transition-transform hover:-translate-y-1">
              <Link href="/booking">Schedule a Pickup</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
