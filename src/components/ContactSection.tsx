import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TradeProfitAnimation from "@/components/TradeProfitAnimation";
import { api } from "@/lib/api";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email) {
      toast({
        title: "Помилка",
        description: "Будь ласка, заповніть всі поля",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.submitApplication(formData);
      
      toast({
        title: "Заявку надіслано!",
        description: "Ми зв'яжемося з вами найближчим часом",
      });
      
      setFormData({ name: "", phone: "", email: "" });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося надіслати заявку. Спробуйте пізніше.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-card/30 relative overflow-hidden">
      <TradeProfitAnimation />
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <Card className="bg-card border-primary/20 shadow-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-foreground mb-2">
              Стань частиною <span className="text-primary">команди</span>
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Заповни форму і ми зв'яжемося з тобою для обговорення деталей співпраці
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Ім'я *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Введіть ваше ім'я"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-input border-border focus:border-primary transition-smooth"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Телефон *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+380 XX XXX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-input border-border focus:border-primary transition-smooth"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Пошта *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-input border-border focus:border-primary transition-smooth"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-glow hover:shadow-glow hover:scale-105 transition-smooth"
              >
                {isSubmitting ? "Відправляємо..." : "Відправити заявку"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;
