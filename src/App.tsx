import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useSecurityMonitoring } from "./hooks/useSecurityMonitoring";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import SocialConnect from "./pages/SocialConnect";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ConhecaMais from "./pages/ConhecaMais";
import FAQ from "./pages/FAQ";
import Precos from "./pages/Precos";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import AdminTest from "./pages/AdminTest";
import AdminLogs from "./pages/AdminLogs";
import ScrollToTop from "./components/ScrollToTop";
import InstallPWA from "./components/InstallPWA";
import { SecurityHeaders } from "./components/SecurityHeaders";
import SocialMindDashboard from "./features/socialmind/Dashboard";
import SocialMindAudience from "./features/socialmind/Audience";
import SocialMindCampaigns from "./features/socialmind/Campaigns";

const queryClient = new QueryClient();

const SecurityMonitoringWrapper = ({ children }: { children: React.ReactNode }) => {
  useSecurityMonitoring();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SecurityMonitoringWrapper>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SecurityHeaders />
          <ScrollToTop />
          <InstallPWA />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/social-connect" element={<SocialConnect />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/conheca-mais" element={<ConhecaMais />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/precos" element={<Precos />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/socialmind/dashboard" element={<SocialMindDashboard />} />
            <Route path="/socialmind/audience" element={<SocialMindAudience />} />
            <Route path="/socialmind/campaigns" element={<SocialMindCampaigns />} />
            <Route path="/admin/teste" element={<AdminTest />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SecurityMonitoringWrapper>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
