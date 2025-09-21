-- Fix security warning: Update function search paths

-- Fix get_social_account_secure function
CREATE OR REPLACE FUNCTION public.get_social_account_secure(p_account_id uuid)
RETURNS TABLE(
  id uuid,
  platform text,
  account_id text,
  username text,
  display_name text,
  profile_picture_url text,
  is_connected boolean,
  last_sync_at timestamp with time zone
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  -- Only return non-sensitive data for user's own accounts
  IF NOT EXISTS (
    SELECT 1 FROM public.social_accounts 
    WHERE social_accounts.id = p_account_id 
    AND social_accounts.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: You can only access your own social accounts';
  END IF;
  
  RETURN QUERY
  SELECT 
    sa.id,
    sa.platform,
    sa.account_id,
    sa.username,
    sa.display_name,
    sa.profile_picture_url,
    sa.is_connected,
    sa.last_sync_at
  FROM public.social_accounts sa
  WHERE sa.id = p_account_id 
  AND sa.user_id = auth.uid();
END;
$$;

-- Fix get_request_ip function
CREATE OR REPLACE FUNCTION public.get_request_ip()
RETURNS inet
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- In production, this would extract real IP from headers
  RETURN inet '127.0.0.1';
END;
$$;

-- Fix detect_suspicious_activity function
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  failed_attempts integer;
  session_count integer;
BEGIN
  -- Check for multiple failed login attempts in last hour
  SELECT COUNT(*) INTO failed_attempts
  FROM public.security_audit_log
  WHERE user_id = p_user_id
  AND action = 'AUTH_SIGNIN_FAILED'
  AND created_at > now() - interval '1 hour';
  
  -- Check for multiple active sessions
  SELECT COUNT(*) INTO session_count
  FROM public.user_sessions
  WHERE user_id = p_user_id
  AND is_active = true;
  
  -- Flag as suspicious if many failed attempts or too many sessions
  RETURN (failed_attempts > 3 OR session_count > 5);
END;
$$;