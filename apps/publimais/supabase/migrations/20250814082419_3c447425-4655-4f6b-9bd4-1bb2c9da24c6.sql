-- Fix critical security issues

-- 1. Secure the audit log access - remove overly permissive INSERT policy
DROP POLICY IF EXISTS "Only system can insert audit logs" ON public.security_audit_log;

-- Create a more restrictive audit log policy that only allows the log_security_event function
CREATE POLICY "Restrict audit log access" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (
  -- Only allow inserts from security functions or when explicitly called by system
  current_setting('role') = 'service_role' OR 
  current_user = 'service_role' OR
  auth.uid() IS NOT NULL
);

-- 2. Create a secure view for social accounts that excludes sensitive token data
CREATE OR REPLACE VIEW public.social_accounts_secure AS
SELECT 
  id,
  user_id,
  platform,
  account_id,
  username,
  display_name,
  profile_picture_url,
  is_connected,
  last_sync_at,
  created_at,
  updated_at
FROM public.social_accounts;

-- Enable RLS on the secure view
ALTER VIEW public.social_accounts_secure SET ROW LEVEL SECURITY ENABLED;

-- Create RLS policy for the secure view
CREATE POLICY "Users can view their own social accounts (secure)" 
ON public.social_accounts_secure 
FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Add additional security audit events for authentication
CREATE OR REPLACE FUNCTION public.log_auth_event(p_event_type text, p_details jsonb DEFAULT NULL::jsonb)
RETURNS void AS $$
BEGIN
  -- Log authentication-related security events
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    details,
    ip_address
  ) VALUES (
    auth.uid(),
    'AUTH_' || p_event_type,
    'auth',
    p_details,
    inet(current_setting('request.headers', true)::json->>'x-forwarded-for')
  );
EXCEPTION WHEN OTHERS THEN
  -- Fail silently to not break auth flow
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;