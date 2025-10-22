import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { ArrowLeft, Save, Plus, Pencil, Trash2, TrendingUp, Wallet, Users, GraduationCap, Clock, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Advantage {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  initials?: string;
  photo?: string;
  description: string;
  order: number;
}

interface Stat {
  _id?: string;
  value: string;
  label: string;
  order: number;
}

const iconMap: any = {
  TrendingUp,
  Wallet,
  Users,
  GraduationCap,
  Clock,
  Shield,
};

const sectionConfig: any = {
  hero: {
    title: "Головна сторінка",
    fields: [
      { name: "title", label: "Заголовок (BULL)", type: "input" },
      { name: "subtitle", label: "Підзаголовок", type: "textarea" },
      { name: "buttonText", label: "Текст кнопки", type: "input" }
    ]
  },
  about: {
    title: "Про компанію",
    hasStats: true,
    fields: [
      { name: "title", label: "Частина заголовка (перша)", type: "input" },
      { name: "titleHighlight", label: "Частина заголовка (виділена)", type: "input" },
      { name: "paragraph1", label: "Перший абзац", type: "textarea" },
      { name: "paragraph2", label: "Другий абзац", type: "textarea" },
      { name: "paragraph3", label: "Третій абзац", type: "textarea" }
    ]
  },
  advantages: {
    title: "Переваги",
    hasAdvantages: true,
    fields: [
      { name: "title", label: "Заголовок секції", type: "input" },
      { name: "subtitle", label: "Підзаголовок секції", type: "textarea" }
    ]
  },
  team: {
    title: "Команда",
    hasTeam: true,
    fields: [
      { name: "title", label: "Заголовок секції", type: "input" },
      { name: "subtitle", label: "Підзаголовок секції", type: "textarea" }
    ]
  },
  contact: {
    title: "Контакти",
    fields: [
      { name: "title", label: "Частина заголовка (перша)", type: "input" },
      { name: "titleHighlight", label: "Частина заголовка (виділена)", type: "input" },
      { name: "subtitle", label: "Підзаголовок форми", type: "textarea" }
    ]
  },
  footer: {
    title: "Футер",
    fields: [
      { name: "description", label: "Опис компанії", type: "textarea" },
      { name: "phone", label: "Телефон", type: "input" },
      { name: "email", label: "Email", type: "input" },
      { name: "instagram", label: "Instagram (посилання)", type: "input" },
      { name: "telegram", label: "Telegram (посилання)", type: "input" },
      { name: "viber", label: "Viber (посилання)", type: "input" },
      { name: "facebook", label: "Facebook (посилання)", type: "input" }
    ]
  },
};

const SectionManager = () => {
  const { section } = useParams<{ section: string }>();
  const config = section ? sectionConfig[section] : null;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(false);
  
  // For advantages
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [advantageDialog, setAdvantageDialog] = useState(false);
  const [editingAdvantage, setEditingAdvantage] = useState<Advantage | null>(null);
  const [advantageForm, setAdvantageForm] = useState<Advantage>({
    title: "", description: "", icon: "TrendingUp", color: "text-primary", order: 0
  });

  // For team
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamDialog, setTeamDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState<TeamMember>({
    name: "", role: "", initials: "", photo: "", description: "", order: 0
  });
  const [photoPreview, setPhotoPreview] = useState<string>("");

  // For stats
  const [stats, setStats] = useState<Stat[]>([]);
  const [statDialog, setStatDialog] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [statForm, setStatForm] = useState<Stat>({ value: "", label: "", order: 0 });

  useEffect(() => {
    if (!section || !config) {
      navigate("/admin/dashboard");
      return;
    }
    loadData();
  }, [section]);

  const loadData = async () => {
    try {
      // Load content
      const contentData = await api.getContentBySection(section!).catch(() => ({}));
      setContent(contentData);

      // Load additional data based on section
      if (config?.hasAdvantages) {
        const advantagesData = await api.getAdvantages().catch(() => []);
        setAdvantages(advantagesData);
      }
      if (config?.hasTeam) {
        const teamData = await api.getTeamMembers().catch(() => []);
        setTeam(teamData);
      }
      if (config?.hasStats) {
        const statsData = await api.getStats().catch(() => []);
        setStats(statsData);
      }
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити дані",
        variant: "destructive",
      });
      if (error.message?.includes('token')) {
        navigate("/admin/login");
      }
    }
  };

  const handleSaveContent = async () => {
    setLoading(true);
    try {
      await api.updateContent(section!, content);
      toast({ title: "Збережено", description: "Контент секції оновлено" });
      loadData();
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setContent({ ...content, [field]: value });
  };

  // Advantage handlers
  const handleSaveAdvantage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAdvantage?._id) {
        await api.updateAdvantage(editingAdvantage._id, advantageForm);
        toast({ title: "Оновлено", description: "Перевага оновлена" });
      } else {
        await api.createAdvantage(advantageForm);
        toast({ title: "Створено", description: "Нова перевага додана" });
      }
      setAdvantageDialog(false);
      setEditingAdvantage(null);
      setAdvantageForm({ title: "", description: "", icon: "TrendingUp", color: "text-primary", order: 0 });
      loadData();
    } catch (error: any) {
      toast({ title: "Помилка", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteAdvantage = async (id: string) => {
    if (!confirm("Видалити цю перевагу?")) return;
    try {
      await api.deleteAdvantage(id);
      toast({ title: "Видалено", description: "Перевага видалена" });
      loadData();
    } catch (error: any) {
      toast({ title: "Помилка", description: error.message, variant: "destructive" });
    }
  };

  // Team handlers
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...teamForm,
        initials: teamForm.initials || getInitials(teamForm.name),
      };
      if (editingMember?._id) {
        await api.updateTeamMember(editingMember._id, dataToSend);
        toast({ title: "Оновлено", description: "Член команди оновлений" });
      } else {
        await api.createTeamMember(dataToSend);
        toast({ title: "Створено", description: "Новий член команди доданий" });
      }
      setTeamDialog(false);
      setEditingMember(null);
      setTeamForm({ name: "", role: "", initials: "", photo: "", description: "", order: 0 });
      setPhotoPreview("");
      loadData();
    } catch (error: any) {
      toast({ title: "Помилка", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm("Видалити цього члена команди?")) return;
    try {
      await api.deleteTeamMember(id);
      toast({ title: "Видалено", description: "Член команди видалений" });
      loadData();
    } catch (error: any) {
      toast({ title: "Помилка", description: error.message, variant: "destructive" });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "Помилка", description: "Розмір файлу не повинен перевищувати 2MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTeamForm({ ...teamForm, photo: base64String });
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Stats handlers
  const handleSaveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStat?._id) {
        await api.updateStat(editingStat._id, statForm);
        toast({ title: "Оновлено", description: "Статистика оновлена" });
      } else {
        await api.createStat(statForm);
        toast({ title: "Створено", description: "Нова статистика додана" });
      }
      setStatDialog(false);
      setEditingStat(null);
      setStatForm({ value: "", label: "", order: 0 });
      loadData();
    } catch (error: any) {
      toast({ title: "Помилка", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteStat = async (id: string) => {
    if (!confirm("Видалити цю статистику?")) return;
    try {
      await api.deleteStat(id);
      toast({ title: "Видалено", description: "Статистика видалена" });
      loadData();
    } catch (error: any) {
      toast({ title: "Помилка", description: error.message, variant: "destructive" });
    }
  };

  if (!config) return null;

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
            Секція: <span className="text-primary">{config.title}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Всі налаштування цієї секції в одному місці
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Content Section */}
        <Card className="bg-card border-primary/20">
          <CardHeader>
            <CardTitle>Контент секції</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.fields.map((field: any) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-2">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={content[field.name] || ""}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    rows={5}
                    className="bg-input border-border"
                  />
                ) : (
                  <Input
                    value={content[field.name] || ""}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    className="bg-input border-border"
                  />
                )}
              </div>
            ))}
            
            <Button
              onClick={handleSaveContent}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Збереження..." : "Зберегти контент"}
            </Button>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        {config.hasStats && (
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Статистика</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Цифри, які відображаються в секції "Про компанію"
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setEditingStat(null);
                    setStatForm({ value: "", label: "", order: stats.length });
                    setStatDialog(true);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Додати
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <Card key={stat._id} className="relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingStat(stat);
                          setStatForm(stat);
                          setStatDialog(true);
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => stat._id && handleDeleteStat(stat._id)}
                        className="border-destructive/40"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Advantages Section */}
        {config.hasAdvantages && (
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Список переваг</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Переваги роботи в компанії з іконками
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setEditingAdvantage(null);
                    setAdvantageForm({ title: "", description: "", icon: "TrendingUp", color: "text-primary", order: advantages.length });
                    setAdvantageDialog(true);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Додати
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {advantages.map((advantage) => {
                  const IconComponent = iconMap[advantage.icon] || TrendingUp;
                  return (
                    <Card key={advantage._id} className="relative group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingAdvantage(advantage);
                            setAdvantageForm(advantage);
                            setAdvantageDialog(true);
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => advantage._id && handleDeleteAdvantage(advantage._id)}
                          className="border-destructive/40"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <IconComponent className={`w-6 h-6 ${advantage.color}`} />
                        </div>
                        <CardTitle className="text-xl">{advantage.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{advantage.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Section */}
        {config.hasTeam && (
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Члени команди</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Фото та опис членів команди
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setEditingMember(null);
                    setTeamForm({ name: "", role: "", initials: "", photo: "", description: "", order: team.length });
                    setPhotoPreview("");
                    setTeamDialog(true);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Додати
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {team.map((member) => (
                  <Card key={member._id} className="relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingMember(member);
                          setTeamForm(member);
                          setPhotoPreview(member.photo || "");
                          setTeamDialog(true);
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => member._id && handleDeleteTeamMember(member._id)}
                        className="border-destructive/40"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        {member.photo ? (
                          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-primary">
                            {member.initials || getInitials(member.name)}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-center text-lg">{member.name}</CardTitle>
                      <p className="text-center text-primary font-semibold text-sm">{member.role}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-xs text-center">{member.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      {/* Advantage Dialog */}
      <Dialog open={advantageDialog} onOpenChange={setAdvantageDialog}>
        <DialogContent className="bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle>
              {editingAdvantage ? "Редагувати перевагу" : "Нова перевага"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAdvantage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Назва</label>
              <Input
                value={advantageForm.title}
                onChange={(e) => setAdvantageForm({ ...advantageForm, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Опис</label>
              <Textarea
                value={advantageForm.description}
                onChange={(e) => setAdvantageForm({ ...advantageForm, description: e.target.value })}
                required
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Іконка</label>
              <Select value={advantageForm.icon} onValueChange={(value) => setAdvantageForm({ ...advantageForm, icon: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TrendingUp">Графік (TrendingUp)</SelectItem>
                  <SelectItem value="Wallet">Гаманець (Wallet)</SelectItem>
                  <SelectItem value="Users">Люди (Users)</SelectItem>
                  <SelectItem value="GraduationCap">Навчання (GraduationCap)</SelectItem>
                  <SelectItem value="Clock">Годинник (Clock)</SelectItem>
                  <SelectItem value="Shield">Щит (Shield)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Колір</label>
              <Select value={advantageForm.color} onValueChange={(value) => setAdvantageForm({ ...advantageForm, color: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-primary">Зелений (Primary)</SelectItem>
                  <SelectItem value="text-accent">Помаранчевий (Accent)</SelectItem>
                  <SelectItem value="text-secondary">Червоний (Secondary)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Порядок</label>
              <Input
                type="number"
                value={advantageForm.order}
                onChange={(e) => setAdvantageForm({ ...advantageForm, order: parseInt(e.target.value) })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAdvantageDialog(false)}>
                Скасувати
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingAdvantage ? "Зберегти" : "Створити"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Team Dialog */}
      <Dialog open={teamDialog} onOpenChange={setTeamDialog}>
        <DialogContent className="bg-card border-primary/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Редагувати члена команди" : "Новий член команди"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveTeamMember} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ім'я та Прізвище</label>
              <Input
                value={teamForm.name}
                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Посада</label>
              <Input
                value={teamForm.role}
                onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Фото</label>
              {photoPreview ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTeamForm({ ...teamForm, photo: "" });
                      setPhotoPreview("");
                    }}
                  >
                    Видалити фото
                  </Button>
                </div>
              ) : (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Опис</label>
              <Textarea
                value={teamForm.description}
                onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                required
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Порядок</label>
              <Input
                type="number"
                value={teamForm.order}
                onChange={(e) => setTeamForm({ ...teamForm, order: parseInt(e.target.value) })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTeamDialog(false)}>
                Скасувати
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingMember ? "Зберегти" : "Створити"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stat Dialog */}
      <Dialog open={statDialog} onOpenChange={setStatDialog}>
        <DialogContent className="bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle>
              {editingStat ? "Редагувати статистику" : "Нова статистика"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveStat} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Значення (наприклад: 50+)</label>
              <Input
                value={statForm.value}
                onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                placeholder="50+"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Підпис</label>
              <Input
                value={statForm.label}
                onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                placeholder="Трейдерів"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Порядок</label>
              <Input
                type="number"
                value={statForm.order}
                onChange={(e) => setStatForm({ ...statForm, order: parseInt(e.target.value) })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStatDialog(false)}>
                Скасувати
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingStat ? "Зберегти" : "Створити"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionManager;

