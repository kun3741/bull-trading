import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, FileText, Award, Users, Phone, Mail, Footprints, LogOut, FileStack } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ApplicationsManager from "./ApplicationsManager";

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

  const contentSections = [
    {
      title: "Головна сторінка",
      description: "Контент героїчної секції з кнопкою CTA",
      icon: Home,
      path: "/admin/section/hero",
      color: "text-primary",
    },
    {
      title: "Про компанію",
      description: "Текст, статистика та інформація про компанію",
      icon: FileText,
      path: "/admin/section/about",
      color: "text-primary",
    },
    {
      title: "Переваги",
      description: "Заголовок секції та список переваг роботи",
      icon: Award,
      path: "/admin/section/advantages",
      color: "text-accent",
    },
    {
      title: "Команда",
      description: "Заголовок секції та члени команди",
      icon: Users,
      path: "/admin/section/team",
      color: "text-primary",
    },
    {
      title: "Контакти",
      description: "Заголовок та текст форми зворотнього зв'язку",
      icon: Phone,
      path: "/admin/section/contact",
      color: "text-secondary",
    },
    {
      title: "Футер",
      description: "Контактна інформація та посилання на соцмережі",
      icon: Footprints,
      path: "/admin/section/footer",
      color: "text-muted-foreground",
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
            Керування <span className="text-primary">сайтом</span>
          </h2>
          <p className="text-muted-foreground">
            Виберіть розділ для редагування або перегляду заявок
          </p>
        </div>

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileStack className="w-4 h-4" />
              Контент
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            <ApplicationsManager />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Tabs defaultValue="hero" className="w-full">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
                <TabsTrigger value="hero" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Головна
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Про компанію
                </TabsTrigger>
                <TabsTrigger value="advantages" className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Переваги
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Команда
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Контакти
                </TabsTrigger>
                <TabsTrigger value="footer" className="flex items-center gap-2">
                  <Footprints className="w-4 h-4" />
                  Футер
                </TabsTrigger>
              </TabsList>

              {contentSections.map((section) => (
                <TabsContent key={section.path} value={section.path.split('/').pop() || ''}>
                  <Card className="border-primary/20">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center`}>
                          <section.icon className={`w-6 h-6 ${section.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-foreground">
                            {section.title}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground mt-1">
                            {section.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center py-12">
                        <Link to={section.path}>
                          <Button size="lg" className="gap-2">
                            Редагувати секцію
                            <FileText className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-6 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-primary">Інструкції</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-muted-foreground">
                      <p>• Всі зміни зберігаються автоматично в базу даних</p>
                      <p>• Для перегляду змін на сайті оновіть сторінку</p>
                      <p>• Зміни відображаються одразу для всіх користувачів</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

