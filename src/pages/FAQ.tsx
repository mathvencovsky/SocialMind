import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle } from "lucide-react";

const FAQ = () => {
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
                ❓ Respostas para suas principais dúvidas
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold font-poppins leading-tight fade-in">
                <span className="bg-gradient-to-r from-primary via-accent-cyan to-secondary bg-clip-text text-transparent">
                  Tire suas dúvidas sobre a Publi+
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto fade-in">
                Encontre respostas para as principais dúvidas sobre a plataforma
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {/* O que é a Publi+ */}
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  O que é a Publi+?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  A Publi+ é uma plataforma inovadora que conecta criadores de conteúdo e PMEs 
                  (Pequenas e Médias Empresas) para campanhas de marketing de influência. 
                  Facilitamos parcerias autênticas e eficazes entre marcas e criadores, 
                  proporcionando resultados mensuráveis para ambos os lados.
                </AccordionContent>
              </AccordionItem>

              {/* Criadores - Planos */}
              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  Quais são os planos disponíveis para criadores?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Plano Gratuito:</h4>
                    <p>Perfil básico com informações essenciais e acesso limitado à plataforma.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Criador Pro (R$ 24,90/mês):</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Métricas detalhadas de performance</li>
                      <li>Maior visibilidade nos resultados de busca</li>
                      <li>Filtros avançados para encontrar oportunidades</li>
                      <li>Prioridade no atendimento ao cliente</li>
                      <li>Perfil verificado com selo de autenticidade</li>
                    </ul>
                  </div>
                  <p className="text-sm">
                    <strong>Flexibilidade total:</strong> Você pode alterar seu plano a qualquer momento, 
                    sem multas ou taxas de cancelamento.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Agências - Planos */}
              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  Quais são os planos para agências e empresas?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Agência Basic (R$ 299,90/mês):</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Gestão de até 5 criadores simultaneamente</li>
                      <li>Dashboard com métricas básicas</li>
                      <li>Suporte por email</li>
                      <li>Relatórios básicos de campanhas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Agência Growth (R$ 599,90/mês):</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Gestão de até 20 criadores simultaneamente</li>
                      <li>Analytics avançados e insights detalhados</li>
                      <li>Suporte prioritário via chat e telefone</li>
                      <li>Relatórios personalizados e exportáveis</li>
                      <li>Gerenciador de campanhas dedicado</li>
                      <li>API para integração com outras ferramentas</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* PMEs - Planos */}
              <AccordionItem value="item-3b" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  PMEs podem usar a Publi+ diretamente?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4">
                  <p>
                    Sim! Pequenas e médias empresas podem usar a Publi+ diretamente pagando R$24,90/mês 
                    e publicar campanhas conectando-se com criadores sem intermediários.
                  </p>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Plano PME (R$ 24,90/mês):</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Publique suas oportunidades para criadores</li>
                      <li>Conexão direta sem intermediários</li>
                      <li>Acesso a criadores verificados</li>
                      <li>Analytics básicos de campanha</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Qual a diferença entre PME e agência?</h4>
                    <p>
                      PMEs focam em suas próprias campanhas por R$24,90/mês. Agências gerenciam múltiplos 
                      criadores e campanhas, com planos a partir de R$299,90/mês.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Pagamentos */}
              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  Como funcionam os pagamentos?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Formas de Pagamento:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Cartão de crédito:</strong> Cobrança mensal automática</li>
                      <li><strong>PIX:</strong> Em breve! Pagamento instantâneo via PIX</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Política de Cancelamento:</h4>
                    <p>Sem taxas de cancelamento. Você pode cancelar ou alterar seu plano a qualquer momento. 
                    O acesso aos recursos premium permanece ativo até o final do período já pago.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Segurança:</h4>
                    <p>Todos os pagamentos são processados com criptografia SSL e seguem os mais altos 
                    padrões de segurança bancária.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Lançamento */}
              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  Quando a plataforma estará disponível?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-3">
                  <p>
                    A Publi+ está atualmente em fase de desenvolvimento e testes finais. 
                    Estamos oferecendo <strong>acesso antecipado exclusivo</strong> através da nossa lista de espera.
                  </p>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Benefícios do Acesso Antecipado:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Primeiros a testar todas as funcionalidades</li>
                      <li>Desconto especial de lançamento</li>
                      <li>Influência direta no desenvolvimento da plataforma</li>
                      <li>Suporte premium durante a fase beta</li>
                    </ul>
                  </div>
                  <p>
                    <strong>Inscreva-se na nossa lista de espera</strong> para ser notificado assim que 
                    liberarmos o acesso!
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Segurança */}
              <AccordionItem value="item-6" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  Como a Publi+ garante a segurança dos dados?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Proteção de Dados:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Criptografia de ponta a ponta para todas as comunicações</li>
                      <li>Servidores seguros com certificação ISO 27001</li>
                      <li>Backups automatizados e redundância de dados</li>
                      <li>Conformidade total com a LGPD (Lei Geral de Proteção de Dados)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Privacidade Garantida:</h4>
                    <p>
                      Seus dados pessoais são tratados com máxima confidencialidade. 
                      Nunca compartilhamos informações com terceiros sem sua autorização expressa.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Verificação de Perfis:</h4>
                    <p>
                      Todos os perfis passam por um processo de verificação para garantir 
                      autenticidade e reduzir riscos de fraude.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Suporte */}
              <AccordionItem value="item-7" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  Como posso entrar em contato com o suporte?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Canais de Atendimento:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Email:</strong> suporte@publi.plus</li>
                      <li><strong>Chat ao vivo:</strong> Disponível na plataforma (usuários premium)</li>
                      <li><strong>Central de Ajuda:</strong> Artigos e tutoriais completos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Horários de Atendimento:</h4>
                    <p>
                      <strong>Email:</strong> 24/7 com resposta em até 24h<br/>
                      <strong>Chat:</strong> Segunda a sexta, 9h às 18h (horário de Brasília)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Suporte Especializado:</h4>
                    <p>
                      Usuários dos planos premium têm acesso a suporte prioritário 
                      com especialistas em marketing de influência.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Contact CTA */}
            <div className="mt-16 text-center p-8 bg-muted/30 rounded-lg">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Não encontrou sua resposta?</h3>
              <p className="text-muted-foreground mb-4">
                Nossa equipe está sempre pronta para ajudar você
              </p>
              <a 
                href="mailto:suporte@publi.plus" 
                className="text-primary hover:underline font-medium"
              >
                Entre em contato conosco →
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;