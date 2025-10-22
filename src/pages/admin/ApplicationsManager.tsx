import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Application {
  _id: string;
  name: string;
  phone: string;
  email: string;
  status: 'new' | 'in_progress' | 'completed' | 'rejected';
  notes: string;
  telegramSent: boolean;
  telegramError: string | null;
  createdAt: string;
}

const statusColors = {
  new: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  completed: 'bg-green-500',
  rejected: 'bg-red-500',
};

const statusLabels = {
  new: 'Нова',
  in_progress: 'В обробці',
  completed: 'Завершена',
  rejected: 'Відхилена',
};

export default function ApplicationsManager() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await api.getApplications();
      setApplications(data);
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити заявки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (app: Application) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditNotes(app.notes || '');
    setDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;

    try {
      await api.updateApplication(selectedApp._id, {
        status: editStatus,
        notes: editNotes,
      });

      toast({
        title: "Успіх",
        description: "Статус заявки оновлено",
      });

      setDialogOpen(false);
      loadApplications();
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося оновити заявку",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цю заявку?')) return;

    try {
      await api.deleteApplication(id);
      toast({
        title: "Успіх",
        description: "Заявку видалено",
      });
      loadApplications();
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося видалити заявку",
        variant: "destructive",
      });
    }
  };

  const handleResendToTelegram = async (id: string) => {
    try {
      const result = await api.resendApplicationToTelegram(id);
      
      if (result.success) {
        toast({
          title: "Успіх",
          description: "Повідомлення відправлено в Telegram",
        });
      } else {
        toast({
          title: "Помилка",
          description: result.error || "Не вдалося відправити в Telegram",
          variant: "destructive",
        });
      }
      
      loadApplications();
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося відправити в Telegram",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <p className="text-center text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/admin/dashboard'}
            className="mb-4"
          >
            ← Назад до панелі
          </Button>
          
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">
                Управління заявками
              </CardTitle>
              <p className="text-muted-foreground">
                Всього заявок: {applications.length}
              </p>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-card border-primary/20">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">№</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Ім'я</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Telegram</TableHead>
                    <TableHead>Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        Заявок поки немає
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app, index) => (
                      <TableRow key={app._id}>
                        <TableCell className="font-medium text-primary">
                          {index + 1}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(app.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium">{app.name}</TableCell>
                        <TableCell>{app.phone}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[app.status]}>
                            {statusLabels[app.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {app.telegramSent ? (
                            <Badge className="bg-green-500">✓ Відправлено</Badge>
                          ) : (
                            <Badge variant="destructive">
                              ✗ {app.telegramError ? 'Помилка' : 'Не відправлено'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(app)}
                            >
                              Переглянути
                            </Button>
                            {!app.telegramSent && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResendToTelegram(app._id)}
                                className="text-blue-500"
                              >
                                📤 Telegram
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(app._id)}
                            >
                              Видалити
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-card border-primary/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary">Деталі заявки</DialogTitle>
              <DialogDescription>
                Переглядайте та редагуйте інформацію про заявку
              </DialogDescription>
            </DialogHeader>
            
            {selectedApp && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ім'я</label>
                    <p className="text-foreground">{selectedApp.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Телефон</label>
                    <p className="text-foreground">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Дата створення</label>
                    <p className="text-foreground">{formatDate(selectedApp.createdAt)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telegram статус</label>
                  <p className="text-foreground">
                    {selectedApp.telegramSent ? (
                      <Badge className="bg-green-500">✓ Відправлено в Telegram</Badge>
                    ) : (
                      <Badge variant="destructive">
                        ✗ Не відправлено
                        {selectedApp.telegramError && `: ${selectedApp.telegramError}`}
                      </Badge>
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Статус заявки
                  </label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Нова</SelectItem>
                      <SelectItem value="in_progress">В обробці</SelectItem>
                      <SelectItem value="completed">Завершена</SelectItem>
                      <SelectItem value="rejected">Відхилена</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Примітки
                  </label>
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Додайте примітки до заявки..."
                    rows={4}
                    className="bg-input border-border"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Скасувати
                  </Button>
                  <Button onClick={handleUpdateStatus} className="bg-primary">
                    Зберегти зміни
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

