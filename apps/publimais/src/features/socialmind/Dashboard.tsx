import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, BarChart3, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

type AnalyticsProfile = { 
  id: string; 
  name: string; 
  followers_count: number; 
  following_count: number; 
  created_at: string;
};

export default function SocialMindDashboard() {
  const [profile, setProfile] = useState<AnalyticsProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("analytics_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o perfil de analytics.",
          variant: "destructive"
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDemoProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("analytics_profiles")
        .insert({
          user_id: user.id,
          name: "Meu Perfil de Influenciador",
          followers_count: 25000,
          following_count: 300
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o perfil demo.",
          variant: "destructive"
        });
      } else {
        setProfile(data);
        
        // Create demo audience data
        await supabase
          .from("analytics_audiences")
          .insert({
            user_id: user.id,
            profile_id: data.id,
            age18_24: 40,
            age25_34: 35,
            age35_44: 15,
            age45plus: 10,
            male: 55,
            female: 45,
            locations: ['Brasil', 'Estados Unidos', 'Reino Unido']
          });

        // Create demo campaigns
        await supabase
          .from("analytics_campaigns")
          .insert([
            {
              user_id: user.id,
              profile_id: data.id,
              name: 'Campanha de Lançamento',
              status: 'active',
              engagement_rate: 4.2,
              reach: 15000
            },
            {
              user_id: user.id,
              profile_id: data.id,
              name: 'Promoção de Verão',
              status: 'completed',
              engagement_rate: 3.8,
              reach: 12000
            },
            {
              user_id: user.id,
              profile_id: data.id,
              name: 'Boost de Engajamento',
              status: 'draft',
              engagement_rate: 0,
              reach: 0
            }
          ]);

        toast({
          title: "Perfil criado!",
          description: "Perfil demo criado com dados de exemplo.",
        });
      }
    } catch (error) {
      console.error('Error creating demo profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Bem-vindo ao SocialMind Analytics</h2>
          <p className="text-muted-foreground mb-6">
            Crie seu perfil de analytics para começar a monitorar suas métricas sociais.
          </p>
          <Button onClick={createDemoProfile}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Perfil Demo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">Analytics Dashboard</p>
        </div>
        <Badge variant="secondary">
          Ativo desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{profile.followers_count.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Seguidores</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{profile.following_count.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Seguindo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">4.2%</div>
                <div className="text-sm text-muted-foreground">Taxa de Engajamento</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {((profile.followers_count / profile.following_count) * 100).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Ratio Seguidor/Seguindo</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Gerencie seus dados de analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/socialmind/audience')}
            >
              <Users className="w-4 h-4 mr-2" />
              Ver Demografia da Audiência
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/socialmind/campaigns')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Gerenciar Campanhas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insights Recentes</CardTitle>
            <CardDescription>Resumo das últimas atividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                <span className="text-sm">Crescimento da última semana</span>
                <Badge variant="secondary">+12%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                <span className="text-sm">Melhor horário para postar</span>
                <Badge variant="secondary">18:00 - 20:00</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                <span className="text-sm">Alcance médio por post</span>
                <Badge variant="secondary">8.5K</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}