-- Fix social media token security - Encrypt existing unencrypted tokens and improve RLS

-- Encrypt any existing unencrypted tokens (if any exist)
UPDATE public.social_accounts 
SET 
  access_token = CASE 
    WHEN access_token IS NOT NULL AND access_token != '' AND NOT (access_token ~ '^[A-Za-z0-9+/]*={0,2}$' AND length(access_token) >= 20)
    THEN public.encrypt_token(access_token)
    ELSE access_token
  END,
  refresh_token = CASE 
    WHEN refresh_token IS NOT NULL AND refresh_token != '' AND NOT (refresh_token ~ '^[A-Za-z0-9+/]*={0,2}$' AND length(refresh_token) >= 20)
    THEN public.encrypt_token(refresh_token)
    ELSE refresh_token
  END
WHERE 
  (access_token IS NOT NULL AND access_token != '' AND NOT (access_token ~ '^[A-Za-z0-9+/]*={0,2}$' AND length(access_token) >= 20))
  OR 
  (refresh_token IS NOT NULL AND refresh_token != '' AND NOT (refresh_token ~ '^[A-Za-z0-9+/]*={0,2}$' AND length(refresh_token) >= 20));

-- Create view for secure social account access (excludes token fields)
CREATE OR REPLACE VIEW public.social_accounts_secure AS
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

-- Enable RLS on the view
ALTER VIEW public.social_accounts_secure SET (security_barrier = true);

-- Grant appropriate permissions on the view
GRANT SELECT ON public.social_accounts_secure TO authenticated;

-- Create policy for the secure view
CREATE POLICY "Users can view their own social accounts via secure view" 
ON public.social_accounts_secure
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Log security event for token encryption enhancement
INSERT INTO public.security_audit_log (
  user_id,
  action,
  table_name,
  details
) VALUES (
  null,
  'SECURITY_TOKEN_ENCRYPTION_ENHANCED',
  'social_accounts',
  '{"description": "Enhanced token encryption and created secure view for social accounts"}'::jsonb
);