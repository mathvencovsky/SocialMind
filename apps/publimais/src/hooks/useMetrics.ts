import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SocialMetrics {
  id: string;
  social_account_id: string;
  date: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  engagement_rate: number;
  likes_avg: number;
  comments_avg: number;
  shares_avg: number;
  views_avg: number;
  reach_avg: number;
  impressions_avg: number;
  profile_views: number;
  website_clicks: number;
  created_at: string;
}

interface MetricsSummary {
  totalFollowers: number;
  avgEngagementRate: number;
  totalPosts: number;
  connectedAccounts: number;
  topPlatform: string;
  growthRate: number;
}

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<SocialMetrics[]>([]);
  const [summary, setSummary] = useState<MetricsSummary>({
    totalFollowers: 0,
    avgEngagementRate: 0,
    totalPosts: 0,
    connectedAccounts: 0,
    topPlatform: '',
    growthRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMetrics = async () => {
    if (!user) return;

    try {
      // Fetch social metrics for user's connected accounts
      const { data: metricsData, error: metricsError } = await supabase
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

      if (metricsError) throw metricsError;

      const formattedMetrics = metricsData?.map((metric: any) => ({
        id: metric.id,
        social_account_id: metric.social_account_id,
        date: metric.date,
        followers_count: metric.followers_count || 0,
        following_count: metric.following_count || 0,
        posts_count: metric.posts_count || 0,
        engagement_rate: metric.engagement_rate || 0,
        likes_avg: metric.likes_avg || 0,
        comments_avg: metric.comments_avg || 0,
        shares_avg: metric.shares_avg || 0,
        views_avg: metric.views_avg || 0,
        reach_avg: metric.reach_avg || 0,
        impressions_avg: metric.impressions_avg || 0,
        profile_views: metric.profile_views || 0,
        website_clicks: metric.website_clicks || 0,
        created_at: metric.created_at
      })) || [];

      setMetrics(formattedMetrics);

      // Calculate summary
      if (formattedMetrics.length > 0) {
        const latestMetrics = formattedMetrics.slice(0, 5); // Get latest metrics for each account
        const totalFollowers = latestMetrics.reduce((sum, m) => sum + m.followers_count, 0);
        const avgEngagementRate = latestMetrics.reduce((sum, m) => sum + m.engagement_rate, 0) / latestMetrics.length;
        const totalPosts = latestMetrics.reduce((sum, m) => sum + m.posts_count, 0);

        setSummary({
          totalFollowers,
          avgEngagementRate: Number(avgEngagementRate.toFixed(2)),
          totalPosts,
          connectedAccounts: latestMetrics.length,
          topPlatform: 'Instagram', // This would be calculated based on followers or engagement
          growthRate: 0 // This would be calculated based on historical data
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricsByPlatform = (platform: string) => {
    return metrics.filter(metric => {
      // This would need to be joined with social_accounts to get platform info
      return true; // Placeholder
    });
  };

  const getGrowthData = (days = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return metrics
      .filter(metric => new Date(metric.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  useEffect(() => {
    fetchMetrics();
  }, [user]);

  return {
    metrics,
    summary,
    loading,
    getMetricsByPlatform,
    getGrowthData,
    refetch: fetchMetrics
  };
};