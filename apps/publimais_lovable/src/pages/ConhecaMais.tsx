import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Building2, 
  Briefcase, 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Building
} from "lucide-react";
import { Link } from "react-router-dom";

const ConhecaMais = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background to-muted">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent-cyan to-secondary"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary))_0%,transparent_50%)] opacity-30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(var(--accent-cyan))_0%,transparent_50%)] opacity-30"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm text-primary text-sm font-medium border border-primary/20 fade-in">
                🚀 Descubra como revolucionamos o marketing de influência
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold font-poppins leading-tight fade-in">
                <span className="bg-gradient-to-r from-primary via-accent-cyan to-secondary bg-clip-text text-transparent">
                  A plataforma que conecta criadores e marcas no Brasil
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto fade-in">
                Descubra como a Publi+ está revolucionando o marketing de influência, 
                conectando criadores autênticos com marcas que querem crescer de verdade.
              </p>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona a Publi+</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Um processo simples e eficiente para conectar criadores e marcas
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>1. Criadores se Cadastram</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Criadores criam perfis detalhados com portfólio, métricas e especialidades
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle>2. Marcas Descobrem</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Agências e marcas encontram criadores ideais usando filtros avançados
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-primary shadow-strong bg-gradient-to-br from-primary/5 to-accent-cyan/5 hover-lift">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-primary">3. Conexão Direta</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comunicação direta e segura para negociar campanhas e parcerias
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recursos */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos Principais</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ferramentas poderosas para maximizar suas parcerias
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <Search className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Busca por Nicho</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Encontre criadores especializados no seu segmento de mercado
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Building2 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Perfis de Agências</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Conecte-se com agências especializadas em influencer marketing
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Briefcase className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Portfólios</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Visualize trabalhos anteriores e métricas de performance
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MessageCircle className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Contato Direto</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comunicação segura e direta entre criadores e marcas
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Planos */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos e Preços</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Escolha o plano ideal para suas necessidades
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Gratuito */}
              <Card className="relative h-full">
                <CardHeader>
                  <Badge className="w-fit mb-2" variant="secondary">Gratuito</Badge>
                  <CardTitle className="text-xl">Gratuito</CardTitle>
                  <div className="text-2xl font-bold">
                    R$ 0<span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Perfil básico</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Campanhas abertas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Comunicação básica</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline" asChild><Link to="/auth">Começar Gratuitamente</Link></Button>
                </CardContent>
              </Card>

              {/* Criador Pro */}
              <Card className="relative h-full border-primary">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Mais Popular</Badge>
                </div>
                <CardHeader>
                  <Badge className="w-fit mb-2">Para Criadores</Badge>
                  <div className="text-xs text-muted-foreground mb-2">
                    Sem números inflacionados. A Publi+ está em fase inicial e todos os dados são reais.
                  </div>
                  <CardTitle className="text-xl">Criador Pro</CardTitle>
                  <div className="text-2xl font-bold">
                    R$ 24,90<span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Perfil verificado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Métricas avançadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Maior visibilidade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Filtros especiais</span>
                    </div>
                  </div>
                  <Button className="w-full" asChild><Link to="/auth">Escolher Plano</Link></Button>
                </CardContent>
              </Card>

              {/* PME */}
              <Card className="relative h-full border-accent-cyan">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-accent-cyan text-white">Para PMEs</Badge>
                  <div className="text-xs text-muted-foreground mb-2">
                    Sem números inflacionados. A Publi+ está em fase inicial e todos os dados são reais.
                  </div>
                  <CardTitle className="text-xl">PME</CardTitle>
                  <div className="text-2xl font-bold">
                    R$ 24,90<span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Publique campanhas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Conexão direta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Criadores verificados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Analytics básicos</span>
                    </div>
                  </div>
                  <Button className="w-full bg-accent-cyan text-white hover:bg-accent-cyan/90" asChild><Link to="/auth">Começar Agora</Link></Button>
                </CardContent>
              </Card>

              {/* Agência Growth */}
              <Card className="relative h-full border-secondary">
                <CardHeader>
                  <Badge className="w-fit mb-2">Para Agências</Badge>
                  <div className="text-xs text-muted-foreground mb-2">
                    Sem números inflacionados. A Publi+ está em fase inicial e todos os dados são reais.
                  </div>
                  <CardTitle className="text-xl">Agência</CardTitle>
                  <div className="text-2xl font-bold">
                    R$ 599,90<span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Até 20 criadores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Analytics avançados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Suporte prioritário</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Relatórios personalizados</span>
                    </div>
                  </div>
                  <Button className="w-full" asChild><Link to="/auth">Escolher Growth</Link></Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Free Plan Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-card backdrop-blur-sm p-8 rounded-2xl shadow-medium border hover-lift">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-primary">Plano Gratuito para Criadores</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Perfeito para iniciantes. Crie seu perfil gratuitamente, participe de campanhas abertas 
                  e ganhe visibilidade sem custo.
                </p>
                <Button size="lg" variant="outline" className="group" asChild>
                  <Link to="/auth">
                    Começar Gratuitamente
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* PME Information Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-card backdrop-blur-sm p-8 rounded-2xl shadow-medium border hover-lift">
                <div className="w-16 h-16 bg-accent-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="h-8 w-8 text-accent-cyan" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-accent-cyan">Também para PMEs</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  PMEs também podem usar a Publi+ diretamente — acesse mesmo plano que criadores e conecte-se com talentos.
                  Pequenas e médias empresas pagam R$24,90/mês e podem publicar campanhas diretamente.
                </p>
                <Button size="lg" className="group bg-accent-cyan text-white hover:bg-accent-cyan/90" asChild>
                  <Link to="/auth">
                    Criar Campanha
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Por que usar a Publi+ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que usar a Publi+</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Os diferenciais que fazem da Publi+ a melhor escolha
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Segurança Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Dados criptografados e comunicação segura entre todas as partes
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle>Resultados Rápidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Conecte-se com os criadores ideais em minutos, não em dias
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-secondary shadow-strong bg-gradient-to-br from-secondary/5 to-accent-coral/5 hover-lift">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-secondary">Qualidade Premium</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Criadores verificados e agências qualificadas para melhores resultados
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para revolucionar seu marketing?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Junte-se a milhares de criadores e marcas que já estão crescendo com a Publi+
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/auth">
                Comece agora e cresça com Publi+
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConhecaMais;