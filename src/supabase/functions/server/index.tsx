import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { analyzeWithVirusTotal, analyzeWithAbuseIPDB, generateAIAnalysis } from "./threat-analysis.tsx";
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Test user creation endpoint (for development only)
app.post("/create-test-user", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Create a test user with email confirmation disabled
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'test123456',
      user_metadata: { name: 'Test User' },
      email_confirm: true // Auto-confirm email for testing
    });

    if (error) {
      console.error('Test user creation error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      message: 'Test user created successfully',
      email: 'test@example.com',
      password: 'test123456',
      data 
    });
  } catch (error) {
    console.error('Test user creation processing error:', error);
    return c.json({ error: 'Test user creation failed' }, 500);
  }
});

// Threat analysis endpoint
app.post("/analyze", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { type, value } = await c.req.json();

    let vtData = null;
    let abuseData = null;

    // Analyze with VirusTotal
    try {
      vtData = await analyzeWithVirusTotal(type, value);
    } catch (error) {
      console.error('VirusTotal analysis error:', error);
      vtData = { error: error.message };
    }

    // If it's an IP address, also analyze with AbuseIPDB
    if (type === 'ip') {
      try {
        abuseData = await analyzeWithAbuseIPDB(value);
      } catch (error) {
        console.error('AbuseIPDB analysis error:', error);
        abuseData = { error: error.message };
      }
    }

    // Generate AI analysis
    let aiAnalysis = '';
    try {
      aiAnalysis = await generateAIAnalysis(vtData, abuseData, type, value);
    } catch (error) {
      console.error('AI analysis error:', error);
      aiAnalysis = 'AI analysis unavailable';
    }

    // Store analysis in KV store
    const analysisId = `analysis_${user.id}_${Date.now()}`;
    await kv.set(analysisId, {
      userId: user.id,
      type,
      value,
      vtData,
      abuseData,
      aiAnalysis,
      timestamp: new Date().toISOString(),
    });

    return c.json({
      analysisId,
      vtData,
      abuseData,
      aiAnalysis,
    });
  } catch (error) {
    console.error('Analysis processing error:', error);
    return c.json({ error: 'Analysis failed' }, 500);
  }
});

// Save download history
app.post("/history", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { analysisId, fileName, format } = await c.req.json();

    const historyId = `history_${user.id}_${Date.now()}`;
    await kv.set(historyId, {
      userId: user.id,
      analysisId,
      fileName,
      format,
      downloadedAt: new Date().toISOString(),
    });

    return c.json({ success: true, historyId });
  } catch (error) {
    console.error('History save error:', error);
    return c.json({ error: 'Failed to save history' }, 500);
  }
});

// Get download history
app.get("/history", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const historyItems = await kv.getByPrefix(`history_${user.id}_`);
    
    // Sort by timestamp descending
    const sortedHistory = historyItems.sort((a, b) => {
      return new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime();
    });

    return c.json({ history: sortedHistory });
  } catch (error) {
    console.error('History fetch error:', error);
    return c.json({ error: 'Failed to fetch history' }, 500);
  }
});

// Get analysis by ID
app.get("/analysis/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const analysisId = c.req.param('id');
    const analysis = await kv.get(analysisId);

    if (!analysis || analysis.userId !== user.id) {
      return c.json({ error: 'Analysis not found' }, 404);
    }

    return c.json({ analysis });
  } catch (error) {
    console.error('Analysis fetch error:', error);
    return c.json({ error: 'Failed to fetch analysis' }, 500);
  }
});

// Update user profile
app.put("/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { name } }
    );

    if (error) {
      console.error('Profile update error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ data });
  } catch (error) {
    console.error('Profile update processing error:', error);
    return c.json({ error: 'Profile update failed' }, 500);
  }
});

// Dedicated AbuseIPDB check endpoint
app.post("/abuse-check", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { type, value } = await c.req.json();

    let abuseData = null;

    // Perform AbuseIPDB check based on type
    try {
      if (type === 'ip' || type === 'subnet') {
        abuseData = await analyzeWithAbuseIPDB(value);
      } else if (type === 'domain') {
        // For domains, AbuseIPDB doesn't have direct support
        // We can try to resolve the domain to IP first or use alternative approach
        abuseData = { 
          data: { 
            message: 'Domain check not directly supported by AbuseIPDB. Please check the IP address associated with this domain.',
            domain: value 
          } 
        };
      }
    } catch (error) {
      console.error('AbuseIPDB check error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(abuseData);
  } catch (error) {
    console.error('AbuseIPDB check processing error:', error);
    return c.json({ error: 'AbuseIPDB check failed' }, 500);
  }
});

