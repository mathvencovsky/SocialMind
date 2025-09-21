import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building, Users, TrendingUp, ArrowRight } from "lucide-react";

const AgencyHighlight = () => {
  const agencyCreators = [
    { name: "Ana Silva", followers: "32K", avatar: "AS", specialty: "Fitness" },
    { name: "Bruno Costa", followers: "45K", avatar: "BC", specialty: "Tech" },
    { name: "Carla Lima", followers: "28K", avatar: "CL", specialty: "Lifestyle" },
    { name: "Diego Santos", followers: "52K", avatar: "DS", specialty: "Gaming" },
    { name: "Elena Rocha", followers: "38K", avatar: "ER", specialty: "Beauty" },
    { name: "Felipe Moura", followers: "41K", avatar: "FM", specialty: "Travel" }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Agências em <span className="bg-gradient-feature bg-clip-text text-transparent">Destaque</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça agências brasileiras que estão transformando o marketing de influência
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="bg-card shadow-strong border-0 overflow-hidden hover-lift">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Agency Info */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center">
                      <Building className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Criativa Digital</h3>
                      <p className="text-muted-foreground">Agência especializada em creators brasileiros</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    Com mais de 120 criadores em seu portfólio, a Criativa Digital é referência 
                    em campanhas autênticas que geram resultados reais para marcas nacionais e internacionais.
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">120+</div>
                      <div className="text-sm text-muted-foreground">Criadores</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">85K</div>
                      <div className="text-sm text-muted-foreground">Receita/mês</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">95%</div>
                      <div className="text-sm text-muted-foreground">Satisfação</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-8">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      300% crescimento em 2024
                    </Badge>
                    <Badge variant="outline">Verificada</Badge>
                  </div>

                  <Button size="lg" className="bg-gradient-hero text-white hover:opacity-90 group">
                    Ver todos os criadores
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Creators Grid */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Alguns dos nossos criadores
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {agencyCreators.map((creator, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-4 bg-background rounded-xl border hover-scale cursor-pointer"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="" alt={creator.name} />
                          <AvatarFallback className="bg-gradient-accent text-white text-sm font-semibold">
                            {creator.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground text-sm">{creator.name}</div>
                          <div className="text-xs text-muted-foreground">{creator.followers} • {creator.specialty}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-accent/5 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground">
                      + 114 outros criadores verificados
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AgencyHighlight;