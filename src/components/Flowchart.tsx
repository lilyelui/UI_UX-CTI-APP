import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export function Flowchart() {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">CTI Platform - Complete Feature Flow</CardTitle>
        <CardDescription className="text-sm">
          End-to-end user journey from sign-up to logout
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <svg viewBox="0 0 1200 1800" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          {/* Define styles */}
          <defs>
            <style>
              {`
                .flow-box { fill: #0052FF; stroke: #003DA3; stroke-width: 2; }
                .flow-box-auth { fill: #6366F1; stroke: #4F46E5; stroke-width: 2; }
                .flow-box-feature { fill: #00D9FF; stroke: #00B8D9; stroke-width: 2; }
                .flow-box-action { fill: #00E676; stroke: #00C853; stroke-width: 2; }
                .flow-box-end { fill: #FF3B5C; stroke: #E91E63; stroke-width: 2; }
                .flow-text { fill: white; font-size: 14px; font-weight: 600; text-anchor: middle; }
                .flow-text-sm { fill: white; font-size: 12px; text-anchor: middle; }
                .flow-arrow { stroke: #64748B; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
                .flow-label { fill: #64748B; font-size: 11px; text-anchor: middle; font-style: italic; }
              `}
            </style>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#64748B" />
            </marker>
          </defs>

          {/* Start */}
          <rect x="500" y="20" width="200" height="60" rx="30" className="flow-box" />
          <text x="600" y="55" className="flow-text">START</text>

          {/* Arrow to Auth */}
          <path d="M 600 80 L 600 120" className="flow-arrow" />

          {/* Authentication Choice */}
          <rect x="450" y="120" width="300" height="80" rx="10" className="flow-box-auth" />
          <text x="600" y="150" className="flow-text">User Authentication</text>
          <text x="600" y="175" className="flow-text-sm">Choose Sign-up or Login</text>

          {/* Sign-up branch */}
          <path d="M 450 160 L 250 160 L 250 240" className="flow-arrow" />
          <text x="330" y="155" className="flow-label">New User</text>
          
          <rect x="150" y="240" width="200" height="100" rx="10" className="flow-box-auth" />
          <text x="250" y="270" className="flow-text">Sign Up</text>
          <text x="250" y="295" className="flow-text-sm">- Enter Email</text>
          <text x="250" y="315" className="flow-text-sm">- Enter Password</text>
          <text x="250" y="335" className="flow-text-sm">- Enter Name</text>

          {/* Sign-up to Login */}
          <path d="M 350 290 L 450 290 L 450 260" className="flow-arrow" />
          <text x="400" y="285" className="flow-label">Success</text>

          {/* Login branch */}
          <path d="M 750 160 L 950 160 L 950 240" className="flow-arrow" />
          <text x="870" y="155" className="flow-label">Existing User</text>
          
          <rect x="850" y="240" width="200" height="100" rx="10" className="flow-box-auth" />
          <text x="950" y="270" className="flow-text">Login</text>
          <text x="950" y="295" className="flow-text-sm">- Enter Email</text>
          <text x="950" y="315" className="flow-text-sm">- Enter Password</text>
          <text x="950" y="335" className="flow-text-sm">- Gmail Auth</text>

          {/* Login success */}
          <path d="M 950 340 L 950 390 L 600 390 L 600 420" className="flow-arrow" />
          <path d="M 600 200 L 600 420" className="flow-arrow" />
          
          {/* Authenticated */}
          <rect x="450" y="420" width="300" height="60" rx="10" className="flow-box" />
          <text x="600" y="455" className="flow-text">Authenticated User</text>

          {/* Arrow to Dashboard */}
          <path d="M 600 480 L 600 520" className="flow-arrow" />

          {/* Main Dashboard */}
          <rect x="400" y="520" width="400" height="80" rx="10" className="flow-box-feature" />
          <text x="600" y="550" className="flow-text">DASHBOARD PAGE</text>
          <text x="600" y="575" className="flow-text-sm">Threat Analysis Hub</text>

          {/* Dashboard Features */}
          <path d="M 400 560 L 100 560 L 100 640" className="flow-arrow" />
          <rect x="20" y="640" width="160" height="200" rx="10" className="flow-box-action" />
          <text x="100" y="665" className="flow-text-sm">Threat Analysis</text>
          <text x="100" y="690" className="flow-text-sm" style={{ fontSize: '10px' }}>• File Hash Check</text>
          <text x="100" y="710" className="flow-text-sm" style={{ fontSize: '10px' }}>• Domain Check</text>
          <text x="100" y="730" className="flow-text-sm" style={{ fontSize: '10px' }}>• IP Address Check</text>
          <text x="100" y="750" className="flow-text-sm" style={{ fontSize: '10px' }}>• URL Analysis</text>
          <text x="100" y="770" className="flow-text-sm" style={{ fontSize: '10px' }}>• VirusTotal API</text>
          <text x="100" y="790" className="flow-text-sm" style={{ fontSize: '10px' }}>• AbuseIPDB API</text>
          <text x="100" y="810" className="flow-text-sm" style={{ fontSize: '10px' }}>• AI Report</text>
          <text x="100" y="830" className="flow-text-sm" style={{ fontSize: '10px' }}>• PDF/DOCX Export</text>

          <path d="M 600 600 L 600 640" className="flow-arrow" />
          <rect x="520" y="640" width="160" height="200" rx="10" className="flow-box-action" />
          <text x="600" y="665" className="flow-text-sm">AbuseIPDB Check</text>
          <text x="600" y="690" className="flow-text-sm" style={{ fontSize: '10px' }}>• IP Check</text>
          <text x="600" y="710" className="flow-text-sm" style={{ fontSize: '10px' }}>• Domain Check</text>
          <text x="600" y="730" className="flow-text-sm" style={{ fontSize: '10px' }}>• Subnet Check</text>
          <text x="600" y="750" className="flow-text-sm" style={{ fontSize: '10px' }}>• ASN Lookup</text>
          <text x="600" y="770" className="flow-text-sm" style={{ fontSize: '10px' }}>• Abuse Score</text>
          <text x="600" y="790" className="flow-text-sm" style={{ fontSize: '10px' }}>• Report History</text>
          <text x="600" y="810" className="flow-text-sm" style={{ fontSize: '10px' }}>• Threat Level</text>
          <text x="600" y="830" className="flow-text-sm" style={{ fontSize: '10px' }}>• Mitigation Tips</text>

          {/* History Page */}
          <path d="M 800 560 L 1000 560 L 1000 640" className="flow-arrow" />
          <text x="920" y="555" className="flow-label">Navigate</text>
          <rect x="920" y="640" width="160" height="120" rx="10" className="flow-box-feature" />
          <text x="1000" y="665" className="flow-text">HISTORY PAGE</text>
          <text x="1000" y="690" className="flow-text-sm" style={{ fontSize: '10px' }}>• View Downloads</text>
          <text x="1000" y="710" className="flow-text-sm" style={{ fontSize: '10px' }}>• Re-download</text>
          <text x="1000" y="730" className="flow-text-sm" style={{ fontSize: '10px' }}>• Filter & Search</text>
          <text x="1000" y="750" className="flow-text-sm" style={{ fontSize: '10px' }}>• Analysis Details</text>

          {/* Settings Page */}
          <path d="M 600 600 L 300 850" className="flow-arrow" />
          <text x="420" y="720" className="flow-label">Navigate</text>
          <rect x="220" y="900" width="160" height="120" rx="10" className="flow-box-feature" />
          <text x="300" y="925" className="flow-text">SETTINGS PAGE</text>
          <text x="300" y="950" className="flow-text-sm" style={{ fontSize: '10px' }}>• Edit Profile</text>
          <text x="300" y="970" className="flow-text-sm" style={{ fontSize: '10px' }}>• Update Name</text>
          <text x="300" y="990" className="flow-text-sm" style={{ fontSize: '10px' }}>• View Email</text>
          <text x="300" y="1010" className="flow-text-sm" style={{ fontSize: '10px' }}>• Logout</text>

          {/* Analysis Results */}
          <path d="M 100 840 L 100 920 L 600 920 L 600 960" className="flow-arrow" />
          <path d="M 600 840 L 600 960" className="flow-arrow" />
          
          <rect x="450" y="960" width="300" height="100" rx="10" className="flow-box-action" />
          <text x="600" y="990" className="flow-text">Analysis Results Display</text>
          <text x="600" y="1015" className="flow-text-sm">Charts, Tables, AI Report</text>
          <text x="600" y="1040" className="flow-text-sm">Mitigation Actions</text>

          {/* Download */}
          <path d="M 600 1060 L 600 1100" className="flow-arrow" />
          <rect x="450" y="1100" width="300" height="80" rx="10" className="flow-box-action" />
          <text x="600" y="1130" className="flow-text">Download Report</text>
          <text x="600" y="1155" className="flow-text-sm">PDF or DOCX Format</text>

          {/* Save to History */}
          <path d="M 750 1140 L 900 1140 L 900 1200" className="flow-arrow" />
          <text x="840" y="1135" className="flow-label">Auto Save</text>
          <rect x="820" y="1200" width="160" height="60" rx="10" className="flow-box-action" />
          <text x="900" y="1235" className="flow-text-sm">Save to History</text>

          {/* Return to Dashboard */}
          <path d="M 600 1180 L 600 1260" className="flow-arrow" />
          <rect x="450" y="1260" width="300" height="60" rx="10" className="flow-box-feature" />
          <text x="600" y="1295" className="flow-text">Continue or Navigate</text>

          {/* Navigation Loop */}
          <path d="M 450 1290 L 200 1290 L 200 560 L 400 560" className="flow-arrow" />
          <text x="210" y="900" className="flow-label" transform="rotate(-90 210 900)">New Analysis</text>

          {/* Logout */}
          <path d="M 300 1020 L 300 1340 L 450 1340" className="flow-arrow" />
          <text x="350" y="1180" className="flow-label">Logout</text>
          
          <rect x="450" y="1340" width="300" height="80" rx="10" className="flow-box-end" />
          <text x="600" y="1370" className="flow-text">LOGOUT</text>
          <text x="600" y="1395" className="flow-text-sm">Session Terminated</text>

          {/* End */}
          <path d="M 600 1420 L 600 1460" className="flow-arrow" />
          <rect x="500" y="1460" width="200" height="60" rx="30" className="flow-box-end" />
          <text x="600" y="1495" className="flow-text">END</text>

          {/* Back to Start */}
          <path d="M 700 1490 L 1100 1490 L 1100 50 L 700 50" className="flow-arrow" strokeDasharray="5,5" />
          <text x="1110" y="770" className="flow-label" transform="rotate(-90 1110 770)">Return to Login</text>
        </svg>
      </CardContent>
    </Card>
  );
}
