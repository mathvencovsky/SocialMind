import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Search, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AdminRoute from '@/components/AdminRoute';

interface AdminLog {
  id: string;
  action: string;
  platform?: string;
  endpoint?: string;
  request_data?: any;
  response_data?: any;
  error_message?: string;
  status_code?: number;
  duration_ms?: number;
  created_at: string;
}

const AdminLogs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*')
        .eq('admin_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        console.error('Error fetching logs:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os logs.",
          variant: "destructive"
        });
      } else {
        setLogs(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.endpoint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.error_message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = platformFilter === 'all' || log.platform === platformFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'success' && log.status_code && log.status_code >= 200 && log.status_code < 300) ||
      (statusFilter === 'error' && (log.error_message || (log.status_code && log.status_code >= 400)));
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const getStatusIcon = (log: AdminLog) => {
    if (log.error_message || (log.status_code && log.status_code >= 400)) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    if (log.status_code && log.status_code >= 200 && log.status_code < 300) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusColor = (log: AdminLog) => {
    if (log.error_message || (log.status_code && log.status_code >= 400)) {
      return 'destructive';
    }
    if (log.status_code && log.status_code >= 200 && log.status_code < 300) {
      return 'secondary';
    }
    return 'outline';
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    return `${ms}ms`;
  };

  const formatJson = (obj: any) => {
    if (!obj) return 'N/A';
    return JSON.stringify(obj, null, 2);
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/teste')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Teste
                </Button>
                <h1 className="text-2xl font-bold text-primary">Logs de Depuração</h1>
              </div>
              <Button variant="outline" onClick={fetchLogs} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por ação, endpoint ou erro..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as plataformas</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="success">Sucesso</SelectItem>
                      <SelectItem value="error">Erro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Logs da API ({filteredLogs.length})</span>
                  {logs.some(log => log.error_message) && (
                    <Badge variant="destructive" className="flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Erros detectados
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Registros de todas as chamadas feitas às APIs das redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Nenhum log encontrado</h3>
                    <p className="text-muted-foreground">
                      {logs.length === 0 ? 
                        'Conecte alguns perfis para ver os logs aqui' :
                        'Tente ajustar os filtros para ver mais resultados'
                      }
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {filteredLogs.map((log) => (
                        <div key={log.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(log)}
                              <div>
                                <h4 className="font-medium">{log.action}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(log.created_at).toLocaleString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {log.platform && (
                                <Badge variant="outline" className="capitalize">
                                  {log.platform}
                                </Badge>
                              )}
                              {log.status_code && (
                                <Badge variant={getStatusColor(log)}>
                                  {log.status_code}
                                </Badge>
                              )}
                              <Badge variant="secondary">
                                {formatDuration(log.duration_ms)}
                              </Badge>
                            </div>
                          </div>

                          {log.endpoint && (
                            <div>
                              <span className="text-sm font-medium">Endpoint: </span>
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {log.endpoint}
                              </code>
                            </div>
                          )}

                          {log.error_message && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium text-red-800">Erro</span>
                              </div>
                              <p className="text-sm text-red-700">{log.error_message}</p>
                            </div>
                          )}

                          {(log.request_data || log.response_data) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {log.request_data && (
                                <div>
                                  <h5 className="text-sm font-medium mb-2">Request Data</h5>
                                  <ScrollArea className="h-32">
                                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                      {formatJson(log.request_data)}
                                    </pre>
                                  </ScrollArea>
                                </div>
                              )}
                              
                              {log.response_data && (
                                <div>
                                  <h5 className="text-sm font-medium mb-2">Response Data</h5>
                                  <ScrollArea className="h-32">
                                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                      {formatJson(log.response_data)}
                                    </pre>
                                  </ScrollArea>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminLogs;