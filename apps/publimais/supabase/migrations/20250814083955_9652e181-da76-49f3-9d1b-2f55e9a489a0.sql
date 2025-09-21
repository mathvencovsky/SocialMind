-- Fix search path security warning
CREATE OR REPLACE FUNCTION public.get_social_account_secure(p_account_id uuid)
RETURNS TABLE(
  id uuid,
  platform text,
  account_id text,
  username text,
  display_name text,
  profile_picture_url text,
  is_connected boolean,
  last_sync_at timestamp with time zone
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
  -- Only return non-sensitive data for user's own accounts
  IF NOT EXISTS (
    SELECT 1 FROM public.social_accounts 
    WHERE social_accounts.id = p_account_id 
    AND social_accounts.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: You can only access your own social accounts';
  END IF;
  
  RETURN QUERY
  SELECT 
    sa.id,
    sa.platform,
    sa.account_id,
    sa.username,
    sa.display_name,
    sa.profile_picture_url,
    sa.is_connected,
    sa.last_sync_at
  FROM public.social_accounts sa
  WHERE sa.id = p_account_id 
  AND sa.user_id = auth.uid();
END;
$$;