-- Fix social media token security - Encrypt existing tokens and improve access control

-- Encrypt any existing unencrypted tokens
UPDATE public.social_accounts 
SET 
  access_token = CASE 
    WHEN access_token IS NOT NULL AND access_token != '' 
    THEN public.encrypt_token(access_token)
    ELSE access_token
  END,
  refresh_token = CASE 
    WHEN refresh_token IS NOT NULL AND refresh_token != '' 
    THEN public.encrypt_token(refresh_token)
    ELSE refresh_token
  END
WHERE access_token IS NOT NULL OR refresh_token IS NOT NULL;

-- Log security enhancement
INSERT INTO public.security_audit_log (
  user_id,
  action,
  table_name,
  details
) VALUES (
  null,
  'SECURITY_TOKEN_ENCRYPTION_APPLIED',
  'social_accounts',
  '{"description": "Applied token encryption to existing social accounts"}'::jsonb
);