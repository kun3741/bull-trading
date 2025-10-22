import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet, Users, GraduationCap, Clock, Shield } from "lucide-react";
import DataFlowAnimation from "@/components/DataFlowAnimation";

const advantages = [
  {
    icon: TrendingUp,
    title: "Високий дохід",
    description: "Конкурентна заробітна плата з можливістю отримання бонусів за результати торгівлі",
    color: "text-primary",
  },
  {
    icon: Wallet,
    title: "Фінансова стабільність",
    description: "Гарантована оплата праці, своєчасні виплати та прозора система нарахувань",
    color: "text-accent",
  },
  {
    icon: Users,
    title: "Професійна команда",
    description: "Робота з досвідченими трейдерами та можливість обміну знаннями",
    color: "text-primary",
  },
  {
    icon: GraduationCap,
    title: "Навчання та розвиток",
    description: "Безкоштовне навчання, тренінги та доступ до професійних інструментів аналізу",
    color: "text-secondary",
  },
  {
    icon: Clock,
    title: "Гнучкий графік",
    description: "Можливість працювати віддалено та обирати зручний для себе графік роботи",
    color: "text-accent",
  },
  {
    icon: Shield,
    title: "Безпека та підтримка",
    description: "Повна юридична підтримка, безпечні умови праці та страхування",
    color: "text-primary",
  },
];

const AdvantagesSection = () => {
  return (
    <section id="advantages" className="py-24 bg-card/30 relative overflow-hidden">
      <DataFlowAnimation />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Наші <span className="text-primary">переваги</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ми створюємо найкращі умови для професійного розвитку та успішної кар'єри у трейдингу
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/40 transition-smooth hover:shadow-glow hover:scale-105 group"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-smooth`}>
                  <advantage.icon className={`w-6 h-6 ${advantage.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {advantage.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {advantage.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
