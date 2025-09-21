import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';  
import { Settings, TestTube, FileText, Shield } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

const AdminQuickAccess = () => {
  const { isAdmin, loading } = useAdmin();

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-800">
          <Shield className="w-5 h-5 mr-2" />
          Painel Administrativo
          <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
            Admin
          </Badge>
        </CardTitle>
        <CardDescription className="text-orange-600">
          Ferramentas exclusivas para administradores do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/teste">
            <Button variant="outline" className="w-full justify-start h-auto p-4 border-orange-200 hover:bg-orange-100">
              <div className="flex items-start space-x-3">
                <TestTube className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="text-left">
                  <div className="font-medium text-orange-800">Ambiente de Teste</div>
                  <div className="text-sm text-orange-600">
                    Conectar perfis reais e testar APIs
                  </div>
                </div>
              </div>
            </Button>
          </Link>

          <Link to="/admin/logs">
            <Button variant="outline" className="w-full justify-start h-auto p-4 border-orange-200 hover:bg-orange-100">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="text-left">
                  <div className="font-medium text-orange-800">Logs de Debug</div>
                  <div className="text-sm text-orange-600">
                    Visualizar chamadas da API e erros
                  </div>
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminQuickAccess;