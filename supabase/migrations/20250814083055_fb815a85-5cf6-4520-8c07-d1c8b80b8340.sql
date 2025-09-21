-- Complete Audit Log Security
-- Add SELECT policy for security_audit_log table with admin access control
CREATE POLICY "Admins can view security audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.user_id = security_audit_log.user_id
  )
);

-- Enhanced Security Event Logging
-- Update log_security_event function to capture IP and user agent
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action text, 
  p_table_name text DEFAULT NULL::text, 
  p_record_id uuid DEFAULT NULL::uuid, 
  p_details jsonb DEFAULT NULL::jsonb,
  p_ip_address inet DEFAULT NULL::inet,
  p_user_agent text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name,
    p_record_id,
    p_details,
    p_ip_address,
    p_user_agent
  );
END;
$function$;

-- Enhanced auth event logging with IP and user agent
CREATE OR REPLACE FUNCTION public.log_auth_event(
  p_event_type text, 
  p_details jsonb DEFAULT NULL::jsonb,
  p_ip_address inet DEFAULT NULL::inet,
  p_user_agent text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    details,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    'AUTH_' || p_event_type,
    'auth',
    p_details,
    p_ip_address,
    p_user_agent
  );
EXCEPTION WHEN OTHERS THEN
  -- Log errors but don't break auth flow
  NULL;
END;
$function$;

-- Session Security: Add function to track active sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_activity timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS on user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to manage user sessions
CREATE OR REPLACE FUNCTION public.manage_user_session(
  p_session_id text,
  p_ip_address inet DEFAULT NULL::inet,
  p_user_agent text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert or update session
  INSERT INTO public.user_sessions (user_id, session_id, ip_address, user_agent)
  VALUES (auth.uid(), p_session_id, p_ip_address, p_user_agent)
  ON CONFLICT (session_id) 
  DO UPDATE SET 
    last_activity = now(),
    is_active = true;
    
  -- Cleanup old inactive sessions (older than 7 days)
  DELETE FROM public.user_sessions 
  WHERE user_id = auth.uid() 
  AND last_activity < now() - interval '7 days';
END;
$function$;

-- Rate limiting table for authentication attempts
CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address inet NOT NULL,
  email text,
  attempt_count integer NOT NULL DEFAULT 1,
  first_attempt timestamp with time zone NOT NULL DEFAULT now(),
  last_attempt timestamp with time zone NOT NULL DEFAULT now(),
  blocked_until timestamp with time zone
);

-- Enable RLS on auth_rate_limits (system table)
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(
  p_ip_address inet,
  p_email text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_attempts integer := 0;
  is_blocked boolean := false;
BEGIN
  -- Check if IP is currently blocked
  SELECT COUNT(*) INTO current_attempts
  FROM public.auth_rate_limits
  WHERE ip_address = p_ip_address
  AND blocked_until > now();
  
  IF current_attempts > 0 THEN
    RETURN false;
  END IF;
  
  -- Clean up old attempts (older than 1 hour)
  DELETE FROM public.auth_rate_limits
  WHERE ip_address = p_ip_address
  AND first_attempt < now() - interval '1 hour';
  
  -- Get current attempt count
  SELECT attempt_count INTO current_attempts
  FROM public.auth_rate_limits
  WHERE ip_address = p_ip_address
  AND first_attempt > now() - interval '1 hour';
  
  IF current_attempts IS NULL THEN
    current_attempts := 0;
  END IF;
  
  -- Insert or update rate limit record
  INSERT INTO public.auth_rate_limits (ip_address, email, attempt_count)
  VALUES (p_ip_address, p_email, 1)
  ON CONFLICT (ip_address) 
  DO UPDATE SET 
    attempt_count = auth_rate_limits.attempt_count + 1,
    last_attempt = now(),
    email = COALESCE(p_email, auth_rate_limits.email),
    blocked_until = CASE 
      WHEN auth_rate_limits.attempt_count + 1 >= 5 THEN now() + interval '15 minutes'
      ELSE NULL
    END;
  
  -- Return false if too many attempts
  RETURN (current_attempts + 1) < 5;
END;
$function$;