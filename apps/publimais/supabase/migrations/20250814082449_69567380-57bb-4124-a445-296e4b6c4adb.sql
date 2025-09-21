-- Fix critical security issues (corrected)

-- 1. Secure the audit log access - remove overly permissive INSERT policy
DROP POLICY IF EXISTS "Only system can insert audit logs" ON public.security_audit_log;

-- Create a more restrictive audit log policy
CREATE POLICY "System only audit log access" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (
  -- Only allow inserts from service role or authenticated users via functions
  current_setting('role') = 'service_role' OR 
  (auth.uid() IS NOT NULL AND current_user = 'authenticator')
);

-- 2. Add function to get secure social accounts (excludes tokens)
CREATE OR REPLACE FUNCTION public.get_user_social_accounts_secure()
RETURNS TABLE (
  id uuid,
  platform text,
  account_id text,
  username text,
  display_name text,
  profile_picture_url text,
  is_connected boolean,
  last_sync_at timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.id,
    sa.platform,
    sa.account_id,
    sa.username,
    sa.display_name,
    sa.profile_picture_url,
    sa.is_connected,
    sa.last_sync_at,
    sa.created_at,
    sa.updated_at
  FROM public.social_accounts sa
  WHERE sa.user_id = auth.uid()
  AND sa.is_connected = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Add enhanced security audit function for authentication events
CREATE OR REPLACE FUNCTION public.log_auth_event(p_event_type text, p_details jsonb DEFAULT NULL::jsonb)
RETURNS void AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    details
  ) VALUES (
    auth.uid(),
    'AUTH_' || p_event_type,
    'auth',
    p_details
  );
EXCEPTION WHEN OTHERS THEN
  -- Log errors but don't break auth flow
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function to validate password strength
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS boolean AS $$
BEGIN
  -- Check minimum length, uppercase, lowercase, number, special char
  RETURN (
    LENGTH(password) >= 8 AND
    password ~ '[A-Z]' AND
    password ~ '[a-z]' AND
    password ~ '[0-9]' AND
    password ~ '[^A-Za-z0-9]'
  );
END;
$$ LANGUAGE plpgsql;