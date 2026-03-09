import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export function ComprehensiveFlowchart() {
  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Comprehensive Platform Flowchart</CardTitle>
        <CardDescription className="text-sm">
          Complete user journey with unified threat analysis workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <svg viewBox="0 0 1600 2400" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>
              {`
                .box-start { fill: #00E676; stroke: #00C853; stroke-width: 3; }
                .box-auth { fill: #6366F1; stroke: #4F46E5; stroke-width: 2; }
                .box-main { fill: #0052FF; stroke: #003DA3; stroke-width: 2; }
                .box-feature { fill: #00D9FF; stroke: #00B8D9; stroke-width: 2; }
                .box-process { fill: #7B61FF; stroke: #6366F1; stroke-width: 2; }
                .box-data { fill: #FFB020; stroke: #FF9800; stroke-width: 2; }
                .box-output { fill: #00E676; stroke: #00C853; stroke-width: 2; }
                .box-end { fill: #FF3B5C; stroke: #E91E63; stroke-width: 2; }
                .box-decision { fill: #FFF8E1; stroke: #FFB020; stroke-width: 2; }
                .text-title { fill: white; font-size: 16px; font-weight: 700; text-anchor: middle; }
                .text-sm { fill: white; font-size: 12px; text-anchor: middle; }
                .text-xs { fill: white; font-size: 10px; text-anchor: middle; }
                .arrow { stroke: #64748B; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
                .arrow-decision { stroke: #FFB020; stroke-width: 2; fill: none; marker-end: url(#arrowhead-decision); }
                .label { fill: #475569; font-size: 11px; text-anchor: middle; font-weight: 600; }
              `}
            </style>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#64748B" />
            </marker>
            <marker id="arrowhead-decision" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#FFB020" />
            </marker>
          </defs>

          {/* START */}
          <ellipse cx="800" cy="40" rx="100" ry="40" className="box-start" />
          <text x="800" y="50" className="text-title">START</text>

          <path d="M 800 80 L 800 140" className="arrow" />

          {/* AUTHENTICATION GATEWAY */}
          <rect x="650" y="140" width="300" height="80" rx="10" className="box-auth" />
          <text x="800" y="170" className="text-title">Authentication Gateway</text>
          <text x="800" y="195" className="text-sm">New User or Existing User?</text>

          {/* SIGN UP BRANCH */}
          <path d="M 650 180 L 400 180 L 400 260" className="arrow-decision" />
          <text x="500" y="175" className="label">New User</text>
          
          <rect x="300" y="260" width="200" height="120" rx="10" className="box-auth" />
          <text x="400" y="290" className="text-title">Sign Up</text>
          <text x="400" y="315" className="text-sm">• Email & Password</text>
          <text x="400" y="335" className="text-sm">• Full Name</text>
          <text x="400" y="355" className="text-sm">• Gmail OAuth Option</text>
          <text x="400" y="375" className="text-sm">• Email Verification</text>

          <path d="M 500 320 L 650 320 L 650 350" className="arrow" />
          <text x="570" y="315" className="label">Success</text>

          {/* LOGIN BRANCH */}
          <path d="M 950 180 L 1200 180 L 1200 260" className="arrow-decision" />
          <text x="1100" y="175" className="label">Existing User</text>
          
          <rect x="1100" y="260" width="200" height="120" rx="10" className="box-auth" />
          <text x="1200" y="290" className="text-title">Login</text>
          <text x="1200" y="315" className="text-sm">• Email & Password</text>
          <text x="1200" y="335" className="text-sm">• Gmail OAuth</text>
          <text x="1200" y="355" className="text-sm">• JWT Token Generated</text>
          <text x="1200" y="375" className="text-sm">• Session Created</text>

          <path d="M 1100 320 L 950 320 L 950 350" className="arrow" />

          {/* AUTHENTICATED USER */}
          <rect x="650" y="350" width="300" height="60" rx="10" className="box-main" />
          <text x="800" y="385" className="text-title">AUTHENTICATED USER</text>

          <path d="M 800 410 L 800 470" className="arrow" />

          {/* MAIN DASHBOARD HUB */}
          <rect x="600" y="470" width="400" height="100" rx="10" className="box-main" />
          <text x="800" y="500" className="text-title">Main Dashboard Hub</text>
          <text x="800" y="525" className="text-sm">Central navigation to all features</text>
          <text x="800" y="545" className="text-xs">Dashboard | History | Settings | Documentation</text>

          {/* UNIFIED THREAT ANALYSIS */}
          <path d="M 600 520 L 200 520 L 200 610" className="arrow" />
          <text x="380" y="515" className="label">Navigate to Dashboard</text>
          
          <rect x="50" y="610" width="300" height="140" rx="10" className="box-feature" />
          <text x="200" y="640" className="text-title">Unified Threat Analysis</text>
          <text x="200" y="665" className="text-sm">Auto-Detection & Multi-Source</text>
          <text x="200" y="690" className="text-xs">• IP Address Detection</text>
          <text x="200" y="710" className="text-xs">• Domain Detection</text>
          <text x="200" y="730" className="text-xs">• URL Detection</text>
          <text x="200" y="750" className="text-xs">• Hash (MD5/SHA1/SHA256)</text>

          {/* INTELLIGENT ANALYSIS ENGINE */}
          <path d="M 200 750 L 200 830" className="arrow" />
          
          <rect x="50" y="830" width="300" height="180" rx="10" className="box-process" />
          <text x="200" y="860" className="text-title">Intelligent Analysis Engine</text>
          <text x="200" y="885" className="text-xs">1. Auto-detect input type (regex patterns)</text>
          <text x="200" y="905" className="text-xs">2. Query VirusTotal API (all types)</text>
          <text x="200" y="925" className="text-xs">3. Query AbuseIPDB API (IP/Domain/Subnet)</text>
          <text x="200" y="945" className="text-xs">4. Generate AI analysis (Qwen AI)</text>
          <text x="200" y="965" className="text-xs">5. Calculate threat correlations</text>
          <text x="200" y="985" className="text-xs">6. Generate mitigation actions</text>
          <text x="200" y="1005" className="text-xs">7. Store in KV database</text>

          {/* THREAT CORRELATION ENGINE */}
          <path d="M 350 920 L 500 920" className="arrow" />
          
          <rect x="500" y="830" width="280" height="180" rx="10" className="box-data" />
          <text x="640" y="860" className="text-title">Threat Correlation</text>
          <text x="640" y="880" className="text-title">Engine</text>
          <text x="640" y="905" className="text-xs">Cross-Reference Analysis:</text>
          <text x="640" y="925" className="text-xs">• VT Malicious Count</text>
          <text x="640" y="945" className="text-xs">• VT Suspicious Count</text>
          <text x="640" y="965" className="text-xs">• AbuseIPDB Score (0-100%)</text>
          <text x="640" y="985" className="text-xs">• Geographic Origin</text>
          <text x="640" y="1005" className="text-xs">→ Unified Threat Level</text>

          {/* RESULTS DISPLAY */}
          <path d="M 200 1010 L 200 1090" className="arrow" />
          
          <rect x="50" y="1090" width="300" height="200" rx="10" className="box-output" />
          <text x="200" y="1120" className="text-title">Structured Results Display</text>
          <text x="200" y="1145" className="text-xs">1. Threat Level (CRITICAL/HIGH/MEDIUM/LOW)</text>
          <text x="200" y="1165" className="text-xs">2. Total Alerts (vendor count)</text>
          <text x="200" y="1185" className="text-xs">3. High Alerts (malicious detections)</text>
          <text x="200" y="1205" className="text-xs">4. Medium Alerts (suspicious)</text>
          <text x="200" y="1225" className="text-xs">5. Threat Distribution (Pie Chart)</text>
          <text x="200" y="1245" className="text-xs">6. Detection Statistics (Bar Chart)</text>
          <text x="200" y="1265" className="text-xs">7. Security Vendor Analysis (Table)</text>
          <text x="200" y="1285" className="text-xs">+ More detailed sections...</text>

          {/* ADDITIONAL RESULT SECTIONS */}
          <path d="M 350 1190 L 500 1190" className="arrow" />
          
          <rect x="500" y="1090" width="280" height="200" rx="10" className="box-output" />
          <text x="640" y="1120" className="text-title">Advanced Analytics</text>
          <text x="640" y="1145" className="text-xs">8. AI-Generated Report</text>
          <text x="640" y="1165" className="text-xs">9. Correlation Insights (Radar Chart)</text>
          <text x="640" y="1185" className="text-xs">10. Mitigation Actions (Prioritized)</text>
          <text x="640" y="1205" className="text-xs">11. IP Reputation (if applicable)</text>
          <text x="640" y="1225" className="text-xs">12. Download Options (PDF/DOCX)</text>

          {/* HISTORY PAGE */}
          <path d="M 1000 520 L 1300 520 L 1300 610" className="arrow" />
          <text x="1170" y="515" className="label">Navigate</text>
          
          <rect x="1200" y="610" width="250" height="140" rx="10" className="box-feature" />
          <text x="1325" y="640" className="text-title">History Page</text>
          <text x="1325" y="665" className="text-sm">Download Tracking</text>
          <text x="1325" y="690" className="text-xs">• View All Downloads</text>
          <text x="1325" y="710" className="text-xs">• Re-download Reports</text>
          <text x="1325" y="730" className="text-xs">• Filter by Date/Type</text>
          <text x="1325" y="750" className="text-xs">• Analysis Details</text>

          {/* SETTINGS PAGE */}
          <path d="M 800 570 L 800 680 L 950 680" className="arrow" />
          <text x="860" y="670" className="label">Navigate</text>
          
          <rect x="950" y="610" width="200" height="140" rx="10" className="box-feature" />
          <text x="1050" y="640" className="text-title">Settings Page</text>
          <text x="1050" y="665" className="text-sm">User Management</text>
          <text x="1050" y="690" className="text-xs">• Edit Profile</text>
          <text x="1050" y="710" className="text-xs">• Update Name</text>
          <text x="1050" y="730" className="text-xs">• View Email</text>
          <text x="1050" y="750" className="text-xs">• Logout</text>

          {/* DOCUMENTATION PAGE */}
          <path d="M 950 680 L 950 830" className="arrow" />
          
          <rect x="850" y="830" width="200" height="140" rx="10" className="box-feature" />
          <text x="950" y="860" className="text-title">Documentation</text>
          <text x="950" y="885" className="text-sm">System Information</text>
          <text x="950" y="910" className="text-xs">• Flowchart</text>
          <text x="950" y="930" className="text-xs">• ERD Diagram</text>
          <text x="950" y="950" className="text-xs">• API Docs</text>
          <text x="950" y="970" className="text-xs">• Tech Stack</text>

          {/* REPORT DOWNLOAD */}
          <path d="M 200 1290 L 200 1370" className="arrow" />
          
          <rect x="100" y="1370" width="200" height="100" rx="10" className="box-process" />
          <text x="200" y="1400" className="text-title">Report Download</text>
          <text x="200" y="1425" className="text-xs">User clicks PDF or DOCX</text>
          <text x="200" y="1445" className="text-xs">→ Generate report content</text>
          <text x="200" y="1465" className="text-xs">→ Save to History</text>

          {/* SAVE TO HISTORY */}
          <path d="M 300 1420 L 400 1420 L 400 1520" className="arrow" />
          
          <rect x="300" y="1520" width="200" height="80" rx="10" className="box-data" />
          <text x="400" y="1550" className="text-title">Save to History DB</text>
          <text x="400" y="1575" className="text-xs">KV Store: history_[userId]_[ts]</text>

          {/* ACTIVITY LOGS */}
          <path d="M 640 1010 L 640 1400 L 800 1400 L 800 1520" className="arrow" />
          
          <rect x="700" y="1520" width="200" height="80" rx="10" className="box-data" />
          <text x="800" y="1550" className="text-title">Activity Logs</text>
          <text x="800" y="1575" className="text-xs">All actions tracked</text>

          {/* DATA FLOW TO STORAGE */}
          <path d="M 200 1470 L 200 1650" className="arrow" />
          <path d="M 400 1600 L 600 1760" className="arrow" />
          <path d="M 800 1600 L 800 1760" className="arrow" />
          
          {/* DATABASE LAYER */}
          <rect x="400" y="1760" width="800" height="180" rx="10" style={{ fill: '#0A0E27', stroke: '#00D9FF', strokeWidth: 3 }} />
          <text x="800" y="1790" className="text-title">Database Layer</text>
          <text x="800" y="1820" className="text-xs" style={{ fill: '#E2E8F0' }}>Supabase Auth: Users, Roles, Sessions</text>
          <text x="800" y="1845" className="text-xs" style={{ fill: '#E2E8F0' }}>KV Store: Analysis Requests, Results, Indicators</text>
          <text x="800" y="1870" className="text-xs" style={{ fill: '#E2E8F0' }}>Tables: VirusTotal Results, AbuseIPDB Results, Threat Scores</text>
          <text x="800" y="1895" className="text-xs" style={{ fill: '#E2E8F0' }}>Logs: Vendor Detections, AI Reports, Correlation Results</text>
          <text x="800" y="1920" className="text-xs" style={{ fill: '#E2E8F0' }}>Audit: Mitigation Recommendations, Activity Logs, Download History</text>

          {/* NAVIGATION LOOP */}
          <path d="M 50 1190 L 20 1190 L 20 520 L 50 520" className="arrow" strokeDasharray="5,5" />
          <text x="10" y="850" className="label" transform="rotate(-90 10 850)">Continue Analysis</text>

          {/* LOGOUT */}
          <path d="M 1050 750 L 1050 2050 L 950 2050" className="arrow" />
          <text x="1060" y="1400" className="label" transform="rotate(-90 1060 1400)">Logout</text>
          
          <rect x="750" y="2050" width="200" height="80" rx="10" className="box-end" />
          <text x="850" y="2080" className="text-title">LOGOUT</text>
          <text x="850" y="2105" className="text-xs">Session Terminated</text>

          {/* END */}
          <path d="M 850 2130 L 850 2180" className="arrow" />
          
          <ellipse cx="850" cy="2220" rx="100" ry="40" className="box-end" />
          <text x="850" y="2230" className="text-title">END</text>

          {/* RETURN TO START */}
          <path d="M 950 2220 L 1500 2220 L 1500 40 L 900 40" className="arrow" strokeDasharray="5,5" />
          <text x="1510" y="1130" className="label" transform="rotate(-90 1510 1130)">Re-authenticate</text>

          {/* LEGEND */}
          <g transform="translate(1150, 1760)">
            <rect width="350" height="180" rx="5" style={{ fill: '#F8F9FB', stroke: '#64748B', strokeWidth: 1 }} />
            <text x="175" y="25" style={{ fill: '#0F1419', fontSize: '14px', fontWeight: '700', textAnchor: 'middle' }}>
              Legend
            </text>
            
            <rect x="20" y="40" width="80" height="25" rx="5" className="box-start" />
            <text x="120" y="57" style={{ fill: '#0F1419', fontSize: '11px' }}>Start/End</text>
            
            <rect x="20" y="75" width="80" height="25" rx="5" className="box-auth" />
            <text x="120" y="92" style={{ fill: '#0F1419', fontSize: '11px' }}>Authentication</text>
            
            <rect x="20" y="110" width="80" height="25" rx="5" className="box-feature" />
            <text x="120" y="127" style={{ fill: '#0F1419', fontSize: '11px' }}>Features</text>
            
            <rect x="190" y="40" width="80" height="25" rx="5" className="box-process" />
            <text x="290" y="57" style={{ fill: '#0F1419', fontSize: '11px' }}>Processing</text>
            
            <rect x="190" y="75" width="80" height="25" rx="5" className="box-data" />
            <text x="290" y="92" style={{ fill: '#0F1419', fontSize: '11px' }}>Data/Storage</text>
            
            <rect x="190" y="110" width="80" height="25" rx="5" className="box-output" />
            <text x="290" y="127" style={{ fill: '#0F1419', fontSize: '11px' }}>Output/Results</text>
            
            <path d="M 20 150 L 100 150" className="arrow" />
            <text x="120" y="155" style={{ fill: '#0F1419', fontSize: '11px' }}>Data Flow</text>
            
            <path d="M 190 150 L 270 150" className="arrow" strokeDasharray="5,5" />
            <text x="290" y="155" style={{ fill: '#0F1419', fontSize: '11px' }}>Loop/Return</text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}