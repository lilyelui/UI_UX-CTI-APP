import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

export function ERDiagram() {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">
          Entity Relationship Diagram (ERD)
        </CardTitle>
        <CardDescription className="text-sm">
          Database schema for CTI Platform (Key-Value Store based)
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <svg
          viewBox="0 0 1400 900"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Define styles */}
          <defs>
            <style>
              {`
                .entity-box { fill: #1E293B; stroke: #00D9FF; stroke-width: 3; }
                .entity-header { fill: #0052FF; }
                .entity-title { fill: white; font-size: 18px; font-weight: 700; text-anchor: middle; }
                .attr-text { fill: #E2E8F0; font-size: 13px; }
                .attr-pk { fill: #FFB020; font-weight: 700; }
                .attr-fk { fill: #00E676; font-weight: 600; }
                .relationship { stroke: #00D9FF; stroke-width: 2; fill: none; }
                .relationship-label { fill: #94A3B8; font-size: 12px; text-anchor: middle; font-style: italic; }
                .cardinality { fill: #FFB020; font-size: 14px; font-weight: 700; }
              `}
            </style>
            <marker
              id="arrow-one"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#00D9FF" />
            </marker>
            <marker
              id="arrow-many"
              markerWidth="15"
              markerHeight="10"
              refX="14"
              refY="5"
              orient="auto"
            >
              <path
                d="M 0 5 L 10 0 L 10 10 Z M 5 5 L 15 0 L 15 10 Z"
                fill="#00D9FF"
              />
            </marker>
          </defs>

          {/* Users Entity (Managed by Supabase Auth) */}
          <g id="users-entity">
            <rect
              x="50"
              y="50"
              width="350"
              height="320"
              rx="10"
              className="entity-box"
            />
            <rect
              x="50"
              y="50"
              width="350"
              height="50"
              rx="10"
              className="entity-header"
            />
            <text x="225" y="82" className="entity-title">
              USERS
            </text>

            <text x="70" y="125" className="attr-pk">
              🔑 id (UUID) - PK
            </text>
            <text x="70" y="155" className="attr-text">
              email (VARCHAR)
            </text>
            <text x="70" y="185" className="attr-text">
              password (HASHED)
            </text>
            <text x="70" y="215" className="attr-text">
              user_metadata (JSONB)
            </text>
            <text
              x="90"
              y="240"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              - name (VARCHAR)
            </text>
            <text x="70" y="270" className="attr-text">
              created_at (TIMESTAMP)
            </text>
            <text x="70" y="300" className="attr-text">
              updated_at (TIMESTAMP)
            </text>
            <text x="70" y="330" className="attr-text">
              email_confirmed (BOOLEAN)
            </text>
            <text x="70" y="360" className="attr-text">
              last_sign_in_at (TIMESTAMP)
            </text>
          </g>

          {/* Analysis Results Entity */}
          <g id="analysis-entity">
            <rect
              x="550"
              y="50"
              width="380"
              height="450"
              rx="10"
              className="entity-box"
            />
            <rect
              x="550"
              y="50"
              width="380"
              height="50"
              rx="10"
              className="entity-header"
            />
            <text x="740" y="82" className="entity-title">
              ANALYSIS_RESULTS
            </text>

            <text x="570" y="125" className="attr-pk">
              🔑 analysisId (VARCHAR) - PK
            </text>
            <text
              x="590"
              y="145"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              {"Format: analysis_{userId}_{timestamp}"}
            </text>
            <text x="570" y="175" className="attr-fk">
              🔗 userId (UUID) - FK
            </text>
            <text x="570" y="205" className="attr-text">
              type (VARCHAR)
            </text>
            <text
              x="590"
              y="230"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              Values: hash | domain | ip | url
            </text>
            <text x="570" y="260" className="attr-text">
              value (VARCHAR)
            </text>
            <text
              x="590"
              y="285"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              The analyzed target
            </text>
            <text x="570" y="315" className="attr-text">
              vtData (JSONB)
            </text>
            <text
              x="590"
              y="340"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              VirusTotal API response
            </text>
            <text x="570" y="370" className="attr-text">
              abuseData (JSONB)
            </text>
            <text
              x="590"
              y="395"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              AbuseIPDB API response
            </text>
            <text x="570" y="425" className="attr-text">
              aiAnalysis (TEXT)
            </text>
            <text
              x="590"
              y="450"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              AI-generated report
            </text>
            <text x="570" y="480" className="attr-text">
              timestamp (TIMESTAMP)
            </text>
          </g>

          {/* Download History Entity */}
          <g id="history-entity">
            <rect
              x="1000"
              y="50"
              width="350"
              height="380"
              rx="10"
              className="entity-box"
            />
            <rect
              x="1000"
              y="50"
              width="350"
              height="50"
              rx="10"
              className="entity-header"
            />
            <text x="1175" y="82" className="entity-title">
              DOWNLOAD_HISTORY
            </text>

            <text x="1020" y="125" className="attr-pk">
              🔑 historyId (VARCHAR) - PK
            </text>
            <text
              x="1040"
              y="145"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              {"Format: history_{userId}_{timestamp}"}
            </text>
            <text x="1020" y="175" className="attr-fk">
              🔗 userId (UUID) - FK
            </text>
            <text x="1020" y="205" className="attr-fk">
              🔗 analysisId (VARCHAR) - FK
            </text>
            <text x="1020" y="235" className="attr-text">
              fileName (VARCHAR)
            </text>
            <text
              x="1040"
              y="260"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              Generated file name
            </text>
            <text x="1020" y="290" className="attr-text">
              format (VARCHAR)
            </text>
            <text
              x="1040"
              y="315"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              Values: pdf | docx
            </text>
            <text x="1020" y="345" className="attr-text">
              downloadedAt (TIMESTAMP)
            </text>
            <text
              x="1040"
              y="370"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              When report was downloaded
            </text>
            <text x="1020" y="400" className="attr-text">
              fileSize (INTEGER)
            </text>
            <text x="1020" y="430" className="attr-text">
              downloadCount (INTEGER)
            </text>
          </g>

          {/* AbuseIPDB Checks Entity */}
          <g id="abuse-checks-entity">
            <rect
              x="550"
              y="550"
              width="380"
              height="300"
              rx="10"
              className="entity-box"
            />
            <rect
              x="550"
              y="550"
              width="380"
              height="50"
              rx="10"
              className="entity-header"
            />
            <text x="740" y="582" className="entity-title">
              ABUSEIPDB_CHECKS
            </text>

            <text x="570" y="625" className="attr-pk">
              🔑 checkId (VARCHAR) - PK
            </text>
            <text
              x="590"
              y="645"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              {"Format: abuse_{userId}_{timestamp}"}
            </text>
            <text x="570" y="675" className="attr-fk">
              🔗 userId (UUID) - FK
            </text>
            <text x="570" y="705" className="attr-text">
              type (VARCHAR)
            </text>
            <text
              x="590"
              y="730"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              Values: ip | domain | subnet
            </text>
            <text x="570" y="760" className="attr-text">
              value (VARCHAR)
            </text>
            <text x="570" y="790" className="attr-text">
              checkData (JSONB)
            </text>
            <text
              x="590"
              y="815"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              AbuseIPDB check response
            </text>
            <text x="570" y="845" className="attr-text">
              timestamp (TIMESTAMP)
            </text>
          </g>

          {/* Relationships */}

          {/* Users to Analysis Results (1:N) */}
          <path
            d="M 400 200 L 550 200"
            className="relationship"
            marker-end="url(#arrow-many)"
          />
          <text x="475" y="195" className="cardinality">
            1
          </text>
          <text x="540" y="195" className="cardinality">
            N
          </text>
          <text x="475" y="220" className="relationship-label">
            creates
          </text>

          {/* Users to Download History (1:N) */}
          <path
            d="M 400 150 L 480 150 L 480 100 L 1000 100"
            className="relationship"
            marker-end="url(#arrow-many)"
          />
          <text x="410" y="145" className="cardinality">
            1
          </text>
          <text x="990" y="95" className="cardinality">
            N
          </text>
          <text x="700" y="95" className="relationship-label">
            downloads
          </text>

          {/* Analysis Results to Download History (1:N) */}
          <path
            d="M 930 250 L 980 250 L 980 230 L 1000 230"
            className="relationship"
            marker-end="url(#arrow-many)"
          />
          <text x="940" y="245" className="cardinality">
            1
          </text>
          <text x="990" y="225" className="cardinality">
            N
          </text>
          <text x="990" y="245" className="relationship-label">
            has
          </text>

          {/* Users to AbuseIPDB Checks (1:N) */}
          <path
            d="M 225 370 L 225 700 L 550 700"
            className="relationship"
            marker-end="url(#arrow-many)"
          />
          <text x="215" y="535" className="cardinality">
            1
          </text>
          <text x="540" y="695" className="cardinality">
            N
          </text>
          <text x="300" y="695" className="relationship-label">
            performs
          </text>

          {/* Database Information */}
          <g id="db-info">
            <rect
              x="50"
              y="500"
              width="400"
              height="350"
              rx="10"
              style={{ fill: "#0A0E27", stroke: "#00D9FF", strokeWidth: 2 }}
            />
            <rect
              x="50"
              y="500"
              width="400"
              height="50"
              rx="10"
              style={{ fill: "#0052FF" }}
            />
            <text x="250" y="532" className="entity-title">
              DATABASE IMPLEMENTATION
            </text>

            <text
              x="70"
              y="575"
              className="attr-text"
              style={{ fontWeight: "700", fill: "#00D9FF" }}
            >
              Storage Type:
            </text>
            <text x="70" y="600" className="attr-text">
              • Supabase Auth (Users)
            </text>
            <text x="70" y="625" className="attr-text">
              • Key-Value Store (Analysis & History)
            </text>

            <text
              x="70"
              y="660"
              className="attr-text"
              style={{ fontWeight: "700", fill: "#00D9FF" }}
            >
              Key Patterns:
            </text>
            <text
              x="70"
              y="685"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              • analysis_{"{userId}"}_{"{timestamp}"}
            </text>
            <text
              x="70"
              y="710"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              • history_{"{userId}"}_{"{timestamp}"}
            </text>
            <text
              x="70"
              y="735"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              • abuse_{"{userId}"}_{"{timestamp}"}
            </text>

            <text
              x="70"
              y="770"
              className="attr-text"
              style={{ fontWeight: "700", fill: "#00D9FF" }}
            >
              Data Access:
            </text>
            <text x="70" y="795" className="attr-text">
              • Authenticated via JWT tokens
            </text>
            <text x="70" y="820" className="attr-text">
              • User-specific data isolation
            </text>
            <text x="70" y="845" className="attr-text">
              • Prefix-based query support
            </text>
          </g>

          {/* Legend */}
          <g id="legend">
            <rect
              x="1000"
              y="500"
              width="350"
              height="350"
              rx="10"
              style={{ fill: "#0A0E27", stroke: "#00D9FF", strokeWidth: 2 }}
            />
            <rect
              x="1000"
              y="500"
              width="350"
              height="50"
              rx="10"
              style={{ fill: "#0052FF" }}
            />
            <text x="1175" y="532" className="entity-title">
              LEGEND
            </text>

            <text x="1020" y="575" className="attr-pk">
              🔑 Primary Key (PK)
            </text>
            <text x="1020" y="605" className="attr-fk">
              🔗 Foreign Key (FK)
            </text>
            <text x="1020" y="635" className="attr-text">
              Regular Attribute
            </text>

            <path
              d="M 1020 660 L 1120 660"
              className="relationship"
              marker-end="url(#arrow-many)"
            />
            <text x="1135" y="665" className="attr-text">
              One-to-Many
            </text>

            <text
              x="1020"
              y="700"
              className="attr-text"
              style={{ fontWeight: "700", fill: "#00D9FF" }}
            >
              Cardinality:
            </text>
            <text x="1020" y="725" className="cardinality">
              1
            </text>
            <text x="1040" y="725" className="attr-text">
              = One
            </text>
            <text x="1020" y="750" className="cardinality">
              N
            </text>
            <text x="1040" y="750" className="attr-text">
              = Many
            </text>

            <text
              x="1020"
              y="785"
              className="attr-text"
              style={{ fontWeight: "700", fill: "#00D9FF" }}
            >
              Data Types:
            </text>
            <text
              x="1020"
              y="810"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              VARCHAR - Variable length text
            </text>
            <text
              x="1020"
              y="835"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              UUID - Unique identifier
            </text>
            <text
              x="1020"
              y="860"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              JSONB - JSON binary data
            </text>
            <text
              x="1020"
              y="885"
              className="attr-text"
              style={{ fontSize: "11px" }}
            >
              TIMESTAMP - Date and time
            </text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}
