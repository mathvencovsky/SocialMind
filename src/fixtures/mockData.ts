
import type { AudienceDemographics, Campaign, FollowerPoint, Post, SimilarProfile } from "@/types/domain";

export const followersHistoryBase: FollowerPoint[] = [
  { month: "Jan", followers: 12000, date: "2025-01-01" },
  { month: "Fev", followers: 13800, date: "2025-02-01" },
  { month: "Mar", followers: 15100, date: "2025-03-01" },
  { month: "Abr", followers: 17600, date: "2025-04-01" },
  { month: "Mai", followers: 20250, date: "2025-05-01" },
  { month: "Jun", followers: 22100, date: "2025-06-01" },
];

export const postsBase: Post[] = [
  { id: 1, title: "Look do dia", platform: "instagram", type: "orgânico", likes: 2300, comments: 180, shares: 70, views: 18000, tags: ["moda"] },
  { id: 2, title: "Reels treino HIIT", platform: "instagram", type: "orgânico", likes: 5400, comments: 420, shares: 220, views: 52000, tags: ["fitness"] },
  { id: 3, title: "#ad Tênis Marca X", platform: "instagram", type: "campanha", likes: 6100, comments: 510, shares: 260, views: 68000, tags: ["fitness","calcados"] },
  { id: 4, title: "Vlog viagem", platform: "youtube", type: "orgânico", likes: 3100, comments: 260, shares: 120, views: 29000, tags: ["lifestyle"] },
  { id: 5, title: "#ad BF Loja Y", platform: "tiktok", type: "campanha", likes: 9200, comments: 740, shares: 410, views: 110000, tags: ["moda"] },
  { id: 6, title: "Receita rápida", platform: "tiktok", type: "orgânico", likes: 4000, comments: 330, shares: 150, views: 45000, tags: ["culinaria"] },
];

export const audienceBase: AudienceDemographics = {
  gender: [{ name: "Feminino", value: 62 }, { name: "Masculino", value: 38 }],
  age: [{ name: "13–17", value: 6 }, { name: "18–24", value: 34 }, { name: "25–34", value: 41 }, { name: "35–44", value: 14 }, { name: "45+", value: 5 }],
  location: [{ name: "BR", value: 72 }, { name: "PT", value: 9 }, { name: "US", value: 7 }, { name: "ES", value: 5 }, { name: "Outros", value: 7 }],
  quality: { fakeFollowersPct: 7, inactivePct: 12, realPct: 81 },
  niches: ["fitness", "moda", "lifestyle"],
};

export const campaignsBase: Campaign[] = [
  { name: "Black Friday 2024", budget: 30000, start: "2024-11-15", end: "2024-11-30", posts: [5], clicks: 18000, conversions: 1200, revenue: 210000, impressions: 380000, emv: 95000, promoCode: "BF-INFLU-20" },
  { name: "Lançamento Tênis X", budget: 15000, start: "2024-04-02", end: "2024-04-20", posts: [3], clicks: 7200, conversions: 310, revenue: 68000, impressions: 120000, emv: 42000, promoCode: "TENISX15" },
];

export const similarProfilesBase: SimilarProfile[] = [
  { handle: "@fit_ana", er: 6.2, avgViews: 54000, followers: 280000, platform: "instagram", country: "BR", niches: ["fitness"] },
  { handle: "@joao_hiitt", er: 5.1, avgViews: 47000, followers: 190000, platform: "tiktok", country: "BR", niches: ["fitness"] },
  { handle: "@canalcardio", er: 4.4, avgViews: 61000, followers: 320000, platform: "youtube", country: "PT", niches: ["fitness"] },
  { handle: "@move_fast", er: 7.0, avgViews: 52000, followers: 150000, platform: "instagram", country: "US", niches: ["fitness","lifestyle"] },
  { handle: "@estilo_ju", er: 6.8, avgViews: 43000, followers: 90000, platform: "instagram", country: "BR", niches: ["moda"] },
];
