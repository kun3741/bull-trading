import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { ArrowLeft, Plus, Pencil, Trash2, TrendingUp, Wallet, Users, GraduationCap, Clock, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Advantage {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  color: string;
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

const AdvantagesManager = () => {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdvantage, setEditingAdvantage] = useState<Advantage | null>(null);
  const [formData, setFormData] = useState<Advantage>({
    title: "",
    description: "",
    icon: "TrendingUp",
    color: "text-primary",
    order: 0,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadAdvantages();
  }, []);

  const loadAdvantages = async () => {
    try {
      const data = await api.getAdvantages();
      setAdvantages(data);
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити переваги",
        variant: "destructive",
      });
      if (error.message.includes('token')) {
        navigate("/admin/login");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAdvantage?._id) {
        await api.updateAdvantage(editingAdvantage._id, formData);
        toast({ title: "Оновлено", description: "Перевага оновлена" });
      } else {
        await api.createAdvantage(formData);
        toast({ title: "Створено", description: "Нова перевага додана" });
      }
      setIsDialogOpen(false);
      setEditingAdvantage(null);
      setFormData({ title: "", description: "", icon: "TrendingUp", color: "text-primary", order: 0 });
      loadAdvantages();
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (advantage: Advantage) => {
    setEditingAdvantage(advantage);
    setFormData(advantage);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити цю перевагу?")) return;
    try {
      await api.deleteAdvantage(id);
      toast({ title: "Видалено", description: "Перевага видалена" });
      loadAdvantages();
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleNew = () => {
    setEditingAdvantage(null);
    setFormData({ title: "", description: "", icon: "TrendingUp", color: "text-primary", order: advantages.length });
    setIsDialogOpen(true);
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Управління <span className="text-primary">перевагами</span>
            </h1>
            <Button onClick={handleNew} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Додати перевагу
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage) => {
            const IconComponent = iconMap[advantage.icon] || TrendingUp;
            return (
              <Card key={advantage._id} className="bg-card border-border relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(advantage)}
                    className="border-primary/40"
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => advantage._id && handleDelete(advantage._id)}
                    className="border-destructive/40 hover:bg-destructive/10"
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle>
              {editingAdvantage ? "Редагувати перевагу" : "Нова перевага"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Назва</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Опис</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Іконка</label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
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
              <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
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
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Скасувати
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingAdvantage ? "Зберегти" : "Створити"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvantagesManager;

