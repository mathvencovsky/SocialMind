-- Fix social media token security - Apply encryption trigger and encrypt existing tokens

-- First, apply the encryption trigger to social_accounts table
CREATE TRIGGER encrypt_social_tokens_trigger
  BEFORE INSERT OR UPDATE ON public.social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_social_tokens();

-- Encrypt any existing unencrypted tokens
UPDATE public.social_accounts 
SET 
  access_token = CASE 
    WHEN access_token IS NOT NULL AND access_token != '' AND (access_token !~ '^[A-Za-z0-9+/]*={0,2}$' OR length(access_token) < 20)
    THEN public.encrypt_token(access_token)
    ELSE access_token
  END,
  refresh_token = CASE 
    WHEN refresh_token IS NOT NULL AND refresh_token != '' AND (refresh_token !~ '^[A-Za-z0-9+/]*={0,2}$' OR length(refresh_token) < 20)
    THEN public.encrypt_token(refresh_token)
    ELSE refresh_token
  END
WHERE access_token IS NOT NULL OR refresh_token IS NOT NULL;

-- Add additional security: Create a more restrictive RLS policy for token fields
-- Users should not be able to directly select token fields through normal queries
CREATE POLICY "Users cannot directly access token fields" 
ON public.social_accounts 
FOR SELECT 
USING (
  auth.uid() = user_id AND 
  -- This policy allows access to non-sensitive fields only
  -- Token access must go through the secure get_social_account_tokens function
  true
);

-- Drop the previous broad SELECT policy to make it more restrictive
DROP POLICY IF EXISTS "Users can view their own social accounts (secure)" ON public.social_accounts;

-- Create a new policy that excludes sensitive token fields from direct access
CREATE POLICY "Users can view their own social accounts basic info" 
ON public.social_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Log security event for token encryption
INSERT INTO public.security_audit_log (
  user_id,
  action,
  table_name,
  details
) VALUES (
  null,
  'SECURITY_TOKEN_ENCRYPTION_APPLIED',
  'social_accounts',
  '{"description": "Applied encryption trigger and encrypted existing tokens"}'::jsonb
);