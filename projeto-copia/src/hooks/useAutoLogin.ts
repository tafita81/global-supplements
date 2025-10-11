import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAutoLogin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
        
        // Verificar se há redirect salvo (do 404.html)
        const savedRedirect = sessionStorage.getItem('redirect');
        if (savedRedirect && savedRedirect !== '/') {
          console.log('🔄 Navegando para rota salva:', savedRedirect);
          sessionStorage.removeItem('redirect');
          navigate(savedRedirect);
        }
      }
    };
    
    autoLogin();
  }, [navigate]);

  return { isAuthenticated, isLoading };
};
