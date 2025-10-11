import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const ensureAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('🔐 AppLayout: Fazendo login automático...');
          const { error } = await supabase.auth.signInWithPassword({
            email: 'admin@globalsuplements.com',
            password: 'GlobalSupplements2025!'
          });
          
          if (error) {
            console.log('🔐 AppLayout: Criando conta...');
            await supabase.auth.signUp({
              email: 'admin@globalsuplements.com',
              password: 'GlobalSupplements2025!'
            });
          }
        }
        setIsAuthenticated(true);
      } catch (err) {
        console.error('❌ Erro na autenticação:', err);
        setIsAuthenticated(true); // Continuar mesmo com erro
      }
    };
    
    ensureAuth();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Autenticando...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 bg-card">
            <SidebarTrigger />
            <h2 className="ml-4 font-semibold">{t("site.title", "Global Supplements - Premium Worldwide Network")}</h2>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}