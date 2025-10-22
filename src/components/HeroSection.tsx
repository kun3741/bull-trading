import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import TradingAnimations from "@/components/TradingAnimations";

const HeroSection = () => {
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
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 text-shadow-glow animate-fade-in">
          <span className="text-primary">BULL</span>{" "}
          <span className="text-foreground">trading</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Шукаємо співробітників з України від 18 років з базовими навичками у трейдингу
        </p>
        
        <Button
          onClick={scrollToContact}
          size="lg"
          className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-glow hover:shadow-glow hover:scale-105 transition-smooth animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          Залишити заявку
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
