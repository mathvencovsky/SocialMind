import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { Users, MapPin, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Audience = { 
  id: string; 
  age18_24: number; 
  age25_34: number; 
  age35_44: number; 
  age45plus: number; 
  male: number; 
  female: number; 
  locations: string[]; 
};

export default function SocialMindAudience() {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAudience();
    }
  }, [user]);

  const fetchAudience = async () => {
    try {
      const { data, error } = await supabase
        .from("analytics_audiences")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching audience:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da audiência.",
          variant: "destructive"
        });
      } else {
        setAudience(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!audience) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Dados da Audiência Não Encontrados</h2>
          <p className="text-muted-foreground">
            Volte ao dashboard e crie um perfil demo para ver os dados da audiência.
          </p>
        </div>
      </div>
    );
  }

  const ageData = [
    { name: "18-24", value: audience.age18_24, label: "18-24 anos" },
    { name: "25-34", value: audience.age25_34, label: "25-34 anos" },
    { name: "35-44", value: audience.age35_44, label: "35-44 anos" },
    { name: "45+", value: audience.age45plus, label: "45+ anos" }
  ];

  const genderData = [
    { name: "Masculino", value: audience.male },
    { name: "Feminino", value: audience.female }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
  const GENDER_COLORS = ['#0088FE', '#FF8C94'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Demografia da Audiência</h1>
        <p className="text-muted-foreground">
          Análise detalhada do perfil dos seus seguidores para otimizar sua estratégia de conteúdo.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {(audience.age18_24 + audience.age25_34 + audience.age35_44 + audience.age45plus)}%
                </div>
                <div className="text-sm text-muted-foreground">Total Audiência Analisada</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{Math.max(...ageData.map(d => d.value))}%</div>
                <div className="text-sm text-muted-foreground">Maior Faixa Etária</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{audience.locations.length}</div>
                <div className="text-sm text-muted-foreground">Países Principais</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Idade</CardTitle>
            <CardDescription>Percentual da audiência por faixa etária</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ label, value }) => `${label}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`age-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentual']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Gênero</CardTitle>
            <CardDescription>Comparação entre audiência masculina e feminina</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genderData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Percentual (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Percentual']} />
                <Bar dataKey="value" fill="#8884d8">
                  {genderData.map((entry, index) => (
                    <Cell key={`gender-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Principais Localizações
          </CardTitle>
          <CardDescription>Países com maior concentração de seguidores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {audience.locations.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                  </div>
                  <span className="font-medium">{location}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.floor(Math.random() * 30) + 10}% {/* Simulated percentage */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights da Audiência</CardTitle>
          <CardDescription>Resumo dos dados mais importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Faixa Etária Dominante</h4>
              <p className="text-blue-800 dark:text-blue-200">
                {ageData.reduce((prev, current) => (prev.value > current.value) ? prev : current).label} 
                representa a maior parte da sua audiência ({ageData.reduce((prev, current) => (prev.value > current.value) ? prev : current).value}%).
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Distribuição de Gênero</h4>
              <p className="text-green-800 dark:text-green-200">
                Sua audiência é {audience.male > audience.female ? 'predominantemente masculina' : 'predominantemente feminina'} 
                ({Math.max(audience.male, audience.female)}% vs {Math.min(audience.male, audience.female)}%).
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">Alcance Geográfico</h4>
              <p className="text-purple-800 dark:text-purple-200">
                Sua audiência tem presença internacional, com destaque para {audience.locations[0]} 
                como principal mercado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}