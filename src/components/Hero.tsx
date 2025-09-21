import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, BarChart3, Users, Star } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary))_0%,transparent_50%)] opacity-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(var(--accent-cyan))_0%,transparent_50%)] opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Star className="w-3 h-3 mr-1" />
                #1 Plataforma para Influenciadores
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary">Ganhe visibilidade,</span>
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  construa portfólio
                </span>
                <br />
                <span className="text-foreground">com dados reais</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                A plataforma completa para influenciadores que querem 
                <span className="text-primary font-semibold"> profissionalizar sua carreira</span> e 
                <span className="text-primary font-semibold"> fechar mais contratos</span> com marcas.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                <span>Portfólio automático com métricas reais de suas redes</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                <span>Relatórios profissionais para apresentar às marcas</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                <span>Analytics detalhado de engajamento e audiência</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-all duration-200 group text-lg px-8 py-6">
                  Começar Agora Grátis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover:bg-primary/5 border-primary/20">
                  Ver Como Funciona
                </Button>
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/40">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">+500</span> influenciadores já usam
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-green-600">98%</span> relatam aumento nos contratos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-blue-600">5x</span> mais dados que a concorrência
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Dashboard da Publi+ mostrando métricas de redes sociais" 
                className="w-full h-auto object-cover"
              />
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
              
              {/* Floating Cards */}
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border/40">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Live Analytics</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border/40">
                <div className="text-sm">
                  <div className="font-semibold text-primary">2.4M</div>
                  <div className="text-xs text-muted-foreground">Total Reach</div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-primary opacity-20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-r from-accent-cyan to-secondary opacity-20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;