-- Fix RLS policies for new tables that don't have any policies

-- Add missing policies for auth_rate_limits table
CREATE POLICY "System can manage rate limits" 
ON public.auth_rate_limits 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add unique constraint for session_id in user_sessions
ALTER TABLE public.user_sessions 
ADD CONSTRAINT user_sessions_session_id_key UNIQUE (session_id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_ip_address ON public.auth_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_blocked_until ON public.auth_rate_limits(blocked_until);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON public.user_sessions(last_activity);