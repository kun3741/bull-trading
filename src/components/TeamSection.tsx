import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import NetworkAnimation from "@/components/NetworkAnimation";
import { api } from "@/lib/api";

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [content, setContent] = useState<any>({});

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [members, teamContent] = await Promise.all([
          api.getTeamMembers(),
          api.getContentBySection('team').catch(() => ({}))
        ]);
        setTeamMembers(members);
        setContent(teamContent);
      } catch (error) {
        console.error('Failed to load team data:', error);
        // Fallback to default data
        setTeamMembers([
          {
            name: "Олександр Коваленко",
            role: "Head Trader",
            initials: "ОК",
            description: "10+ років досвіду на ринках. Спеціалізується на криптовалютах та деривативах.",
          },
          {
            name: "Марія Шевченко",
            role: "Senior Analyst",
            initials: "МШ",
            description: "Експерт з технічного аналізу та розробки торгових стратегій.",
          },
          {
            name: "Андрій Мельник",
            role: "Risk Manager",
            initials: "АМ",
            description: "Фахівець з управління ризиками та оптимізації торгових портфелів.",
          },
          {
            name: "Катерина Бондаренко",
            role: "Trading Coach",
            initials: "КБ",
            description: "Наставник та тренер для нових членів команди. 8 років у трейдингу.",
          },
        ]);
      }
    };
    loadData();
  }, []);

  return (
    <section id="team" className="py-24 bg-background relative overflow-hidden">
      <NetworkAnimation />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {content.title || "Наша"} <span className="text-primary">команда</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {content.subtitle || "Досвідчені професіонали, готові поділитися своїми знаннями та допомогти вам досягти успіху"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={member._id || index}
              className="bg-card border-border hover:border-primary/40 transition-smooth hover:shadow-glow hover:scale-105 group"
            >
              <CardContent className="pt-8 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-primary/30 group-hover:border-primary transition-smooth overflow-hidden bg-primary/20 flex items-center justify-center">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {member.initials || getInitials(member.name)}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {member.name}
                </h3>
                
                <div className="text-primary font-semibold mb-3">
                  {member.role}
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
