
import { useMemo, useState, useCallback } from "react";
import type { SimilarProfile } from "@/types/domain";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export default function BenchmarkSection({ similar }:{ similar: SimilarProfile[] }){
  const [platform,setPlatform]=useState<"instagram"|"tiktok"|"youtube">("instagram");
  const [followersBand,setFollowersBand]=useState("any");
  const [country,setCountry]=useState("any");
  const [niche,setNiche]=useState("any");

  const followersPass = useCallback((n:number)=>{
    if(followersBand==="any") return true;
    if(followersBand==="<100k") return n<100000;
    if(followersBand==="100-300k") return n>=100000 && n<=300000;
    if(followersBand==="300-1M") return n>300000 && n<=1000000;
    if(followersBand===">1M") return n>1000000;
    return true;
  },[followersBand]);

  const filtered = useMemo(()=> similar.filter(s=>
    s.platform===platform &&
    followersPass(s.followers) &&
    (country==="any"||s.country===country) &&
    (niche==="any" || (s.niches||[]).includes(niche))
  ), [similar,platform,followersPass,country,niche]);

  return (<div className="grid lg:grid-cols-2 gap-4">
    <Card><CardContent className="p-4">
      <h3 className="text-lg font-semibold mb-2">Filtros</h3>
      <div className="grid md:grid-cols-4 gap-2">
        <Select value={platform} onValueChange={(v:string)=>setPlatform(v as "instagram"|"tiktok"|"youtube")}>
          <SelectTrigger><SelectValue placeholder="Plataforma" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
          </SelectContent>
        </Select>
        <Select value={followersBand} onValueChange={(v:string)=>setFollowersBand(v)}>
          <SelectTrigger><SelectValue placeholder="Seguidores" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Todos</SelectItem>
            <SelectItem value="<100k">&lt; 100k</SelectItem>
            <SelectItem value="100-300k">100k–300k</SelectItem>
            <SelectItem value="300-1M">300k–1M</SelectItem>
            <SelectItem value=">1M">&gt; 1M</SelectItem>
          </SelectContent>
        </Select>
        <Select value={country} onValueChange={(v:string)=>setCountry(v)}>
          <SelectTrigger><SelectValue placeholder="País" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Todos</SelectItem>
            <SelectItem value="BR">Brasil</SelectItem>
            <SelectItem value="PT">Portugal</SelectItem>
            <SelectItem value="US">Estados Unidos</SelectItem>
            <SelectItem value="ES">Espanha</SelectItem>
          </SelectContent>
        </Select>
        <Select value={niche} onValueChange={(v:string)=>setNiche(v)}>
          <SelectTrigger><SelectValue placeholder="Nicho" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Todos</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
            <SelectItem value="moda">Moda</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent></Card>

    <Card><CardContent className="p-4">
      <h3 className="text-lg font-semibold mb-2">Comparativo ({platform})</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={filtered.map(s=>({ name:s.handle, ER:s.er, Views:s.avgViews }))}>
          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
          <Bar dataKey="ER" radius={[6,6,0,0]} /><Bar dataKey="Views" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-xs text-gray-500 mt-2">Filtros: Seguidores {followersBand}, País {country}, Nicho {niche}</div>
    </CardContent></Card>

    <Card className="lg:col-span-2"><CardContent className="p-4">
      <h3 className="text-lg font-semibold mb-3">Ranking (por ER)</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500">
            <th className="p-2">Perfil</th><th className="p-2">Plataforma</th><th className="p-2">País</th>
            <th className="p-2">Seguidores</th><th className="p-2">Nicho</th><th className="p-2">ER</th><th className="p-2">Views médios</th>
          </tr></thead>
          <tbody>
            {filtered.sort((a,b)=>b.er-a.er).map(s=>(
              <tr key={s.handle} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{s.handle}</td>
                <td className="p-2 capitalize">{s.platform}</td>
                <td className="p-2">{s.country}</td>
                <td className="p-2">{s.followers.toLocaleString()}</td>
                <td className="p-2">{(s.niches||[]).join(", ")}</td>
                <td className="p-2">{s.er}%</td>
                <td className="p-2">{s.avgViews.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent></Card>
  </div> );
}
