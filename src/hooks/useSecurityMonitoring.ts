import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSecurityMonitoring = () => {
  const { user, session } = useAuth();

  // Track session activity
  const trackSession = useCallback(async () => {
    if (!session || !user) return;

    try {
      await supabase.rpc('manage_user_session', {
        p_session_id: session.access_token.substring(0, 32), // Use first 32 chars as session ID
        p_user_agent: navigator.userAgent
      });
    } catch (error) {
      console.warn('Failed to track session:', error);
    }
  }, [session, user]);

  // Monitor for security events with enhanced detection
  const logSecurityEvent = useCallback(async (action: string, details?: any) => {
    if (!user) return;

    try {
      // Check for suspicious activity
      const { data: suspicious } = await supabase.rpc('detect_suspicious_activity', {
        p_user_id: user.id
      });

      await supabase.rpc('log_security_event', {
        p_action: action,
        p_details: { ...details, suspicious_activity: suspicious },
        p_user_agent: navigator.userAgent
      });

      if (suspicious) {
        console.warn('Suspicious activity detected for user:', user.id);
      }
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  }, [user]);

  // Track page visibility changes for session monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial session tracking
    trackSession();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackSession]);

  // Track session periodically (every 5 minutes)
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      trackSession();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [session, trackSession]);

  return {
    logSecurityEvent,
    trackSession
  };
};