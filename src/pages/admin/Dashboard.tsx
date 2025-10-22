import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Award, BarChart3, FileText, LogOut, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.verify();
      } catch (error) {
        toast({
          title: "Сесія закінчилась",
          description: "Будь ласка, увійдіть знову",
          variant: "destructive",
        });
        navigate("/admin/login");
      }
    };
    checkAuth();
  }, [navigate, toast]);

  const handleLogout = () => {
    api.logout();
    toast({
      title: "Вихід виконано",
      description: "До побачення!",
    });
    navigate("/admin/login");
  };

  const sections = [
    {
      title: "Заявки",
      description: "Перегляд та обробка заявок",
      icon: Mail,
      path: "/admin/applications",
      color: "text-green-500",
    },
    {
      title: "Команда",
      description: "Керування членами команди",
      icon: Users,
      path: "/admin/team",
      color: "text-primary",
    },
    {
      title: "Переваги",
      description: "Редагування переваг компанії",
      icon: Award,
      path: "/admin/advantages",
      color: "text-accent",
    },
    {
      title: "Статистика",
      description: "Управління статистичними даними",
      icon: BarChart3,
      path: "/admin/stats",
      color: "text-secondary",
    },
    {
      title: "Контент",
      description: "Редагування текстового контенту",
      icon: FileText,
      path: "/admin/content",
      color: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-primary">BULL</span> trading
            <span className="text-muted-foreground text-lg ml-2">/ Адмін панель</span>
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-primary/40 hover:bg-primary/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Вийти
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Керування <span className="text-primary">контентом</span>
          </h2>
          <p className="text-muted-foreground">
            Виберіть розділ для редагування
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link key={section.path} to={section.path}>
              <Card className="bg-card border-border hover:border-primary/40 transition-smooth hover:shadow-glow hover:scale-105 group cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-smooth`}>
                    <section.icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {section.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-8 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Інструкції</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Всі зміни зберігаються автоматично в базу даних</p>
            <p>• Для перегляду змін на сайті оновіть сторінку</p>
            <p>• Зміни відображаються одразу для всіх користувачів</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

