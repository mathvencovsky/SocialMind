import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://publimais.lovable.app/auth/reset-password"
      });

      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setSubmitted(true);
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada para redefinir sua senha."
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-background to-muted">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent-cyan to-secondary"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary))_0%,transparent_50%)] opacity-30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(var(--accent-cyan))_0%,transparent_50%)] opacity-30"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-md mx-auto">
              {/* Back to Login Link */}
              <div className="mb-8">
                <Link 
                  to="/auth" 
                  className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors duration-200 group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                  Voltar para o login
                </Link>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">Publi+</h1>
                <p className="text-muted-foreground">Redefinir senha</p>
              </div>

              {/* Reset Password Card */}
              <Card className="shadow-strong border-2">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Mail className="h-5 w-5" />
                    Esqueci minha senha
                  </CardTitle>
                  <CardDescription>
                    {!submitted ? 
                      "Digite seu email para receber o link de redefinição" :
                      "Link enviado com sucesso!"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email cadastrado</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enviar link de redefinição
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Enviamos um link de redefinição para o seu email.
                          <br />
                          Verifique sua caixa de entrada e spam.
                        </p>
                      </div>
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/auth">Voltar para o login</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;