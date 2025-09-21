import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Create Supabase client with service role for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, platform, userId, authCode, redirectUri } = await req.json();

    switch (action) {
      case 'initiate_oauth':
        return await initiateOAuth(platform, userId);
      
      case 'exchange_token':
        return await exchangeToken(platform, authCode, redirectUri, userId);
      
      case 'refresh_token':
        return await refreshToken(platform, userId);
      
      case 'revoke_token':
        return await revokeToken(platform, userId);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in secure-social-auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function initiateOAuth(platform: string, userId: string) {
  // Log security event
  await supabase.rpc('log_security_event', {
    p_action: 'oauth_initiate',
    p_table_name: 'social_accounts',
    p_details: { platform, user_id: userId }
  });

  // Generate OAuth URLs based on platform
  let authUrl = '';
  let clientId = '';

  switch (platform) {
    case 'instagram':
      clientId = Deno.env.get('INSTAGRAM_CLIENT_ID') || 'demo_client_id';
      authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent('https://your-app.lovable.app/oauth/callback')}&scope=user_profile,user_media&response_type=code`;
      break;
    
    case 'tiktok':
      clientId = Deno.env.get('TIKTOK_CLIENT_ID') || 'demo_client_id';
      authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${clientId}&response_type=code&scope=user.info.basic,video.list&redirect_uri=${encodeURIComponent('https://your-app.lovable.app/oauth/callback')}`;
      break;
    
    case 'youtube':
      clientId = Deno.env.get('GOOGLE_CLIENT_ID') || 'demo_client_id';
      authUrl = `https://accounts.google.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent('https://your-app.lovable.app/oauth/callback')}&scope=https://www.googleapis.com/auth/youtube.readonly&response_type=code&access_type=offline`;
      break;
    
    case 'twitter':
      clientId = Deno.env.get('TWITTER_CLIENT_ID') || 'demo_client_id';
      authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent('https://your-app.lovable.app/oauth/callback')}&scope=tweet.read%20users.read%20follows.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
      break;
    
    case 'facebook':
      clientId = Deno.env.get('FACEBOOK_CLIENT_ID') || 'demo_client_id';
      authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent('https://your-app.lovable.app/oauth/callback')}&scope=pages_read_engagement,pages_read_user_content,instagram_basic&response_type=code`;
      break;
    
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  return new Response(
    JSON.stringify({ authUrl, platform }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function exchangeToken(platform: string, authCode: string, redirectUri: string, userId: string) {
  // This is a placeholder for actual OAuth token exchange
  // In production, you would exchange the authorization code for access tokens
  console.log(`Exchanging token for ${platform}`, { authCode, redirectUri, userId });

  // Simulate token exchange (replace with actual API calls)
  const mockTokenData = {
    access_token: `mock_access_token_${platform}_${Date.now()}`,
    refresh_token: `mock_refresh_token_${platform}_${Date.now()}`,
    expires_in: 3600,
    account_id: `${platform}_user_${Math.random().toString(36).substr(2, 9)}`,
    username: `demo_user_${platform}`,
    display_name: `Demo User ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
    profile_picture_url: `https://via.placeholder.com/150?text=${platform.toUpperCase()}`
  };

  // Insert or update social account with encrypted tokens
  const { error } = await supabase
    .from('social_accounts')
    .upsert({
      user_id: userId,
      platform,
      account_id: mockTokenData.account_id,
      username: mockTokenData.username,
      display_name: mockTokenData.display_name,
      profile_picture_url: mockTokenData.profile_picture_url,
      access_token: mockTokenData.access_token, // Will be automatically encrypted by trigger
      refresh_token: mockTokenData.refresh_token, // Will be automatically encrypted by trigger
      token_expires_at: new Date(Date.now() + mockTokenData.expires_in * 1000).toISOString(),
      is_connected: true,
      last_sync_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,platform'
    });

  if (error) {
    console.error('Error saving social account:', error);
    throw new Error('Failed to save social account');
  }

  // Log security event
  await supabase.rpc('log_security_event', {
    p_action: 'oauth_token_exchange',
    p_table_name: 'social_accounts',
    p_details: { platform, user_id: userId, account_id: mockTokenData.account_id }
  });

  return new Response(
    JSON.stringify({ success: true, platform, account_id: mockTokenData.account_id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function refreshToken(platform: string, userId: string) {
  // Get the account
  const { data: account, error: fetchError } = await supabase
    .from('social_accounts')
    .select('id')
    .eq('user_id', userId)
    .eq('platform', platform)
    .single();

  if (fetchError || !account) {
    throw new Error('Social account not found');
  }

  // Get decrypted tokens using secure function
  const { data: tokens, error: tokenError } = await supabase
    .rpc('get_social_account_tokens', { account_id: account.id });

  if (tokenError || !tokens || tokens.length === 0) {
    throw new Error('Failed to retrieve tokens');
  }

  const { refresh_token } = tokens[0];

  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  // Simulate token refresh (replace with actual API calls)
  const newAccessToken = `refreshed_access_token_${platform}_${Date.now()}`;
  const expiresIn = 3600;

  // Update with new access token
  const { error: updateError } = await supabase
    .from('social_accounts')
    .update({
      access_token: newAccessToken, // Will be automatically encrypted by trigger
      token_expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
      last_sync_at: new Date().toISOString()
    })
    .eq('id', account.id);

  if (updateError) {
    throw new Error('Failed to update access token');
  }

  // Log security event
  await supabase.rpc('log_security_event', {
    p_action: 'oauth_token_refresh',
    p_table_name: 'social_accounts',
    p_details: { platform, user_id: userId, account_id: account.id }
  });

  return new Response(
    JSON.stringify({ success: true, platform }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function revokeToken(platform: string, userId: string) {
  // Mark account as disconnected and clear tokens
  const { error } = await supabase
    .from('social_accounts')
    .update({
      is_connected: false,
      access_token: null,
      refresh_token: null,
      token_expires_at: null
    })
    .eq('user_id', userId)
    .eq('platform', platform);

  if (error) {
    throw new Error('Failed to revoke tokens');
  }

  // Log security event
  await supabase.rpc('log_security_event', {
    p_action: 'oauth_token_revoke',
    p_table_name: 'social_accounts',
    p_details: { platform, user_id: userId }
  });

  return new Response(
    JSON.stringify({ success: true, platform }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}