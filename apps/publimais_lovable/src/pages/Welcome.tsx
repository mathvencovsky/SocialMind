import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Instagram, Youtube, Facebook, Twitter, ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react';

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const socialPlatforms = [
    {
      name: 'Instagram',
      icon: <Instagram className="w-8 h-8 text-pink-600" />,
      description: 'Conecte seu perfil do Instagram para analytics de posts, stories e audiência',
      benefits: ['Métricas de engajamento', 'Análise de hashtags', 'Insights de audiência']
    },
    {
      name: 'TikTok',
      icon: <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center text-white text-sm font-bold">TT</div>,
      description: 'Analise o desempenho dos seus vídeos e tendências no TikTok',
      benefits: ['Analytics de vídeos', 'Trends e hashtags', 'Demografia da audiência']
    },
    {
      name: 'YouTube',
      icon: <Youtube className="w-8 h-8 text-red-600" />,
      description: 'Monitore suas estatísticas do canal e performance dos vídeos',
      benefits: ['Métricas do canal', 'Performance de vídeos', 'Análise de receita']
    },
    {
      name: 'Twitter/X',
      icon: <Twitter className="w-8 h-8 text-blue-500" />,
      description: 'Acompanhe engajamento de tweets e crescimento de seguidores',
      benefits: ['Engajamento de tweets', 'Análise de menções', 'Crescimento de seguidores']
    }
  ];

  const steps = [
    {
      title: 'Bem-vindo ao Publi+! 🎉',
      description: 'Sua jornada para profissionalizar suas redes sociais começa agora',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Olá, {user?.email?.split('@')[0]}! 👋
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Parabéns por criar sua conta! Agora você está a poucos passos de transformar 
              suas redes sociais em uma ferramenta profissional poderosa.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Analytics Avançado</h3>
              <p className="text-xs text-muted-foreground">Dados reais das suas redes</p>
            </div>
            <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Relatórios Profissionais</h3>
              <p className="text-xs text-muted-foreground">Para apresentar às marcas</p>
            </div>
            <div className="text-center p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Portfólio Automático</h3>
              <p className="text-xs text-muted-foreground">Gerado automaticamente</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Conecte suas Redes Sociais 📱',
      description: 'Escolha quais plataformas você quer conectar para começar',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Conecte suas redes para gerar métricas reais
            </h3>
            <p className="text-muted-foreground text-sm">
              Você pode conectar todas ou apenas algumas. Mais redes = relatórios mais completos!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPlatforms.map((platform, index) => (
              <Card key={platform.name} className="hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {platform.icon}
                    <div>
                      <CardTitle className="text-base">{platform.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">Recomendado</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm">
                    {platform.description}
                  </CardDescription>
                  <div className="space-y-1">
                    {platform.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Conectar {platform.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 border border-border/40">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm mb-1">💡 Dica Profissional</h4>
                <p className="text-xs text-muted-foreground">
                  Conectar múltiplas plataformas cria relatórios mais robustos e impressiona mais as marcas. 
                  Você pode conectar mais redes a qualquer momento no seu dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - go to dashboard
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary text-white font-bold text-xl px-3 py-1 rounded-lg">
                Publi+
              </div>
              <Badge variant="secondary">Setup</Badge>
            </div>
            <Button variant="ghost" onClick={handleSkip}>
              Pular Tutorial
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Passo {currentStep + 1} de {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% completo
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <Card className="shadow-strong">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl md:text-3xl">
                {currentStepData.title}
              </CardTitle>
              <CardDescription className="text-lg">
                {currentStepData.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              {currentStepData.content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Voltar
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSkip}>
                Pular e Ir para Dashboard
              </Button>
              <Button onClick={handleNext} className="bg-gradient-primary">
                {currentStep === steps.length - 1 ? (
                  <>
                    Ir para Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;