import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3, 
  Share2, 
  Download,
  Play,
  Filter,
  Calendar,
  Target,
  Zap,
  Heart,
  MessageCircle,
  Eye
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Insights = () => {
  const marketTrends = [
    {
      title: "Crescimento do TikTok no Brasil",
      percentage: "+127%",
      description: "Aumento no engagement de marcas brasileiras na plataforma",
      trend: "up",
      color: "text-accent-green"
    },
    {
      title: "Micro-influenciadores",
      percentage: "+89%",
      description: "Preferência das marcas por creators com 10K-100K seguidores",
      trend: "up",
      color: "text-accent-cyan"
    },
    {
      title: "ROI Médio",
      percentage: "320%",
      description: "Retorno médio das campanhas de influência no Brasil",
      trend: "up",
      color: "text-primary"
    },
    {
      title: "Investimento em Vídeo",
      percentage: "+156%",
      description: "Aumento na produção de conteúdo em vídeo",
      trend: "up",
      color: "text-secondary"
    }
  ];

  const insights = [
    {
      id: 1,
      title: "Melhores horários para postar no Instagram",
      type: "Dica",
      content: "Dados mostram que posts entre 18h-21h têm 40% mais engagement no público brasileiro.",
      icon: Target,
      actionable: true
    },
    {
      id: 2,
      title: "Nichos em alta para 2024",
      type: "Tendência",
      content: "Sustentabilidade, tech education e lifestyle saudável lideram o interesse das marcas.",
      icon: TrendingUp,
      actionable: false
    },
    {
      id: 3,
      title: "Como aumentar taxa de conversão",
      type: "Estratégia",
      content: "Stories com CTA direto convertem 65% mais que posts convencionais.",
      icon: Zap,
      actionable: true
    }
  ];

  const caseStudies = [
    {
      title: "Campanha Sustentabilidade - Marca Verde",
      results: {
        reach: "2.3M",
        engagement: "12.5%",
        conversions: "1.2K",
        roi: "450%"
      },
      description: "Como uma marca de produtos sustentáveis conquistou o mercado brasileiro usando micro-influenciadores especializados.",
      category: "Sustentabilidade"
    },
    {
      title: "Lançamento Tech - StartupBR",
      results: {
        reach: "1.8M",
        engagement: "15.2%",
        conversions: "890",
        roi: "380%"
      },
      description: "Estratégia de influência para lançar uma fintech brasileira focada no público jovem.",
      category: "Tecnologia"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-accent-cyan/5 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-poppins text-foreground mb-6">
              Insights do <span className="bg-gradient-hero bg-clip-text text-transparent">Mercado</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dados em tempo real, tendências e estratégias para otimizar suas campanhas de influência
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Select defaultValue="todos">
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as categorias</SelectItem>
                <SelectItem value="tendencias">Tendências</SelectItem>
                <SelectItem value="estrategias">Estratégias</SelectItem>
                <SelectItem value="dados">Dados de mercado</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="30dias">
              <SelectTrigger className="w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </div>
      </section>

      {/* Market Trends */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-poppins text-center text-foreground mb-12">
            Tendências do Mercado
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {marketTrends.map((trend, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6 text-center">
                  <div className={`text-3xl font-bold font-poppins mb-2 ${trend.color}`}>
                    {trend.percentage}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{trend.title}</h3>
                  <p className="text-sm text-muted-foreground">{trend.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12">
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="cases">Casos de Sucesso</TabsTrigger>
              <TabsTrigger value="tools">Ferramentas</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {insights.map((insight) => {
                  const Icon = insight.icon;
                  return (
                    <Card key={insight.id} className="hover-lift">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{insight.type}</Badge>
                          {insight.actionable && (
                            <Badge className="bg-accent-green text-white">Acionável</Badge>
                          )}
                        </div>
                        <CardTitle className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-primary" />
                          {insight.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{insight.content}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4 mr-2" />
                            Compartilhar
                          </Button>
                          {insight.actionable && (
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Aplicar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="cases" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {caseStudies.map((study, index) => (
                  <Card key={index} className="hover-lift">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">{study.category}</Badge>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-xl">{study.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">{study.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <Eye className="h-5 w-5 text-primary mr-1" />
                          </div>
                          <div className="text-2xl font-bold text-primary">{study.results.reach}</div>
                          <div className="text-sm text-muted-foreground">Alcance</div>
                        </div>
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <Heart className="h-5 w-5 text-accent-coral mr-1" />
                          </div>
                          <div className="text-2xl font-bold text-accent-coral">{study.results.engagement}</div>
                          <div className="text-sm text-muted-foreground">Engagement</div>
                        </div>
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <Target className="h-5 w-5 text-accent-green mr-1" />
                          </div>
                          <div className="text-2xl font-bold text-accent-green">{study.results.conversions}</div>
                          <div className="text-sm text-muted-foreground">Conversões</div>
                        </div>
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <DollarSign className="h-5 w-5 text-secondary mr-1" />
                          </div>
                          <div className="text-2xl font-bold text-secondary">{study.results.roi}</div>
                          <div className="text-sm text-muted-foreground">ROI</div>
                        </div>
                      </div>

                      <Button className="w-full">
                        Ver estudo completo
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-8">
              <div className="text-center">
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-12">
                    <BarChart3 className="h-16 w-16 text-primary mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Ferramentas em Desenvolvimento
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Estamos desenvolvendo ferramentas exclusivas para análise de performance, 
                      previsão de trends e otimização de campanhas.
                    </p>
                    <Button size="lg">
                      Receber notificação do lançamento
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Insights;