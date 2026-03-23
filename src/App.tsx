import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import FlamTabXBlog from "./pages/FlamTabX";
import NotFound from "./pages/NotFound";

const EnergySavingsPage = lazy(() => import("./pages/EnergySavingsPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog/flamtabx" element={<FlamTabXBlog />} />
          <Route
            path="/tools/energy-savings"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
                    Loading calculator…
                  </div>
                }
              >
                <EnergySavingsPage />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={<Navigate to={{ pathname: "/", hash: "closing" }} replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
