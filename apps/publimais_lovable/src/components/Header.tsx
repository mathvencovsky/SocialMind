import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    navigate('/auth');
  };

  const handleDashboardClick = () => {
    setMobileMenuOpen(false);
    navigate('/dashboard');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-gradient-primary text-white font-bold text-xl px-3 py-1 rounded-lg">
              Publi+
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <a 
                href="#features" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Recursos
              </a>
              <a 
                href="#pricing" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Preços
              </a>
              <Link 
                to="/blog" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Blog
              </Link>
            </nav>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              {user ? (
                <Button 
                  onClick={handleDashboardClick}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity duration-200"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={handleLoginClick}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                  <Button 
                    onClick={handleLoginClick}
                    className="bg-gradient-primary hover:opacity-90 transition-opacity duration-200"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Cadastrar-se
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/40 bg-background/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Recursos
              </a>
              <a 
                href="#pricing" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preços
              </a>
              <Link 
                to="/blog" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-border/40 space-y-3">
                {user ? (
                  <Button 
                    onClick={handleDashboardClick}
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-200"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleLoginClick}
                      className="w-full"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                    <Button 
                      onClick={handleLoginClick}
                      className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-200"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Cadastrar-se
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;