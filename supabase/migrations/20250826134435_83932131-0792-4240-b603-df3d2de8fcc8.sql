-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create social_accounts table with encrypted tokens
CREATE TABLE public.social_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('instagram', 'facebook', 'youtube', 'tiktok', 'twitter')),
    account_ref TEXT NOT NULL, -- platform's account ID or username
    username TEXT,
    display_name TEXT,
    profile_picture_url TEXT,
    access_token_enc TEXT, -- encrypted access token
    refresh_token_enc TEXT, -- encrypted refresh token
    expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, provider, account_ref)
);

-- Enable RLS on social_accounts
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_accounts
CREATE POLICY "Users can view their own social accounts" 
ON public.social_accounts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social accounts" 
ON public.social_accounts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts" 
ON public.social_accounts FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social accounts" 
ON public.social_accounts FOR DELETE 
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_social_accounts_updated_at
    BEFORE UPDATE ON public.social_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RPC to set encryption key (server-side only)
CREATE OR REPLACE FUNCTION public.select_set_config(setting_name TEXT, new_value TEXT, is_local BOOLEAN DEFAULT false)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM set_config(setting_name, new_value, is_local);
    RETURN new_value;
END;
$$;

-- RPC to encrypt tokens server-side
CREATE OR REPLACE FUNCTION public.encrypt_token_secure(token_value TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    encryption_key TEXT;
BEGIN
    -- Get encryption key from config
    encryption_key := current_setting('app.token_enc_key', true);
    
    IF encryption_key IS NULL OR encryption_key = '' THEN
        RAISE EXCEPTION 'Encryption key not configured';
    END IF;
    
    IF token_value IS NULL OR token_value = '' THEN
        RETURN NULL;
    END IF;
    
    RETURN encode(encrypt(token_value::bytea, encryption_key::bytea, 'aes'), 'base64');
END;
$$;

-- RPC to decrypt tokens server-side
CREATE OR REPLACE FUNCTION public.decrypt_token_secure(encrypted_token TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    encryption_key TEXT;
BEGIN
    -- Get encryption key from config
    encryption_key := current_setting('app.token_enc_key', true);
    
    IF encryption_key IS NULL OR encryption_key = '' THEN
        RAISE EXCEPTION 'Encryption key not configured';
    END IF;
    
    IF encrypted_token IS NULL OR encrypted_token = '' THEN
        RETURN NULL;
    END IF;
    
    RETURN convert_from(decrypt(decode(encrypted_token, 'base64'), encryption_key::bytea, 'aes'), 'UTF8');
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$;

-- RPC to safely upsert social account with encrypted tokens
CREATE OR REPLACE FUNCTION public.upsert_social_account_secure(
    p_provider TEXT,
    p_account_ref TEXT,
    p_username TEXT,
    p_display_name TEXT,
    p_profile_picture_url TEXT,
    p_access_token TEXT,
    p_refresh_token TEXT,
    p_expires_at TIMESTAMP WITH TIME ZONE,
    p_scope TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    account_id UUID;
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated';
    END IF;
    
    -- Upsert social account with encrypted tokens
    INSERT INTO public.social_accounts (
        user_id,
        provider,
        account_ref,
        username,
        display_name,
        profile_picture_url,
        access_token_enc,
        refresh_token_enc,
        expires_at,
        scope,
        last_sync_at
    ) VALUES (
        current_user_id,
        p_provider,
        p_account_ref,
        p_username,
        p_display_name,
        p_profile_picture_url,
        public.encrypt_token_secure(p_access_token),
        public.encrypt_token_secure(p_refresh_token),
        p_expires_at,
        p_scope,
        now()
    )
    ON CONFLICT (user_id, provider, account_ref)
    DO UPDATE SET
        username = EXCLUDED.username,
        display_name = EXCLUDED.display_name,
        profile_picture_url = EXCLUDED.profile_picture_url,
        access_token_enc = EXCLUDED.access_token_enc,
        refresh_token_enc = EXCLUDED.refresh_token_enc,
        expires_at = EXCLUDED.expires_at,
        scope = EXCLUDED.scope,
        is_active = true,
        last_sync_at = now(),
        updated_at = now()
    RETURNING id INTO account_id;
    
    RETURN account_id;
END;
$$;

-- RPC to get decrypted token (server-side only)
CREATE OR REPLACE FUNCTION public.get_decrypted_token(
    p_provider TEXT,
    p_account_ref TEXT,
    p_token_type TEXT DEFAULT 'access'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    encrypted_token TEXT;
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated';
    END IF;
    
    -- Get encrypted token
    IF p_token_type = 'access' THEN
        SELECT access_token_enc INTO encrypted_token
        FROM public.social_accounts
        WHERE user_id = current_user_id 
        AND provider = p_provider 
        AND account_ref = p_account_ref
        AND is_active = true;
    ELSIF p_token_type = 'refresh' THEN
        SELECT refresh_token_enc INTO encrypted_token
        FROM public.social_accounts
        WHERE user_id = current_user_id 
        AND provider = p_provider 
        AND account_ref = p_account_ref
        AND is_active = true;
    ELSE
        RAISE EXCEPTION 'Invalid token type. Use "access" or "refresh"';
    END IF;
    
    IF encrypted_token IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Decrypt and return token
    RETURN public.decrypt_token_secure(encrypted_token);
END;
$$;

-- Create metrics table for caching social media metrics
CREATE TABLE public.social_metrics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    social_account_id UUID NOT NULL REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    engagement_rate NUMERIC(5,2) DEFAULT 0,
    reach_avg INTEGER DEFAULT 0,
    impressions_avg INTEGER DEFAULT 0,
    likes_avg INTEGER DEFAULT 0,
    comments_avg INTEGER DEFAULT 0,
    shares_avg INTEGER DEFAULT 0,
    views_avg INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    website_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(social_account_id, metric_date)
);

-- Enable RLS on social_metrics
ALTER TABLE public.social_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_metrics
CREATE POLICY "Users can view metrics for their social accounts" 
ON public.social_metrics FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.social_accounts 
    WHERE id = social_metrics.social_account_id 
    AND user_id = auth.uid()
));

CREATE POLICY "Users can insert metrics for their social accounts" 
ON public.social_metrics FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.social_accounts 
    WHERE id = social_metrics.social_account_id 
    AND user_id = auth.uid()
));

