
import type { Campaign, FollowerPoint, Post } from "@/types/domain";

type Weights = { like: number; comment: number; share: number };
const ER_WEIGHTS: Record<Post["platform"], Weights> = {
  instagram: { like: 1, comment: 1.5, share: 1.2 },
  tiktok: { like: 1, comment: 1.2, share: 2 },
  youtube: { like: 1, comment: 2, share: 1.5 },
};

export function erForPost(p: Post): number {
  const w = ER_WEIGHTS[p.platform];
  const inter = p.likes * w.like + p.comments * w.comment + p.shares * w.share;
  return p.views ? Number(((inter / p.views) * 100).toFixed(2)) : 0;
}

type AggBucket = { inter: number; views: number; likes: number; comments: number; shares: number; count: number };
type Agg = { organico: AggBucket; campanha: AggBucket };

export function aggregateEngagement(posts: Post[]) {
  const agg: Agg = {
    organico: { inter: 0, views: 0, likes: 0, comments: 0, shares: 0, count: 0 },
    campanha: { inter: 0, views: 0, likes: 0, comments: 0, shares: 0, count: 0 },
  };
  posts.forEach((p) => {
    const key = p.type === "campanha" ? "campanha" : "organico";
    const w = ER_WEIGHTS[p.platform];
    const inter = p.likes * w.like + p.comments * w.comment + p.shares * w.share;
    const bucket = agg[key];
    bucket.inter += inter;
    bucket.views += p.views;
    bucket.likes += p.likes;
    bucket.comments += p.comments;
    bucket.shares += p.shares;
    bucket.count += 1;
  });
  const stats = (o: AggBucket) => ({
    likes: o.count ? Math.round(o.likes / o.count) : 0,
    comments: o.count ? Math.round(o.comments / o.count) : 0,
    shares: o.count ? Math.round(o.shares / o.count) : 0,
    views: o.count ? Math.round(o.views / o.count) : 0,
    er: o.views ? Number(((o.inter / o.views) * 100).toFixed(2)) : 0,
  });
  return { organico: stats(agg.organico), campanha: stats(agg.campanha) };
}

export function growthPeaks(series: FollowerPoint[]) {
  const arr = series.map((p, i) => {
    const prev = series[i - 1]?.followers ?? p.followers;
    const delta = p.followers - prev;
    const pct = prev ? (delta / prev) * 100 : 0;
    return { ...p, delta, pct };
  });
  const top = [...arr].sort((a, b) => b.delta - a.delta)[0];
  return { top, series: arr };
}

export function calcCampaignKPIs(c: Campaign | null) {
  if (!c) return { cpc: 0, cpm: 0, ctr: 0, cr: 0, roas: 0 };
  const cpc = c.clicks ? c.budget / c.clicks : 0;
  const cpm = c.impressions ? c.budget / (c.impressions / 1000) : 0;
  const ctr = c.impressions ? (c.clicks / c.impressions) * 100 : 0;
  const cr = c.clicks ? (c.conversions / c.clicks) * 100 : 0;
  const roas = c.budget ? c.revenue / c.budget : 0;
  return { cpc, cpm, ctr, cr, roas };
}
