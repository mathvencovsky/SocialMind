import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, TrendingUp, Users, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  const posts = [
    {
      title: "Como escolher criadores brasileiros autênticos para sua marca",
      excerpt: "Estratégias para identificar creators que realmente se alinham com os valores da sua marca e geram engajamento real no mercado brasileiro.",
      category: "Para Marcas",
      date: "15 Dez 2024",
      readTime: "6 min",
      icon: Target,
      color: "text-primary"
    },
    {
      title: "5 nichos em crescimento para criadores brasileiros em 2025",
      excerpt: "Descubra as áreas de conteúdo com maior potencial de monetização e como posicionar seu perfil para aproveitá-las.",
      category: "Para Criadores",
      date: "12 Dez 2024",
      readTime: "8 min",
      icon: TrendingUp,
      color: "text-accent-cyan"
    },
    {
      title: "Cases de sucesso: Agências brasileiras que cresceram 300%",
      excerpt: "Histórias reais de agências nacionais que transformaram seus resultados usando estratégias de creator economy.",
      category: "Cases de Sucesso",
      date: "8 Dez 2024",
      readTime: "10 min",
      icon: Users,
      color: "text-secondary"
    }
  ];

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Blog & <span className="bg-gradient-hero bg-clip-text text-transparent">Insights</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dicas práticas, cases de sucesso e tendências do mercado de influenciadores brasileiro
          </p>
        </div>

        {/* Featured Posts */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <Card key={index} className="group hover-scale hover:shadow-strong transition-all duration-300 cursor-pointer border bg-card">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <post.icon className={`h-5 w-5 ${post.color}`} />
                    <span className="text-sm font-medium text-muted-foreground">{post.category}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                  <span>•</span>
                  <span>{post.readTime} de leitura</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-medium text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Quer receber nossos insights por email?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Cadastre-se na nossa newsletter e receba conteúdos exclusivos sobre 
            marketing de influência, casos de sucesso e dicas para crescer no mercado brasileiro.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/auth">Inscrever-se na newsletter</Link>
          </Button>
        </div>

        {/* Categories */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            Explore por categoria
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Para Criadores", count: 15, color: "bg-accent-green" },
              { name: "Para Marcas", count: 12, color: "bg-accent-blue" },
              { name: "Para Agências", count: 8, color: "bg-primary" },
              { name: "Cases de Sucesso", count: 20, color: "bg-accent-teal" },
              { name: "Tendências", count: 10, color: "bg-destructive" }
            ].map((category, index) => (
              <Button
                key={index}
                variant="outline"
                className="hover:shadow-soft transition-all duration-200"
              >
                <div className={`w-2 h-2 ${category.color} rounded-full mr-2`}></div>
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;