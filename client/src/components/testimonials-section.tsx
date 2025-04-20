import { motion } from "framer-motion";
import { Star, StarHalf } from "lucide-react";

const testimonials = [
  {
    text: "BoxClear made our move so much easier. They came the day after we unpacked and took all our boxes away. Fast, friendly, and eco-friendly!",
    author: "Jennifer M.",
    role: "Residential Customer",
    rating: 5,
    initials: "JM"
  },
  {
    text: "As a small business owner, the weekly box pickup service has been a game-changer. I love the recycling certificate for our sustainability reports.",
    author: "Robert J.",
    role: "Business Owner",
    rating: 5,
    initials: "RJ"
  },
  {
    text: "The team was professional and on time. They cleared out dozens of boxes from our home after a big move. Highly recommend the same-day service!",
    author: "Sarah P.",
    role: "Residential Customer",
    rating: 4.5,
    initials: "SP"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-[#00C853] mb-4"
          >
            What Our Customers Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#37474F] text-lg max-w-2xl mx-auto"
          >
            Don't just take our word for it. Here's what people think about BoxClear.
          </motion.p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 md:gap-12"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ 
                boxShadow: '0 4px 20px -2px rgba(33, 33, 33, 0.15), 0 2px 8px -1px rgba(0, 230, 118, 0.1)' 
              }}
            >
              <div className="flex items-center mb-4">
                <div className="text-[#00C853] flex">
                  {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                    <Star key={i} className="fill-current" />
                  ))}
                  {testimonial.rating % 1 > 0 && <StarHalf className="fill-current" />}
                </div>
              </div>
              <p className="text-[#37474F] mb-6 italic">{testimonial.text}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#00C853]/20 flex items-center justify-center mr-4">
                  <span className="text-[#00C853] font-semibold">{testimonial.initials}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-[#37474F]/70">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
