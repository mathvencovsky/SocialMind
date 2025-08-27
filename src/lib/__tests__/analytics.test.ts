
import { describe, it, expect } from "vitest";
import { erForPost, calcCampaignKPIs } from "../analytics";
import type { Post, Campaign } from "@/types/domain";

describe("analytics functions", () => {
  it("calculates ER correctly for an Instagram post", () => {
    const post: Post = { id: 1, title: "x", platform: "instagram", type: "orgânico", likes: 100, comments: 10, shares: 5, views: 1000 };
    const er = erForPost(post);
    expect(er).toBeGreaterThan(0);
  });

  it("returns zero KPIs for null campaign", () => {
    const kpis = calcCampaignKPIs(null);
    expect(kpis.cpc).toBe(0);
  });

  it("calculates KPIs correctly", () => {
    const campaign: Campaign = { budget: 1000, clicks: 100, impressions: 10000, conversions: 10, revenue: 2000, posts: [], name: "x", start: "", end: "", emv: 0 };
    const kpis = calcCampaignKPIs(campaign);
    expect(kpis.cpc).toBe(10);
    expect(kpis.cpm).toBeCloseTo(100);
    expect(kpis.ctr).toBeCloseTo(1);
    expect(kpis.cr).toBeCloseTo(10);
    expect(kpis.roas).toBe(2);
  });
});
