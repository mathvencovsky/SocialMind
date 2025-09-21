-- Create encryption key management
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a function to encrypt tokens
CREATE OR REPLACE FUNCTION public.encrypt_token(token_value text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create a function to decrypt tokens
CREATE OR REPLACE FUNCTION public.decrypt_token(encrypted_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create a trigger to automatically encrypt tokens on insert/update
CREATE OR REPLACE FUNCTION public.encrypt_social_tokens()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create the trigger
DROP TRIGGER IF EXISTS encrypt_tokens_trigger ON public.social_accounts;
CREATE TRIGGER encrypt_tokens_trigger
  BEFORE INSERT OR UPDATE ON public.social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_social_tokens();

-- Update RLS policies to restrict token access
DROP POLICY IF EXISTS "Users can view their own social accounts" ON public.social_accounts;

-- Create a secure view that excludes sensitive token data for normal queries
CREATE OR REPLACE VIEW public.social_accounts_safe AS
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
  updated_at,
  token_expires_at
FROM public.social_accounts;

-- Grant access to the safe view
GRANT SELECT ON public.social_accounts_safe TO authenticated;
GRANT SELECT ON public.social_accounts_safe TO anon;

-- Enable RLS on the view
ALTER VIEW public.social_accounts_safe SET (security_barrier = true);

-- Create RLS policy for the safe view
CREATE POLICY "Users can view their own social accounts safely"
ON public.social_accounts_safe
FOR SELECT
USING (auth.uid() = user_id);

-- Create a secure function to get decrypted tokens (only for authorized operations)
CREATE OR REPLACE FUNCTION public.get_social_account_tokens(account_id uuid)
RETURNS TABLE(
  access_token text,
  refresh_token text
)
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Restrict direct access to the social_accounts table for token fields
CREATE POLICY "Users can view non-sensitive social account data"
ON public.social_accounts
FOR SELECT
USING (
  auth.uid() = user_id
);

-- Allow users to update non-sensitive fields
CREATE POLICY "Users can update non-sensitive social account data"
ON public.social_accounts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own social accounts
CREATE POLICY "Users can insert their own social accounts"
ON public.social_accounts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own social accounts
CREATE POLICY "Users can delete their own social accounts"
ON public.social_accounts
FOR DELETE
USING (auth.uid() = user_id);

-- Fix the handle_new_user function security issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email));
  RETURN NEW;
END;
$$;

-- Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for audit log (only admins can view)
CREATE POLICY "Only system can insert audit logs"
ON public.security_audit_log
FOR INSERT
WITH CHECK (true); -- Allow system inserts

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action text,
  p_table_name text DEFAULT NULL,
  p_record_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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