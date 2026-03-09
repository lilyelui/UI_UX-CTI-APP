import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ComprehensiveFlowchart } from "./ComprehensiveFlowchart";
import { ComprehensiveERD } from "./ComprehensiveERD";
import {
  FileText,
  GitBranch,
  Database,
  Shield,
  Activity,
  Globe,
} from "lucide-react";
import { Badge } from "./ui/badge";

export function DocumentationPage() {
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl"
          style={{
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          Platform Documentation
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Complete system architecture, feature flows, and database schema
        </p>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield
              className="h-5 w-5 sm:h-6 sm:w-6"
              style={{ color: "var(--primary)" }}
            />
            <CardTitle className="text-lg sm:text-xl">
              System Overview
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Cyber Threat Intelligence Platform - Full-stack Security Analysis
            System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className="p-4 rounded-lg border"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText
                  className="h-5 w-5"
                  style={{ color: "var(--primary)" }}
                />
                <h3
                  className="text-base"
                  style={{ fontWeight: "var(--font-weight-semibold)" }}
                >
                  Frontend
                </h3>
              </div>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>• React 18 with TypeScript</li>
                <li>• Tailwind CSS v4.0</li>
                <li>• Recharts for data visualization</li>
                <li>• Responsive design (mobile-first)</li>
              </ul>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity
                  className="h-5 w-5"
                  style={{ color: "var(--accent)" }}
                />
                <h3
                  className="text-base"
                  style={{ fontWeight: "var(--font-weight-semibold)" }}
                >
                  Backend
                </h3>
              </div>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>• Supabase Edge Functions</li>
                <li>• Hono.js framework</li>
                <li>• Deno runtime</li>
                <li>• RESTful API architecture</li>
              </ul>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Database
                  className="h-5 w-5"
                  style={{ color: "var(--success)" }}
                />
                <h3
                  className="text-base"
                  style={{ fontWeight: "var(--font-weight-semibold)" }}
                >
                  Database
                </h3>
              </div>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>• Supabase Auth (Users)</li>
                <li>• Key-Value Store (Analysis)</li>
                <li>• JWT authentication</li>
                <li>• Real-time capabilities</li>
              </ul>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Globe
                  className="h-5 w-5"
                  style={{ color: "var(--warning)" }}
                />
                <h3
                  className="text-base"
                  style={{ fontWeight: "var(--font-weight-semibold)" }}
                >
                  External APIs
                </h3>
              </div>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>• VirusTotal API v3</li>
                <li>• AbuseIPDB API v2</li>
                <li>• Qwen AI (Alibaba Cloud)</li>
                <li>• Gmail OAuth</li>
              </ul>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield
                  className="h-5 w-5"
                  style={{ color: "var(--destructive)" }}
                />
                <h3
                  className="text-base"
                  style={{ fontWeight: "var(--font-weight-semibold)" }}
                >
                  Security
                </h3>
              </div>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>• JWT token authentication</li>
                <li>• Row-level security</li>
                <li>• API key encryption</li>
                <li>• CORS protection</li>
              </ul>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <GitBranch
                  className="h-5 w-5"
                  style={{ color: "var(--secondary)" }}
                />
                <h3
                  className="text-base"
                  style={{ fontWeight: "var(--font-weight-semibold)" }}
                >
                  Features
                </h3>
              </div>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>• Multi-type threat analysis</li>
                <li>• AI-powered reports</li>
                <li>• PDF/DOCX export</li>
                <li>• Download history tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Key Features</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Comprehensive threat intelligence and analysis capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <h4
                className="text-sm sm:text-base mb-2"
                style={{ fontWeight: "var(--font-weight-semibold)" }}
              >
                Threat Analysis
              </h4>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>✓ File hash (MD5, SHA1, SHA256) analysis via VirusTotal</li>
                <li>✓ Domain reputation checking</li>
                <li>✓ IP address threat assessment with AbuseIPDB</li>
                <li>✓ URL security scanning</li>
                <li>✓ Real-time threat scoring and visualization</li>
              </ul>
            </div>

            <div>
              <h4
                className="text-sm sm:text-base mb-2"
                style={{ fontWeight: "var(--font-weight-semibold)" }}
              >
                AbuseIPDB Checks
              </h4>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>✓ Dedicated IP address reputation checks</li>
                <li>✓ Domain name abuse lookups</li>
                <li>✓ Subnet/CIDR range analysis</li>
                <li>✓ Abuse confidence scoring (0-100%)</li>
                <li>✓ Historical abuse report viewing</li>
              </ul>
            </div>

            <div>
              <h4
                className="text-sm sm:text-base mb-2"
                style={{ fontWeight: "var(--font-weight-semibold)" }}
              >
                Reporting & Analytics
              </h4>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>✓ AI-generated comprehensive security reports</li>
                <li>✓ Interactive charts (Pie, Bar, Line)</li>
                <li>✓ Security vendor analysis table</li>
                <li>✓ Mitigation action recommendations</li>
                <li>✓ Export to PDF and DOCX formats</li>
              </ul>
            </div>

            <div>
              <h4
                className="text-sm sm:text-base mb-2"
                style={{ fontWeight: "var(--font-weight-semibold)" }}
              >
                User Management
              </h4>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>✓ Gmail OAuth authentication</li>
                <li>✓ Secure user registration and login</li>
                <li>✓ Profile management</li>
                <li>✓ Download history tracking</li>
                <li>✓ Re-download previous reports</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagrams */}
      <Tabs defaultValue="flowchart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="flowchart" className="text-xs sm:text-sm">
            <GitBranch className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Feature Flow
          </TabsTrigger>
          <TabsTrigger value="erd" className="text-xs sm:text-sm">
            <Database className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Database ERD
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flowchart" className="mt-4 sm:mt-6">
          <ComprehensiveFlowchart />
        </TabsContent>

        <TabsContent value="erd" className="mt-4 sm:mt-6">
          <ComprehensiveERD />
        </TabsContent>
      </Tabs>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Technology Stack</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Modern technologies powering the CTI Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="px-3 py-1">
              React 18
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              TypeScript
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Tailwind CSS v4
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Supabase
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Hono.js
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Deno
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Recharts
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              VirusTotal API
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              AbuseIPDB API
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Qwen AI
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Gmail OAuth
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              JWT Auth
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              KV Store
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              REST API
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">API Endpoints</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Available backend API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="p-3 sm:p-4 rounded-lg border"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <Badge className="w-fit">POST</Badge>
                <code className="text-xs sm:text-sm">
                  /server/unified-analyze
                </code>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Unified threat analysis (PRIMARY)
              </p>
            </div>

            <div
              className="p-3 sm:p-4 rounded-lg border"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <Badge className="w-fit">POST</Badge>
                <code className="text-xs sm:text-sm">/server/analyze</code>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Legacy threat analysis (hash, domain, IP, URL)
              </p>
            </div>

            <div
              className="p-3 sm:p-4 rounded-lg border"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <Badge className="w-fit">POST</Badge>
                <code className="text-xs sm:text-sm">/server/abuse-check</code>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Dedicated AbuseIPDB check (IP, domain, subnet)
              </p>
            </div>

            <div
              className="p-3 sm:p-4 rounded-lg border"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <Badge variant="secondary" className="w-fit">
                  GET
                </Badge>
                <code className="text-xs sm:text-sm">/server/history</code>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get user's download history
              </p>
            </div>

            <div
              className="p-3 sm:p-4 rounded-lg border"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <Badge className="w-fit">POST</Badge>
                <code className="text-xs sm:text-sm">/server/history</code>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Save downloaded report to history
              </p>
            </div>

            <div
              className="p-3 sm:p-4 rounded-lg border"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <Badge variant="secondary" className="w-fit">
                  GET
                </Badge>
                <code className="text-xs sm:text-sm">/server/analysis/:id</code>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Retrieve specific analysis by ID
              </p>
            </div>

            <div
              className="p-3 sm:p-4 rounded-lg border"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <Badge variant="outline" className="w-fit">
                  PUT
                </Badge>
                <code className="text-xs sm:text-sm">/server/profile</code>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Update user profile information
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
