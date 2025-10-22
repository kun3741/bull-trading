import { useState, useEffect } from "react";
import bullLogo from "@/assets/bull-logo.png";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        isScrolled ? "bg-black/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => scrollToSection("hero")}
          className="flex items-center gap-3 hover:opacity-80 transition-smooth"
        >
          <img src={bullLogo} alt="BULL trading" className="h-12 w-auto" />
        </button>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Про компанію", id: "about" },
            { label: "Переваги", id: "advantages" },
            { label: "Команда", id: "team" },
            { label: "Контакти", id: "contact" },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-foreground/80 hover:text-primary font-medium transition-smooth relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
