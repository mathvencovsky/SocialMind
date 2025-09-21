import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const creatorPlans = [
    {
      name: "Free",
      price: "R$ 0",
      period: "/sempre",
      description: "Para criadores iniciantes",
      features: [
        "Listagem no marketplace",
        "Acesso a campanhas básicas",
        "Visibilidade nas buscas"
      ],
      cta: "Começar Grátis",
      variant: "outline" as const,
      popular: false,
      category: "creators"
    },
    {
      name: "Pro",
      price: "R$ 24,90",
      period: "/mês",
      description: "Cresça sua audiência agora",
      features: [
        "Visibilidade melhorada",
        "Analytics avançados",
        "Convites filtrados",
        "Suporte prioritário"
      ],
      cta: "Assinar Agora",
      variant: "hero" as const,
      popular: true,
      badge: "Mais Popular",
      category: "creators"
    }
  ];

  const agencyPlans = [
    {
      name: "Basic",
      price: "R$ 299,90",
      period: "/mês",
      description: "Para agências pequenas",
      features: [
        "Até 5 criadores gerenciados",
        "Ferramentas básicas",
        "Analytics essenciais",
        "Interações com marcas"
      ],
      cta: "Começar Teste",
      variant: "outline" as const,
      popular: false,
      category: "agencies"
    },
    {
      name: "Growth",
      price: "R$ 599,90",
      period: "/mês",
      description: "Potencialize seus resultados",
      features: [
        "Até 20 criadores",
        "Analytics premium",
        "Gestão completa",
        "Relatórios avançados"
      ],
      cta: "Assinar Agora",
      variant: "hero" as const,
      popular: true,
      badge: "Recomendado",
      category: "agencies"
    }
  ];

  const pmeplan = {
    name: "PME",
    price: "R$ 24,90",
    period: "/mês",
    description: "Para Pequenas e Médias Empresas",
    features: [
      "Publique suas oportunidades para criadores",
      "Conexão direta sem intermediários",
      "Acesso a criadores verificados",
      "Analytics básicos de campanha"
    ],
    cta: "Começar Agora",
    variant: "cyan" as const,
    popular: false,
    category: "pmes"
  };

  return (
    <section id="precos" className="py-24 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Escolha o plano perfeito e <span className="bg-gradient-hero bg-clip-text text-transparent">comece hoje mesmo</span>
          </h2>
        </div>

        {/* Creators Pricing */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">Para Criadores</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {creatorPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden hover-lift transition-all duration-300 ${
                  plan.popular 
                    ? 'border-primary shadow-strong bg-gradient-to-br from-primary/5 to-accent-cyan/5' 
                    : 'shadow-medium hover:shadow-strong'
                }`}
              >
                {plan.popular && plan.badge && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-hero text-white text-center py-2 text-sm font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4" />
                      {plan.badge}
                    </div>
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-accent-green flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.variant} 
                    size="lg" 
                    className="w-full"
                    asChild
                  >
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* PMEs Pricing */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-foreground mb-4">Para Pequenas e Médias Empresas</h3>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            PMEs também podem usar a Publi+ diretamente — acesse mesmo plano que criadores e conecte-se com talentos.
          </p>
          <div className="max-w-md mx-auto">
            <Card className="relative overflow-hidden hover-lift transition-all duration-300 border-accent-cyan shadow-strong bg-gradient-to-br from-accent-cyan/5 to-cyan-50">
              <CardHeader className="text-center pt-6">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {pmeplan.name}
                </CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{pmeplan.price}</span>
                    <span className="text-muted-foreground">{pmeplan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{pmeplan.description}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {pmeplan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-accent-green flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                  
                  <Button 
                    variant={pmeplan.variant} 
                    size="lg" 
                    className="w-full"
                    asChild
                  >
                    <Link to="/auth">{pmeplan.cta}</Link>
                  </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Agencies Pricing */}
        <div>
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">Para Agências</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {agencyPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden hover-lift transition-all duration-300 ${
                  plan.popular 
                    ? 'border-secondary shadow-strong bg-gradient-to-br from-secondary/5 to-accent-coral/5' 
                    : 'shadow-medium hover:shadow-strong'
                }`}
              >
                {plan.popular && plan.badge && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-feature text-white text-center py-2 text-sm font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4" />
                      {plan.badge}
                    </div>
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-accent-green flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.variant} 
                    size="lg" 
                    className="w-full"
                    asChild
                  >
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            Todos os planos incluem 30 dias de teste gratuito
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent-teal" />
              Cancelamento a qualquer momento
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent-green" />
              Suporte em português
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent-blue" />
              Dados seguros no Brasil
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;