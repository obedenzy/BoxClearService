import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import ProcessSection from "@/components/process-section";
import TestimonialsSection from "@/components/testimonials-section";
import CtaSection from "@/components/cta-section";
import ServiceAreaSection from "@/components/service-area-section";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>BoxClear - Eco-Friendly Cardboard and Box Removal Service</title>
        <meta name="description" content="BoxClear offers eco-friendly cardboard and box removal services for residential and commercial clients. Book your pickup today!" />
        <meta name="keywords" content="box removal service, cardboard recycling near me, moving box pickup, eco-friendly removal" />
        <meta property="og:title" content="BoxClear - Eco-Friendly Box Removal" />
        <meta property="og:description" content="BoxClear provides eco-friendly cardboard and box removal services for homes and businesses. We recycle responsibly so you don't have to worry." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <TestimonialsSection />
      <ServiceAreaSection />
      <CtaSection />
    </>
  );
}
