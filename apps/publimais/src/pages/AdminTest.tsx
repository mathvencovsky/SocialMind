import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Instagram, 
  Youtube, 
  Twitter, 
  Facebook,
  RefreshCw,
  FileText,
  Plus,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Eye,
  BarChart3
} from 'lucide-react';
import { useTestProfiles } from '@/hooks/useTestProfiles';
import AdminRoute from '@/components/AdminRoute';

const platformIcons = {
  instagram: Instagram,
  tiktok: BarChart3,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
};

const platformColors = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  tiktok: 'bg-gradient-to-r from-black to-gray-700',
  youtube: 'bg-gradient-to-r from-red-500 to-red-600',
  twitter: 'bg-gradient-to-r from-blue-400 to-blue-500',
  facebook: 'bg-gradient-to-r from-blue-600 to-blue-700',
};

const AdminTest = () => {
  const navigate = useNavigate();
  const { profiles, metrics, loading, connectProfile, disconnectProfile, forceUpdate, generateReport } = useTestProfiles();

  const platforms = ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook'];
  const connectedPlatforms = profiles.map(p => p.platform);
  const availablePlatforms = platforms.filter(p => !connectedPlatforms.includes(p));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatGrowth = (growth: any) => {
    if (!growth || !growth.followers) return '+0%';
    const percentage = ((growth.followers.current - growth.followers.previous) / growth.followers.previous * 100).toFixed(1);
    const percentageNum = parseFloat(percentage);
    return `${percentageNum >= 0 ? '+' : ''}${percentage}%`;
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
                <h1 className="text-2xl font-bold text-primary">Ambiente de Teste - Perfis Reais</h1>
              </div>
              <Button variant="outline" onClick={() => navigate('/admin/logs')}>
                <FileText className="w-4 h-4 mr-2" />
                Ver Logs
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Available Platforms to Connect */}
            {availablePlatforms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Conectar Perfis Reais
                  </CardTitle>
                  <CardDescription>
                    Conecte seus perfis reais de redes sociais para testar as integrações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {availablePlatforms.map((platform) => {
                      const Icon = platformIcons[platform as keyof typeof platformIcons];
                      return (
                        <Button
                          key={platform}
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-center space-y-2"
                          onClick={() => connectProfile(platform)}
                          disabled={loading}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${platformColors[platform as keyof typeof platformColors]}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="capitalize font-medium">{platform}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Connected Profiles */}
            {loading && profiles.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : profiles.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">Nenhum perfil conectado</h3>
                  <p className="text-muted-foreground mb-4">
                    Conecte seus perfis reais para começar a testar as funcionalidades
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {profiles.map((profile) => {
                  const Icon = platformIcons[profile.platform as keyof typeof platformIcons];
                  const profileMetrics = metrics[profile.id];
                  
                  return (
                    <Card key={profile.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${platformColors[profile.platform as keyof typeof platformColors]}`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{profile.display_name}</CardTitle>
                              <CardDescription>@{profile.username}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="secondary" className="capitalize">
                            {profile.platform}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Profile Info */}
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={profile.profile_picture_url} />
                            <AvatarFallback>{profile.display_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {profile.bio || 'Sem biografia disponível'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Última sincronização: {profile.last_sync_at ? 
                                new Date(profile.last_sync_at).toLocaleDateString('pt-BR') : 
                                'Nunca'
                              }
                            </p>
                          </div>
                        </div>

                        <Separator />

                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="w-4 h-4 mr-1" />
                              Seguidores
                            </div>
                            <p className="text-lg font-semibold">
                              {formatNumber(profile.followers_count)}
                            </p>
                            {profileMetrics?.growth_7d && (
                              <p className={`text-xs ${formatGrowth(profileMetrics.growth_7d).startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {formatGrowth(profileMetrics.growth_7d)} (7d)
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Engajamento
                            </div>
                            <p className="text-lg font-semibold">
                              {(profile.engagement_rate * 100).toFixed(1)}%
                            </p>
                          </div>

                          {profileMetrics && (
                            <>
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Heart className="w-4 h-4 mr-1" />
                                  Curtidas (média)
                                </div>
                                <p className="text-lg font-semibold">
                                  {formatNumber(profileMetrics.likes_avg)}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  Comentários (média)
                                </div>
                                <p className="text-lg font-semibold">
                                  {formatNumber(profileMetrics.comments_avg)}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Visualizações (média)
                                </div>
                                <p className="text-lg font-semibold">
                                  {formatNumber(profileMetrics.views_avg)}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <BarChart3 className="w-4 h-4 mr-1" />
                                  Alcance (média)
                                </div>
                                <p className="text-lg font-semibold">
                                  {formatNumber(profileMetrics.reach_avg)}
                                </p>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Top Post */}
                        {profileMetrics?.top_post && (
                          <>
                            <Separator />
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Post Mais Popular (7 dias)</h4>
                              <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-sm line-clamp-2 mb-2">
                                  {profileMetrics.top_post.caption || 'Sem legenda'}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span className="flex items-center">
                                    <Heart className="w-3 h-3 mr-1" />
                                    {formatNumber(profileMetrics.top_post.likes)}
                                  </span>
                                  <span className="flex items-center">
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    {formatNumber(profileMetrics.top_post.comments)}
                                  </span>
                                  {profileMetrics.top_post.views && (
                                    <span className="flex items-center">
                                      <Eye className="w-3 h-3 mr-1" />
                                      {formatNumber(profileMetrics.top_post.views)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <Separator />

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => forceUpdate(profile.id)}
                            disabled={loading}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Atualizar Dados
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => generateReport(profile.id)}
                            disabled={loading}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Gerar PDF
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => disconnectProfile(profile.id)}
                            disabled={loading}
                          >
                            Desconectar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminTest;