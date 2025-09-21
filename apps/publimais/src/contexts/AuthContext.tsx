import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    // Get user's IP address and user agent for security logging
    const userAgent = navigator.userAgent;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName
        }
      }
    });

    // Log security event
    if (!error) {
      try {
        await supabase.rpc('log_auth_event', {
          p_event_type: 'SIGNUP_SUCCESS',
          p_details: { email, user_agent: userAgent },
          p_user_agent: userAgent
        });
      } catch (logError) {
        console.warn('Failed to log auth event:', logError);
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const userAgent = navigator.userAgent;
    
    // Check rate limiting with enhanced IP detection
    try {
      const { data: requestIp } = await supabase.rpc('get_request_ip');
      const { data: rateLimitOk } = await supabase.rpc('check_auth_rate_limit', {
        p_ip_address: requestIp || '127.0.0.1',
        p_email: email
      });

      if (!rateLimitOk) {
        return { error: { message: 'Too many login attempts. Please try again later.' } };
      }
    } catch (rateLimitError) {
      console.warn('Rate limit check failed:', rateLimitError);
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // Log authentication attempt
    try {
      await supabase.rpc('log_auth_event', {
        p_event_type: error ? 'SIGNIN_FAILED' : 'SIGNIN_SUCCESS',
        p_details: { 
          email, 
          user_agent: userAgent,
          error_message: error?.message 
        },
        p_user_agent: userAgent
      });
    } catch (logError) {
      console.warn('Failed to log auth event:', logError);
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};