import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Instagram, Youtube, Facebook, Twitter, Plus, BarChart3, TrendingUp, Users, Heart, Download, Share2, LogOut, Package2, Settings } from 'lucide-react';
import AdminQuickAccess from '@/components/AdminQuickAccess';
import MetricsDashboard from '@/components/MetricsDashboard';
import AdPackageManager from '@/components/AdPackageManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReports } from '@/hooks/useReports';
import SocialMindDashboard from '@/components/SocialMindDashboard';

interface Profile {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  niche: string;
  location: string;
  website: string;
}

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

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading: reportLoading, downloadReportPDF, shareReport } = useReports();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch social accounts securely (excluding sensitive token data)
      const { data: accountsData, error: accountsError } = await supabase
        .from('social_accounts')
        .select('id, provider, account_ref, created_at, updated_at')
        .eq('user_id', user?.id);

      if (accountsError) {
        console.error('Error fetching social accounts:', accountsError);
      } else {
        // Transform data to match interface
        const transformedAccounts = (accountsData || []).map(account => ({
          id: account.id,
          provider: account.provider,
          account_ref: account.account_ref || '',
          username: account.account_ref || '',
          display_name: account.account_ref || '',
          profile_picture_url: '',
          is_connected: true,
          last_sync_at: account.updated_at || account.created_at
        }));
        setSocialAccounts(transformedAccounts);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (provider: string) => {
    switch (provider) {
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'youtube': return <Youtube className="w-5 h-5 text-red-600" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'twitter': return <Twitter className="w-5 h-5 text-blue-500" />;
      case 'tiktok': return <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">TT</div>;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const handleConnectPlatform = (platform: string) => {
    navigate('/social-connect');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDownloadReport = async () => {
    await downloadReportPDF();
  };

  const handleShareReport = async () => {
    const result = await shareReport({ expirationDays: 7 });
    if (result) {
      toast({
        title: "Relatório compartilhado!",
        description: `Link público criado. Expira em ${new Date(result.expiresAt).toLocaleDateString('pt-BR')}`
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const connectedAccounts = socialAccounts.filter(account => account.is_connected);
  const availablePlatforms = ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">Publi+</h1>
              <Badge variant="secondary">Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Olá, {profile?.display_name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Admin Quick Access */}
        <div className="mb-8">
          <AdminQuickAccess />
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Métricas
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package2 className="w-4 h-4" />
              Pacotes
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">{/* Overview content */}

            {/* Profile Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{profile?.display_name || 'Influenciador'}</CardTitle>
                  <CardDescription>
                    {profile?.niche && (
                      <Badge variant="secondary" className="mr-2">{profile.niche}</Badge>
                    )}
                    {profile?.location && (
                      <span className="text-sm text-muted-foreground">{profile.location}</span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            {profile?.bio && (
              <CardContent>
                <p className="text-muted-foreground">{profile.bio}</p>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Connected Accounts */}
        {connectedAccounts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contas Conectadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedAccounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader className="pb-3">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-3">
                         {getPlatformIcon(account.provider)}
                         <div>
                           <CardTitle className="text-lg capitalize">{account.provider}</CardTitle>
                           <CardDescription>@{account.username || account.account_ref}</CardDescription>
                         </div>
                       </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Conectado
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">0</div>
                        <div className="text-xs text-muted-foreground">Seguidores</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">0%</div>
                        <div className="text-xs text-muted-foreground">Engajamento</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-3">
                      Última sincronização: {account.last_sync_at ? new Date(account.last_sync_at).toLocaleDateString('pt-BR') : 'Nunca'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Connect New Platforms */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {connectedAccounts.length > 0 ? 'Conectar Mais Redes' : 'Conecte suas Redes Sociais'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlatforms
               .filter(platform => !connectedAccounts.some(account => account.provider === platform))
               .map((platform) => (
                <Card key={platform} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      {getPlatformIcon(platform)}
                    </div>
                    <h3 className="font-semibold capitalize mb-2">{platform}</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnectPlatform(platform)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Conectar
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Total de Seguidores</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Heart className="w-8 h-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold">0%</div>
                  <div className="text-sm text-muted-foreground">Engajamento Médio</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Posts este mês</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{connectedAccounts.length}</div>
                  <div className="text-sm text-muted-foreground">Redes Conectadas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

            {/* Portfolio Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Seu Portfólio Profissional</CardTitle>
                <CardDescription>
                  Gere relatórios profissionais para apresentar a marcas e fechar contratos publicitários.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="flex-1" 
                    disabled={connectedAccounts.length === 0 || reportLoading}
                    onClick={handleDownloadReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {reportLoading ? 'Gerando...' : 'Baixar Relatório'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    disabled={connectedAccounts.length === 0 || reportLoading}
                    onClick={handleShareReport}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {reportLoading ? 'Compartilhando...' : 'Compartilhar Relatório'}
                  </Button>
                </div>
                {connectedAccounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-4">
                    Conecte suas redes sociais para gerar relatórios com dados reais.
                  </p>
                ) : (
                  <p className="text-sm text-green-600 mt-4">
                    ✓ {connectedAccounts.length} rede{connectedAccounts.length > 1 ? 's' : ''} conectada{connectedAccounts.length > 1 ? 's' : ''}. Relatórios disponíveis!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <SocialMindDashboard />
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsDashboard />
          </TabsContent>

          <TabsContent value="packages">
            <AdPackageManager />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Perfil</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais e profissionais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Em breve</h3>
                  <p className="text-muted-foreground">
                    Configurações avançadas do perfil estarão disponíveis em breve.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;