import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <AdvantagesSection />
      <TeamSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
