import { useState, useEffect } from "react";
import { Instagram, Send, Phone, Mail, Facebook } from "lucide-react";
import bullLogo from "@/assets/bull-logo-footer.png";
import { api } from "@/lib/api";

const Footer = () => {
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    const loadContent = async () => {
      try {
        const footerContent = await api.getContentBySection('footer').catch(() => ({}));
        setContent(footerContent);
      } catch (error) {
        console.error('Failed to load footer content:', error);
      }
    };
    loadContent();
  }, []);

  return (
    <footer className="bg-black border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <img src={bullLogo} alt="BULL trading" className="h-16 w-auto mb-4" />
            <p className="text-muted-foreground">
              {content.description || "Професійна команда трейдерів для вашого успіху на фінансових ринках"}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Контакти</h3>
            <div className="space-y-3">
              <a
                href={`tel:${content.phone || '+380123456789'}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth"
              >
                <Phone className="w-4 h-4" />
                <span>{content.phone || "+380 12 345 67 89"}</span>
              </a>
              <a
                href={`mailto:${content.email || 'info@bulltrading.com'}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth"
              >
                <Mail className="w-4 h-4" />
                <span>{content.email || "info@bulltrading.com"}</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Соціальні мережі</h3>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: content.instagram || "#", label: "Instagram" },
                { icon: Send, href: content.telegram || "#", label: "Telegram" },
                { icon: Phone, href: content.viber || "#", label: "Viber" },
                { icon: Facebook, href: content.facebook || "#", label: "Facebook" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary flex items-center justify-center text-primary transition-smooth hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} BULL trading. Всі права захищено.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
