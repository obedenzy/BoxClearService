import { motion } from "framer-motion";
import { ShoppingBag, PackageCheck, Recycle } from "lucide-react";

const steps = [
  {
    icon: <ShoppingBag className="text-[#00C853] text-2xl" />,
    title: "Step 1: Gather Your Boxes",
    description: "Gather your boxes and put them in a convenient pickup location such as your garage, curbside, or another accessible area."
  },
  {
    icon: <PackageCheck className="text-[#00C853] text-2xl" />,
    title: "Step 2: We Pick Up",
    description: "We will come to pick up the boxes at your scheduled time. No need to flatten them - we'll handle that for you."
  },
  {
    icon: <Recycle className="text-[#00C853] text-2xl" />,
    title: "Step 3: Eco-Friendly Recycling",
    description: "We'll take them for recycling, ensuring your cardboard waste is processed responsibly and sustainably."
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

export default function ProcessSection() {
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
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#37474F] text-lg max-w-2xl mx-auto"
          >
            Our simple three-step process makes box removal effortless
          </motion.p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 md:gap-12"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-[#FFFFF0] rounded-xl p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ 
                boxShadow: '0 4px 20px -2px rgba(33, 33, 33, 0.15), 0 2px 8px -1px rgba(0, 230, 118, 0.1)' 
              }}
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#00C853]/10 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#37474F] mb-3">{step.title}</h3>
              <p className="text-[#37474F]/80">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-[#37474F] italic">
            "Our goal is to make box removal as effortless as possible for you while ensuring environmental responsibility."
          </p>
        </motion.div>
      </div>
    </section>
  );
}