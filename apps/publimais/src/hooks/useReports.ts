import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportData {
  profile: any;
  summary: any;
  socialAccounts: any[];
  metrics: any[];
  adPackages: any[];
  generatedAt: string;
  reportType: string;
}

interface SharedReport {
  publicUrl: string;
  expiresAt: string;
}

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateReport = async (options: {
    format?: 'pdf' | 'json';
    includePackages?: boolean;
  } = {}): Promise<ReportData | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: {
          format: options.format || 'json',
          includePackages: options.includePackages !== false
        }
      });

      if (error) throw error;

      toast({
        title: "Relatório gerado!",
        description: "Seu relatório foi gerado com sucesso.",
      });

      return data.data;
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const shareReport = async (options: {
    expirationDays?: number;
    includePackages?: boolean;
  } = {}): Promise<SharedReport | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-report/share', {
        body: {
          expirationDays: options.expirationDays || 7,
          includePackages: options.includePackages !== false
        }
      });

      if (error) throw error;

      toast({
        title: "Relatório compartilhado!",
        description: "Link público gerado com sucesso. Link copiado para área de transferência.",
      });

      // Copy to clipboard
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(data.publicUrl);
        } catch (err) {
          console.warn('Failed to copy to clipboard:', err);
        }
      }

      return {
        publicUrl: data.publicUrl,
        expiresAt: data.expiresAt
      };
    } catch (error) {
      console.error('Error sharing report:', error);
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar o relatório. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const downloadReportPDF = async (): Promise<void> => {
    setLoading(true);
    try {
      // For now, generate JSON data and show message
      const reportData = await generateReport({ format: 'json' });
      
      if (reportData) {
        // In a real implementation, you would generate a PDF from the data
        // For now, we'll just show the JSON data
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);

        toast({
          title: "Download iniciado",
          description: "Arquivo JSON baixado. Implementação de PDF em breve.",
        });
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar o relatório.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateReport,
    shareReport,
    downloadReportPDF
  };
};