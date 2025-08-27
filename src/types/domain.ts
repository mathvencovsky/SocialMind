
export type FollowerPoint = { month: string; followers: number; date?: string };
export type Post = {
  id: number; title: string; platform: "instagram" | "tiktok" | "youtube";
  type: "orgânico" | "campanha"; likes: number; comments: number; shares: number; views: number; tags?: string[];
};
export type AudienceDemographics = {
  gender: { name: string; value: number }[];
  age: { name: string; value: number }[];
  location: { name: string; value: number }[];
  quality: { fakeFollowersPct: number; inactivePct: number; realPct: number };
  niches: string[];
};
export type Campaign = {
  name: string; budget: number; start: string; end: string; posts: number[];
  clicks: number; conversions: number; revenue: number; impressions: number; emv: number; promoCode?: string;
};
export type SimilarProfile = {
  handle: string; er: number; avgViews: number; followers: number;
  platform: "instagram" | "tiktok" | "youtube"; country: string; niches: string[];
};
