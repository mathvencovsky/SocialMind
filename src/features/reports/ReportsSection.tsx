
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/domain";
import { aggregateEngagement } from "@/lib/analytics";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { parseCSV, CsvParsed } from "@/utils/csv";

export default function ReportsSection({ posts }:{ posts: Post[] }){
  const [jsonText,setJsonText]=useState("");
  const [csvText,setCsvText]=useState("title,views\nVideo A,100\nVideo B,250");
  const [data,setData]=useState<Post[]>(posts);
  const engagement = useMemo(()=> aggregateEngagement(data),[data]);

  return (<div className="grid lg:grid-cols-2 gap-4">
    <Card><CardContent className="p-4">
      <h3 className="text-lg font-semibold mb-2">Resumo – Orgânico x Campanha</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={[
          { name: "ER médio", Orgânico: engagement.organico.er, Campanha: engagement.campanha.er },
          { name: "Likes médios", Orgânico: engagement.organico.likes, Campanha: engagement.campanha.likes },
          { name: "Coments médios", Orgânico: engagement.organico.comments, Campanha: engagement.campanha.comments },
          { name: "Shares médios", Orgânico: engagement.organico.shares, Campanha: engagement.campanha.shares },
        ]}>
          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name"/><YAxis/><Tooltip/><Legend/>
          <Bar dataKey="Orgânico" radius={[6,6,0,0]} /><Bar dataKey="Campanha" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent></Card>

    <Card><CardContent className="p-4 space-y-3">
      <h3 className="text-lg font-semibold">Importar dados</h3>
      <p className="text-sm text-gray-600">JSON (posts, followersHistory, campaigns...) ou CSV (title,views,...)</p>
      <textarea className="w-full h-28 p-2 border rounded-xl" value={jsonText} onChange={e=>setJsonText(e.target.value)} placeholder='{"posts":[...]}'/>
      <textarea className="w-full h-28 p-2 border rounded-xl" value={csvText} onChange={e=>setCsvText(e.target.value)} placeholder={'title,views\nVideo A,100'} />
      <div className="flex gap-2">
        <Button onClick={()=>{ try{ const payload=JSON.parse(jsonText) as { posts?: Post[] }; if(payload.posts) setData(payload.posts);} catch{ alert("JSON inválido"); } }}>Aplicar JSON</Button>
        <Button variant="secondary" onClick={()=>{
          const parsed: CsvParsed = parseCSV(csvText);
          if(parsed.headers.includes('title') && parsed.headers.includes('views')){
            const mapped: Post[] = parsed.rows.map((r, i) => ({
              id: 1000 + i,
              title: String(r.title ?? ""),
              platform: "instagram",
              type: "orgânico",
              likes: 0,
              comments: 0,
              shares: 0,
              views: Number(r.views ?? 0) || 0
            }));
            setData(prev=>[...prev,...mapped]);
          }
        }}>Aplicar CSV</Button>
        <Button variant="secondary" onClick={()=>window.print()}>Exportar PDF</Button>
      </div>
    </CardContent></Card>
  </div> );
}
