
import { useMemo, useState } from "react";
import type { Campaign, Post } from "@/types/domain";
import { calcCampaignKPIs, erForPost } from "@/lib/analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export default function CampaignsSection({ campaigns, posts, platform }:{ campaigns: Campaign[]; posts: Post[]; platform: "instagram"|"tiktok"|"youtube"; }){
  const [selectedName,setSelectedName]=useState<string>(campaigns[0]?.name ?? "");
  const selected = campaigns.find(c=>c.name===selectedName) || campaigns[0] || null;
  const selectedPosts = useMemo(()=> posts.filter(p=> selected?.posts.includes(p.id)),[posts,selected]);
  const kpi = useMemo(()=> calcCampaignKPIs(selected),[selected]);

  return (<div className="grid lg:grid-cols-3 gap-4">
    <Card><CardContent className="p-4">
      <h3 className="text-lg font-semibold mb-4">Campanhas</h3>
      <div className="space-y-2">
        {campaigns.map(c => (
          <button key={c.name} onClick={()=>setSelectedName(c.name)}
            className={`w-full text-left p-3 rounded-2xl border transition shadow-sm hover:shadow ${selectedName===c.name ? "bg-indigo-50 border-indigo-200" : "bg-white"}`}>
            <div className="font-semibold">{c.name}</div>
            <div className="text-xs text-gray-500">{c.start} → {c.end}</div>
            <div className="text-xs">Budget: R$ {c.budget.toLocaleString()}</div>
          </button>
        ))}
      </div>
    </CardContent></Card>

    <Card className="lg:col-span-2"><CardContent className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">{selected?.name}</h3>
          <div className="text-sm text-gray-500">Período: {selected?.start} – {selected?.end} · Código: {selected?.promoCode}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={()=>window.print()}>PDF</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-3">
        <K label="Impressões" v={selected?.impressions?.toLocaleString() || "0"} />
        <K label="Cliques" v={selected?.clicks?.toLocaleString() || "0"} />
        <K label="Conv." v={selected?.conversions?.toLocaleString() || "0"} />
        <K label="Receita" v={`R$ ${(selected?.revenue || 0).toLocaleString()}`} />
        <K label="EMV" v={`R$ ${(selected?.emv || 0).toLocaleString()}`} />
      </div>

      <div className="grid md:grid-cols-5 gap-3">
        <K label="CPC" v={`R$ ${kpi.cpc.toFixed(2)}`} />
        <K label="CPM" v={`R$ ${kpi.cpm.toFixed(2)}`} />
        <K label="CTR" v={`${kpi.ctr.toFixed(2)}%`} />
        <K label="CR" v={`${kpi.cr.toFixed(2)}%`} />
        <K label="ROAS" v={`${kpi.roas.toFixed(2)}x`} />
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Desempenho por Post – {platform}</h4>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={selectedPosts.map(p => ({ name: p.title, Views: p.views, Likes: p.likes, Comentários: p.comments, ER: erForPost(p) }))}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Legend />
            <Bar dataKey="Views" radius={[6,6,0,0]} /><Bar dataKey="Likes" radius={[6,6,0,0]} />
            <Bar dataKey="Comentários" radius={[6,6,0,0]} /><Bar dataKey="ER" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent></Card>
  </div> );
}

function K({label,v}:{label:string;v:string}){ return (<div className="p-3 bg-white rounded-2xl shadow"><div className="text-gray-500 text-xs">{label}</div><div className="text-xl font-bold">{v}</div></div>); }
