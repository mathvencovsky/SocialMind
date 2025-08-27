import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  ReferenceDot,
} from "recharts";
import type { FollowerPoint, Post, Campaign, SimilarProfile } from "@/types/domain";
import { aggregateEngagement, erForPost, growthPeaks } from "@/lib/analytics";

function KPI({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 bg-white rounded-2xl shadow">
      <div className="text-gray-500 text-xs">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

export default function ProfileSection({
  followersHistory,
  posts,
  campaigns,
  similarProfiles,
}: {
  followersHistory: FollowerPoint[];
  posts: Post[];
  campaigns: Campaign[];
  similarProfiles: SimilarProfile[];
}) {
  const [platform, setPlatform] = useState<"instagram" | "tiktok" | "youtube">("instagram");
  const [niche, setNiche] = useState<string>("any");
  const [cmpA, setCmpA] = useState<string | null>(null);
  const [cmpB, setCmpB] = useState<string | null>(null);

  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (p) => p.platform === platform && (niche === "any" || (p.tags || []).includes(niche))
      ),
    [posts, platform, niche]
  );
  const engagement = useMemo(() => aggregateEngagement(filteredPosts), [filteredPosts]);
  const peaks = useMemo(() => growthPeaks(followersHistory), [followersHistory]);

  const summary = useMemo(() => {
    const total = filteredPosts.length;
    const avgER = total
      ? Number((filteredPosts.reduce((a, p) => a + erForPost(p), 0) / total).toFixed(2))
      : 0;
    const lastFollowers = followersHistory[followersHistory.length - 1]?.followers || 0;
    const avgViews = total ? Math.round(filteredPosts.reduce((a, p) => a + p.views, 0) / total) : 0;
    return { lastFollowers, avgER, avgViews, campaigns: campaigns.length };
  }, [filteredPosts, followersHistory, campaigns.length]);

  const handles = similarProfiles.filter((s) => s.platform === platform).map((s) => s.handle);
  const a = similarProfiles.find((s) => s.handle === cmpA) || null;
  const b = similarProfiles.find((s) => s.handle === cmpB) || null;

  const compareChartData = [
    { metric: "Seguidores", Base: summary.lastFollowers, A: a?.followers || 0, B: b?.followers || 0 },
    { metric: "ER (%)", Base: summary.avgER, A: a?.er || 0, B: b?.er || 0 },
    { metric: "Views médios", Base: summary.avgViews, A: a?.avgViews || 0, B: b?.avgViews || 0 },
    { metric: "Campanhas", Base: summary.campaigns, A: 0, B: 0 },
  ];

  // 👇 Tipagem fora do JSX para evitar "Unexpected token" no parser
  const lineData = peaks.series as Array<{ month: string; followers: number }>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-3">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Resumo do Perfil</h2>
          <div className="grid md:grid-cols-4 gap-3 mb-4">
            <KPI label="Seguidores" value={summary.lastFollowers.toLocaleString()} />
            <KPI label="ER médio" value={`${summary.avgER}%`} />
            <KPI label="Views médios" value={summary.avgViews.toLocaleString()} />
            <KPI label="Campanhas" value={summary.campaigns} />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={
                [
                  { name: "Likes", v: engagement.organico.likes },
                  { name: "Comentários", v: engagement.organico.comments },
                  { name: "Shares", v: engagement.organico.shares },
                ] as Array<{ name: string; v: number }>
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="v" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Crescimento de Seguidores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="followers" stroke="#4f46e5" strokeWidth={3} />
              {peaks.top && (
                <ReferenceDot
                  x={peaks.top.month}
                  y={peaks.top.followers}
                  r={6}
                  fill="#ef4444"
                  stroke="none"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Select
  value={platform}
  onValueChange={(v: string) => setPlatform(v as "instagram" | "tiktok" | "youtube")}>
              <SelectTrigger>
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
            <Select value={niche} onValueChange={(v: string) => setNiche(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Nicho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Todos</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="moda">Moda</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm font-semibold mb-2">Comparar Perfis</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Select value={cmpA ?? ""} onValueChange={(v: string) => setCmpA(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Perfil A" />
              </SelectTrigger>
              <SelectContent>
                {handles.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cmpB ?? ""} onValueChange={(v: string) => setCmpB(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Perfil B" />
              </SelectTrigger>
              <SelectContent>
                {handles.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={
                compareChartData as Array<{ metric: string; Base: number; A: number; B: number }>
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Base" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="A" fill="#82ca9d" radius={[6, 6, 0, 0]} />
              <Bar dataKey="B" fill="#8884d8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Conteúdos em Destaque – {platform}</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {filteredPosts.slice(0, 6).map((p) => (
              <div key={p.id} className="p-3 bg-white rounded-2xl shadow">
                <div className="text-[10px] tracking-wide text-gray-500 uppercase">{p.type}</div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-xs text-gray-500">Views: {p.views.toLocaleString()}</div>
                <div className="text-xs">
                  Likes {p.likes} · Coments {p.comments} · Shares {p.shares}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ER ({p.platform}): {erForPost(p)}%
                </div>
                <Button variant="secondary" className="mt-2 w-full">
                  Ver detalhes
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
