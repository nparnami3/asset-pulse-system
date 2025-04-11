
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Providers
import { ApiProvider } from "@/context/ApiContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AssetsPage from "./pages/AssetsPage";
import AssetAddPage from "./pages/AssetAddPage";
import AssetEditPage from "./pages/AssetEditPage";
import AssetViewPage from "./pages/AssetViewPage";
import ImportPage from "./pages/ImportPage";
import DatabasePage from "./pages/DatabasePage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import ApiConfigPage from "./pages/ApiConfigPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ApiProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/assets/add" element={<AssetAddPage />} />
            <Route path="/assets/edit/:assetId" element={<AssetEditPage />} />
            <Route path="/assets/view/:assetId" element={<AssetViewPage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="/api-config" element={<ApiConfigPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ApiProvider>
  </QueryClientProvider>
);

export default App;
