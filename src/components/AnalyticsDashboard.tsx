import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Heart, BarChart3, Eye, Share, MessageCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  totalFollowers: number;
  followerGrowth: number;
  avgEngagement: number;
  engagementGrowth: number;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  topPlatforms: Array<{
    platform: string;
    followers: number;
    engagement: number;
    color: string;
  }>;
  growthData: Array<{
    date: string;
    followers: number;
    engagement: number;
  }>;
  contentPerformance: Array<{
    type: string;
    posts: number;
    avgLikes: number;
    avgComments: number;
  }>;
  audienceDemographics: Array<{
    age: string;
    percentage: number;
  }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Seguidores</p>
                <p className="text-3xl font-bold">{formatNumber(data.totalFollowers)}</p>
                <div className="flex items-center mt-2">
                  {data.followerGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${data.followerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(data.followerGrowth)} (30 dias)
                  </span>
                </div>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engajamento Médio</p>
                <p className="text-3xl font-bold">{data.avgEngagement.toFixed(1)}%</p>
                <div className="flex items-center mt-2">
                  {data.engagementGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${data.engagementGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(data.engagementGrowth)} (30 dias)
                  </span>
                </div>
              </div>
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Posts este mês</p>
                <p className="text-3xl font-bold">{data.totalPosts}</p>
                <div className="flex items-center mt-2">
                  <BarChart3 className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-muted-foreground">
                    Média: {(data.totalPosts / 30).toFixed(1)}/dia
                  </span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Visualizações</p>
                <p className="text-3xl font-bold">{formatNumber(data.totalViews)}</p>
                <div className="flex items-center mt-2">
                  <Eye className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(Math.floor(data.totalViews / data.totalPosts))} por post
                  </span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Crescimento nos Últimos 30 Dias</CardTitle>
          <CardDescription>
            Acompanhe o crescimento de seguidores e taxa de engajamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="followers" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Seguidores"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="engagement" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Engajamento (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform Performance & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance por Plataforma</CardTitle>
            <CardDescription>
              Seguidores e engajamento por rede social
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.topPlatforms}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="followers" fill="#8884d8" name="Seguidores" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demografia da Audiência</CardTitle>
            <CardDescription>
              Distribuição por faixa etária
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.audienceDemographics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ age, percentage }) => `${age}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {data.audienceDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Tipo de Conteúdo</CardTitle>
          <CardDescription>
            Análise de engagement por formato de post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.contentPerformance.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }} />
                  <div>
                    <p className="font-medium capitalize">{content.type}</p>
                    <p className="text-sm text-muted-foreground">{content.posts} posts</p>
                  </div>
                </div>
                <div className="flex space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{formatNumber(content.avgLikes)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span>{formatNumber(content.avgComments)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{formatNumber(data.totalLikes)}</p>
            <p className="text-sm text-muted-foreground">Total de Curtidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{formatNumber(data.totalComments)}</p>
            <p className="text-sm text-muted-foreground">Total de Comentários</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Share className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{data.avgEngagement.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Taxa de Engajamento</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;