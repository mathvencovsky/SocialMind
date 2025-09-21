-- Criar tabela para pacotes publicitários
CREATE TABLE public.ad_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  delivery_days integer NOT NULL DEFAULT 7 CHECK (delivery_days > 0),
  includes jsonb DEFAULT '[]',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_packages ENABLE ROW LEVEL SECURITY;

-- RLS policies for ad_packages
CREATE POLICY "Users can view their own packages" 
ON public.ad_packages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own packages" 
ON public.ad_packages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own packages" 
ON public.ad_packages 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own packages" 
ON public.ad_packages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_ad_packages_updated_at
BEFORE UPDATE ON public.ad_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela para relatórios compartilhados
CREATE TABLE public.shared_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_data jsonb NOT NULL,
  public_url text UNIQUE NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  views_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for shared_reports
CREATE POLICY "Users can view their own reports" 
ON public.shared_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports" 
ON public.shared_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view non-expired public reports"
ON public.shared_reports
FOR SELECT
USING (expires_at > now());

-- Atualizar tabela de profiles para incluir mais campos profissionais
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS instagram_handle text,
ADD COLUMN IF NOT EXISTS tiktok_handle text,
ADD COLUMN IF NOT EXISTS youtube_handle text,
ADD COLUMN IF NOT EXISTS twitter_handle text,
ADD COLUMN IF NOT EXISTS facebook_handle text,
ADD COLUMN IF NOT EXISTS rate_per_post numeric CHECK (rate_per_post >= 0),
ADD COLUMN IF NOT EXISTS rate_per_story numeric CHECK (rate_per_story >= 0),
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{"Português"}',
ADD COLUMN IF NOT EXISTS collaboration_types text[] DEFAULT '{}';

-- Create function to generate public report URL
CREATE OR REPLACE FUNCTION public.generate_report_url()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$$;