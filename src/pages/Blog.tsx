import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search, TrendingUp, Users, Target, BarChart3, Lightbulb, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Blog = () => {
  const categories = [
    { name: "Estratégias", count: 12, icon: Target },
    { name: "Tendências", count: 8, icon: TrendingUp },
    { name: "Casos de Sucesso", count: 15, icon: BarChart3 },
    { name: "Dicas", count: 20, icon: Lightbulb },
    { name: "Influenciadores", count: 10, icon: Users }
  ];

  const articles = [
    {
      id: 1,
      title: "Como Escolher os Influenciadores Ideais para Sua Marca",
      slug: "como-escolher-influenciadores-ideais",
      excerpt: "Descubra as estratégias essenciais para identificar e selecionar os criadores de conteúdo que realmente vão impactar seu negócio.",
      category: "Estratégias",
      date: "15 Mar 2024",
      readTime: "8 min",
      image: "/placeholder.svg",
      featured: true
    },
    {
      id: 2,
      title: "Tendências do marketing de influência em 2024",
      excerpt: "As principais mudanças no mercado brasileiro e como se adaptar para maximizar seus resultados.",
      category: "Tendências",
      date: "12 Nov 2024",
      readTime: "7 min",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 3,
      title: "Case: Como a marca X aumentou vendas em 300%",
      excerpt: "Análise completa de uma campanha que revolucionou os resultados de uma empresa brasileira.",
      category: "Casos de Sucesso",
      date: "10 Nov 2024",
      readTime: "8 min",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 4,
      title: "Métricas que realmente importam no marketing de influência",
      excerpt: "Aprenda a medir o ROI real das suas campanhas e otimizar seus investimentos.",
      category: "Estratégias",
      date: "8 Nov 2024",
      readTime: "6 min",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 5,
      title: "O futuro dos micro-influenciadores no Brasil",
      excerpt: "Por que investir em criadores com audiências menores pode ser mais eficaz.",
      category: "Tendências",
      date: "5 Nov 2024",
      readTime: "4 min",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 6,
      title: "Guia completo para negociar com influenciadores",
      excerpt: "Dicas práticas para estabelecer parcerias justas e lucrativas para ambas as partes.",
      category: "Dicas",
      date: "3 Nov 2024",
      readTime: "9 min",
      image: "/api/placeholder/400/250",
      featured: false
    }
  ];

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (!category) return Target;
    return category.icon;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-accent-cyan/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-poppins text-foreground mb-6">
              Blog <span className="bg-gradient-hero bg-clip-text text-transparent">Publi+</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Insights, estratégias e tendências do marketing de influência no Brasil
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Buscar artigos..."
                className="pl-12 h-14 text-lg rounded-xl"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="group hover-scale"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Featured Article */}
            {articles.filter(article => article.featured).map((article) => {
              const Icon = getCategoryIcon(article.category);
              return (
                <Card key={article.id} className="lg:col-span-2 overflow-hidden hover-lift group cursor-pointer">
                  <div className="relative h-64">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                      <Heart className="h-16 w-16 text-primary/30" />
                    </div>
                    <Badge className="absolute top-4 left-4 bg-primary text-white">
                      Destaque
                    </Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {article.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </div>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold font-poppins text-foreground mb-4 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {article.excerpt}
                    </p>
                    <Link to={`/blog/${article.slug}`}>
                      <Button variant="outline" className="group-hover:bg-primary group-hover:text-white">
                        Ler mais
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}

            {/* Regular Articles */}
            {articles.filter(article => !article.featured).map((article) => {
              const Icon = getCategoryIcon(article.category);
              return (
                <Card key={article.id} className="overflow-hidden hover-lift group cursor-pointer hover-scale">
                  <div className="relative h-48">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent-coral/20 flex items-center justify-center">
                      <Icon className="h-12 w-12 text-secondary/40" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Icon className="h-3 w-3" />
                        {article.category}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold font-poppins text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </div>
                      </div>
                      <Link to={`/blog/${article.slug || 'post'}`}>
                        <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                          Ler mais
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="hover-lift">
              Carregar mais artigos
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;