import { motion } from "framer-motion";
import { Recycle, Zap, Building } from "lucide-react";

const features = [
  {
    icon: <Recycle className="text-[#00C853] text-2xl" />,
    title: "Eco-Friendly Removal",
    description: "We recycle 100% of the cardboard we collect, turning your waste into valuable resources."
  },
  {
    icon: <Zap className="text-[#00C853] text-2xl" />,
    title: "Same-Day Service",
    description: "Need boxes gone now? We offer same-day pickup in most service areas when you book before noon."
  },
  {
    icon: <Building className="text-[#00C853] text-2xl" />,
    title: "Residential & Commercial",
    description: "From single-family homes to large office buildings, we have plans for every box removal need."
  }
];

// Animation variants for staggered animations
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

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FFFFF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-[#00C853] mb-4"
          >
            Why Choose BoxClear?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#37474F] text-lg max-w-2xl mx-auto"
          >
            We make cardboard and box removal hassle-free while prioritizing environmental responsibility.
          </motion.p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 md:gap-12"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ 
                boxShadow: '0 4px 20px -2px rgba(33, 33, 33, 0.15), 0 2px 8px -1px rgba(0, 230, 118, 0.1)' 
              }}
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#00C853]/10 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#37474F] mb-3">{feature.title}</h3>
              <p className="text-[#37474F]/80">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
