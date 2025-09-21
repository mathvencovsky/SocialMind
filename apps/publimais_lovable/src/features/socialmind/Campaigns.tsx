import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Users, BarChart3, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Campaign = { 
  id: string; 
  name: string; 
  status: 'active' | 'completed' | 'draft';
  engagement_rate: number;
  reach: number;
  created_at: string;
};

export default function SocialMindCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    }
  }, [user]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from("analytics_campaigns")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as campanhas.",
          variant: "destructive"
        });
      } else {
        setCampaigns(data?.map(campaign => ({
          ...campaign,
          status: campaign.status as 'active' | 'completed' | 'draft'
        })) || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'completed':
        return 'Concluída';
      case 'draft':
        return 'Rascunho';
      default:
        return status;
    }
  };

  const createSampleCampaign = async () => {
    if (!user) return;

    try {
      // Get profile ID first
      const { data: profile } = await supabase
        .from("analytics_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) {
        toast({
          title: "Erro",
          description: "Crie um perfil no dashboard primeiro.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from("analytics_campaigns")
        .insert({
          user_id: user.id,
          profile_id: profile.id,
          name: `Nova Campanha ${campaigns.length + 1}`,
          status: 'draft',
          engagement_rate: 0,
          reach: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating campaign:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar a campanha.",
          variant: "destructive"
        });
      } else {
        setCampaigns([{
          ...data,
          status: data.status as 'active' | 'completed' | 'draft'
        }, ...campaigns]);
        toast({
          title: "Campanha criada!",
          description: "Nova campanha adicionada como rascunho.",
        });
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from("analytics_campaigns")
        .delete()
        .eq("id", campaignId)
        .eq("user_id", user?.id);

      if (error) {
        console.error('Error deleting campaign:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir a campanha.",
          variant: "destructive"
        });
      } else {
        setCampaigns(campaigns.filter(c => c.id !== campaignId));
        toast({
          title: "Campanha excluída",
          description: "A campanha foi removida com sucesso.",
        });
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0);
  const avgEngagement = campaigns.length > 0 
    ? campaigns.reduce((sum, c) => sum + c.engagement_rate, 0) / campaigns.length 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Campanhas</h1>
          <p className="text-muted-foreground">
            Monitore e gerencie suas campanhas publicitárias e de engajamento.
          </p>
        </div>
        <Button onClick={createSampleCampaign}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{activeCampaigns}</div>
                <div className="text-sm text-muted-foreground">Campanhas Ativas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{completedCampaigns}</div>
                <div className="text-sm text-muted-foreground">Campanhas Concluídas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Alcance Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Engajamento Médio</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Campanhas</CardTitle>
          <CardDescription>
            {campaigns.length === 0 
              ? "Nenhuma campanha encontrada. Crie sua primeira campanha!"
              : `Total de ${campaigns.length} campanha${campaigns.length > 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma campanha ainda</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira campanha para monitorar performance.
              </p>
              <Button onClick={createSampleCampaign}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Campanha
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Criada em {new Date(campaign.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {getStatusText(campaign.status)}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteCampaign(campaign.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{campaign.engagement_rate}%</div>
                      <div className="text-xs text-muted-foreground">Taxa de Engajamento</div>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{campaign.reach.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Alcance</div>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {campaign.reach > 0 ? ((campaign.engagement_rate * campaign.reach) / 100).toFixed(0) : '0'}
                      </div>
                      <div className="text-xs text-muted-foreground">Interações Estimadas</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}