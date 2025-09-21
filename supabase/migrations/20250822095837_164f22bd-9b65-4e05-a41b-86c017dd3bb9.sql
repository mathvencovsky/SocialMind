-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create test_profiles table (separate from main social_accounts)
CREATE TABLE public.test_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT,
    profile_picture_url TEXT,
    bio TEXT,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    engagement_rate NUMERIC DEFAULT 0,
    access_token TEXT, -- Will be encrypted by trigger
    refresh_token TEXT, -- Will be encrypted by trigger
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.test_profiles ENABLE ROW LEVEL SECURITY;

-- Add trigger for encryption
CREATE TRIGGER encrypt_test_profile_tokens
BEFORE INSERT OR UPDATE ON public.test_profiles
FOR EACH ROW EXECUTE FUNCTION public.encrypt_social_tokens();

-- Add trigger for updated_at
CREATE TRIGGER update_test_profiles_updated_at
BEFORE UPDATE ON public.test_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies for test_profiles
CREATE POLICY "Only admins can manage test profiles"
ON public.test_profiles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create admin_logs table for debugging
CREATE TABLE public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    platform TEXT,
    endpoint TEXT,
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    status_code INTEGER,
    duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_logs
CREATE POLICY "Only admins can view admin logs"
ON public.admin_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can create admin logs"
ON public.admin_logs
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create test_metrics table for storing real-time metrics
CREATE TABLE public.test_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_profile_id UUID REFERENCES public.test_profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    engagement_rate NUMERIC DEFAULT 0,
    likes_avg INTEGER DEFAULT 0,
    comments_avg INTEGER DEFAULT 0,
    shares_avg INTEGER DEFAULT 0,
    views_avg INTEGER DEFAULT 0,
    reach_avg INTEGER DEFAULT 0,
    impressions_avg INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    website_clicks INTEGER DEFAULT 0,
    growth_7d JSONB, -- Store 7-day growth data
    top_post JSONB, -- Store most popular post data
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.test_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies for test_metrics
CREATE POLICY "Only admins can manage test metrics"
ON public.test_metrics
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update security_audit_log policy to use proper admin check
DROP POLICY IF EXISTS "System and admin only audit log access" ON public.security_audit_log;

CREATE POLICY "System and admin only audit log access"
ON public.security_audit_log
FOR SELECT
USING (
    (auth.role() = 'service_role'::text) OR 
    (public.has_role(auth.uid(), 'admin'))
);