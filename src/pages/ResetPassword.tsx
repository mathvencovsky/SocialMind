import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { PasswordStrength } from '@/components/ui/password-strength';
import { Loader2, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session from the email link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        // If no session, check if we have the required tokens in URL
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        if (!accessToken || !refreshToken) {
          toast({
            title: "Link inválido",
            description: "Este link não é mais válido, solicite uma nova redefinição de senha.",
            variant: "destructive"
          });
          setTimeout(() => navigate('/auth/forgot-password'), 3000);
        } else {
          setIsValidSession(true);
        }
      }
    };

    checkSession();
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate password match
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas devem ser iguais.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast({
        title: "Senha muito fraca",
        description: "A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        if (error.message.includes('session_not_found') || error.message.includes('invalid_session')) {
          toast({
            title: "Sessão expirada",
            description: "Este link não é mais válido, solicite uma nova redefinição de senha.",
            variant: "destructive"
          });
          setTimeout(() => navigate('/auth/forgot-password'), 3000);
        } else {
          toast({
            title: "Erro",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        setSuccess(true);
        toast({
          title: "Senha redefinida!",
          description: "Sua senha foi alterada com sucesso."
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

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <section className="relative py-20 overflow-hidden bg-gradient-to-br from-background to-muted">
            <div className="relative z-10 container mx-auto px-4">
              <div className="max-w-md mx-auto text-center">
                <Card className="shadow-strong border-2">
                  <CardContent className="pt-6">
                    <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Este link não é mais válido ou expirou.
                      </p>
                    </div>
                    <Button variant="outline" asChild className="w-full mt-4">
                      <Link to="/auth/forgot-password">Solicitar nova redefinição</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

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
                    {success ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Shield className="h-5 w-5" />}
                    {success ? "Senha redefinida!" : "Nova senha"}
                  </CardTitle>
                  <CardDescription>
                    {success ? 
                      "Sua senha foi alterada com sucesso" :
                      "Digite sua nova senha para acessar sua conta"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!success ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Nova senha</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Mínimo 8 caracteres com letras, números e símbolos"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={8}
                        />
                        <PasswordStrength password={password} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Digite a senha novamente"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Redefinir senha
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Senha redefinida com sucesso! Agora você pode fazer login novamente.
                        </p>
                      </div>
                      <Button asChild className="w-full">
                        <Link to="/auth">Fazer login</Link>
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

export default ResetPassword;