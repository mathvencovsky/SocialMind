import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Log helper function
async function logApiCall(
  adminUserId: string,
  action: string,
  platform?: string,
  endpoint?: string,
  requestData?: any,
  responseData?: any,
  errorMessage?: string,
  statusCode?: number,
  startTime?: number
) {
  const duration = startTime ? Date.now() - startTime : undefined;
  
  try {
    await supabase.from('admin_logs').insert({
      admin_user_id: adminUserId,
      action,
      platform,
      endpoint,
      request_data: requestData,
      response_data: responseData,
      error_message: errorMessage,
      status_code: statusCode,
      duration_ms: duration
    });
  } catch (error) {
    console.error('Failed to log API call:', error);
  }
}

// Mock API functions for demonstration
async function connectRealProfile(platform: string, userId: string) {
  const startTime = Date.now();
  const endpoint = `https://api.${platform}.com/oauth/authorize`;
  
  try {
    // Log the connection attempt
    await logApiCall(
      userId, 
      'CONNECT_PROFILE', 
      platform, 
      endpoint,
      { platform, action: 'connect' }
    );

    // Simulate real profile data (in production, this would be actual API calls)
    const mockProfileData = {
      instagram: {
        username: 'admin_test_account',
        display_name: 'Admin Test Profile',
        profile_picture_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
        bio: 'Perfil de teste para validação das APIs',
        followers_count: 15420,
        following_count: 890,
        posts_count: 234,
        engagement_rate: 0.045
      },
      tiktok: {
        username: 'admin_tiktok_test',
        display_name: 'Admin TikTok Test',
        profile_picture_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
        bio: 'Testando integração TikTok API',
        followers_count: 8750,
        following_count: 123,
        posts_count: 89,
        engagement_rate: 0.067
      },
      youtube: {
        username: 'AdminYouTubeTest',
        display_name: 'Admin YouTube Channel',
        profile_picture_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
        bio: 'Canal de testes para validação da API do YouTube',
        followers_count: 3250,
        following_count: 45,
        posts_count: 12,
        engagement_rate: 0.089
      },
      twitter: {
        username: 'admin_x_test',
        display_name: 'Admin X Test',
        profile_picture_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
        bio: 'Perfil de teste para integração com X (Twitter)',
        followers_count: 1840,
        following_count: 234,
        posts_count: 456,
        engagement_rate: 0.032
      },
      facebook: {
        username: 'admin.facebook.test',
        display_name: 'Admin Facebook Test',
        profile_picture_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=faces',
        bio: 'Página de teste para validação da API do Facebook',
        followers_count: 5670,
        following_count: 67,
        posts_count: 123,
        engagement_rate: 0.054
      }
    };

    const profileData = mockProfileData[platform as keyof typeof mockProfileData];
    
    if (!profileData) {
      throw new Error(`Platform ${platform} not supported`);
    }

    // Insert test profile
    const { data: testProfile, error: insertError } = await supabase
      .from('test_profiles')
      .insert({
        admin_user_id: userId,
        platform,
        username: profileData.username,
        display_name: profileData.display_name,
        profile_picture_url: profileData.profile_picture_url,
        bio: profileData.bio,
        followers_count: profileData.followers_count,
        following_count: profileData.following_count,
        posts_count: profileData.posts_count,
        engagement_rate: profileData.engagement_rate,
        access_token: `fake_token_${platform}_${Date.now()}`,
        refresh_token: `fake_refresh_${platform}_${Date.now()}`,
        last_sync_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Insert initial metrics
    const mockMetrics = {
      followers_count: profileData.followers_count,
      following_count: profileData.following_count,
      posts_count: profileData.posts_count,
      engagement_rate: profileData.engagement_rate,
      likes_avg: Math.floor(profileData.followers_count * profileData.engagement_rate * 0.8),
      comments_avg: Math.floor(profileData.followers_count * profileData.engagement_rate * 0.15),
      views_avg: Math.floor(profileData.followers_count * 2.5),
      reach_avg: Math.floor(profileData.followers_count * 1.8),
      impressions_avg: Math.floor(profileData.followers_count * 3.2),
      profile_views: Math.floor(profileData.followers_count * 0.1),
      website_clicks: Math.floor(profileData.followers_count * 0.02),
      growth_7d: {
        followers: {
          current: profileData.followers_count,
          previous: profileData.followers_count - Math.floor(Math.random() * 100) - 10
        }
      },
      top_post: {
        caption: `Post mais popular da última semana no ${platform}! 🚀 Testando a integração da API.`,
        likes: Math.floor(profileData.followers_count * profileData.engagement_rate * 1.5),
        comments: Math.floor(profileData.followers_count * profileData.engagement_rate * 0.3),
        views: platform === 'youtube' || platform === 'tiktok' ? Math.floor(profileData.followers_count * 4) : undefined
      }
    };

    await supabase
      .from('test_metrics')
      .insert({
        test_profile_id: testProfile.id,
        ...mockMetrics
      });

    await logApiCall(
      userId,
      'CONNECT_PROFILE_SUCCESS',
      platform,
      endpoint,
      { platform },
      { profile: testProfile, metrics: mockMetrics },
      undefined,
      200,
      startTime
    );

    return { success: true, profile: testProfile };
    
  } catch (error) {
    console.error(`Error connecting ${platform} profile:`, error);
    
    await logApiCall(
      userId,
      'CONNECT_PROFILE_ERROR',
      platform,
      endpoint,
      { platform },
      undefined,
      error.message,
      500,
      startTime
    );
    
    throw error;
  }
}

async function forceUpdateProfile(profileId: string, userId: string) {
  const startTime = Date.now();
  
  try {
    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('test_profiles')
      .select('*')
      .eq('id', profileId)
      .eq('admin_user_id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('Profile not found');
    }

    const endpoint = `https://api.${profile.platform}.com/user/insights`;
    
    await logApiCall(
      userId,
      'FORCE_UPDATE_START',
      profile.platform,
      endpoint,
      { profileId, action: 'force_update' }
    );

    // Simulate fetching updated data
    const growthFactor = 1 + (Math.random() * 0.1 - 0.05); // -5% to +5% change
    const newFollowersCount = Math.floor(profile.followers_count * growthFactor);
    const newEngagementRate = Math.max(0.01, profile.engagement_rate + (Math.random() * 0.02 - 0.01));

    // Update profile
    const { error: updateError } = await supabase
      .from('test_profiles')
      .update({
        followers_count: newFollowersCount,
        engagement_rate: newEngagementRate,
        last_sync_at: new Date().toISOString()
      })
      .eq('id', profileId);

    if (updateError) {
      throw updateError;
    }

    // Add new metrics
    const updatedMetrics = {
      test_profile_id: profileId,
      followers_count: newFollowersCount,
      engagement_rate: newEngagementRate,
      likes_avg: Math.floor(newFollowersCount * newEngagementRate * 0.8),
      comments_avg: Math.floor(newFollowersCount * newEngagementRate * 0.15),
      views_avg: Math.floor(newFollowersCount * 2.5),
      reach_avg: Math.floor(newFollowersCount * 1.8),
      impressions_avg: Math.floor(newFollowersCount * 3.2),
      profile_views: Math.floor(newFollowersCount * 0.1),
      website_clicks: Math.floor(newFollowersCount * 0.02),
      growth_7d: {
        followers: {
          current: newFollowersCount,
          previous: profile.followers_count
        }
      },
      top_post: {
        caption: `Post atualizado após force update! 🔄 Novos dados coletados em ${new Date().toLocaleDateString('pt-BR')}.`,
        likes: Math.floor(newFollowersCount * newEngagementRate * 1.5),
        comments: Math.floor(newFollowersCount * newEngagementRate * 0.3),
        views: profile.platform === 'youtube' || profile.platform === 'tiktok' ? Math.floor(newFollowersCount * 4) : undefined
      }
    };

    await supabase
      .from('test_metrics')
      .insert(updatedMetrics);

    await logApiCall(
      userId,
      'FORCE_UPDATE_SUCCESS',
      profile.platform,
      endpoint,
      { profileId },
      { updated_metrics: updatedMetrics },
      undefined,
      200,
      startTime
    );

    return { success: true };
    
  } catch (error) {
    console.error('Error updating profile:', error);
    
    await logApiCall(
      userId,
      'FORCE_UPDATE_ERROR',
      undefined,
      undefined,
      { profileId },
      undefined,
      error.message,
      500,
      startTime
    );
    
    throw error;
  }
}

async function generateTestReport(profileId: string, userId: string) {
  const startTime = Date.now();
  
  try {
    await logApiCall(
      userId,
      'GENERATE_REPORT_START',
      undefined,
      'pdf-generator',
      { profileId, action: 'generate_report' }
    );

    // Get profile and metrics
    const { data: profile } = await supabase
      .from('test_profiles')
      .select('*')
      .eq('id', profileId)  
      .eq('admin_user_id', userId)
      .single();

    const { data: metrics } = await supabase
      .from('test_metrics')
      .select('*')
      .eq('test_profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Simulate PDF generation (in production, use a real PDF library)
    const reportData = {
      profile,
      metrics: metrics?.[0],
      generated_at: new Date().toISOString(),
      report_type: 'test_validation'
    };

    // In a real implementation, you would:
    // 1. Generate actual PDF using puppeteer or similar
    // 2. Upload to Supabase Storage
    // 3. Return download URL
    
    const mockPdfUrl = `data:application/pdf;base64,JVBERi0xLjQKJdP0zOEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoyIDc1MiBUZAooUmVsYXTDs3JpbyBkZSBUZXN0ZSBHZXJhZG8hKSBUagpFVApzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDI0NSAwMDAwMCBuIAowMDAwMDAwMzIyIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDE0CiUlRU9G`;

    await logApiCall(
      userId,
      'GENERATE_REPORT_SUCCESS',
      profile.platform,
      'pdf-generator',
      { profileId },
      { report_generated: true, profile_name: profile.display_name },
      undefined,
      200,
      startTime
    );

    return { success: true, pdf_url: mockPdfUrl };
    
  } catch (error) {
    console.error('Error generating report:', error);
    
    await logApiCall(
      userId,
      'GENERATE_REPORT_ERROR',
      undefined,
      'pdf-generator',
      { profileId },
      undefined,
      error.message,
      500,
      startTime
    );
    
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, platform, userId, profileId } = await req.json();

    // Verify user is admin (this would be done via JWT in production)
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    if (roleError || !userRole) {
      return new Response(
        JSON.stringify({ error: 'Access denied: Admin role required' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let result;

    switch (action) {
      case 'connect':
        result = await connectRealProfile(platform, userId);
        break;
      case 'force_update':
        result = await forceUpdateProfile(profileId, userId);
        break;
      case 'generate_report':
        result = await generateTestReport(profileId, userId);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in admin-test-profiles function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});