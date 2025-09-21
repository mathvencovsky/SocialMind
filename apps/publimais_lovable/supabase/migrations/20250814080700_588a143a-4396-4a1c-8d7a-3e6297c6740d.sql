-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  niche TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create social media accounts table
CREATE TABLE public.social_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'twitter', 'facebook')),
  account_id TEXT NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT,
  profile_picture_url TEXT,
  access_token TEXT, -- Will be encrypted
  refresh_token TEXT, -- Will be encrypted
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_connected BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for social_accounts
CREATE POLICY "Users can view their own social accounts" 
ON public.social_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts" 
ON public.social_accounts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social accounts" 
ON public.social_accounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social accounts" 
ON public.social_accounts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create social media metrics table
CREATE TABLE public.social_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  social_account_id UUID NOT NULL REFERENCES public.social_accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  likes_avg INTEGER DEFAULT 0,
  comments_avg INTEGER DEFAULT 0,
  shares_avg INTEGER DEFAULT 0,
  views_avg INTEGER DEFAULT 0,
  reach_avg INTEGER DEFAULT 0,
  impressions_avg INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  website_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(social_account_id, date)
);

-- Enable RLS
ALTER TABLE public.social_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for social_metrics
CREATE POLICY "Users can view metrics for their social accounts" 
ON public.social_metrics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.social_accounts 
    WHERE social_accounts.id = social_metrics.social_account_id 
    AND social_accounts.user_id = auth.uid()
  )
);

-- Create posts table for top performing content
CREATE TABLE public.social_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  social_account_id UUID NOT NULL REFERENCES public.social_accounts(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  caption TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'carousel', 'story')),
  media_url TEXT,
  thumbnail_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(social_account_id, post_id)
);

-- Enable RLS
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for social_posts
CREATE POLICY "Users can view posts for their social accounts" 
ON public.social_posts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.social_accounts 
    WHERE social_accounts.id = social_posts.social_account_id 
    AND social_accounts.user_id = auth.uid()
  )
);

-- Create audience demographics table
CREATE TABLE public.audience_demographics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  social_account_id UUID NOT NULL REFERENCES public.social_accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  country_code TEXT,
  age_range TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(social_account_id, date, country_code, age_range, gender)
);

-- Enable RLS
ALTER TABLE public.audience_demographics ENABLE ROW LEVEL SECURITY;

-- Create policies for audience_demographics
CREATE POLICY "Users can view demographics for their social accounts" 
ON public.audience_demographics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.social_accounts 
    WHERE social_accounts.id = audience_demographics.social_account_id 
    AND social_accounts.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email));
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();