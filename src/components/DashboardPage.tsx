import React, { useState } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  AlertCircle,
  Shield,
  Activity,
  FileText,
  Download,
  Loader2,
  Info,
  Globe,
  Network,
  Zap,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import ReactMarkdown from "react-markdown";
interface DashboardPageProps {
  accessToken: string;
}

export function DashboardPage({ accessToken }: DashboardPageProps) {
  const [analysisValue, setAnalysisValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [detectedType, setDetectedType] = useState<string>("");

  // Auto-detect input type
  const detectInputType = (value: string): string => {
    const trimmedValue = value.trim();

    // Hash detection (MD5, SHA1, SHA256)
    if (/^[a-fA-F0-9]{32}$/.test(trimmedValue)) return "hash-md5";
    if (/^[a-fA-F0-9]{40}$/.test(trimmedValue)) return "hash-sha1";
    if (/^[a-fA-F0-9]{64}$/.test(trimmedValue)) return "hash-sha256";

    // IPv4 detection
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(trimmedValue)) return "ip";

    // IPv6 detection
    if (/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(trimmedValue))
      return "ip";

    // CIDR/Subnet detection
    if (/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(trimmedValue)) return "subnet";

    // URL detection
    if (/^https?:\/\/.+/.test(trimmedValue)) return "url";

    // Domain detection (simple)
    if (
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(
        trimmedValue,
      )
    )
      return "domain";

    // ASN detection
    if (/^AS\d+$/i.test(trimmedValue)) return "asn";

    return "unknown";
  };

  const handleInputChange = (value: string) => {
    setAnalysisValue(value);
    if (value.trim()) {
      const type = detectInputType(value);
      setDetectedType(type);
    } else {
      setDetectedType("");
    }
  };
  function generateMockAnalysisResult(value: string, type: string) {
    // Generate seed from value for consistent results
    const seed = value
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const abuseScore = seed % 100;
    const totalReports = seed % 500;
    // Geographic data
    const countries = [
      "US",
      "CN",
      "RU",
      "DE",
      "GB",
      "FR",
      "JP",
      "BR",
      "IN",
      "CA",
    ];
    const countryNames = [
      "United States",
      "China",
      "Russia",
      "Germany",
      "United Kingdom",
      "France",
      "Japan",
      "Brazil",
      "India",
      "Canada",
    ];
    const isps = [
      "Amazon.com Inc.",
      "Google LLC",
      "Cloudflare Inc.",
      "Microsoft Corporation",
      "DigitalOcean LLC",
    ];

    const countryIdx = seed % countries.length;
  }
  const handleUnifiedAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnalysisResult(null);

    const type = detectInputType(analysisValue);

    if (type === "unknown") {
      toast.error(
        "Unable to detect input type. Please check your input format.",
      );
      setLoading(false);
      return;
    }

    // 🔥 delay kecil biar UI smooth
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // ✅ 1. START DARI MOCK (biar UI tetap tampil dulu)
      const mockResult = generateMockAnalysisResult(analysisValue, type);
      let finalResult = { ...mockResult };

      // 🔥 2. FETCH API PARALLEL
      const [chatRes, apiRes] = await Promise.all([
        fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            indicator: analysisValue,
            type,
          }),
        }),
        fetch("http://localhost:5000/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            indicator: analysisValue,
            type,
          }),
        }),
      ]);

      const chatData = await chatRes.json();
      const apiData = await apiRes.json();

      console.log("CHAT API:", chatData);
      console.log("UNIFIED API:", apiData);

      // 🔥 3. OVERRIDE DATA DARI CHAT API
      if (chatData?.success) {
        finalResult.aiAnalysis = chatData.aiAnalysis;
        finalResult.vtData = chatData.vtData;
        finalResult.abuseData = chatData.abuseData;
        finalResult.mispData = chatData.mispData;
        finalResult.correlationInsights = chatData.correlationInsights;
        finalResult.mitigationActions = chatData.mitigationActions;
      }

      // 🔥 4. OVERRIDE DATA DARI UNIFIED API
      if (apiData) {
        finalResult.stats = apiData.stats;
        finalResult.vendors = apiData.vendors;
        finalResult.threatLevel = apiData.threatLevel;
        finalResult.total = apiData.total;
      }

      // 🔥 5. TAMBAHAN CHECK-IP (lebih detail untuk IP)
      if (type === "ip") {
        try {
          const abuseRes = await fetch("http://localhost:5000/check-ip", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ip: analysisValue,
            }),
          });

          const rawAbuse = await abuseRes.json();
          console.log("REAL ABUSE:", rawAbuse);

          const normalizedAbuse = rawAbuse?.data || rawAbuse || {};

          finalResult.abuseData = {
            data: {
              ipAddress: normalizedAbuse.ipAddress ?? analysisValue,
              isPublic: normalizedAbuse.isPublic ?? true,
              ipVersion: normalizedAbuse.ipVersion ?? 4,
              isWhitelisted: normalizedAbuse.isWhitelisted ?? false,

              abuseConfidenceScore:
                normalizedAbuse.abuseConfidenceScore ??
                normalizedAbuse.score ??
                0,

              countryCode:
                normalizedAbuse.countryCode ?? normalizedAbuse.country ?? "N/A",

              countryName: normalizedAbuse.countryName ?? "Unknown",
              usageType: normalizedAbuse.usageType ?? "Unknown",

              isp: normalizedAbuse.isp ?? "N/A",
              domain: normalizedAbuse.domain ?? "N/A",

              totalReports:
                normalizedAbuse.totalReports ?? normalizedAbuse.reports ?? 0,

              numDistinctUsers: normalizedAbuse.numDistinctUsers ?? 0,
              lastReportedAt: normalizedAbuse.lastReportedAt ?? null,
            },
          };
        } catch (err) {
          console.error("Abuse fetch failed, fallback to existing:", err);
        }
      }

      // ✅ 6. SET FINAL RESULT
      setAnalysisResult(finalResult);

      setAnalysisValue("");
      setDetectedType("");

      toast.success("Unified threat analysis completed successfully!");
    } catch (error) {
      console.error("Analysis processing error:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async (format: "pdf" | "docx") => {
    if (!analysisResult?.aiAnalysis) return;

    try {
      const res = await fetch("http://localhost:5000/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: analysisResult.aiAnalysis,
          format,
        }),
      });

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `Threat Intelligence Report.${format}`;
      a.click();

      toast.success(`Report downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report");
    }
  };

  const generateReportContent = (result: any) => {
    return `
CYBER THREAT INTELLIGENCE REPORT
================================

Analysis Type: ${result.detectedType.toUpperCase()}
Analysis Target: ${analysisValue}
Generated: ${new Date().toLocaleString()}

THREAT CORRELATION ANALYSIS
${result.correlationInsights}

AI-GENERATED ANALYSIS
${result.aiAnalysis}

RECOMMENDED MITIGATION ACTIONS
${result.mitigationActions?.join("\n") || "See detailed recommendations below"}

---
RAW DATA
---

VirusTotal Data:
${JSON.stringify(result.vtData, null, 2)}

AbuseIPDB Data:
${JSON.stringify(result.abuseData, null, 2)}
`;
  };

  // Process threat data for visualization
  const getThreatStats = () => {
    if (!analysisResult?.stats) {
      return { malicious: 0, suspicious: 0, undetected: 0, harmless: 0 };
    }
    return analysisResult.stats;
  };

  const threatStats = getThreatStats();
  const totalVendors = Object.values(threatStats).reduce(
    (a: any, b: any) => a + b,
    0,
  ) as number;

  const threatLevelData = [
    { name: "Malicious", value: threatStats.malicious || 0, color: "#ef4444" },
    {
      name: "Suspicious",
      value: threatStats.suspicious || 0,
      color: "#f59e0b",
    },
    { name: "Harmless", value: threatStats.harmless || 0, color: "#10b981" },
    {
      name: "Undetected",
      value: threatStats.undetected || 0,
      color: "#6b7280",
    },
  ];
  let lastY = 0;
  const getVendorResults = () => {
    if (!analysisResult?.vendors) return [];

    return analysisResult.vendors.slice(0, 100);
  };

  const getAbuseIPData = () => {
    if (!analysisResult?.abuseData?.data) return null;
    return analysisResult.abuseData.data;
  };
  const getMISPData = () => {
    if (!analysisResult?.mispData) return null;
    return analysisResult.mispData;
  };
  const getThreatLevel = () => {
    const level = analysisResult?.threatLevel || "LOW";

    const map: any = {
      CRITICAL: {
        level: "CRITICAL",
        color: "var(--destructive)",
        bgColor: "var(--destructive-light)",
      },
      HIGH: {
        level: "HIGH",
        color: "var(--warning)",
        bgColor: "var(--warning-light)",
      },
      MEDIUM: {
        level: "MEDIUM",
        color: "#FFB020",
        bgColor: "#FFF8E1",
      },
      LOW: {
        level: "LOW",
        color: "var(--success)",
        bgColor: "var(--success-light)",
      },
    };

    return map[level];
  };

  const threatLevel = getThreatLevel();

  // Correlation data for radar chart
  const getCorrelationData = () => {
    const misp = getMISPData();

    return [
      {
        metric: "Malware",
        score: (threatStats.malicious / Math.max(totalVendors, 1)) * 100,
      },
      {
        metric: "Reputation",
        score: 100 - (getAbuseIPData()?.abuseConfidenceScore || 0),
      },
      {
        metric: "Intel",
        score: Math.min((misp?.matchCount || 0) * 20, 100),
      },
      {
        metric: "Confidence",
        score:
          misp?.confidence === "High"
            ? 95
            : misp?.confidence === "Medium"
              ? 65
              : 30,
      },
      {
        metric: "History",
        score: misp?.lastSeen && misp?.lastSeen !== "-" ? 80 : 40,
      },
    ];
  };

  const getTypeIcon = (type: string) => {
    if (type.includes("hash")) return "🔐";
    if (type === "ip") return "🌐";
    if (type === "domain") return "🔗";
    if (type === "url") return "🔒";
    if (type === "subnet") return "📡";
    if (type === "asn") return "🏢";
    return "🔍";
  };

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
          Unified Threat Analysis
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Intelligent multi-source threat analysis with automatic detection
        </p>
      </div>

      {/* Unified Analysis Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap
              className="h-5 w-5 sm:h-6 sm:w-6"
              style={{ color: "var(--accent)" }}
            />
            <CardTitle className="text-lg sm:text-xl">
              Intelligent Threat Analysis
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Enter any indicator - we'll automatically detect the type and
            perform comprehensive analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnifiedAnalysis} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="indicator">Threat Indicator</Label>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Input
                    id="indicator"
                    placeholder="Enter IP, Domain, URL, Hash (MD5/SHA1/SHA256), Subnet, or ASN..."
                    value={analysisValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    required
                    className="pr-20"
                  />
                  {detectedType && (
                    <Badge
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                      variant="secondary"
                    >
                      {getTypeIcon(detectedType)} {detectedType.toUpperCase()}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Examples:</span>
                  <code className="px-2 py-1 rounded bg-muted">8.8.8.8</code>
                  <code className="px-2 py-1 rounded bg-muted">
                    example.com
                  </code>
                  <code className="px-2 py-1 rounded bg-muted">
                    https://...
                  </code>
                  <code className="px-2 py-1 rounded bg-muted">abc123...</code>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with AI & Multiple Sources...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Analyze Threat
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysisResult && (
        <>
          {/* 1. Threat Level Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle
                  className="text-sm"
                  style={{ fontWeight: "var(--font-weight-semibold)" }}
                >
                  Threat Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="px-3 py-2 rounded-lg text-center"
                  style={{
                    backgroundColor: threatLevel.bgColor,
                    border: `2px solid ${threatLevel.color}`,
                  }}
                >
                  <div
                    className="text-xl sm:text-2xl"
                    style={{
                      color: threatLevel.color,
                      fontWeight: "var(--font-weight-bold)",
                    }}
                  >
                    {threatLevel.level}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Total Alerts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle
                  className="text-sm"
                  style={{ fontWeight: "var(--font-weight-semibold)" }}
                >
                  Total Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl sm:text-3xl"
                  style={{
                    fontWeight: "var(--font-weight-bold)",
                    color: "var(--foreground)",
                  }}
                >
                  {totalVendors}
                </div>
                <p className="text-xs text-muted-foreground">
                  Security vendors
                </p>
              </CardContent>
            </Card>

            {/* 3. High Alerts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle
                  className="text-sm"
                  style={{ fontWeight: "var(--font-weight-semibold)" }}
                >
                  High Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl sm:text-3xl"
                  style={{
                    fontWeight: "var(--font-weight-bold)",
                    color: "var(--destructive)",
                  }}
                >
                  {threatStats.malicious}
                </div>
                <p className="text-xs text-muted-foreground">
                  Malicious detections
                </p>
              </CardContent>
            </Card>

            {/* 4. Medium Alerts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle
                  className="text-sm"
                  style={{ fontWeight: "var(--font-weight-semibold)" }}
                >
                  Medium Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl sm:text-3xl"
                  style={{
                    fontWeight: "var(--font-weight-bold)",
                    color: "var(--warning)",
                  }}
                >
                  {threatStats.suspicious}
                </div>
                <p className="text-xs text-muted-foreground">
                  Suspicious detections
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 5. Threat Distribution & 6. Detection Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Threat Distribution
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Analysis breakdown by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={threatLevelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50} // 🔥 donut style
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) =>
                        percent > 0
                          ? `${name} (${(percent * 100).toFixed(0)}%)`
                          : ""
                      }
                      labelLine={false}
                    >
                      {threatLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value: number) => [`${value}`, "Detections"]}
                    />

                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Detection Statistics
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Vendor detection counts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={threatLevelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* 7. Security Vendor Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Security Vendor Analysis
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Detection results from VirusTotal security vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">
                        Vendor
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Category
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Result
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getVendorResults().map((vendor: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="text-xs sm:text-sm">
                          {vendor.vendor}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              vendor.category === "malicious"
                                ? "destructive"
                                : vendor.category === "suspicious"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {vendor.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {vendor.result}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* AbuseIPDB Reputation Data (if applicable) */}
          {getAbuseIPData() && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Network
                    className="h-5 w-5"
                    style={{ color: "var(--accent)" }}
                  />
                  <CardTitle className="text-base sm:text-lg">
                    IP Reputation Analysis
                  </CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  AbuseIPDB threat intelligence data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Abuse Score
                    </p>
                    <p
                      className="text-xl sm:text-2xl"
                      style={{
                        fontWeight: "var(--font-weight-bold)",
                        color:
                          getAbuseIPData().abuseConfidenceScore > 75
                            ? "var(--destructive)"
                            : "var(--success)",
                      }}
                    >
                      {getAbuseIPData().abuseConfidenceScore}%
                    </p>
                    <Progress
                      value={getAbuseIPData().abuseConfidenceScore}
                      className="mt-2 h-2"
                    />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Country
                    </p>
                    <p
                      className="text-xl sm:text-2xl"
                      style={{ fontWeight: "var(--font-weight-bold)" }}
                    >
                      {getAbuseIPData().countryCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Reports
                    </p>
                    <p
                      className="text-xl sm:text-2xl"
                      style={{ fontWeight: "var(--font-weight-bold)" }}
                    >
                      {getAbuseIPData().totalReports || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      ISP
                    </p>
                    <p className="text-base sm:text-lg truncate">
                      {getAbuseIPData().isp || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* ===============================
   MISP THREAT INTELLIGENCE CARD
================================ */}
          {getMISPData() && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" style={{ color: "#2563eb" }} />

                  <CardTitle className="text-base sm:text-lg">
                    MISP Threat Intelligence
                  </CardTitle>
                </div>

                <CardDescription className="text-xs sm:text-sm">
                  Community sourced threat intelligence correlation
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* KPI */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Match Count</p>
                    <p className="text-2xl font-bold">
                      {getMISPData()?.matchCount || 0}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p
                      className={`text-2xl font-bold ${
                        getMISPData()?.confidence === "High"
                          ? "text-red-600"
                          : getMISPData()?.confidence === "Medium"
                            ? "text-yellow-500"
                            : "text-green-600"
                      }`}
                    >
                      {getMISPData()?.confidence || "Low"}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">
                      Threat Level
                    </p>
                    <p className="text-2xl font-bold">
                      {getMISPData()?.threatLevel || "Unknown"}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Published</p>
                    <p className="text-2xl font-bold text-green-600">
                      {getMISPData()?.published || "No"}
                    </p>
                  </div>
                </div>

                {/* DETAIL */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  <div className="rounded-lg border p-4 space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Threat Actor
                      </p>
                      <p className="font-semibold">
                        {getMISPData()?.threatActor || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Source Organization
                      </p>
                      <p className="font-semibold">
                        {getMISPData()?.sourceOrg || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        TLP Classification
                      </p>
                      <p className="font-semibold">
                        {getMISPData()?.tlp || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Last Updated
                      </p>
                      <p className="font-semibold">
                        {getMISPData()?.lastUpdated || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Correlation
                      </p>
                      <p className="font-semibold text-green-600">
                        {getMISPData()?.correlation || "Unknown"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        IOC Intelligence Source
                      </p>
                      <p className="font-semibold">MISP Federation Feed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 9. Threat Correlation Engine */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  style={{ color: "var(--primary)" }}
                />
                <CardTitle className="text-base sm:text-lg">
                  Threat Correlation Engine
                </CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Multi-dimensional threat analysis across data sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={getCorrelationData()}>
                      <PolarGrid />
                      <PolarAngleAxis
                        dataKey="metric"
                        tick={{ fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fontSize: 10 }}
                      />
                      <Radar
                        name="Threat Score"
                        dataKey="score"
                        stroke="#0052FF"
                        fill="#0052FF"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  <h4
                    className="text-sm sm:text-base"
                    style={{ fontWeight: "var(--font-weight-semibold)" }}
                  >
                    Correlation Insights
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    {analysisResult.correlationInsights ? (
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="whitespace-pre-wrap">
                          {analysisResult.correlationInsights}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-2 p-2 rounded bg-muted">
                          <Badge variant="outline" className="text-xs">
                            VT
                          </Badge>
                          <span>
                            VirusTotal detected {threatStats.malicious}{" "}
                            malicious vendors
                          </span>
                        </div>
                        <div className="flex items-start gap-2 p-2 rounded bg-muted">
                          <Badge variant="outline" className="text-xs">
                            Abuse
                          </Badge>
                          <span>
                            AbuseIPDB confidence:{" "}
                            {getAbuseIPData()?.abuseConfidenceScore || 0}%
                          </span>
                        </div>
                        <div className="flex items-start gap-2 p-2 rounded bg-muted">
                          <Badge variant="outline" className="text-xs">
                            Geo
                          </Badge>
                          <span>
                            Origin: {getAbuseIPData()?.countryCode || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 p-2 rounded bg-muted">
                          <Badge variant="outline" className="text-xs">
                            History
                          </Badge>
                          <span>
                            {getAbuseIPData()?.totalReports || 0} abuse reports
                            filed
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 8. AI-Generated Analysis Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-base sm:text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  AI-Generated Analysis Report
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleDownload("pdf")}
                    className="text-xs sm:text-sm"
                  >
                    <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Download PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload("docx")}
                    className="text-xs sm:text-sm"
                  >
                    <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Download DOCX
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">
                <ReactMarkdown>{analysisResult.aiAnalysis}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* 10. Recommended Mitigation Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  style={{ color: "var(--success)" }}
                />
                <CardTitle className="text-base sm:text-lg">
                  Recommended Mitigation Actions
                </CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Step-by-step security response plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisResult.mitigationActions ? (
                  analysisResult.mitigationActions.map(
                    (action: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge className="mt-0.5 text-xs">{index + 1}</Badge>
                        <span className="text-xs sm:text-sm">{action}</span>
                      </li>
                    ),
                  )
                ) : (
                  <>
                    {threatStats.malicious > 0 && (
                      <>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-sm">
                            Immediately block the analyzed indicator in your
                            firewall and security systems
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-sm">
                            Conduct forensic analysis if this indicator was
                            accessed within your network
                          </span>
                        </li>
                      </>
                    )}
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm">
                        Update threat intelligence feeds with the identified
                        indicators of compromise
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm">
                        Monitor network logs for any similar patterns or related
                        threats
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm">
                        Document findings and share with your security team
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Network className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm">
                        Review related infrastructure and check for lateral
                        movement indicators
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
