-- Fix all function search paths to comply with security requirements

-- Update encrypt_token function
CREATE OR REPLACE FUNCTION public.encrypt_token(token_value text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key text;
BEGIN
  -- Use a consistent encryption key derived from the database
  encryption_key := encode(digest('social_media_token_key_v1' || current_setting('app.settings.jwt_secret', true), 'sha256'), 'hex');
  
  IF token_value IS NULL OR token_value = '' THEN
    RETURN NULL;
  END IF;
  
  RETURN encode(encrypt(token_value::bytea, encryption_key::bytea, 'aes'), 'base64');
END;
$$;

-- Update decrypt_token function
CREATE OR REPLACE FUNCTION public.decrypt_token(encrypted_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key text;
BEGIN
  -- Use the same encryption key
  encryption_key := encode(digest('social_media_token_key_v1' || current_setting('app.settings.jwt_secret', true), 'sha256'), 'hex');
  
  IF encrypted_token IS NULL OR encrypted_token = '' THEN
    RETURN NULL;
  END IF;
  
  RETURN convert_from(decrypt(decode(encrypted_token, 'base64'), encryption_key::bytea, 'aes'), 'UTF8');
EXCEPTION
  WHEN OTHERS THEN
    -- Return NULL if decryption fails
    RETURN NULL;
END;
$$;

-- Update encrypt_social_tokens function
CREATE OR REPLACE FUNCTION public.encrypt_social_tokens()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Encrypt access_token if provided and not already encrypted
  IF NEW.access_token IS NOT NULL AND NEW.access_token != '' THEN
    -- Check if it's already encrypted (base64 encoded)
    IF NEW.access_token !~ '^[A-Za-z0-9+/]*={0,2}$' OR length(NEW.access_token) < 20 THEN
      NEW.access_token := public.encrypt_token(NEW.access_token);
    END IF;
  END IF;
  
  -- Encrypt refresh_token if provided and not already encrypted
  IF NEW.refresh_token IS NOT NULL AND NEW.refresh_token != '' THEN
    -- Check if it's already encrypted (base64 encoded)
    IF NEW.refresh_token !~ '^[A-Za-z0-9+/]*={0,2}$' OR length(NEW.refresh_token) < 20 THEN
      NEW.refresh_token := public.encrypt_token(NEW.refresh_token);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update get_social_account_tokens function
CREATE OR REPLACE FUNCTION public.get_social_account_tokens(account_id uuid)
RETURNS TABLE(
  access_token text,
  refresh_token text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return tokens for accounts owned by the current user
  IF NOT EXISTS (
    SELECT 1 FROM public.social_accounts 
    WHERE id = account_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: You can only access your own social account tokens';
  END IF;
  
  RETURN QUERY
  SELECT 
    public.decrypt_token(sa.access_token) as access_token,
    public.decrypt_token(sa.refresh_token) as refresh_token
  FROM public.social_accounts sa
  WHERE sa.id = account_id AND sa.user_id = auth.uid();
END;
$$;

-- Update log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action text,
  p_table_name text DEFAULT NULL,
  p_record_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    details
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name,
    p_record_id,
    p_details
  );
END;
$$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;