-- Fix function search path security warnings

-- Update all functions to have explicit search_path settings for security

-- 1. Fix get_user_social_accounts_secure function
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
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- 2. Fix log_auth_event function
CREATE OR REPLACE FUNCTION public.log_auth_event(p_event_type text, p_details jsonb DEFAULT NULL::jsonb)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- 3. Fix validate_password_strength function
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS boolean 
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
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
$$;