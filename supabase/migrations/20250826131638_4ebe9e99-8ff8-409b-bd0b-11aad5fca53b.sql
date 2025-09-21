-- Fix remaining function search path security issues

-- Fix log_shared_report_access function
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

-- Fix validate_password function that may have mutable search path
CREATE OR REPLACE FUNCTION public.validate_password(password text, username text DEFAULT NULL::text, previous_passwords text[] DEFAULT NULL::text[])
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    min_length int := 12;
    max_length int := 128;
    complexity_regex text;
BEGIN
    -- Check if password is NULL or empty
    IF password IS NULL OR trim(password) = '' THEN
        RETURN false;
    END IF;
    
    -- Check password length
    IF length(password) < min_length OR length(password) > max_length THEN
        RETURN false;
    END IF;
    
    -- Complex password requirements:
    -- Must contain at least:
    -- 1 uppercase letter
    -- 1 lowercase letter
    -- 1 number
    -- 1 special character
    complexity_regex := '^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:''",.<>?/\\|`~]).*$';
    
    IF password !~ complexity_regex THEN
        RETURN false;
    END IF;
    
    -- Check if password contains username (if provided)
    IF username IS NOT NULL THEN
        -- Case-insensitive check to prevent username-based passwords
        IF lower(password) LIKE '%' || lower(username) || '%' THEN
            RETURN false;
        END IF;
    END IF;
    
    -- Check against previous passwords (if provided)
    IF previous_passwords IS NOT NULL AND array_length(previous_passwords, 1) > 0 THEN
        -- Simple hash comparison to prevent recent password reuse
        IF password = ANY(previous_passwords) THEN
            RETURN false;
        END IF;
    END IF;
    
    -- Check for common weak passwords
    IF password IN (
        'password', 
        '123456', 
        'qwerty', 
        'admin', 
        'welcome'
    ) THEN
        RETURN false;
    END IF;
    
    -- Additional checks can be added here (e.g., dictionary word checks)
    
    RETURN true;
END;
$function$;