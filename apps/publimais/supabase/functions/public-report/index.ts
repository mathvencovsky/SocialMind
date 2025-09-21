import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const reportId = url.pathname.split('/').pop();

    if (!reportId) {
      return new Response(
        JSON.stringify({ error: 'Report ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch shared report
    const { data: sharedReport, error: reportError } = await supabaseClient
      .from('shared_reports')
      .select('*')
      .eq('public_url', reportId)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (reportError || !sharedReport) {
      return new Response(
        JSON.stringify({ error: 'Report not found or expired' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the access for security monitoring and increment view count
    try {
      await supabaseClient.rpc('log_shared_report_access', {
        report_id: sharedReport.id,
        access_ip: req.headers.get('x-forwarded-for') || '127.0.0.1'
      });
    } catch (logError) {
      console.warn('Failed to log report access:', logError);
      // Fallback to manual view count increment if logging fails
      await supabaseClient
        .from('shared_reports')
        .update({ views_count: sharedReport.views_count + 1 })
        .eq('id', sharedReport.id);
    }

    // Return HTML page instead of JSON for better sharing experience
    const reportData = sharedReport.report_data as any;
    const html = generateReportHTML(reportData);

    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8'
      }
    });

  } catch (error) {
    console.error('Error fetching public report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateReportHTML(reportData: any): string {
  const profile = reportData.profile || {};
  const summary = reportData.summary || {};
  const packages = reportData.adPackages || [];

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfólio - ${profile.display_name || 'Influenciador'}</title>
    <meta name="description" content="Portfólio profissional de ${profile.display_name} - ${summary.totalFollowers} seguidores, ${summary.avgEngagementRate}% de engajamento">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .profile-name { font-size: 2.5em; margin-bottom: 10px; font-weight: 300; }
        .profile-bio { font-size: 1.1em; opacity: 0.9; }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
        }
        .stat-card {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .stat-number { font-size: 2em; font-weight: bold; color: #667eea; }
        .stat-label { color: #666; margin-top: 5px; }
        .section {
            padding: 30px;
        }
        .section h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.5em;
        }
        .package {
            border: 1px solid #eee;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
        }
        .package-title { font-weight: bold; color: #333; margin-bottom: 10px; }
        .package-price { color: #667eea; font-size: 1.2em; font-weight: bold; }
        .platforms {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        .platform {
            background: #667eea;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            background: #f8f9fa;
        }
        .cta {
            background: #667eea;
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
            font-weight: bold;
        }
        @media (max-width: 600px) {
            .container { padding: 10px; }
            .profile-name { font-size: 2em; }
            .stats { grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h1 class="profile-name">${profile.display_name || 'Influenciador'}</h1>
                ${profile.bio ? `<p class="profile-bio">${profile.bio}</p>` : ''}
                ${profile.location ? `<p>📍 ${profile.location}</p>` : ''}
                <div class="platforms">
                    ${summary.platforms?.map((platform: string) => 
                        `<span class="platform">${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>`
                    ).join('') || ''}
                </div>
            </div>

            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">${formatNumber(summary.totalFollowers || 0)}</div>
                    <div class="stat-label">Total de Seguidores</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${summary.avgEngagementRate || 0}%</div>
                    <div class="stat-label">Engajamento Médio</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${summary.connectedAccounts || 0}</div>
                    <div class="stat-label">Redes Conectadas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${packages.length}</div>
                    <div class="stat-label">Pacotes Disponíveis</div>
                </div>
            </div>

            ${packages.length > 0 ? `
            <div class="section">
                <h2>🎯 Pacotes Publicitários</h2>
                ${packages.map((pkg: any) => `
                    <div class="package">
                        <div class="package-title">${pkg.title}</div>
                        <div style="color: #666; margin: 10px 0;">${pkg.description || ''}</div>
                        <div class="package-price">R$ ${pkg.price?.toFixed(2) || '0,00'}</div>
                        <div style="color: #666; font-size: 0.9em; margin-top: 5px;">
                            ⏱️ Entrega em ${pkg.delivery_days || 7} dias
                        </div>
                        ${pkg.includes && pkg.includes.length > 0 ? `
                            <ul style="margin-top: 10px; padding-left: 20px; color: #666;">
                                ${pkg.includes.map((item: string) => `<li>${item}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <p>💼 Portfólio gerado pela Publi+</p>
            <p>📅 Relatório gerado em ${new Date(reportData.generatedAt).toLocaleDateString('pt-BR')}</p>
            <a href="https://publimais.lovable.app" class="cta">Criar meu portfólio</a>
        </div>
    </div>

    <script>
        function formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        }
    </script>
</body>
</html>`;

  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}