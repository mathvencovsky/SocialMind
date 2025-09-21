import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface SocialAccount {
  id: string;
  provider: string;
  account_ref: string;
  username?: string;
  display_name?: string;
  profile_picture_url?: string;
  is_connected: boolean;
  last_sync_at: string;
}

export const useSocialAccounts = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAccounts = async () => {
    if (!user) return;

    try {
      // Use secure query that excludes sensitive token data (access_token, refresh_token)
      const { data, error } = await supabase
        .from('social_accounts')
        .select(`
          id,
          provider,
          account_ref,
          created_at,
          updated_at,
          expires_at
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching social accounts:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas contas conectadas.",
          variant: "destructive"
        });
      } else {
        // Transform data to match interface
        const transformedAccounts = (data || []).map(account => ({
          id: account.id,
          provider: account.provider,
          account_ref: account.account_ref || '',
          username: account.account_ref || '',
          display_name: account.account_ref || '',
          profile_picture_url: '',
          is_connected: true,
          last_sync_at: account.updated_at || account.created_at
        }));
        setAccounts(transformedAccounts);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const connectAccount = async (platform: string) => {
    if (!user) return;

    try {
      // Call secure OAuth initiation
      const { data, error } = await supabase.functions.invoke('secure-social-auth', {
        body: {
          action: 'initiate_oauth',
          platform,
          userId: user.id
        }
      });

      if (error) {
        console.error('OAuth initiation error:', error);
        toast({
          title: "Erro",
          description: "Não foi possível iniciar a conexão. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      // In a real implementation, redirect to authUrl
      toast({
        title: "OAuth Demo",
        description: `Simulando conexão com ${platform}. Em produção, você seria redirecionado para autorizar a conexão.`,
      });

      // Simulate successful connection for demo
      setTimeout(async () => {
        const { error: exchangeError } = await supabase.functions.invoke('secure-social-auth', {
          body: {
            action: 'exchange_token',
            platform,
            authCode: 'demo_auth_code',
            redirectUri: window.location.origin,
            userId: user.id
          }
        });

        if (!exchangeError) {
          await fetchAccounts();
          toast({
            title: "Conectado!",
            description: `${platform} foi conectado com sucesso.`,
          });
        }
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const disconnectAccount = async (accountId: string) => {
    if (!user) return;

    try {
      // Find the account to get platform info
      const account = accounts.find(acc => acc.id === accountId);
      if (!account) return;

      // Call secure token revocation
      const { error } = await supabase.functions.invoke('secure-social-auth', {
        body: {
          action: 'revoke_token',
          platform: account.provider,
          userId: user.id
        }
      });

      if (error) {
        console.error('Error disconnecting account:', error);
        toast({
          title: "Erro",
          description: "Não foi possível desconectar a conta.",
          variant: "destructive"
        });
      } else {
        await fetchAccounts();
        toast({
          title: "Desconectado",
          description: `${account.provider} foi desconectado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const refreshAccount = async (accountId: string) => {
    if (!user) return;

    try {
      // Find the account to get platform info
      const account = accounts.find(acc => acc.id === accountId);
      if (!account) return;

      // Call secure token refresh
      const { error } = await supabase.functions.invoke('secure-social-auth', {
        body: {
          action: 'refresh_token',
          platform: account.provider,
          userId: user.id
        }
      });

      if (error) {
        console.error('Error refreshing account:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar os dados da conta.",
          variant: "destructive"
        });
      } else {
        await fetchAccounts();
        toast({
          title: "Dados atualizados",
          description: "As métricas da conta foram sincronizadas com sucesso.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {
    accounts,
    loading,
    connectAccount,
    disconnectAccount,
    refreshAccount,
    refetch: fetchAccounts
  };
};