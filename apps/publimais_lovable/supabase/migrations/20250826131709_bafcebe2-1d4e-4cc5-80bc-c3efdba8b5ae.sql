-- Fix the remaining function that has mutable search path
-- Check all functions without explicit search path and fix them

CREATE OR REPLACE FUNCTION public.validate_password(email text, password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Combine multiple checks
    RETURN 
        public.check_password_complexity(password) AND
        NOT EXISTS (
            SELECT 1 
            FROM public.compromised_passwords 
            WHERE leaked_password = password
        );
END;
$function$;