// Unified threat analysis endpoint
app.post("/unified-analyze", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { value, detectedType } = await c.req.json();

    let vtData = null;
    let abuseData = null;
    let correlationInsights = '';
    let mitigationActions: string[] = [];

    // Map detected type to VirusTotal type
    const vtType = detectedType.includes('hash') ? 'hash' : 
                   detectedType === 'ip' ? 'ip' :
                   detectedType === 'domain' ? 'domain' :
                   detectedType === 'url' ? 'url' : 'hash';

    // Analyze with VirusTotal
    try {
      vtData = await analyzeWithVirusTotal(vtType, value);
    } catch (error) {
      console.error('VirusTotal analysis error:', error);
      vtData = { error: error.message };
    }

    // Analyze with AbuseIPDB for IP-related indicators
    if (detectedType === 'ip' || detectedType === 'subnet' || detectedType === 'domain') {
      try {
        abuseData = await analyzeWithAbuseIPDB(value);
      } catch (error) {
        console.error('AbuseIPDB analysis error:', error);
        abuseData = { error: error.message };
      }
    }

    // Generate correlation insights
    const vtMalicious = vtData?.data?.attributes?.last_analysis_stats?.malicious || 0;
    const vtSuspicious = vtData?.data?.attributes?.last_analysis_stats?.suspicious || 0;
    const abuseScore = abuseData?.data?.abuseConfidenceScore || 0;
    const abuseReports = abuseData?.data?.totalReports || 0;

    correlationInsights = `
CROSS-SOURCE THREAT CORRELATION ANALYSIS

VirusTotal Intelligence:
• ${vtMalicious} security vendors flagged this as malicious
• ${vtSuspicious} vendors reported suspicious activity
• Overall detection rate: ${((vtMalicious / Math.max(vtData?.data?.attributes?.last_analysis_stats ? Object.values(vtData.data.attributes.last_analysis_stats).reduce((a: any, b: any) => a + b, 0) : 1, 1)) * 100).toFixed(1)}%

${abuseData?.data ? `
AbuseIPDB Intelligence:
• Abuse confidence score: ${abuseScore}% (${abuseScore > 75 ? 'HIGH RISK' : abuseScore > 50 ? 'MEDIUM RISK' : abuseScore > 25 ? 'LOW RISK' : 'MINIMAL RISK'})
• Total abuse reports: ${abuseReports}
• Geographic origin: ${abuseData.data.countryCode || 'Unknown'}
• Network: ${abuseData.data.isp || 'Unknown'}
` : ''}

Correlation Verdict:
${vtMalicious > 5 || abuseScore > 75 ? '⚠️ CRITICAL THREAT - Immediate action required. Multiple sources confirm malicious activity.' :
  vtMalicious > 2 || abuseScore > 50 ? '⚡ HIGH RISK - Strong indicators of malicious intent. Recommend blocking and investigation.' :
  vtMalicious > 0 || vtSuspicious > 5 || abuseScore > 25 ? 'ℹ️ MEDIUM RISK - Some suspicious indicators detected. Monitor closely.' :
  '✅ LOW RISK - Minimal threat indicators found across all sources.'}

Cross-Reference Analysis:
• Threat consistency across sources: ${vtMalicious > 0 && abuseScore > 50 ? 'HIGH (multiple sources agree)' : 'MODERATE'}
• False positive likelihood: ${vtMalicious === 0 && abuseScore === 0 ? 'N/A - Clean' : vtMalicious < 3 && abuseScore < 25 ? 'LOW' : 'VERY LOW'}
• Recommended confidence level: ${vtMalicious > 5 || abuseScore > 75 ? '95%+' : vtMalicious > 2 || abuseScore > 50 ? '80-95%' : '60-80%'}
`;

    // Generate mitigation actions
    if (vtMalicious > 5 || abuseScore > 75) {
      mitigationActions = [
        'IMMEDIATE: Block this indicator across all network perimeters (firewall, IDS/IPS, proxy)',
        'URGENT: Quarantine any systems that have communicated with this indicator',
        'Conduct full forensic investigation on affected systems',
        'Search SIEM logs for any historical connections to this indicator',
        'Update all threat intelligence platforms and security tools with this IOC',
        'Brief incident response team and escalate to SOC leadership',
        'Document full timeline of exposure and potential data exfiltration',
        'Consider engaging external threat intelligence services for attribution'
      ];
    } else if (vtMalicious > 2 || abuseScore > 50) {
      mitigationActions = [
        'Block this indicator in your security controls as a precautionary measure',
        'Enable enhanced monitoring for any systems that accessed this indicator',
        'Review firewall and proxy logs for related activity patterns',
        'Update threat intelligence feeds with this indicator',
        'Notify security team for awareness and monitoring',
        'Schedule follow-up review in 24-48 hours',
        'Consider adding to watchlist for behavioral analysis'
      ];
    } else if (vtMalicious > 0 || vtSuspicious > 5 || abuseScore > 25) {
      mitigationActions = [
        'Add to monitoring watchlist for suspicious activity',
        'Review context of how this indicator was encountered',
        'Check for any unusual patterns in network traffic',
        'Document finding for threat intelligence database',
        'Consider temporary restriction pending further investigation',
        'Monitor for any changes in threat score over next 7 days'
      ];
    } else {
      mitigationActions = [
        'No immediate action required - low threat indicators',
        'Continue standard security monitoring practices',
        'Document analysis for future reference',
        'Optionally add to low-priority watchlist',
        'Review if context changes or new intelligence emerges'
      ];
    }

    // Generate AI analysis
    let aiAnalysis = '';
    try {
      aiAnalysis = await generateAIAnalysis(vtData, abuseData, detectedType, value);
    } catch (error) {
      console.error('AI analysis error:', error);
      aiAnalysis = 'AI analysis unavailable. See correlation insights above for threat assessment.';
    }

    // Store unified analysis
    const analysisId = `unified_analysis_${user.id}_${Date.now()}`;
    await kv.set(analysisId, {
      userId: user.id,
      detectedType,
      value,
      vtData,
      abuseData,
      correlationInsights,
      aiAnalysis,
      mitigationActions,
      timestamp: new Date().toISOString(),
    });

    return c.json({
      analysisId,
      detectedType,
      vtData,
      abuseData,
      correlationInsights,
      aiAnalysis,
      mitigationActions,
      correlation: {
        vtMalicious,
        vtSuspicious,
        abuseScore,
        abuseReports
      }
    });
  } catch (error) {
    console.error('Unified analysis processing error:', error);
    return c.json({ error: 'Unified analysis failed' }, 500);
  }
});

Deno.serve(app.fetch);