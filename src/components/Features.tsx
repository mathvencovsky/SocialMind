import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  Building, 
  UserCheck, 
  Search, 
  BarChart3, 
  Shield, 
  Target,
  Camera,
  Gamepad2,
  Dumbbell,
  Heart,
  Utensils,
  Palette,
  Car,
  Home,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Star,
  Globe,
  Zap,
  Award,
  ArrowRight
} from "lucide-react";

const Features = () => {
  const uniqueSellingPoints = [
    {
      icon: Target,
      title: "Encontre criadores por nicho ou região",
      description: "Sistema avançado de filtros que conecta marcas aos criadores ideais baseado em especialidade, engajamento real e compatibilidade de audiência.",
      benefit: "Matches mais assertivos",
      color: "from-primary to-primary/80"
    },
    {
      icon: Building,
      title: "Mostre seu portfólio em um perfil profissional",
      description: "Vitrines profissionais personalizadas com branding próprio, gestão centralizada de talentos e dashboard completo de performance.",
      benefit: "Presença profissional",
      color: "from-secondary to-secondary/80"
    },
    {
      icon: BarChart3,
      title: "Analytics e insights de campanha",
      description: "Analytics em tempo real, relatórios automatizados e insights acionáveis para otimizar ROI e demonstrar resultados concretos.",
      benefit: "Decisões baseadas em dados",
      color: "from-accent-coral to-accent-coral/80"
    },
    {
      icon: Users,
      title: "Contato direto com marcas e agências",
      description: "Comunicação direta entre marcas e criadores, sistema de propostas integrado e chat em tempo real sem intermediários.",
      benefit: "Negociação simplificada",
      color: "from-accent-cyan to-accent-cyan/80"
    }
  ];

  const nichos = [
    { icon: Camera, name: "Cinema & TV", description: "Criadores especializados em entretenimento audiovisual", status: "Popular" },
    { icon: Gamepad2, name: "Gaming", description: "Streamers e gamers com audiências engajadas", status: "Em alta" },
    { icon: Dumbbell, name: "Fitness", description: "Profissionais de saúde e bem-estar", status: "Crescendo" },
    { icon: Heart, name: "Lifestyle", description: "Influenciadores de estilo de vida", status: "Trending" },
    { icon: Utensils, name: "Gastronomia", description: "Chefs e food bloggers", status: "Ativo" },
    { icon: Palette, name: "Arte & Design", description: "Artistas e designers criativos", status: "Criativo" },
    { icon: Car, name: "Automotivo", description: "Especialistas em carros e tecnologia", status: "Nicho" },
    { icon: ShoppingBag, name: "E-commerce", description: "Especialistas em vendas online", status: "Comercial" }
  ];

  return (
    <section className="relative py-24 bg-muted">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent-cyan/20 to-accent-amber/20"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unique Selling Points */}
        <div className="mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Tudo o que você precisa para <span className="bg-gradient-feature bg-clip-text text-transparent">fechar parcerias de sucesso</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Publi+ oferece ferramentas pensadas para cada etapa: da busca pelo parceiro ideal até a análise de resultados, tudo em um só lugar.
          </p>
        </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {uniqueSellingPoints.map((point, index) => (
              <Card key={index} className="group hover-lift bg-card border shadow-soft hover:shadow-strong overflow-hidden transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${point.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <point.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold font-poppins text-xl mb-4 text-foreground">{point.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{point.description}</p>
                  <div className="text-sm font-semibold text-primary bg-primary/10 px-3 py-2 rounded-lg inline-block">
                    {point.benefit}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Nichos Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold font-poppins text-foreground mb-6">
              Especialização por <span className="bg-gradient-feature bg-clip-text text-transparent">Nichos</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Conectamos marcas e criadores através de nichos específicos para resultados mais eficazes e autênticos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nichos.map((nicho, index) => (
              <Card key={index} className="group hover-scale bg-white border-0 shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent-cyan rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                    <nicho.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold font-poppins text-lg mb-2">{nicho.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{nicho.description}</p>
                  <div className="text-primary font-semibold">{nicho.status}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Criadores Section */}
        <div id="criadores" className="mb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-green-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Para Criadores</h2>
                  <p className="text-muted-foreground">Monetize sua paixão e expertise</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserCheck className="h-6 w-6 text-accent-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Perfil Profissional Completo</h3>
                      <p className="text-muted-foreground">Crie um portfólio detalhado com métricas reais, cases de sucesso e dados verificados que impressionam marcas.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-accent-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Oportunidades Direcionadas</h3>
                      <p className="text-muted-foreground">Receba propostas de marcas que realmente se alinham com seu nicho e audiência, garantindo parcerias autênticas.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-6 w-6 text-accent-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Monetização Eficiente</h3>
                      <p className="text-muted-foreground">Ferramentas para precificar seus serviços corretamente e negociar de forma profissional com as marcas.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Button variant="success" size="lg" className="w-full text-lg h-14" asChild>
                  <Link to="/auth">Começar como Criador</Link>
                </Button>
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent-green" />
                    <span>100% Gratuito</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent-green" />
                    <span>Cadastro em 5 min</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent-green/5 to-green-50 p-8 rounded-3xl">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-green mb-2">Crescimento Sustentável</div>
                  <p className="text-muted-foreground">Desenvolva sua carreira como criador</p>
                </div>
                <div className="grid grid-cols-1 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-foreground">Feedback positivo de marcas parceiras</div>
                    <p className="text-sm text-muted-foreground">Construa relacionamentos duradouros</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PMEs e Marcas Section */}
        <div id="marcas" className="mb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-accent-blue/5 to-blue-50 p-8 rounded-3xl">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-blue mb-2">Resultados Comprovados</div>
                  <p className="text-muted-foreground">Campanhas mais eficazes e autênticas</p>
                </div>
                <div className="grid grid-cols-1 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-foreground">Conexões de qualidade</div>
                    <p className="text-sm text-muted-foreground">Encontre os criadores ideais para sua marca</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-blue-600 rounded-2xl flex items-center justify-center">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Para PMEs e Marcas</h2>
                  <p className="text-muted-foreground">Conecte-se diretamente com criadores</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Search className="h-6 w-6 text-accent-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Busca Inteligente por Nicho</h3>
                      <p className="text-muted-foreground">Filtros avançados por especialidade, engajamento, localização e dados demográficos da audiência.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-accent-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Criadores Verificados</h3>
                      <p className="text-muted-foreground">Todos os perfis passam por processo de verificação rigoroso com métricas auditadas e histórico comprovado.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-accent-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Analytics em Tempo Real</h3>
                      <p className="text-muted-foreground">Acompanhe o desempenho das suas campanhas com relatórios detalhados e insights acionáveis.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Button variant="branded" size="lg" className="w-full text-lg h-14" asChild>
                  <Link to="/auth">Criar Campanha Agora</Link>
                </Button>
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent-blue" />
                    <span>Teste Grátis 14 dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-accent-blue" />
                    <span>Suporte dedicado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agências Section */}
        <div id="agencias" className="mb-24">
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Para Agências</h2>
                  <p className="text-muted-foreground">Gerencie seu catálogo completo</p>
                </div>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-medium">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Página Dedicada</h3>
                <p className="text-muted-foreground mb-4">Crie uma vitrine profissional da sua agência com branding personalizado e todos os seus criadores.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Design personalizado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Logo e cores da marca</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-medium">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Gestão Centralizada</h3>
                <p className="text-muted-foreground mb-4">Administre todos os criadores, propostas e campanhas em um dashboard único e intuitivo.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Dashboard completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Relatórios automatizados</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-medium">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Catálogo Profissional</h3>
                <p className="text-muted-foreground mb-4">Exponha o portfólio completo dos seus talentos com métricas detalhadas e cases de sucesso.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Perfis organizados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Métricas unificadas</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center space-y-6">
              <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">Cresça sua agência com a Publi+</div>
                  <p className="text-sm text-muted-foreground">Ferramentas profissionais para gerenciar e expandir seu negócio</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button variant="hero" size="lg" className="flex-1" asChild>
                  <Link to="/auth">Cadastrar Agência</Link>
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  Ver Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;