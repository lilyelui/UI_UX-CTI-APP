import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export function ComprehensiveERD() {
  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Comprehensive Entity Relationship Diagram</CardTitle>
        <CardDescription className="text-sm">
          Complete database schema with all entities, relationships, and constraints
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <svg viewBox="0 0 1800 2200" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>
              {`
                .entity { fill: #1E293B; stroke: #00D9FF; stroke-width: 2; }
                .entity-header { fill: #0052FF; }
                .entity-title { fill: white; font-size: 16px; font-weight: 700; text-anchor: middle; }
                .attr { fill: #E2E8F0; font-size: 11px; }
                .attr-pk { fill: #FFB020; font-weight: 700; }
                .attr-fk { fill: #00E676; font-weight: 600; }
                .attr-type { fill: #94A3B8; font-size: 10px; }
                .relationship { stroke: #00D9FF; stroke-width: 2; fill: none; }
                .rel-label { fill: #FFB020; font-size: 11px; text-anchor: middle; font-weight: 600; }
                .cardinality { fill: #00E676; font-size: 12px; font-weight: 700; }
              `}
            </style>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#00D9FF" />
            </marker>
            <marker id="crow-many" markerWidth="15" markerHeight="12" refX="14" refY="6" orient="auto">
              <path d="M 0 6 L 10 0 M 0 6 L 10 12 M 10 0 L 14 6 L 10 12" stroke="#00D9FF" strokeWidth="2" fill="none" />
            </marker>
          </defs>

          {/* USERS */}
          <g id="users">
            <rect x="50" y="50" width="350" height="380" rx="8" className="entity" />
            <rect x="50" y="50" width="350" height="40" rx="8" className="entity-header" />
            <text x="225" y="77" className="entity-title">USERS</text>
            
            <text x="70" y="115" className="attr-pk">🔑 id</text>
            <text x="220" y="115" className="attr-type">UUID PRIMARY KEY</text>
            <text x="70" y="140" className="attr">email</text>
            <text x="220" y="140" className="attr-type">VARCHAR(255) UNIQUE NOT NULL</text>
            <text x="70" y="165" className="attr">password_hash</text>
            <text x="220" y="165" className="attr-type">VARCHAR(255) NOT NULL</text>
            <text x="70" y="190" className="attr">full_name</text>
            <text x="220" y="190" className="attr-type">VARCHAR(255)</text>
            <text x="70" y="215" className="attr">role_id</text>
            <text x="220" y="215" className="attr-type">UUID FOREIGN KEY → Roles</text>
            <text x="70" y="240" className="attr">email_verified</text>
            <text x="220" y="240" className="attr-type">BOOLEAN DEFAULT FALSE</text>
            <text x="70" y="265" className="attr">last_login_at</text>
            <text x="220" y="265" className="attr-type">TIMESTAMP</text>
            <text x="70" y="290" className="attr">login_count</text>
            <text x="220" y="290" className="attr-type">INTEGER DEFAULT 0</text>
            <text x="70" y="315" className="attr">status</text>
            <text x="220" y="315" className="attr-type">ENUM(active, suspended, deleted)</text>
            <text x="70" y="340" className="attr">created_at</text>
            <text x="220" y="340" className="attr-type">TIMESTAMP DEFAULT NOW()</text>
            <text x="70" y="365" className="attr">updated_at</text>
            <text x="220" y="365" className="attr-type">TIMESTAMP</text>
            <text x="70" y="390" className="attr">user_metadata</text>
            <text x="220" y="390" className="attr-type">JSONB</text>
            <text x="70" y="415" className="attr">preferences</text>
            <text x="220" y="415" className="attr-type">JSONB</text>
          </g>

          {/* ROLES */}
          <g id="roles">
            <rect x="500" y="50" width="280" height="200" rx="8" className="entity" />
            <rect x="500" y="50" width="280" height="40" rx="8" className="entity-header" />
            <text x="640" y="77" className="entity-title">ROLES</text>
            
            <text x="520" y="115" className="attr-pk">🔑 id</text>
            <text x="680" y="115" className="attr-type">UUID PRIMARY KEY</text>
            <text x="520" y="140" className="attr">name</text>
            <text x="680" y="140" className="attr-type">VARCHAR(50) UNIQUE</text>
            <text x="530" y="160" className="attr-type">admin, analyst, viewer</text>
            <text x="520" y="185" className="attr">permissions</text>
            <text x="680" y="185" className="attr-type">JSONB</text>
            <text x="520" y="210" className="attr">description</text>
            <text x="680" y="210" className="attr-type">TEXT</text>
            <text x="520" y="235" className="attr">created_at</text>
            <text x="680" y="235" className="attr-type">TIMESTAMP</text>
          </g>

          {/* ANALYSIS_REQUESTS */}
          <g id="analysis-requests">
            <rect x="50" y="500" width="380" height="360" rx="8" className="entity" />
            <rect x="50" y="500" width="380" height="40" rx="8" className="entity-header" />
            <text x="240" y="527" className="entity-title">ANALYSIS_REQUESTS</text>
            
            <text x="70" y="565" className="attr-pk">🔑 id</text>
            <text x="250" y="565" className="attr-type">UUID PRIMARY KEY</text>
            <text x="70" y="590" className="attr-fk">🔗 user_id</text>
            <text x="250" y="590" className="attr-type">UUID FK → Users(id)</text>
            <text x="70" y="615" className="attr-fk">🔗 indicator_id</text>
            <text x="250" y="615" className="attr-type">UUID FK → Indicators(id)</text>
            <text x="70" y="640" className="attr">detected_type</text>
            <text x="250" y="640" className="attr-type">VARCHAR(50)</text>
            <text x="80" y="660" className="attr-type">ip, domain, url, hash, subnet</text>
            <text x="70" y="685" className="attr">status</text>
            <text x="250" y="685" className="attr-type">ENUM</text>
            <text x="80" y="705" className="attr-type">pending, processing, completed, failed</text>
            <text x="70" y="730" className="attr">priority</text>
            <text x="250" y="730" className="attr-type">ENUM(low, medium, high, critical)</text>
            <text x="70" y="755" className="attr">started_at</text>
            <text x="250" y="755" className="attr-type">TIMESTAMP</text>
            <text x="70" y="780" className="attr">completed_at</text>
            <text x="250" y="780" className="attr-type">TIMESTAMP</text>
            <text x="70" y="805" className="attr">created_at</text>
            <text x="250" y="805" className="attr-type">TIMESTAMP DEFAULT NOW()</text>
            <text x="70" y="830" className="attr">error_message</text>
            <text x="250" y="830" className="attr-type">TEXT</text>
            <text x="70" y="855" className="attr">request_metadata</text>
            <text x="250" y="855" className="attr-type">JSONB</text>
          </g>

          {/* INDICATORS */}
          <g id="indicators">
            <rect x="520" y="500" width="350" height="280" rx="8" className="entity" />
            <rect x="520" y="500" width="350" height="40" rx="8" className="entity-header" />
            <text x="695" y="527" className="entity-title">INDICATORS</text>
            
            <text x="540" y="565" className="attr-pk">🔑 id</text>
            <text x="730" y="565" className="attr-type">UUID PRIMARY KEY</text>
            <text x="540" y="590" className="attr">value</text>
            <text x="730" y="590" className="attr-type">VARCHAR(500) UNIQUE</text>
            <text x="540" y="615" className="attr">type</text>
            <text x="730" y="615" className="attr-type">VARCHAR(50)</text>
            <text x="550" y="635" className="attr-type">ip, ipv6, domain, url, hash-md5, hash-sha1, hash-sha256, subnet, asn</text>
            <text x="540" y="660" className="attr">normalized_value</text>
            <text x="730" y="660" className="attr-type">VARCHAR(500)</text>
            <text x="540" y="685" className="attr">first_seen</text>
            <text x="730" y="685" className="attr-type">TIMESTAMP</text>
            <text x="540" y="710" className="attr">last_seen</text>
            <text x="730" y="710" className="attr-type">TIMESTAMP</text>
            <text x="540" y="735" className="attr">analysis_count</text>
            <text x="730" y="735" className="attr-type">INTEGER DEFAULT 0</text>
            <text x="540" y="760" className="attr">tags</text>
            <text x="730" y="760" className="attr-type">TEXT[]</text>
          </g>

          {/* VIRUSTOTAL_RESULTS */}
          <g id="vt-results">
            <rect x="960" y="50" width="380" height="340" rx="8" className="entity" />
            <rect x="960" y="50" width="380" height="40" rx="8" className="entity-header" />
            <text x="1150" y="77" className="entity-title">VIRUSTOTAL_RESULTS</text>
            
            <text x="980" y="115" className="attr-pk">🔑 id</text>
            <text x="1200" y="115" className="attr-type">UUID PRIMARY KEY</text>
            <text x="980" y="140" className="attr-fk">🔗 analysis_request_id</text>
            <text x="1200" y="140" className="attr-type">UUID FK</text>
            <text x="980" y="165" className="attr-fk">🔗 indicator_id</text>
            <text x="1200" y="165" className="attr-type">UUID FK</text>
            <text x="980" y="190" className="attr">malicious_count</text>
            <text x="1200" y="190" className="attr-type">INTEGER</text>
            <text x="980" y="215" className="attr">suspicious_count</text>
            <text x="1200" y="215" className="attr-type">INTEGER</text>
            <text x="980" y="240" className="attr">harmless_count</text>
            <text x="1200" y="240" className="attr-type">INTEGER</text>
            <text x="980" y="265" className="attr">undetected_count</text>
            <text x="1200" y="265" className="attr-type">INTEGER</text>
            <text x="980" y="290" className="attr">total_vendors</text>
            <text x="1200" y="290" className="attr-type">INTEGER</text>
            <text x="980" y="315" className="attr">raw_response</text>
            <text x="1200" y="315" className="attr-type">JSONB</text>
            <text x="980" y="340" className="attr">queried_at</text>
            <text x="1200" y="340" className="attr-type">TIMESTAMP</text>
            <text x="980" y="365" className="attr">created_at</text>
            <text x="1200" y="365" className="attr-type">TIMESTAMP</text>
          </g>

          {/* ABUSEIPDB_RESULTS */}
          <g id="abuse-results">
            <rect x="1420" y="50" width="350" height="340" rx="8" className="entity" />
            <rect x="1420" y="50" width="350" height="40" rx="8" className="entity-header" />
            <text x="1595" y="77" className="entity-title">ABUSEIPDB_RESULTS</text>
            
            <text x="1440" y="115" className="attr-pk">🔑 id</text>
            <text x="1640" y="115" className="attr-type">UUID PRIMARY KEY</text>
            <text x="1440" y="140" className="attr-fk">🔗 analysis_request_id</text>
            <text x="1640" y="140" className="attr-type">UUID FK</text>
            <text x="1440" y="165" className="attr-fk">🔗 indicator_id</text>
            <text x="1640" y="165" className="attr-type">UUID FK</text>
            <text x="1440" y="190" className="attr">abuse_score</text>
            <text x="1640" y="190" className="attr-type">INTEGER (0-100)</text>
            <text x="1440" y="215" className="attr">total_reports</text>
            <text x="1640" y="215" className="attr-type">INTEGER</text>
            <text x="1440" y="240" className="attr">country_code</text>
            <text x="1640" y="240" className="attr-type">VARCHAR(2)</text>
            <text x="1440" y="265" className="attr">isp</text>
            <text x="1640" y="265" className="attr-type">VARCHAR(255)</text>
            <text x="1440" y="290" className="attr">is_whitelisted</text>
            <text x="1640" y="290" className="attr-type">BOOLEAN</text>
            <text x="1440" y="315" className="attr">raw_response</text>
            <text x="1640" y="315" className="attr-type">JSONB</text>
            <text x="1440" y="340" className="attr">queried_at</text>
            <text x="1640" y="340" className="attr-type">TIMESTAMP</text>
            <text x="1440" y="365" className="attr">created_at</text>
            <text x="1640" y="365" className="attr-type">TIMESTAMP</text>
          </g>

          {/* THREAT_SCORES */}
          <g id="threat-scores">
            <rect x="960" y="450" width="380" height="300" rx="8" className="entity" />
            <rect x="960" y="450" width="380" height="40" rx="8" className="entity-header" />
            <text x="1150" y="477" className="entity-title">THREAT_SCORES</text>
            
            <text x="980" y="515" className="attr-pk">🔑 id</text>
            <text x="1200" y="515" className="attr-type">UUID PRIMARY KEY</text>
            <text x="980" y="540" className="attr-fk">🔗 analysis_request_id</text>
            <text x="1200" y="540" className="attr-type">UUID FK UNIQUE</text>
            <text x="980" y="565" className="attr">threat_level</text>
            <text x="1200" y="565" className="attr-type">ENUM</text>
            <text x="990" y="585" className="attr-type">critical, high, medium, low</text>
            <text x="980" y="610" className="attr">confidence_score</text>
            <text x="1200" y="610" className="attr-type">DECIMAL(5,2)</text>
            <text x="980" y="635" className="attr">composite_score</text>
            <text x="1200" y="635" className="attr-type">DECIMAL(5,2)</text>
            <text x="980" y="660" className="attr">vt_weight</text>
            <text x="1200" y="660" className="attr-type">DECIMAL(3,2)</text>
            <text x="980" y="685" className="attr">abuse_weight</text>
            <text x="1200" y="685" className="attr-type">DECIMAL(3,2)</text>
            <text x="980" y="710" className="attr">calculated_at</text>
            <text x="1200" y="710" className="attr-type">TIMESTAMP</text>
            <text x="980" y="735" className="attr">score_metadata</text>
            <text x="1200" y="735" className="attr-type">JSONB</text>
          </g>

          {/* VENDOR_DETECTIONS */}
          <g id="vendor-detections">
            <rect x="1420" y="450" width="350" height="280" rx="8" className="entity" />
            <rect x="1420" y="450" width="350" height="40" rx="8" className="entity-header" />
            <text x="1595" y="477" className="entity-title">VENDOR_DETECTIONS</text>
            
            <text x="1440" y="515" className="attr-pk">🔑 id</text>
            <text x="1640" y="515" className="attr-type">UUID PRIMARY KEY</text>
            <text x="1440" y="540" className="attr-fk">🔗 vt_result_id</text>
            <text x="1640" y="540" className="attr-type">UUID FK</text>
            <text x="1440" y="565" className="attr">vendor_name</text>
            <text x="1640" y="565" className="attr-type">VARCHAR(100)</text>
            <text x="1440" y="590" className="attr">category</text>
            <text x="1640" y="590" className="attr-type">VARCHAR(50)</text>
            <text x="1450" y="610" className="attr-type">malicious, suspicious, harmless, undetected</text>
            <text x="1440" y="635" className="attr">result</text>
            <text x="1640" y="635" className="attr-type">VARCHAR(255)</text>
            <text x="1440" y="660" className="attr">engine_version</text>
            <text x="1640" y="660" className="attr-type">VARCHAR(50)</text>
            <text x="1440" y="685" className="attr">method</text>
            <text x="1640" y="685" className="attr-type">VARCHAR(50)</text>
            <text x="1440" y="710" className="attr">created_at</text>
            <text x="1640" y="710" className="attr-type">TIMESTAMP</text>
          </g>

          {/* AI_REPORTS */}
          <g id="ai-reports">
            <rect x="520" y="930" width="350" height="260" rx="8" className="entity" />
            <rect x="520" y="930" width="350" height="40" rx="8" className="entity-header" />
            <text x="695" y="957" className="entity-title">AI_REPORTS</text>
            
            <text x="540" y="995" className="attr-pk">🔑 id</text>
            <text x="730" y="995" className="attr-type">UUID PRIMARY KEY</text>
            <text x="540" y="1020" className="attr-fk">🔗 analysis_request_id</text>
            <text x="730" y="1020" className="attr-type">UUID FK UNIQUE</text>
            <text x="540" y="1045" className="attr">report_content</text>
            <text x="730" y="1045" className="attr-type">TEXT</text>
            <text x="540" y="1070" className="attr">model_used</text>
            <text x="730" y="1070" className="attr-type">VARCHAR(50)</text>
            <text x="540" y="1095" className="attr">tokens_used</text>
            <text x="730" y="1095" className="attr-type">INTEGER</text>
            <text x="540" y="1120" className="attr">generated_at</text>
            <text x="730" y="1120" className="attr-type">TIMESTAMP</text>
            <text x="540" y="1145" className="attr">quality_score</text>
            <text x="730" y="1145" className="attr-type">DECIMAL(3,2)</text>
            <text x="540" y="1170" className="attr">report_metadata</text>
            <text x="730" y="1170" className="attr-type">JSONB</text>
          </g>

          {/* CORRELATION_RESULTS */}
          <g id="correlation">
            <rect x="960" y="810" width="380" height="320" rx="8" className="entity" />
            <rect x="960" y="810" width="380" height="40" rx="8" className="entity-header" />
            <text x="1150" y="837" className="entity-title">CORRELATION_RESULTS</text>
            
            <text x="980" y="875" className="attr-pk">🔑 id</text>
            <text x="1200" y="875" className="attr-type">UUID PRIMARY KEY</text>
            <text x="980" y="900" className="attr-fk">🔗 analysis_request_id</text>
            <text x="1200" y="900" className="attr-type">UUID FK UNIQUE</text>
            <text x="980" y="925" className="attr">insights</text>
            <text x="1200" y="925" className="attr-type">TEXT</text>
            <text x="980" y="950" className="attr">source_agreement</text>
            <text x="1200" y="950" className="attr-type">VARCHAR(50)</text>
            <text x="980" y="975" className="attr">confidence_level</text>
            <text x="1200" y="975" className="attr-type">DECIMAL(5,2)</text>
            <text x="980" y="1000" className="attr">false_positive_likelihood</text>
            <text x="1200" y="1000" className="attr-type">VARCHAR(50)</text>
            <text x="980" y="1025" className="attr">verdict</text>
            <text x="1200" y="1025" className="attr-type">TEXT</text>
            <text x="980" y="1050" className="attr">radar_chart_data</text>
            <text x="1200" y="1050" className="attr-type">JSONB</text>
            <text x="980" y="1075" className="attr">calculated_at</text>
            <text x="1200" y="1075" className="attr-type">TIMESTAMP</text>
            <text x="980" y="1100" className="attr">correlation_metadata</text>
            <text x="1200" y="1100" className="attr-type">JSONB</text>
          </g>

          {/* MITIGATION_RECOMMENDATIONS */}
          <g id="mitigation">
            <rect x="50" y="930" width="400" height="280" rx="8" className="entity" />
            <rect x="50" y="930" width="400" height="40" rx="8" className="entity-header" />
            <text x="250" y="957" className="entity-title">MITIGATION_RECOMMENDATIONS</text>
            
            <text x="70" y="995" className="attr-pk">🔑 id</text>
            <text x="300" y="995" className="attr-type">UUID PRIMARY KEY</text>
            <text x="70" y="1020" className="attr-fk">🔗 analysis_request_id</text>
            <text x="300" y="1020" className="attr-type">UUID FK</text>
            <text x="70" y="1045" className="attr">action</text>
            <text x="300" y="1045" className="attr-type">TEXT NOT NULL</text>
            <text x="70" y="1070" className="attr">priority</text>
            <text x="300" y="1070" className="attr-type">ENUM</text>
            <text x="80" y="1090" className="attr-type">immediate, urgent, high, medium, low</text>
            <text x="70" y="1115" className="attr">category</text>
            <text x="300" y="1115" className="attr-type">VARCHAR(50)</text>
            <text x="80" y="1135" className="attr-type">block, monitor, investigate, document</text>
            <text x="70" y="1160" className="attr">status</text>
            <text x="300" y="1160" className="attr-type">ENUM(pending, applied, skipped)</text>
            <text x="70" y="1185" className="attr">created_at</text>
            <text x="300" y="1185" className="attr-type">TIMESTAMP</text>
          </g>

          {/* ALERTS */}
          <g id="alerts">
            <rect x="1420" y="790" width="350" height="300" rx="8" className="entity" />
            <rect x="1420" y="790" width="350" height="40" rx="8" className="entity-header" />
            <text x="1595" y="817" className="entity-title">ALERTS</text>
            
            <text x="1440" y="855" className="attr-pk">🔑 id</text>
            <text x="1640" y="855" className="attr-type">UUID PRIMARY KEY</text>
            <text x="1440" y="880" className="attr-fk">🔗 user_id</text>
            <text x="1640" y="880" className="attr-type">UUID FK</text>
            <text x="1440" y="905" className="attr-fk">🔗 analysis_request_id</text>
            <text x="1640" y="905" className="attr-type">UUID FK</text>
            <text x="1440" y="930" className="attr">severity</text>
            <text x="1640" y="930" className="attr-type">ENUM</text>
            <text x="1450" y="950" className="attr-type">critical, high, medium, low, info</text>
            <text x="1440" y="975" className="attr">title</text>
            <text x="1640" y="975" className="attr-type">VARCHAR(255)</text>
            <text x="1440" y="1000" className="attr">message</text>
            <text x="1640" y="1000" className="attr-type">TEXT</text>
            <text x="1440" y="1025" className="attr">read</text>
            <text x="1640" y="1025" className="attr-type">BOOLEAN DEFAULT FALSE</text>
            <text x="1440" y="1050" className="attr">dismissed</text>
            <text x="1640" y="1050" className="attr-type">BOOLEAN DEFAULT FALSE</text>
            <text x="1440" y="1075" className="attr">created_at</text>
            <text x="1640" y="1075" className="attr-type">TIMESTAMP</text>
          </g>

          {/* DOWNLOAD_HISTORY */}
          <g id="downloads">
            <rect x="50" y="1280" width="400" height="280" rx="8" className="entity" />
            <rect x="50" y="1280" width="400" height="40" rx="8" className="entity-header" />
            <text x="250" y="1307" className="entity-title">DOWNLOAD_HISTORY</text>
            
            <text x="70" y="1345" className="attr-pk">🔑 id</text>
            <text x="300" y="1345" className="attr-type">UUID PRIMARY KEY</text>
            <text x="70" y="1370" className="attr-fk">🔗 user_id</text>
            <text x="300" y="1370" className="attr-type">UUID FK</text>
            <text x="70" y="1395" className="attr-fk">🔗 analysis_request_id</text>
            <text x="300" y="1395" className="attr-type">UUID FK</text>
            <text x="70" y="1420" className="attr">file_name</text>
            <text x="300" y="1420" className="attr-type">VARCHAR(255)</text>
            <text x="70" y="1445" className="attr">format</text>
            <text x="300" y="1445" className="attr-type">ENUM(pdf, docx, json, csv)</text>
            <text x="70" y="1470" className="attr">file_size</text>
            <text x="300" y="1470" className="attr-type">BIGINT (bytes)</text>
            <text x="70" y="1495" className="attr">download_count</text>
            <text x="300" y="1495" className="attr-type">INTEGER DEFAULT 1</text>
            <text x="70" y="1520" className="attr">downloaded_at</text>
            <text x="300" y="1520" className="attr-type">TIMESTAMP</text>
            <text x="70" y="1545" className="attr">created_at</text>
            <text x="300" y="1545" className="attr-type">TIMESTAMP</text>
          </g>

          {/* ACTIVITY_LOGS */}
          <g id="activity-logs">
            <rect x="520" y="1280" width="400" height="300" rx="8" className="entity" />
            <rect x="520" y="1280" width="400" height="40" rx="8" className="entity-header" />
            <text x="720" y="1307" className="entity-title">ACTIVITY_LOGS</text>
            
            <text x="540" y="1345" className="attr-pk">🔑 id</text>
            <text x="760" y="1345" className="attr-type">UUID PRIMARY KEY</text>
            <text x="540" y="1370" className="attr-fk">🔗 user_id</text>
            <text x="760" y="1370" className="attr-type">UUID FK</text>
            <text x="540" y="1395" className="attr">action</text>
            <text x="760" y="1395" className="attr-type">VARCHAR(100)</text>
            <text x="550" y="1415" className="attr-type">login, analyze, download, settings_update</text>
            <text x="540" y="1440" className="attr">entity_type</text>
            <text x="760" y="1440" className="attr-type">VARCHAR(50)</text>
            <text x="540" y="1465" className="attr">entity_id</text>
            <text x="760" y="1465" className="attr-type">UUID</text>
            <text x="540" y="1490" className="attr">ip_address</text>
            <text x="760" y="1490" className="attr-type">INET</text>
            <text x="540" y="1515" className="attr">user_agent</text>
            <text x="760" y="1515" className="attr-type">TEXT</text>
            <text x="540" y="1540" className="attr">metadata</text>
            <text x="760" y="1540" className="attr-type">JSONB</text>
            <text x="540" y="1565" className="attr">created_at</text>
            <text x="760" y="1565" className="attr-type">TIMESTAMP</text>
          </g>

          {/* Relationships */}
          
          {/* Users → Roles (N:1) */}
          <path d="M 400 215 L 500 150" className="relationship" marker-end="url(#arrow)" />
          <text x="440" y="180" className="cardinality">N</text>
          <text x="480" y="145" className="cardinality">1</text>
          <text x="450" y="170" className="rel-label">has role</text>

          {/* Users → Analysis Requests (1:N) */}
          <path d="M 225 430 L 225 500" className="relationship" marker-end="url(#crow-many)" />
          <text x="215" y="455" className="cardinality">1</text>
          <text x="215" y="490" className="cardinality">N</text>
          <text x="260" y="465" className="rel-label">creates</text>

          {/* Analysis Requests → Indicators (N:1) */}
          <path d="M 430 680 L 520 640" className="relationship" marker-end="url(#arrow)" />
          <text x="440" y="670" className="cardinality">N</text>
          <text x="500" y="635" className="cardinality">1</text>
          <text x="475" y="655" className="rel-label">analyzes</text>

          {/* Analysis Requests → VT Results (1:1) */}
          <path d="M 430 650 L 800 650 L 800 220 L 960 220" className="relationship" marker-end="url(#arrow)" />
          <text x="440" y="645" className="cardinality">1</text>
          <text x="950" y="215" className="cardinality">1</text>
          <text x="680" y="645" className="rel-label">generates</text>

          {/* Analysis Requests → Abuse Results (1:1) */}
          <path d="M 430 700 L 900 700 L 900 220 L 1420 220" className="relationship" marker-end="url(#arrow)" />
          <text x="440" y="695" className="cardinality">1</text>
          <text x="1410" y="215" className="cardinality">1</text>

          {/* Analysis Requests → Threat Scores (1:1) */}
          <path d="M 430 750 L 960 640" className="relationship" marker-end="url(#arrow)" />
          <text x="440" y="745" className="cardinality">1</text>
          <text x="950" y="635" className="cardinality">1</text>
          <text x="695" y="695" className="rel-label">calculates</text>

          {/* VT Results → Vendor Detections (1:N) */}
          <path d="M 1340 290 L 1420 590" className="relationship" marker-end="url(#crow-many)" />
          <text x="1350" y="290" className="cardinality">1</text>
          <text x="1410" y="585" className="cardinality">N</text>
          <text x="1380" y="440" className="rel-label">has</text>

          {/* Analysis Requests → AI Reports (1:1) */}
          <path d="M 240 860 L 240 930 L 520 1060" className="relationship" marker-end="url(#arrow)" />
          <text x="230" y="870" className="cardinality">1</text>
          <text x="510" y="1055" className="cardinality">1</text>
          <text x="350" y="895" className="rel-label">generates</text>

          {/* Analysis Requests → Correlation (1:1) */}
          <path d="M 430 780 L 800 780 L 800 970 L 960 970" className="relationship" marker-end="url(#arrow)" />
          <text x="440" y="775" className="cardinality">1</text>
          <text x="950" y="965" className="cardinality">1</text>
          <text x="680" y="775" className="rel-label">produces</text>

          {/* Analysis Requests → Mitigation (1:N) */}
          <path d="M 240 860 L 240 930" className="relationship" marker-end="url(#crow-many)" />
          <text x="230" y="870" className="cardinality">1</text>
          <text x="230" y="920" className="cardinality">N</text>
          <text x="270" y="895" className="rel-label">suggests</text>

          {/* Users → Alerts (1:N) */}
          <path d="M 400 240 L 1300 240 L 1300 850 L 1420 850" className="relationship" marker-end="url(#crow-many)" />
          <text x="410" y="235" className="cardinality">1</text>
          <text x="1410" y="845" className="cardinality">N</text>
          <text x="900" y="235" className="rel-label">receives</text>

          {/* Analysis Requests → Alerts (1:N) */}
          <path d="M 430 820 L 1000 820 L 1000 850 L 1420 850" className="relationship" marker-end="url(#crow-many)" />
          <text x="440" y="815" className="cardinality">1</text>
          <text x="1410" y="845" className="cardinality">N</text>

          {/* Users → Downloads (1:N) */}
          <path d="M 225 430 L 225 1420" className="relationship" marker-end="url(#crow-many)" />
          <text x="215" y="920" className="cardinality">1</text>
          <text x="215" y="1270" className="cardinality">N</text>
          <text x="260" y="1100" className="rel-label">downloads</text>

          {/* Analysis Requests → Downloads (1:N) */}
          <path d="M 250 860 L 250 1280" className="relationship" marker-end="url(#crow-many)" />
          <text x="240" y="1070" className="cardinality">1</text>
          <text x="240" y="1270" className="cardinality">N</text>

          {/* Users → Activity Logs (1:N) */}
          <path d="M 400 350 L 600 350 L 600 1420 L 520 1420" className="relationship" marker-end="url(#crow-many)" />
          <text x="410" y="345" className="cardinality">1</text>
          <text x="530" y="1415" className="cardinality">N</text>
          <text x="500" y="885" className="rel-label">logs</text>

          {/* Legend */}
          <g transform="translate(1000, 1200)">
            <rect width="700" height="280" rx="8" style={{ fill: '#0A0E27', stroke: '#00D9FF', strokeWidth: 2 }} />
            <text x="350" y="30" style={{ fill: '#00D9FF', fontSize: '16px', fontWeight: '700', textAnchor: 'middle' }}>
              DATABASE SCHEMA LEGEND
            </text>
            
            <text x="30" y="60" className="attr-pk">🔑 Primary Key (PK)</text>
            <text x="30" y="85" className="attr-fk">🔗 Foreign Key (FK)</text>
            <text x="30" y="110" className="attr">Regular Attribute</text>
            <text x="30" y="135" className="attr-type">Data Type Information</text>
            
            <path d="M 30 155 L 130 155" className="relationship" marker-end="url(#arrow)" />
            <text x="150" y="160" className="attr">One-to-One (1:1)</text>
            
            <path d="M 30 180 L 130 180" className="relationship" marker-end="url(#crow-many)" />
            <text x="150" y="185" className="attr">One-to-Many (1:N)</text>
            
            <text x="30" y="215" style={{ fill: '#FFB020', fontSize: '14px', fontWeight: '700' }}>Key Features:</text>
            <text x="30" y="240" className="attr-type">• Complete audit trail with Activity Logs</text>
            <text x="30" y="260" className="attr-type">• Multi-source threat correlation (VT + AbuseIPDB)</text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}
