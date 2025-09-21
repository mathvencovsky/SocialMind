-- Create profiles table for SocialMind analytics
CREATE TABLE public.analytics_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on analytics_profiles
ALTER TABLE public.analytics_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics_profiles
CREATE POLICY "Users can view their own analytics profiles" 
ON public.analytics_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics profiles" 
ON public.analytics_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics profiles" 
ON public.analytics_profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics profiles" 
ON public.analytics_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create audiences table
CREATE TABLE public.analytics_audiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  profile_id UUID REFERENCES public.analytics_profiles(id) ON DELETE CASCADE,
  age18_24 INTEGER DEFAULT 0,
  age25_34 INTEGER DEFAULT 0,
  age35_44 INTEGER DEFAULT 0,
  age45plus INTEGER DEFAULT 0,
  male INTEGER DEFAULT 0,
  female INTEGER DEFAULT 0,
  locations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on analytics_audiences
ALTER TABLE public.analytics_audiences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics_audiences
CREATE POLICY "Users can manage their own audience data" 
ON public.analytics_audiences 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create campaigns table
CREATE TABLE public.analytics_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  profile_id UUID REFERENCES public.analytics_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'completed', 'draft')) DEFAULT 'draft',
  engagement_rate NUMERIC(5,2) DEFAULT 0,
  reach INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on analytics_campaigns
ALTER TABLE public.analytics_campaigns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics_campaigns
CREATE POLICY "Users can manage their own campaigns" 
ON public.analytics_campaigns 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_analytics_profiles_updated_at
BEFORE UPDATE ON public.analytics_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analytics_audiences_updated_at
BEFORE UPDATE ON public.analytics_audiences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analytics_campaigns_updated_at
BEFORE UPDATE ON public.analytics_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();