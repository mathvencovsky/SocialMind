import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TestProfile {
  id: string;
  platform: string;
  username: string;
  display_name: string;
  profile_picture_url: string;
  bio: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  engagement_rate: number;
  last_sync_at: string;
  created_at: string;
}

interface TestMetrics {
  id: string;
  test_profile_id: string;
  date: string;
  followers_count: number;
  engagement_rate: number;
  growth_7d: any;
  top_post: any;
  likes_avg: number;
  comments_avg: number;
  views_avg: number;
  reach_avg: number;
}

export const useTestProfiles = () => {
  const [profiles, setProfiles] = useState<TestProfile[]>([]);
  const [metrics, setMetrics] = useState<Record<string, TestMetrics>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfiles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('test_profiles')
        .select('*')
        .eq('admin_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching test profiles:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os perfis de teste.",
          variant: "destructive"
        });
      } else {
        setProfiles(data || []);
        
        // Fetch metrics for each profile
        if (data && data.length > 0) {
          const metricsPromises = data.map(profile => 
            supabase
              .from('test_metrics')
              .select('*')
              .eq('test_profile_id', profile.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single()
          );

          const metricsResults = await Promise.all(metricsPromises);
          const metricsMap: Record<string, TestMetrics> = {};
          
          metricsResults.forEach((result, index) => {
            if (result.data) {
              metricsMap[data[index].id] = result.data;
            }
          });
          
          setMetrics(metricsMap);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  const connectProfile = async (platform: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Call edge function to connect real profile
      const { data, error } = await supabase.functions.invoke('admin-test-profiles', {
        body: {
          action: 'connect',
          platform,
          userId: user.id
        }
      });

      if (error) {
        console.error('Error connecting profile:', error);
        toast({
          title: "Erro",
          description: `Não foi possível conectar o perfil ${platform}.`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Conectado!",
        description: `Perfil ${platform} conectado com sucesso.`,
      });

      await fetchProfiles();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const disconnectProfile = async (profileId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('test_profiles')
        .delete()
        .eq('id', profileId);

      if (error) {
        console.error('Error disconnecting profile:', error);
        toast({
          title: "Erro",
          description: "Não foi possível desconectar o perfil.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Desconectado",
          description: "Perfil desconectado com sucesso.",
        });
        await fetchProfiles();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const forceUpdate = async (profileId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('admin-test-profiles', {
        body: {
          action: 'force_update',
          profileId,
          userId: user.id
        }
      });

      if (error) {
        console.error('Error forcing update:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar os dados.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Dados atualizados",
        description: "Métricas atualizadas com sucesso.",
      });

      await fetchProfiles();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (profileId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('admin-test-profiles', {
        body: {
          action: 'generate_report',
          profileId,
          userId: user.id
        }
      });

      if (error) {
        console.error('Error generating report:', error);
        toast({
          title: "Erro",
          description: "Não foi possível gerar o relatório.",
          variant: "destructive"
        });
        return;
      }

      // Download PDF
      if (data?.pdf_url) {
        const link = document.createElement('a');
        link.href = data.pdf_url;
        link.download = `relatorio-teste-${Date.now()}.pdf`;
        link.click();
      }

      toast({
        title: "Relatório gerado",
        description: "O relatório PDF foi gerado com sucesso.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    profiles,
    metrics,
    loading,
    connectProfile,
    disconnectProfile,
    forceUpdate,
    generateReport,
    refetch: fetchProfiles
  };
};