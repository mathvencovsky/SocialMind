-- Fix search_path issues in existing functions
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
SET search_path = ''
AS $function$
BEGIN
    RETURN length(password) >= 8 
           AND password ~ '[A-Z]'   -- Contains uppercase
           AND password ~ '[a-z]'   -- Contains lowercase
           AND password ~ '[0-9]'   -- Contains number
           AND password ~ '[\W]';   -- Contains special character
END;
$function$;