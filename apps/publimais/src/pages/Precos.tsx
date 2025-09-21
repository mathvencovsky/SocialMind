import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  X, 
  Star, 
  Users, 
  TrendingUp, 
  BarChart3,
  Crown,
  Zap,
  Shield,
  Clock,
  Building
} from "lucide-react";

const Precos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background to-muted">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent-cyan to-secondary"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary))_0%,transparent_50%)] opacity-30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(var(--accent-cyan))_0%,transparent_50%)] opacity-30"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm text-primary text-sm font-medium border border-primary/20 fade-in">
                💰 Preços justos para todos os perfis
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins text-foreground leading-tight fade-in">
                Preços da 
                <span className="block bg-gradient-to-r from-primary via-accent-cyan to-secondary bg-clip-text text-transparent">
                  Publi+
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto fade-in">
                Planos acessíveis para criadores e agências que querem crescer no marketing de influência
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
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
                  <CardDescription>
                    Ideal para quem está começando
                  </CardDescription>
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

              {/* Pro */}
              <Card className="relative h-full border-primary">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Recomendado</Badge>
                </div>
                <CardHeader>
                  <Badge className="w-fit mb-2">Para Criadores</Badge>
                  <div className="text-xs text-muted-foreground mb-2">
                    Sem números inflacionados. A Publi+ está em fase inicial e todos os dados são reais.
                  </div>
                  <CardTitle className="text-xl">Pro</CardTitle>
                  <div className="text-2xl font-bold text-primary">
                    R$ 24,90<span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </div>
                  <CardDescription>
                    Bom para quem tem +10k seguidores ou já trabalha com marcas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Tudo do plano gratuito</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Mais visibilidade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Métricas avançadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Prioridade nas buscas</span>
                    </div>
                  </div>
                  <Button className="w-full" asChild><Link to="/auth">Upgrade para Pro</Link></Button>
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
                  <CardDescription>
                    Para Pequenas e Médias Empresas
                  </CardDescription>
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

              {/* Growth */}
              <Card className="relative h-full border-secondary">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-secondary text-secondary-foreground">Para Agências</Badge>
                </div>
                <CardHeader>
                  <Badge className="w-fit mb-2">Agências</Badge>
                  <div className="text-xs text-muted-foreground mb-2">
                    Sem números inflacionados. A Publi+ está em fase inicial e todos os dados são reais.
                  </div>
                  <CardTitle className="text-xl">Growth</CardTitle>
                  <div className="text-2xl font-bold text-secondary">
                    R$ 599,90<span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </div>
                  <CardDescription>
                    Ideal para agências que precisam escalar operações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Até 20 criadores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Relatórios avançados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Suporte prioritário</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Account manager</span>
                    </div>
                  </div>
                  <Button className="w-full" asChild><Link to="/auth">Escolher Growth</Link></Button>
                </CardContent>
              </Card>
            </div>

            {/* PME Information Section */}
            <div className="mt-16 text-center">
              <p className="text-muted-foreground max-w-2xl mx-auto">
                PMEs também podem usar a Publi+ diretamente — acesse mesmo plano que criadores e conecte-se com talentos.
              </p>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que vale a pena entrar na Publi+?</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Investimento inteligente com retorno garantido
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Baixo Custo</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Preços muito abaixo do mercado tradicional de agências
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Alta Exposição</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Criadores ganham maior visibilidade e mais oportunidades
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-accent-cyan" />
                  </div>
                  <CardTitle className="text-lg">Processo Direto</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comunicação direta entre marca e influenciador sem intermediários
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-accent-coral" />
                  </div>
                  <CardTitle className="text-lg">Economia de Tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Agências economizam horas na busca e gestão de influenciadores
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Junte-se à maior plataforma de marketing de influência do Brasil
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/auth">Comece agora</Link>
            </Button>
            <p className="text-sm opacity-80 mt-4">
              ✓ Sem compromisso ✓ Cancele quando quiser
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Precos;