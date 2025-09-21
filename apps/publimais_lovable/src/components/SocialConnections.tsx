import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, Youtube, Facebook, Twitter, Settings, Trash2 } from 'lucide-react';
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

interface SocialConnectionsProps {
  accounts: SocialAccount[];
  onConnect: (provider: string) => void;
  onDisconnect: (accountId: string) => void;
  onRefresh: (accountId: string) => void;
}

const SocialConnections: React.FC<SocialConnectionsProps> = ({
  accounts,
  onConnect,
  onDisconnect,
  onRefresh
}) => {
  const { toast } = useToast();

  const platforms = [
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'text-pink-600',
      description: 'Conecte sua conta do Instagram para analisar posts, stories e métricas de engajamento.'
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: () => <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">TT</div>, 
      color: 'text-black',
      description: 'Analise seus vídeos no TikTok, crescimento de seguidores e tendências de conteúdo.'
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      icon: Youtube, 
      color: 'text-red-600',
      description: 'Conecte seu canal do YouTube para monitorar inscritos, visualizações e performance.'
    },
    { 
      id: 'twitter', 
      name: 'Twitter/X', 
      icon: Twitter, 
      color: 'text-blue-500',
      description: 'Analise seus tweets, impressões, engajamento e crescimento de seguidores.'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'text-blue-600',
      description: 'Conecte sua página do Facebook para análise de alcance, curtidas e público.'
    }
  ];

  const getConnectedAccount = (platformId: string) => {
    return accounts.find(account => account.provider === platformId && account.is_connected);
  };

  const handleConnect = (platformId: string) => {
    toast({
      title: "Conectando...",
      description: `Redirecionando para autenticação do ${platforms.find(p => p.id === platformId)?.name}`,
    });
    onConnect(platformId);
  };

  const handleDisconnect = (accountId: string, platformName: string) => {
    if (window.confirm(`Tem certeza que deseja desconectar sua conta do ${platformName}?`)) {
      onDisconnect(accountId);
      toast({
        title: "Conta desconectada",
        description: `Sua conta do ${platformName} foi desconectada com sucesso.`,
      });
    }
  };

  const handleRefresh = (accountId: string, platformName: string) => {
    toast({
      title: "Atualizando dados...",
      description: `Sincronizando métricas do ${platformName}`,
    });
    onRefresh(accountId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Conectar Redes Sociais</h2>
        <p className="text-muted-foreground">
          Conecte suas contas para gerar automaticamente análises e relatórios profissionais.
        </p>
      </div>

      <div className="grid gap-6">
        {platforms.map((platform) => {
          const connectedAccount = getConnectedAccount(platform.id);
          const isConnected = !!connectedAccount;

          return (
            <Card key={platform.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <platform.icon className={`w-8 h-8 ${platform.color}`} />
                    <div>
                      <CardTitle className="text-xl">{platform.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {platform.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isConnected ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Conectado
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Não conectado
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {isConnected && connectedAccount ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
                      <img 
                        src={connectedAccount.profile_picture_url || '/placeholder.svg'}
                        alt={connectedAccount.display_name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{connectedAccount.display_name}</p>
                        <p className="text-sm text-muted-foreground">@{connectedAccount.username}</p>
                        <p className="text-xs text-muted-foreground">
                          Última sincronização: {' '}
                          {connectedAccount.last_sync_at 
                            ? new Date(connectedAccount.last_sync_at).toLocaleDateString('pt-BR')
                            : 'Nunca'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRefresh(connectedAccount.id, platform.name)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Atualizar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnect(connectedAccount.id, platform.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Desconectar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Esta rede social não está conectada. Clique no botão abaixo para conectar e começar a coletar dados.
                    </p>
                    <Button 
                      onClick={() => handleConnect(platform.id)}
                      className="w-full"
                    >
                      Conectar {platform.name}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SocialConnections;