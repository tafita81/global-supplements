import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAutoLogin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('🔐 Auto-login: Tentando autenticação...');
          
          // Tentar login
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email: 'admin@globalsuplements.com',
            password: 'GlobalSupplements2025!'
          });
          
          if (loginError) {
            console.log('⚠️ Autenticação falhou, mas continuando (modo sem autenticação)');
            console.log('📝 Erro:', loginError.message);
          } else {
            console.log('✅ Auto-login: Sucesso!');
          }
        } else {
          console.log('✅ Já autenticado:', session.user.email);
        }
      } catch (err) {
        console.log('⚠️ Erro na autenticação, continuando sem login:', err);
      } finally {
        // SEMPRE permitir acesso, independente de autenticação
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };
    
    autoLogin();
  }, []);

  return { isAuthenticated, isLoading };
};
