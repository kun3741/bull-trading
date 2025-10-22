import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";

const ContentManager = () => {
  const [contents, setContents] = useState<any>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const sections = [
    { key: "hero", title: "Головний блок", fields: ["title", "subtitle", "buttonText"] },
    { key: "about", title: "Про компанію", fields: ["title", "description"] },
    { key: "advantages", title: "Переваги", fields: ["title", "subtitle"] },
    { key: "team", title: "Команда", fields: ["title", "subtitle"] },
    { key: "contact", title: "Контакти", fields: ["title", "subtitle"] },
  ];

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const data = await api.getContent();
      const contentMap = data.reduce((acc: any, item: any) => {
        acc[item.section] = item;
        return acc;
      }, {});
      setContents(contentMap);
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити контент",
        variant: "destructive",
      });
      if (error.message.includes('token')) {
        navigate("/admin/login");
      }
    }
  };

  const handleSave = async (section: string) => {
    setLoading({ ...loading, [section]: true });
    try {
      await api.updateContent(section, contents[section] || {});
      toast({ title: "Збережено", description: `Контент розділу "${section}" оновлено` });
      loadContent();
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading({ ...loading, [section]: false });
    }
  };

  const updateField = (section: string, field: string, value: string) => {
    setContents({
      ...contents,
      [section]: {
        ...contents[section],
        [field]: value,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <Link to="/admin/dashboard">
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад до дашборду
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            Управління <span className="text-primary">контентом</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {sections.map((section) => (
              <TabsTrigger key={section.key} value={section.key}>
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.key} value={section.key}>
              <Card className="bg-card border-primary/20">
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.fields.map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-2 capitalize">
                        {field === "title" ? "Заголовок" :
                         field === "subtitle" ? "Підзаголовок" :
                         field === "description" ? "Опис" :
                         field === "buttonText" ? "Текст кнопки" : field}
                      </label>
                      {field === "description" ? (
                        <Textarea
                          value={contents[section.key]?.[field] || ""}
                          onChange={(e) => updateField(section.key, field, e.target.value)}
                          rows={5}
                          className="bg-input border-border"
                        />
                      ) : (
                        <Input
                          value={contents[section.key]?.[field] || ""}
                          onChange={(e) => updateField(section.key, field, e.target.value)}
                          className="bg-input border-border"
                        />
                      )}
                    </div>
                  ))}
                  
                  <Button
                    onClick={() => handleSave(section.key)}
                    disabled={loading[section.key]}
                    className="bg-primary hover:bg-primary/90 w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading[section.key] ? "Збереження..." : "Зберегти"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ContentManager;

