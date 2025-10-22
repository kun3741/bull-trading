import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Stat {
  _id?: string;
  value: string;
  label: string;
  order: number;
}

const StatsManager = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [formData, setFormData] = useState<Stat>({
    value: "",
    label: "",
    order: 0,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити статистику",
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
      if (editingStat?._id) {
        await api.updateStat(editingStat._id, formData);
        toast({ title: "Оновлено", description: "Статистика оновлена" });
      } else {
        await api.createStat(formData);
        toast({ title: "Створено", description: "Нова статистика додана" });
      }
      setIsDialogOpen(false);
      setEditingStat(null);
      setFormData({ value: "", label: "", order: 0 });
      loadStats();
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (stat: Stat) => {
    setEditingStat(stat);
    setFormData(stat);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити цю статистику?")) return;
    try {
      await api.deleteStat(id);
      toast({ title: "Видалено", description: "Статистика видалена" });
      loadStats();
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleNew = () => {
    setEditingStat(null);
    setFormData({ value: "", label: "", order: stats.length });
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
              Управління <span className="text-primary">статистикою</span>
            </h1>
            <Button onClick={handleNew} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Додати статистику
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat._id} className="bg-card border-primary/20 relative group hover:border-primary/40 transition-smooth">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(stat)}
                  className="border-primary/40"
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => stat._id && handleDelete(stat._id)}
                  className="border-destructive/40 hover:bg-destructive/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-normal">{stat.label}</div>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {stats.length === 0 && (
          <Card className="bg-card border-border text-center py-12">
            <CardContent>
              <p className="text-muted-foreground text-lg">
                Статистика ще не додана. Натисніть "Додати статистику" щоб створити першу.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle>
              {editingStat ? "Редагувати статистику" : "Нова статистика"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Значення</label>
              <Input
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="50+, 24/7, 100%"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Наприклад: "50+", "5+", "24/7"
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Підпис</label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Трейдерів, Років на ринку"
                required
              />
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
                {editingStat ? "Зберегти" : "Створити"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatsManager;

