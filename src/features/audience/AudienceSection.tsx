
import type { AudienceDemographics } from "@/types/domain";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
const palette = ["#8884d8","#82ca9d","#ffc658","#0088FE","#FF8042"];
export default function AudienceSection({ demographics }:{ demographics: AudienceDemographics }){
  return (<div className="grid lg:grid-cols-3 gap-4">
    <Card><CardContent className="p-4"><h3 className="text-lg font-semibold mb-4">Gênero</h3><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={demographics.gender} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{demographics.gender.map((e,i)=><Cell key={e.name} fill={palette[i%palette.length]} />)}</Pie><Tooltip/></PieChart></ResponsiveContainer></CardContent></Card>
    <Card><CardContent className="p-4"><h3 className="text-lg font-semibold mb-4">Faixa Etária</h3><ResponsiveContainer width="100%" height={220}><BarChart data={demographics.age}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
    <Card><CardContent className="p-4"><h3 className="text-lg font-semibold mb-4">Localização (top países)</h3><ResponsiveContainer width="100%" height={220}><BarChart data={demographics.location}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
    <Card className="lg:col-span-3"><CardContent className="p-4"><h3 className="text-lg font-semibold mb-2">Qualidade da Audiência</h3><div className="grid md:grid-cols-3 gap-3"><K label="Seguidores reais" v={`${demographics.quality.realPct}%`}/><K label="Possível fake" v={`${demographics.quality.fakeFollowersPct}%`}/><K label="Inativos" v={`${demographics.quality.inactivePct}%`}/></div></CardContent></Card>
  </div> );
}
function K({label,v}:{label:string;v:string}){ return (<div className="p-3 bg-white rounded-2xl shadow"><div className="text-gray-500 text-xs">{label}</div><div className="text-xl font-bold">{v}</div></div>); }
