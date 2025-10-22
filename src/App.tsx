import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import TeamManager from "./pages/admin/TeamManager";
import AdvantagesManager from "./pages/admin/AdvantagesManager";
import StatsManager from "./pages/admin/StatsManager";
import ContentManager from "./pages/admin/ContentManager";
import ApplicationsManager from "./pages/admin/ApplicationsManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/team" element={<TeamManager />} />
          <Route path="/admin/advantages" element={<AdvantagesManager />} />
          <Route path="/admin/stats" element={<StatsManager />} />
          <Route path="/admin/content" element={<ContentManager />} />
          <Route path="/admin/applications" element={<ApplicationsManager />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
