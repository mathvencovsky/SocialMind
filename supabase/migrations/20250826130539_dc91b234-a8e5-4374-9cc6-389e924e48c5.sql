-- Fix search_path issues for security
CREATE OR REPLACE FUNCTION public.generate_report_url()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$$;