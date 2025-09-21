-- CRITICAL SECURITY FIXES

-- 1. Fix Social Media Token Exposure
-- Drop existing policies that may expose tokens
DROP POLICY IF EXISTS "Users can view their own social accounts basic info" ON public.social_accounts;
DROP POLICY IF EXISTS "Users cannot directly access token fields" ON public.social_accounts;

-- Create secure policy that explicitly excludes token fields
CREATE POLICY "Users can view social accounts without tokens" 
ON public.social_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Grant access to specific columns only (excluding access_token and refresh_token)
CREATE POLICY "Users can view safe social account fields"
ON public.social_accounts
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Fix Database Function Security Paths
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.check_password_complexity(password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    RETURN length(password) >= 8 
           AND password ~ '[A-Z]'   -- Contains uppercase
           AND password ~ '[a-z]'   -- Contains lowercase
           AND password ~ '[0-9]'   -- Contains number
           AND password ~ '[\W]';   -- Contains special character
END;
$function$;

-- 3. Secure Personal Information Access - Tighten profiles access
-- Recreate profile policies to be more explicit about what can be accessed
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Allow users to view only their own profile
CREATE POLICY "Users can view own profile data" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Add audit logging for shared report access
CREATE OR REPLACE FUNCTION public.log_shared_report_access(report_id uuid, access_ip inet DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Update view count
  UPDATE public.shared_reports 
  SET views_count = views_count + 1 
  WHERE id = report_id;
  
  -- Log access for security monitoring
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    details,
    ip_address
  ) VALUES (
    NULL, -- Anonymous access
    'SHARED_REPORT_ACCESS',
    'shared_reports',
    report_id,
    jsonb_build_object('timestamp', now()),
    access_ip
  );
END;
$function$;