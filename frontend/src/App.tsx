
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore, useSettingsStore } from "@/lib/store";
import AppShell from "@/components/layout/app-shell";
import Home from "./pages/Home";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Portfolios from "./pages/Portfolios";
import PortfolioDetail from "./pages/PortfolioDetail";
import CreatePortfolio from "./pages/CreatePortfolio";
import AddAsset from "./pages/AddAsset";
import Alerts from "./pages/Alerts";
import CreateAlert from "./pages/CreateAlert";
import Analysis from "./pages/Analysis";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const { theme } = useSettingsStore();
  const { isAuthenticated } = useAuthStore();

  // Apply theme on initial load
  useEffect(() => {
    if (theme === 'dark' || 
       (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} />
            
            <Route path="/" element={<AppShell />}>
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="portfolios" element={
                <ProtectedRoute>
                  <Portfolios />
                </ProtectedRoute>
              } />
              <Route path="portfolios/new" element={
                <ProtectedRoute>
                  <CreatePortfolio />
                </ProtectedRoute>
              } />
              <Route path="portfolios/:id" element={
                <ProtectedRoute>
                  <PortfolioDetail />
                </ProtectedRoute>
              } />
              <Route path="portfolios/:id/add-asset" element={
                <ProtectedRoute>
                  <AddAsset />
                </ProtectedRoute>
              } />
              <Route path="alerts" element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              } />
              <Route path="alerts/new" element={
                <ProtectedRoute>
                  <CreateAlert />
                </ProtectedRoute>
              } />
              <Route path="analysis" element={
                <ProtectedRoute>
                  <Analysis />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
