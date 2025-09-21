import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Heart, BarChart3, Eye, MessageCircle, Share2, MousePointer } from 'lucide-react';
import { useMetrics } from '@/hooks/useMetrics';

const MetricsDashboard = () => {
  const { summary, metrics, loading } = useMetrics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const metricsCards = [
    {
      title: 'Total de Seguidores',
      value: formatNumber(summary.totalFollowers),
      icon: Users,
      color: 'text-blue-600',
      description: 'Todas as redes sociais'
    },
    {
      title: 'Engajamento Médio',
      value: `${summary.avgEngagementRate}%`,
      icon: Heart,
      color: 'text-red-600',
      description: 'Taxa de interação'
    },
    {
      title: 'Posts Publicados',
      value: summary.totalPosts.toString(),
      icon: BarChart3,
      color: 'text-green-600',
      description: 'Este mês'
    },
    {
      title: 'Redes Conectadas',
      value: summary.connectedAccounts.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      description: 'Plataformas ativas'
    }
  ];

  // Get latest metrics for detailed view
  const latestMetrics = metrics.slice(0, 1)[0];

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsCards.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
                <div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.title}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {metric.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Metrics */}
      {latestMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                Visualizações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Perfil</span>
                  <span className="font-semibold">{formatNumber(latestMetrics.profile_views)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Posts (média)</span>
                  <span className="font-semibold">{formatNumber(latestMetrics.views_avg)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Alcance (média)</span>
                  <span className="font-semibold">{formatNumber(latestMetrics.reach_avg)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                Engajamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Curtidas (média)</span>
                  <span className="font-semibold">{formatNumber(latestMetrics.likes_avg)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Comentários (média)</span>
                  <span className="font-semibold">{formatNumber(latestMetrics.comments_avg)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Compartilhamentos</span>
                  <span className="font-semibold">{formatNumber(latestMetrics.shares_avg)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MousePointer className="w-5 h-5 mr-2 text-green-600" />
                Conversões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cliques no site</span>
                  <span className="font-semibold">{formatNumber(latestMetrics.website_clicks)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Impressões</span>
                  <span className="font-semibold">{formatNumber(latestMetrics.impressions_avg)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Taxa de engajamento</span>
                  <Badge variant="secondary">{latestMetrics.engagement_rate.toFixed(2)}%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Growth Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights de Crescimento</CardTitle>
          <CardDescription>
            Análise do desempenho das suas redes sociais
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summary.totalFollowers > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatNumber(summary.totalFollowers)}
                </div>
                <div className="text-sm text-muted-foreground">Total de Seguidores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {summary.avgEngagementRate}%
                </div>
                <div className="text-sm text-muted-foreground">Engajamento Médio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {summary.connectedAccounts}
                </div>
                <div className="text-sm text-muted-foreground">Redes Conectadas</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Conecte suas redes sociais</h3>
              <p className="text-muted-foreground">
                Para visualizar métricas detalhadas, conecte suas contas de redes sociais.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsDashboard;