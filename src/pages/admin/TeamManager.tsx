import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  initials?: string;
  photo?: string;
  description: string;
  order: number;
}

const TeamManager = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamMember>({
    name: "",
    role: "",
    initials: "",
    photo: "",
    description: "",
    order: 0,
  });
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await api.getTeamMembers();
      setMembers(data);
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити команду",
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
      // Автоматично генеруємо ініціали якщо їх немає
      const dataToSend = {
        ...formData,
        initials: formData.initials || getInitials(formData.name),
      };

      if (editingMember?._id) {
        await api.updateTeamMember(editingMember._id, dataToSend);
        toast({ title: "Оновлено", description: "Член команди оновлений" });
      } else {
        await api.createTeamMember(dataToSend);
        toast({ title: "Створено", description: "Новий член команди доданий" });
      }
      setIsDialogOpen(false);
      setEditingMember(null);
      setFormData({ name: "", role: "", initials: "", photo: "", description: "", order: 0 });
      setPhotoPreview("");
      loadMembers();
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData(member);
    setPhotoPreview(member.photo || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити цього члена команди?")) return;
    try {
      await api.deleteTeamMember(id);
      toast({ title: "Видалено", description: "Член команди видалений" });
      loadMembers();
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleNewMember = () => {
    setEditingMember(null);
    setFormData({ name: "", role: "", initials: "", photo: "", description: "", order: members.length });
    setPhotoPreview("");
    setIsDialogOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Помилка",
          description: "Розмір файлу не повинен перевищувати 2MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, photo: base64String });
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, photo: "" });
    setPhotoPreview("");
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
              Управління <span className="text-primary">командою</span>
            </h1>
            <Button onClick={handleNewMember} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Додати члена
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <Card key={member._id} className="bg-card border-border relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(member)}
                  className="border-primary/40"
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => member._id && handleDelete(member._id)}
                  className="border-destructive/40 hover:bg-destructive/10"
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
                <CardTitle className="text-center text-xl">{member.name}</CardTitle>
                <p className="text-center text-primary font-semibold">{member.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm text-center">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Редагувати члена команди" : "Новий член команди"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ім'я та Прізвище</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Олександр Коваленко"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Посада</label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Head Trader"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Фото</label>
              <div className="space-y-3">
                {photoPreview ? (
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="border-destructive/40 hover:bg-destructive/10"
                      >
                        Видалити фото
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Після видалення будуть показані ініціали
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Якщо фото не вибрано, будуть використані ініціали з імені та прізвища
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Максимальний розмір: 2MB
                    </p>
                    {formData.name && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {getInitials(formData.name)}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Буде показано: {getInitials(formData.name)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                {editingMember ? "Зберегти" : "Створити"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManager;

