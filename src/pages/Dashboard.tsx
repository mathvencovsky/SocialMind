
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSection from "@/features/profile/ProfileSection";
import AudienceSection from "@/features/audience/AudienceSection";
import CampaignsSection from "@/features/campaigns/CampaignsSection";
import BenchmarkSection from "@/features/benchmark/BenchmarkSection";
import ReportsSection from "@/features/reports/ReportsSection";
import { followersHistoryBase, postsBase, audienceBase, campaignsBase, similarProfilesBase } from "@/fixtures/mockData";
import { useState } from "react";

export default function Dashboard(){
  const [activeProfile] = useState("@influencer_demo");
  const [platform] = useState<"instagram"|"tiktok"|"youtube">("instagram");
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b mb-4">
        <div className="max-w-6xl mx-auto px-2 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl bg-indigo-600" />
            <div className="font-semibold">SocialMind — Dashboard</div>
          </div>
          <div className="text-sm text-gray-600">Protótipo modular</div>
        </div>
      </div>

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid grid-cols-5 gap-2 p-1 bg-white border rounded-xl">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="audiencia">Audiência</TabsTrigger>
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-4">
          <ProfileSection
            activeHandle={activeProfile}
            followersHistory={followersHistoryBase}
            posts={postsBase}
            campaigns={campaignsBase}
            similarProfiles={similarProfilesBase}
          />
        </TabsContent>

        <TabsContent value="audiencia" className="mt-4">
          <AudienceSection demographics={audienceBase}/>
        </TabsContent>

        <TabsContent value="campanhas" className="mt-4">
          <CampaignsSection campaigns={campaignsBase} posts={postsBase} platform={platform}/>
        </TabsContent>

        <TabsContent value="benchmark" className="mt-4">
          <BenchmarkSection similar={similarProfilesBase}/>
        </TabsContent>

        <TabsContent value="relatorios" className="mt-4">
          <ReportsSection posts={postsBase}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
