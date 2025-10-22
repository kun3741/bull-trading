import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import CandlestickAnimation from "@/components/CandlestickAnimation";
import aboutCompanyImg from "@/assets/about-company.png";
import { api } from "@/lib/api";

const AboutSection = () => {
  const [content, setContent] = useState<any>({});
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const aboutContent = await api.getContentBySection('about').catch(() => ({}));
        setContent(aboutContent);
        
        // Load stats from API
        const statsData = await api.getStats().catch(() => []);
        if (statsData.length > 0) {
          setStats(statsData);
        } else {
          // Fallback to default stats
          setStats([
            { value: "50+", label: "Трейдерів" },
            { value: "5+", label: "Років на ринку" },
            { value: "24/7", label: "Підтримка" },
          ]);
        }
      } catch (error) {
        console.error('Failed to load about content:', error);
      }
    };
    loadContent();
  }, []);

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      <CandlestickAnimation />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-primary/20 shadow-glow">
              <img 
                src={aboutCompanyImg} 
                alt="BULL trading" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {content.title || 'Про'} <span className="text-primary">{content.titleHighlight || 'компанію'}</span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              {content.paragraph1 ? (
                <p dangerouslySetInnerHTML={{ __html: content.paragraph1 }} />
              ) : (
                <p>
                  <span className="text-primary font-semibold">BULL trading</span> — це динамічна команда професійних трейдерів, 
                  які спеціалізуються на торгівлі на фінансових ринках.
                </p>
              )}
              
              {content.paragraph2 ? (
                <p>{content.paragraph2}</p>
              ) : (
                <p>
                  Ми пропонуємо унікальну можливість для молодих талантів з України розвивати свої навички 
                  у трейдингу та досягати фінансового успіху разом з досвідченими наставниками.
                </p>
              )}
              
              {content.paragraph3 ? (
                <p>{content.paragraph3}</p>
              ) : (
                <p>
                  Наша місія — створити середовище, де кожен член команди може розкрити свій потенціал, 
                  отримати професійний розвиток та досягти високих результатів на ринку.
                </p>
              )}
              
              <div className="pt-4 grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="p-4 text-center bg-card border-primary/20 hover:border-primary/40 transition-smooth">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
