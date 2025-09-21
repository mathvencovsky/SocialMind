import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  TrendingUp,
  Users,
  Target,
  BarChart
} from "lucide-react";

// Mock blog posts data - in a real app, this would come from an API or CMS
const blogPosts = {
  "como-escolher-influenciadores-ideais": {
    title: "Como Escolher os Influenciadores Ideais para Sua Marca",
    slug: "como-escolher-influenciadores-ideais",
    excerpt: "Descubra as estratégias essenciais para identificar e selecionar os criadores de conteúdo que realmente vão impactar seu negócio.",
    content: `
      <p>Escolher os influenciadores certos para sua marca é uma das decisões mais importantes no marketing de influência. Um criador alinhado com seus valores pode transformar completamente o alcance e a percepção da sua marca.</p>

      <h2>1. Defina Seus Objetivos Claramente</h2>
      <p>Antes de buscar influenciadores, é crucial ter clareza sobre o que você quer alcançar:</p>
      <ul>
        <li><strong>Awareness:</strong> Aumentar o conhecimento da marca</li>
        <li><strong>Engagement:</strong> Gerar interação e conversas</li>
        <li><strong>Conversão:</strong> Driving vendas diretas</li>
        <li><strong>Branding:</strong> Fortalecer a imagem da marca</li>
      </ul>

      <h2>2. Analise a Autenticidade do Criador</h2>
      <p>A autenticidade é o que diferencia uma parceria bem-sucedida de uma campanha que não gera resultados:</p>
      <ul>
        <li>Verifique se o conteúdo é genuíno e natural</li>
        <li>Observe a interação real com os seguidores</li>
        <li>Analise se já promoveu produtos similares</li>
        <li>Confirme se os valores pessoais estão alinhados com sua marca</li>
      </ul>

      <h2>3. Métricas que Realmente Importam</h2>
      <p>Não foque apenas no número de seguidores. As métricas mais importantes são:</p>
      <ul>
        <li><strong>Taxa de Engajamento:</strong> Percentual de interações por post</li>
        <li><strong>Reach Orgânico:</strong> Quantas pessoas veem o conteúdo</li>
        <li><strong>Demografia da Audiência:</strong> Perfil dos seguidores</li>
        <li><strong>Frequência de Posting:</strong> Consistência na criação de conteúdo</li>
      </ul>

      <h2>4. Micro vs Macro Influenciadores</h2>
      <p>Cada tipo de influenciador tem suas vantagens:</p>
      
      <h3>Micro Influenciadores (1K-100K seguidores):</h3>
      <ul>
        <li>Maior taxa de engajamento</li>
        <li>Audiência mais segmentada e leal</li>
        <li>Custo-benefício melhor</li>
        <li>Relacionamento mais próximo com seguidores</li>
      </ul>

      <h3>Macro Influenciadores (100K+ seguidores):</h3>
      <ul>
        <li>Maior alcance</li>
        <li>Mais credibilidade e autoridade</li>
        <li>Conteúdo mais profissional</li>
        <li>Maior visibilidade da marca</li>
      </ul>

      <h2>5. Ferramentas para Análise</h2>
      <p>Use plataformas especializadas para avaliar influenciadores:</p>
      <ul>
        <li>Análise de audiência falsa vs real</li>
        <li>Histórico de performance de campanhas</li>
        <li>Métricas de engajamento por período</li>
        <li>Comparação entre criadores do mesmo nicho</li>
      </ul>

      <h2>Conclusão</h2>
      <p>O sucesso de uma campanha com influenciadores depende muito mais da escolha estratégica do que do orçamento disponível. Invista tempo na pesquisa, priorize a autenticidade e sempre alinhe a escolha com seus objetivos de negócio.</p>

      <p>Na Publi+, facilitamos esse processo conectando você diretamente com criadores verificados e fornecendo todas as métricas necessárias para uma escolha inteligente.</p>
    `,
    author: "Maria Silva",
    date: "2024-03-15",
    readTime: 8,
    category: "Estratégia",
    image: "/placeholder.svg",
    tags: ["influencer marketing", "estratégia", "ROI", "branding"]
  },
  "tendencias-marketing-influenciadores-2024": {
    title: "Tendências do Marketing de Influenciadores para 2024",
    slug: "tendencias-marketing-influenciadores-2024",
    excerpt: "As principais tendências que vão moldar o marketing de influência neste ano, desde micro-influenciadores até inteligência artificial.",
    content: `
      <p>O marketing de influenciadores continua evoluindo rapidamente. Em 2024, novas tendências estão redefinindo como marcas e criadores se conectam, criando oportunidades únicas para quem souber se adaptar.</p>

      <h2>1. Ascensão dos Nano-Influenciadores</h2>
      <p>Criadores com 1K-10K seguidores estão ganhando destaque por sua autenticidade e proximidade com a audiência:</p>
      <ul>
        <li>Taxa de engajamento até 60% maior que macro-influenciadores</li>
        <li>Custo-benefício excepcional para marcas locais</li>
        <li>Relacionamento mais genuíno com seguidores</li>
        <li>Maior flexibilidade para parcerias criativas</li>
      </ul>

      <h2>2. Conteúdo Gerado pelo Usuário (UGC)</h2>
      <p>As marcas estão priorizando conteúdo autêntico criado pelos próprios clientes:</p>
      <ul>
        <li>95% dos consumidores confiam mais em UGC que em publicidade tradicional</li>
        <li>Campanhas híbridas combinando influenciadores e clientes reais</li>
        <li>Ferramentas de curadoria de conteúdo mais sofisticadas</li>
        <li>Incentivos para criação de conteúdo orgânico</li>
      </ul>

      <h2>3. Inteligência Artificial na Seleção</h2>
      <p>IA está revolucionando como encontramos e avaliamos influenciadores:</p>
      <ul>
        <li>Análise preditiva de performance de campanhas</li>
        <li>Detecção automática de audiência falsa</li>
        <li>Matching inteligente entre marca e criador</li>
        <li>Otimização de budget em tempo real</li>
      </ul>

      <h2>4. Foco em ROI Mensurável</h2>
      <p>2024 marca o fim das campanhas sem métricas claras:</p>
      <ul>
        <li>Attribution models mais precisos</li>
        <li>Tracking de conversões em tempo real</li>
        <li>KPIs além de likes e comments</li>
        <li>Relatórios automatizados de performance</li>
      </ul>

      <h2>5. Parcerias de Longo Prazo</h2>
      <p>Marcas estão preferindo relacionamentos duradouros:</p>
      <ul>
        <li>Campanhas de 6-12 meses</li>
        <li>Embaixadores oficiais da marca</li>
        <li>Co-criação de produtos</li>
        <li>Participação em receitas/vendas</li>
      </ul>

      <h2>6. Diversificação de Plataformas</h2>
      <p>Instagram não é mais a única plataforma relevante:</p>
      <ul>
        <li><strong>TikTok:</strong> Crescimento exponencial em todas as idades</li>
        <li><strong>LinkedIn:</strong> B2B e thought leadership</li>
        <li><strong>YouTube Shorts:</strong> Competindo com TikTok</li>
        <li><strong>Clubhouse/Twitter Spaces:</strong> Audio content</li>
      </ul>

      <h2>Conclusão</h2>
      <p>As marcas que se adaptarem a essas tendências primeiro terão vantagem competitiva significativa. O foco deve estar na autenticidade, relacionamentos genuínos e resultados mensuráveis.</p>

      <p>A Publi+ está na vanguarda dessas mudanças, oferecendo ferramentas que incorporam as últimas tendências do mercado.</p>
    `,
    author: "João Santos",
    date: "2024-03-10",
    readTime: 6,
    category: "Tendências",
    image: "/placeholder.svg",
    tags: ["tendências", "2024", "nano-influenciadores", "IA", "ROI"]
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? blogPosts[slug as keyof typeof blogPosts] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Post não encontrado</h1>
            <p className="text-muted-foreground mb-8">O artigo que você está procurando não existe.</p>
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Header */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Link>
          </div>
        </section>

        {/* Article */}
        <article className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Meta Info */}
            <div className="mb-8">
              <Badge className="mb-4">{post.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min de leitura</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm font-medium">Compartilhar:</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-12">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>

            {/* Security Warning */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Atenção: esta página carrega HTML diretamente e precisa de revisão de segurança no código-fonte (dangerouslySetInnerHTML).
              </p>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-ul:mb-4 prose-li:mb-1"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-8">Artigos Relacionados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.values(blogPosts)
                .filter(relatedPost => relatedPost.slug !== post.slug)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Card key={relatedPost.slug} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-6">
                        <Badge className="mb-3">{relatedPost.category}</Badge>
                        <h3 className="font-semibold text-lg mb-2 leading-tight">
                          {relatedPost.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <span>{new Date(relatedPost.date).toLocaleDateString('pt-BR')}</span>
                          <span>{relatedPost.readTime} min</span>
                        </div>
                        <Link to={`/blog/${relatedPost.slug}`}>
                          <Button variant="outline" size="sm">
                            Ler mais
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;