import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const SecurityMonitoring = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const checkSuspiciousActivity = async () => {
      try {
        const { data: isSuspicious } = await supabase.rpc('detect_suspicious_activity', {
          p_user_id: user.id
        });

        if (isSuspicious) {
          toast({
            title: "Atividade Suspeita Detectada",
            description: "Detectamos atividade incomum em sua conta. Verifique suas sessões ativas.",
            variant: "destructive",
          });

          // Log the security alert
          await supabase.rpc('log_security_event', {
            p_action: 'SUSPICIOUS_ACTIVITY_DETECTED',
            p_details: { user_id: user.id, timestamp: new Date().toISOString() },
            p_user_agent: navigator.userAgent
          });
        }
      } catch (error) {
        console.warn('Failed to check suspicious activity:', error);
      }
    };

    // Check on mount and every 5 minutes
    checkSuspiciousActivity();
    const interval = setInterval(checkSuspiciousActivity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, toast]);

  return null;
};