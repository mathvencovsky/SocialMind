import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SocialConnections from '@/components/SocialConnections';
import { useSocialAccounts } from '@/hooks/useSocialAccounts';

const SocialConnect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accounts, loading, connectAccount, disconnectAccount, refreshAccount } = useSocialAccounts();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
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
              <h1 className="text-2xl font-bold text-primary">Conectar Redes Sociais</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <SocialConnections
              accounts={accounts}
              onConnect={connectAccount}
              onDisconnect={disconnectAccount}
              onRefresh={refreshAccount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialConnect;