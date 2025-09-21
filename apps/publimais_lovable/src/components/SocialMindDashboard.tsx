import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Heart, BarChart3, Calendar, Target, Award } from 'lucide-react';

interface SocialMetrics {
  id: string;
  social_account_id: string;
  date: string;
  followers_count: number;
  engagement_rate: number;
  posts_count: number;
  likes_avg: number;
  comments_avg: number;
  shares_avg: number;
  reach_avg: number;
}

interface AudienceData {
  age_group: string;
  percentage: number;
}

interface CampaignData {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'draft';
  engagement_rate: number;
  reach: number;
}

const SocialMindDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<SocialMetrics[]>([]);
  const [audienceData, setAudienceData] = useState<AudienceData[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch social metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('social_metrics')
        .select(`
          *,
          social_accounts!inner(user_id)
        `)
        .eq('social_accounts.user_id', user?.id)
        .order('date', { ascending: false })
        .limit(30);

      if (metricsError) {
        console.error('Error fetching metrics:', metricsError);
      } else {
        setMetrics(metricsData || []);
      }

      // Generate demo audience data
      setAudienceData([
        { age_group: '18-24', percentage: 35 },
        { age_group: '25-34', percentage: 40 },
        { age_group: '35-44', percentage: 18 },
        { age_group: '45+', percentage: 7 }
      ]);

      // Generate demo campaign data
      setCampaigns([
        { id: '1', name: 'Campanha de Lançamento', status: 'active', engagement_rate: 4.2, reach: 15000 },
        { id: '2', name: 'Promoção de Verão', status: 'completed', engagement_rate: 3.8, reach: 12000 },
        { id: '3', name: 'Engajamento Boost', status: 'draft', engagement_rate: 0, reach: 0 }
      ]);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados analíticos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  const totalFollowers = metrics.reduce((sum, metric) => sum + (metric.followers_count || 0), 0);
  const avgEngagement = metrics.length > 0 ? 
    metrics.reduce((sum, metric) => sum + (metric.engagement_rate || 0), 0) / metrics.length : 0;
  const totalPosts = metrics.reduce((sum, metric) => sum + (metric.posts_count || 0), 0);

  const chartData = metrics.slice(0, 7).reverse().map(metric => ({
    date: new Date(metric.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
    followers: metric.followers_count,
    engagement: metric.engagement_rate,
    posts: metric.posts_count
  }));

  if (loading) {
    return <div>Carregando dados analíticos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{totalFollowers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Seguidores</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Engajamento Médio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{totalPosts}</div>
                <div className="text-sm text-muted-foreground">Posts Totais</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">+12%</div>
                <div className="text-sm text-muted-foreground">Crescimento Semanal</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Followers Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Seguidores</CardTitle>
            <CardDescription>Evolução dos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="followers" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Audience Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Demografia da Audiência</CardTitle>
            <CardDescription>Distribuição por faixa etária</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={audienceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ age_group, percentage }) => `${age_group}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {audienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Engajamento</CardTitle>
          <CardDescription>Performance de engajamento ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="engagement" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaigns Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Campanhas Ativas
          </CardTitle>
          <CardDescription>Gerencie suas campanhas publicitárias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Engajamento: {campaign.engagement_rate}% | Alcance: {campaign.reach.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={campaign.status === 'active' ? 'default' : 
                           campaign.status === 'completed' ? 'secondary' : 'outline'}
                >
                  {campaign.status === 'active' ? 'Ativa' : 
                   campaign.status === 'completed' ? 'Concluída' : 'Rascunho'}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button className="w-full">
              <Target className="w-4 h-4 mr-2" />
              Criar Nova Campanha
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMindDashboard;