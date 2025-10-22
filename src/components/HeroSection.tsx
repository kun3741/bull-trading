import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import bullLogo from "@/assets/bull-logo.png";
import TradingAnimations from "@/components/TradingAnimations";
import { api } from "@/lib/api";

const HeroSection = () => {
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    const loadContent = async () => {
      try {
        const heroContent = await api.getContentBySection('hero').catch(() => ({}));
        setContent(heroContent);
      } catch (error) {
        console.error('Failed to load hero content:', error);
      }
    };
    loadContent();
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 gradient-hero" />
      <TradingAnimations />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="flex justify-center mb-8 animate-fade-in">
          <img src={bullLogo} alt="BULL trading" className="h-32 md:h-40 w-auto" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 text-shadow-glow animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="text-primary">{content.title || 'BULL'}</span>{" "}
          <span className="text-foreground">trading</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {content.subtitle || 'Шукаємо співробітників з України від 18 років з базовими навичками у трейдингу'}
        </p>
        
        <Button
          onClick={scrollToContact}
          size="lg"
          className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-glow hover:shadow-glow hover:scale-105 transition-smooth animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          {content.buttonText || 'Залишити заявку'}
        </Button>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
