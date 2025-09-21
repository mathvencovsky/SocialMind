import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportRequest {
  format: 'pdf' | 'json';
  includePackages?: boolean;
  expirationDays?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from JWT
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { format = 'json', includePackages = true, expirationDays = 7 }: ReportRequest = await req.json();

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Fetch social accounts
    const { data: socialAccounts, error: accountsError } = await supabaseClient
      .rpc('get_user_social_accounts_secure');

    if (accountsError) {
      console.error('Error fetching social accounts:', accountsError);
    }

    // Fetch metrics for connected accounts
    const { data: metrics, error: metricsError } = await supabaseClient
      .from('social_metrics')
      .select(`
        *,
        social_accounts!inner(
          platform,
          username,
          user_id
        )
      `)
      .eq('social_accounts.user_id', user.id)
      .order('date', { ascending: false });

    if (metricsError) {
      console.error('Error fetching metrics:', metricsError);
    }

    // Calculate summary metrics
    const latestMetrics = metrics?.slice(0, 5) || [];
    const totalFollowers = latestMetrics.reduce((sum, m) => sum + (m.followers_count || 0), 0);
    const avgEngagementRate = latestMetrics.length > 0 
      ? latestMetrics.reduce((sum, m) => sum + (m.engagement_rate || 0), 0) / latestMetrics.length 
      : 0;
    const totalPosts = latestMetrics.reduce((sum, m) => sum + (m.posts_count || 0), 0);

    let adPackages = null;
    if (includePackages) {
      const { data: packagesData, error: packagesError } = await supabaseClient
        .from('ad_packages')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (packagesError) {
        console.error('Error fetching packages:', packagesError);
      } else {
        adPackages = packagesData;
      }
    }

    // Build report data
    const reportData = {
      profile: {
        display_name: profile?.display_name || 'Influenciador',
        bio: profile?.bio,
        location: profile?.location,
        niche: profile?.niche,
        website: profile?.website,
        avatar_url: profile?.avatar_url
      },
      summary: {
        totalFollowers,
        avgEngagementRate: Number(avgEngagementRate.toFixed(2)),
        totalPosts,
        connectedAccounts: socialAccounts?.length || 0,
        platforms: socialAccounts?.map((acc: any) => acc.platform) || []
      },
      socialAccounts: socialAccounts || [],
      metrics: latestMetrics,
      adPackages: adPackages || [],
      generatedAt: new Date().toISOString(),
      reportType: 'professional_portfolio'
    };

    if (format === 'pdf') {
      // For now, return JSON data that can be used to generate PDF on frontend
      // In a real implementation, you would use a PDF generation library here
      return new Response(
        JSON.stringify({ 
          message: 'PDF generation not implemented yet. Use format: json for data.',
          data: reportData 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create shareable report
    if (req.method === 'POST' && req.url.includes('share')) {
      const publicUrl = await generatePublicUrl();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);

      const { data: sharedReport, error: shareError } = await supabaseClient
        .from('shared_reports')
        .insert({
          user_id: user.id,
          report_data: reportData,
          public_url: publicUrl,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (shareError) {
        throw shareError;
      }

      return new Response(
        JSON.stringify({
          message: 'Report shared successfully',
          publicUrl: `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/public-report/${publicUrl}`,
          expiresAt: expiresAt.toISOString()
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return JSON report
    return new Response(
      JSON.stringify({
        success: true,
        data: reportData
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generatePublicUrl(): Promise<string> {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}