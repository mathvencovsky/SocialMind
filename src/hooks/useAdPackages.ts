import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  delivery_days: number;
  includes: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateAdPackageData {
  title: string;
  description: string;
  price: number;
  delivery_days: number;
  includes: string[];
}

export const useAdPackages = () => {
  const [packages, setPackages] = useState<AdPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPackages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ad_packages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const formattedPackages = (data || []).map(pkg => ({
        ...pkg,
        includes: Array.isArray(pkg.includes) ? pkg.includes.filter((item): item is string => typeof item === 'string') : []
      }));
      setPackages(formattedPackages);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pacotes publicitários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPackage = async (packageData: CreateAdPackageData) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('ad_packages')
        .insert({
          ...packageData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const formattedPackage = {
        ...data,
        includes: Array.isArray(data.includes) ? data.includes.filter((item): item is string => typeof item === 'string') : []
      };
      setPackages(prev => [formattedPackage, ...prev]);
      toast({
        title: "Sucesso",
        description: "Pacote publicitário criado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Error creating package:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o pacote publicitário.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updatePackage = async (id: string, updates: Partial<CreateAdPackageData & { is_active: boolean }>) => {
    try {
      const { data, error } = await supabase
        .from('ad_packages')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      const formattedPackage = {
        ...data,
        includes: Array.isArray(data.includes) ? data.includes.filter((item): item is string => typeof item === 'string') : []
      };
      setPackages(prev => prev.map(pkg => pkg.id === id ? formattedPackage : pkg));
      toast({
        title: "Sucesso",
        description: "Pacote publicitário atualizado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Error updating package:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o pacote publicitário.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ad_packages')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setPackages(prev => prev.filter(pkg => pkg.id !== id));
      toast({
        title: "Sucesso",
        description: "Pacote publicitário removido com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o pacote publicitário.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [user]);

  return {
    packages,
    loading,
    createPackage,
    updatePackage,
    deletePackage,
    refetch: fetchPackages
  };
};