import { useState, useEffect } from "react";
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
    website: "", // Honeypot field - invisible to users
  });
  const [errors, setErrors] = useState({
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    const loadContent = async () => {
      try {
        const contactContent = await api.getContentBySection('contact').catch(() => ({}));
        setContent(contactContent);
      } catch (error) {
        console.error('Failed to load contact content:', error);
      }
    };
    loadContent();
  }, []);

  // Валідація номера телефону
  const validatePhone = (phone: string): string => {
    if (!phone) return "";
    
    // Очищуємо від пробілів та дефісів для перевірки
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    
    // Перевіряємо що містить тільки цифри та +
    if (!/^[\+\d]+$/.test(cleanPhone)) {
      return "Телефон може містити тільки цифри та знак +";
    }
    
    // Перевіряємо українські номери (+380XXXXXXXXX - 13 символів)
    if (cleanPhone.startsWith("+380")) {
      if (cleanPhone.length > 13) {
        return "Номер телефону занадто довгий (максимум 13 символів з +380)";
      }
      if (cleanPhone.length < 13 && cleanPhone.length > 4) {
        return "Введіть повний номер телефону (+380XXXXXXXXX)";
      }
    } else if (cleanPhone.startsWith("+")) {
      // Інші міжнародні номери (до 15 цифр згідно E.164)
      if (cleanPhone.length > 15) {
        return "Номер телефону занадто довгий (максимум 15 символів)";
      }
    } else if (cleanPhone.startsWith("0")) {
      // Локальний формат (0XXXXXXXXX - 10 цифр)
      if (cleanPhone.length > 10) {
        return "Номер телефону занадто довгий (максимум 10 цифр)";
      }
      if (cleanPhone.length < 10 && cleanPhone.length > 1) {
        return "Введіть повний номер телефону (10 цифр)";
      }
    }
    
    return "";
  };

  // Валідація email
  const validateEmail = (email: string): string => {
    if (!email) return "";
    
    // Перевірка на базовий формат email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Введіть коректну адресу електронної пошти";
    }
    
    // Перевірка на максимальну довжину
    if (email.length > 254) {
      return "Email занадто довгий";
    }
    
    // Перевірка на некоректні символи
    if (/[а-яА-ЯіІїЇєЄґҐ]/.test(email)) {
      return "Email не може містити кирилицю";
    }
    
    return "";
  };

  // Обробка зміни телефону
  const handlePhoneChange = (value: string) => {
    // Обмежуємо довжину вводу
    const maxLength = value.startsWith("+") ? 15 : 10;
    const truncatedValue = value.slice(0, maxLength);
    
    setFormData({ ...formData, phone: truncatedValue });
    
    // Валідуємо тільки якщо поле не пусте
    if (truncatedValue) {
      const error = validatePhone(truncatedValue);
      setErrors({ ...errors, phone: error });
    } else {
      setErrors({ ...errors, phone: "" });
    }
  };

  // Обробка зміни email
  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value });
    
    // Валідуємо тільки якщо поле не пусте
    if (value) {
      const error = validateEmail(value);
      setErrors({ ...errors, email: error });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Перевірка на заповненість полів
    if (!formData.name || !formData.phone || !formData.email) {
      toast({
        title: "Помилка",
        description: "Будь ласка, заповніть всі поля",
        variant: "destructive",
      });
      return;
    }

    // Остаточна валідація перед відправкою
    const phoneError = validatePhone(formData.phone);
    const emailError = validateEmail(formData.email);
    
    if (phoneError || emailError) {
      setErrors({ phone: phoneError, email: emailError });
      toast({
        title: "Помилка валідації",
        description: "Будь ласка, виправте помилки у формі",
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
      
      setFormData({ name: "", phone: "", email: "", website: "" });
      setErrors({ phone: "", email: "" });
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
              {content.title || 'Стань частиною'} <span className="text-primary">{content.titleHighlight || 'команди'}</span>
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              {content.subtitle || "Заповни форму і ми зв'яжемося з тобою для обговорення деталей співпраці"}
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
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  required
                  className={`bg-input border-border focus:border-primary transition-smooth ${
                    errors.phone ? "border-destructive" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                )}
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
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required
                  className={`bg-input border-border focus:border-primary transition-smooth ${
                    errors.email ? "border-destructive" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              {/* Honeypot field - приховане від користувачів, але боти його заповнюють */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <Input
                  id="website"
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
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
