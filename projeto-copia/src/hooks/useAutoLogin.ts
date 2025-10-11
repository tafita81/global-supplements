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
          console.log('🔐 Auto-login: Iniciando...');
          
          // Tentar login primeiro
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email: 'admin@globalsuplements.com',
            password: 'GlobalSupplements2025!'
          });
          
          if (loginError) {
            console.log('🔐 Auto-login: Conta não existe, criando...');
            
            // Se login falhar, criar conta
            const { error: signUpError } = await supabase.auth.signUp({
              email: 'admin@globalsuplements.com',
              password: 'GlobalSupplements2025!',
              options: {
                data: {
                  full_name: 'Admin Global Supplements'
                }
              }
            });
            
            if (signUpError) {
              console.error('❌ Erro ao criar conta:', signUpError);
            } else {
              console.log('✅ Conta criada! Fazendo login...');
              
              // Fazer login após criar conta
              await supabase.auth.signInWithPassword({
                email: 'admin@globalsuplements.com',
                password: 'GlobalSupplements2025!'
              });
            }
          } else {
            console.log('✅ Auto-login: Login realizado com sucesso!');
          }
        } else {
          console.log('✅ Já autenticado:', session.user.email);
        }
        
        setIsAuthenticated(true);
      } catch (err) {
        console.error('❌ Erro crítico no auto-login:', err);
        // Mesmo com erro, permitir acesso (para não bloquear usuário)
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    autoLogin();
  }, []);

  return { isAuthenticated, isLoading };
};