CREATE POLICY "Users can update metrics for their social accounts" 
ON public.social_metrics FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM public.social_accounts 
    WHERE id = social_metrics.social_account_id 
    AND user_id = auth.uid()
));

-- Function to update or insert metrics
CREATE OR REPLACE FUNCTION public.upsert_social_metrics(
    p_social_account_id UUID,
    p_metric_date DATE,
    p_followers_count INTEGER DEFAULT NULL,
    p_following_count INTEGER DEFAULT NULL,
    p_posts_count INTEGER DEFAULT NULL,
    p_engagement_rate NUMERIC DEFAULT NULL,
    p_reach_avg INTEGER DEFAULT NULL,
    p_impressions_avg INTEGER DEFAULT NULL,
    p_likes_avg INTEGER DEFAULT NULL,
    p_comments_avg INTEGER DEFAULT NULL,
    p_shares_avg INTEGER DEFAULT NULL,
    p_views_avg INTEGER DEFAULT NULL,
    p_profile_views INTEGER DEFAULT NULL,
    p_website_clicks INTEGER DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    metric_id UUID;
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated';
    END IF;
    
    -- Verify user owns the social account
    IF NOT EXISTS (
        SELECT 1 FROM public.social_accounts 
        WHERE id = p_social_account_id 
        AND user_id = current_user_id
    ) THEN
        RAISE EXCEPTION 'Access denied to social account';
    END IF;
    
    -- Upsert metrics
    INSERT INTO public.social_metrics (
        social_account_id,
        metric_date,
        followers_count,
        following_count,
        posts_count,
        engagement_rate,
        reach_avg,
        impressions_avg,
        likes_avg,
        comments_avg,
        shares_avg,
        views_avg,
        profile_views,
        website_clicks
    ) VALUES (
        p_social_account_id,
        p_metric_date,
        COALESCE(p_followers_count, 0),
        COALESCE(p_following_count, 0),
        COALESCE(p_posts_count, 0),
        COALESCE(p_engagement_rate, 0),
        COALESCE(p_reach_avg, 0),
        COALESCE(p_impressions_avg, 0),
        COALESCE(p_likes_avg, 0),
        COALESCE(p_comments_avg, 0),
        COALESCE(p_shares_avg, 0),
        COALESCE(p_views_avg, 0),
        COALESCE(p_profile_views, 0),
        COALESCE(p_website_clicks, 0)
    )
    ON CONFLICT (social_account_id, metric_date)
    DO UPDATE SET
        followers_count = COALESCE(EXCLUDED.followers_count, social_metrics.followers_count),
        following_count = COALESCE(EXCLUDED.following_count, social_metrics.following_count),
        posts_count = COALESCE(EXCLUDED.posts_count, social_metrics.posts_count),
        engagement_rate = COALESCE(EXCLUDED.engagement_rate, social_metrics.engagement_rate),
        reach_avg = COALESCE(EXCLUDED.reach_avg, social_metrics.reach_avg),
        impressions_avg = COALESCE(EXCLUDED.impressions_avg, social_metrics.impressions_avg),
        likes_avg = COALESCE(EXCLUDED.likes_avg, social_metrics.likes_avg),
        comments_avg = COALESCE(EXCLUDED.comments_avg, social_metrics.comments_avg),
        shares_avg = COALESCE(EXCLUDED.shares_avg, social_metrics.shares_avg),
        views_avg = COALESCE(EXCLUDED.views_avg, social_metrics.views_avg),
        profile_views = COALESCE(EXCLUDED.profile_views, social_metrics.profile_views),
        website_clicks = COALESCE(EXCLUDED.website_clicks, social_metrics.website_clicks),
        created_at = now()
    RETURNING id INTO metric_id;
    
    RETURN metric_id;
END;
$$;