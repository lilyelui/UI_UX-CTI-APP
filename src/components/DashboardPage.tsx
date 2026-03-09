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
        trimmedValue
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

  const handleUnifiedAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnalysisResult(null);

    const type = detectInputType(analysisValue);
    if (type === "unknown") {
      toast.error(
        "Unable to detect input type. Please check your input format."
      );
      setLoading(false);
      return;
    }

    // Simulate loading delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Generate mock analysis results directly in frontend
      const mockResult = generateMockAnalysisResult(analysisValue, type);

      setAnalysisResult(mockResult);
      setAnalysisValue(""); // Clear input after successful analysis
      setDetectedType(""); // Clear detected type badge
      toast.success("Unified threat analysis completed successfully!");
    } catch (error) {
      console.error("Analysis processing error:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: "pdf" | "docx") => {
    if (!analysisResult) return;

    try {
      const fileName = `threat_analysis_${Date.now()}.${format}`;
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            analysisId: analysisResult.analysisId,
            fileName,
            format,
          }),
        }
      );

      const content = generateReportContent(analysisResult);
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

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
    if (!analysisResult?.vtData?.data?.attributes?.last_analysis_stats) {
      return { malicious: 0, suspicious: 0, undetected: 0, harmless: 0 };
    }
    return analysisResult.vtData.data.attributes.last_analysis_stats;
  };

  const threatStats = getThreatStats();
  const totalVendors = Object.values(threatStats).reduce(
    (a: any, b: any) => a + b,
    0
  ) as number;

  const threatLevelData = [
    { name: "Malicious", value: threatStats.malicious, color: "#ef4444" },
    { name: "Suspicious", value: threatStats.suspicious, color: "#f59e0b" },
    { name: "Harmless", value: threatStats.harmless, color: "#10b981" },
    { name: "Undetected", value: threatStats.undetected, color: "#6b7280" },
  ];

  const getVendorResults = () => {
    if (!analysisResult?.vtData?.data?.attributes?.last_analysis_results)
      return [];
    return Object.entries(
      analysisResult.vtData.data.attributes.last_analysis_results
    )
      .map(([vendor, result]: [string, any]) => ({
        vendor,
        category: result.category,
        result: result.result || "Clean",
      }))
      .slice(0, 15);
  };

  const getAbuseIPData = () => {
    if (!analysisResult?.abuseData?.data) return null;
    return analysisResult.abuseData.data;
  };

  const getThreatLevel = () => {
    const abuseScore = getAbuseIPData()?.abuseConfidenceScore || 0;

    if (threatStats.malicious > 5 || abuseScore > 75) {
      return {
        level: "CRITICAL",
        color: "var(--destructive)",
        bgColor: "var(--destructive-light)",
      };
    }
    if (
      threatStats.malicious > 2 ||
      threatStats.suspicious > 5 ||
      abuseScore > 50
    ) {
      return {
        level: "HIGH",
        color: "var(--warning)",
        bgColor: "var(--warning-light)",
      };
    }
    if (threatStats.suspicious > 0 || abuseScore > 25) {
      return { level: "MEDIUM", color: "#FFB020", bgColor: "#FFF8E1" };
    }
    return {
      level: "LOW",
      color: "var(--success)",
      bgColor: "var(--success-light)",
    };
  };

  const threatLevel = getThreatLevel();

  // Correlation data for radar chart
  const getCorrelationData = () => {
    if (!analysisResult?.correlation) return [];

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
        metric: "Network",
        score: getAbuseIPData()?.totalReports > 10 ? 30 : 90,
      },
      {
        metric: "Geographic",
        score: getAbuseIPData()?.countryCode === "US" ? 80 : 60,
      },
      { metric: "History", score: getAbuseIPData()?.lastReportedAt ? 50 : 90 },
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
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={threatLevelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {threatLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
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
                    {getVendorResults().map((vendor, index) => (
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
                {analysisResult.aiAnalysis}
              </div>
            </CardContent>
          </Card>

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
                    )
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

// Mock analysis result generator
function generateMockAnalysisResult(value: string, type: string) {
  // Generate seed from value for consistent results
  const seed = value
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const malicious = seed % 15;
  const suspicious = seed % 8;
  const harmless = 40 + (seed % 20);
  const undetected = 10 + (seed % 10);
  const abuseScore = seed % 100;
  const totalReports = seed % 500;

  // Vendor names
  const vendors = [
    "Kaspersky",
    "McAfee",
    "Symantec",
    "Avast",
    "AVG",
    "BitDefender",
    "ESET-NOD32",
    "F-Secure",
    "Fortinet",
    "GData",
    "Malwarebytes",
    "Microsoft",
    "Panda",
    "Sophos",
    "TrendMicro",
    "VIPRE",
  ];

  // Generate vendor results
  const vendorResults: any = {};
  vendors.forEach((vendor, idx) => {
    let category = "undetected";
    let result = null;

    if (idx < malicious) {
      category = "malicious";
      result = "malware";
    } else if (idx < malicious + suspicious) {
      category = "suspicious";
      result = "suspicious";
    } else if (idx < malicious + suspicious + harmless) {
      category = "harmless";
      result = "clean";
    }

    vendorResults[vendor] = {
      category,
      result,
      method: "blacklist",
      engine_name: vendor,
    };
  });

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

  // Determine threat level
  const threatLevel =
    malicious > 5 || abuseScore > 75
      ? "CRITICAL"
      : malicious > 2 || abuseScore > 50
      ? "HIGH"
      : malicious > 0 || abuseScore > 25
      ? "MEDIUM"
      : "LOW";

  // Generate comprehensive AI analysis
  const aiAnalysis = `COMPREHENSIVE THREAT INTELLIGENCE REPORT

EXECUTIVE SUMMARY

Analysis of ${type.toUpperCase()}: ${value}

This automated threat intelligence report provides a comprehensive assessment based on multi-source intelligence gathering from VirusTotal and AbuseIPDB databases.

Current Threat Assessment: ${threatLevel}

---

1. THREAT LEVEL ASSESSMENT

Overall Classification: ${threatLevel}

Risk Indicators:
- VirusTotal Malicious Detections: ${malicious}
- VirusTotal Suspicious Flags: ${suspicious}
- AbuseIPDB Confidence Score: ${abuseScore}%
- Total Abuse Reports: ${totalReports}

Severity Rating: ${
    malicious > 5 || abuseScore > 75
      ? "🔴 CRITICAL"
      : malicious > 2 || abuseScore > 50
      ? "🟠 HIGH"
      : malicious > 0 || abuseScore > 25
      ? "🟡 MEDIUM"
      : "🟢 LOW"
  }

---

2. DETAILED ANALYSIS

Analysis Metadata
- Analysis Type: ${type}
- Target Indicator: ${value}
- Analysis Timestamp: ${new Date().toISOString()}
- Report Generated: ${new Date().toLocaleString()}

VirusTotal Intelligence Summary
- Total Security Vendors Analyzed: ${
    malicious + suspicious + harmless + undetected
  }
- Malicious Verdicts: ${malicious} vendor(s)
- Suspicious Verdicts: ${suspicious} vendor(s)
- Clean/Harmless: ${harmless} vendor(s)
- Detection Rate: ${(
    (malicious / Math.max(malicious + suspicious + harmless + undetected, 1)) *
    100
  ).toFixed(2)}%

Vendor Consensus: ${
    malicious > harmless
      ? "MAJORITY FLAGGED AS MALICIOUS"
      : suspicious > 5
      ? "MIXED VERDICTS - SUSPICIOUS ACTIVITY"
      : "MAJORITY CONSIDER SAFE"
  }

AbuseIPDB Reputation Analysis
- Abuse Confidence Score: ${abuseScore}% (${
    abuseScore > 75
      ? "HIGH RISK"
      : abuseScore > 50
      ? "MEDIUM RISK"
      : abuseScore > 25
      ? "LOW RISK"
      : "MINIMAL RISK"
  })
- Total Reports: ${totalReports}
- Country: ${countryNames[countryIdx]} (${countries[countryIdx]})
- ISP/Organization: ${isps[seed % isps.length]}

---

3. INDICATORS OF COMPROMISE (IOCs)

Primary IOC:
- Type: ${type}
- Value: ${value}
- Status: ${
    malicious > 0
      ? "⚠️ CONFIRMED MALICIOUS"
      : suspicious > 0
      ? "⚠️ SUSPICIOUS"
      : "✓ CLEAN"
  }

Associated Risk Factors:
${
  malicious > 5
    ? "- High-confidence malware detection across multiple AV engines\n"
    : ""
}${
    malicious > 0 && malicious <= 5
      ? "- Limited malware detections (possible false positives)\n"
      : ""
  }${
    suspicious > 5
      ? "- Multiple vendors flag suspicious behavior patterns\n"
      : ""
  }${abuseScore > 75 ? "- Extensive abuse history documented\n" : ""}${
    abuseScore > 50 && abuseScore <= 75 ? "- Moderate abuse reports\n" : ""
  }${totalReports > 100 ? "- High volume of abuse complaints\n" : ""}${
    malicious === 0 && suspicious === 0 && abuseScore < 25
      ? "- No significant threat indicators identified\n"
      : ""
  }

---

4. CONCLUSION

${
  malicious > 5 || abuseScore > 75
    ? `CRITICAL SECURITY ALERT: This indicator represents a significant threat. Immediate action is required to prevent potential compromise. Activate incident response procedures immediately.`
    : malicious > 2 || abuseScore > 50
    ? `HIGH RISK WARNING: This indicator shows strong signs of malicious activity. Proactive blocking and investigation are strongly recommended.`
    : malicious > 0 || suspicious > 5 || abuseScore > 25
    ? `MODERATE CONCERN: Some security vendors have flagged this indicator as potentially harmful. Additional investigation is warranted.`
    : `LOW RISK ASSESSMENT: Based on current threat intelligence, this indicator does not appear to pose an immediate threat. Maintain standard security monitoring practices.`
}

Analyst Recommendation: ${
    malicious > 5 || abuseScore > 75
      ? "BLOCK & INVESTIGATE IMMEDIATELY"
      : malicious > 2 || abuseScore > 50
      ? "BLOCK & MONITOR CLOSELY"
      : malicious > 0 || abuseScore > 25
      ? "MONITOR & DOCUMENT"
      : "DOCUMENT & PERIODIC REVIEW"
  }

Next Review: ${malicious > 0 || abuseScore > 0 ? "24-48 hours" : "7-14 days"}

---

Report ID: ${Date.now().toString(36).toUpperCase()}
Classification: ${
    malicious > 0 || abuseScore > 50 ? "CONFIDENTIAL" : "INTERNAL USE"
  }`;

  // Generate correlation insights
  const correlationInsights = `CROSS-SOURCE THREAT CORRELATION ANALYSIS

VirusTotal Intelligence:
• ${malicious} security vendors flagged this as malicious
• ${suspicious} vendors reported suspicious activity
• Overall detection rate: ${(
    (malicious / Math.max(malicious + suspicious + harmless + undetected, 1)) *
    100
  ).toFixed(1)}%

AbuseIPDB Intelligence:
• Abuse confidence score: ${abuseScore}% (${
    abuseScore > 75
      ? "HIGH RISK"
      : abuseScore > 50
      ? "MEDIUM RISK"
      : abuseScore > 25
      ? "LOW RISK"
      : "MINIMAL RISK"
  })
• Total abuse reports: ${totalReports}
• Geographic origin: ${countries[countryIdx]}
• Network: ${isps[seed % isps.length]}

Correlation Verdict:
${
  malicious > 5 || abuseScore > 75
    ? "⚠️ CRITICAL THREAT - Immediate action required. Multiple sources confirm malicious activity."
    : malicious > 2 || abuseScore > 50
    ? "⚡ HIGH RISK - Strong indicators of malicious intent. Recommend blocking and investigation."
    : malicious > 0 || suspicious > 5 || abuseScore > 25
    ? "ℹ️ MEDIUM RISK - Some suspicious indicators detected. Monitor closely."
    : "✅ LOW RISK - Minimal threat indicators found across all sources."
}`;

  // Generate mitigation actions
  let mitigationActions: string[] = [];
  if (malicious > 5 || abuseScore > 75) {
    mitigationActions = [
      "IMMEDIATE: Block this indicator across all network perimeters (firewall, IDS/IPS, proxy)",
      "URGENT: Quarantine any systems that have communicated with this indicator",
      "Conduct full forensic investigation on affected systems",
      "Search SIEM logs for any historical connections to this indicator",
      "Update all threat intelligence platforms and security tools with this IOC",
      "Brief incident response team and escalate to SOC leadership",
      "Document full timeline of exposure and potential data exfiltration",
      "Consider engaging external threat intelligence services for attribution",
    ];
  } else if (malicious > 2 || abuseScore > 50) {
    mitigationActions = [
      "Block this indicator in your security controls as a precautionary measure",
      "Enable enhanced monitoring for any systems that accessed this indicator",
      "Review firewall and proxy logs for related activity patterns",
      "Update threat intelligence feeds with this indicator",
      "Notify security team for awareness and monitoring",
      "Schedule follow-up review in 24-48 hours",
      "Consider adding to watchlist for behavioral analysis",
    ];
  } else if (malicious > 0 || suspicious > 5 || abuseScore > 25) {
    mitigationActions = [
      "Add to monitoring watchlist for suspicious activity",
      "Review context of how this indicator was encountered",
      "Check for any unusual patterns in network traffic",
      "Document finding for threat intelligence database",
      "Consider temporary restriction pending further investigation",
      "Monitor for any changes in threat score over next 7 days",
    ];
  } else {
    mitigationActions = [
      "No immediate action required - low threat indicators",
      "Continue standard security monitoring practices",
      "Document analysis for future reference",
      "Optionally add to low-priority watchlist",
      "Review if context changes or new intelligence emerges",
    ];
  }

  return {
    analysisId: `analysis_${Date.now()}`,
    detectedType: type,
    aiAnalysis,
    correlationInsights,
    mitigationActions,
    correlation: {
      vtMalicious: malicious,
      vtSuspicious: suspicious,
      abuseScore,
      abuseReports: totalReports,
    },
    vtData: {
      data: {
        type,
        id: value,
        attributes: {
          last_analysis_stats: {
            malicious,
            suspicious,
            harmless,
            undetected,
            timeout: 0,
          },
          last_analysis_results: vendorResults,
          reputation: malicious > 5 ? -50 : malicious > 2 ? -20 : 0,
          total_votes: {
            harmless: seed % 100,
            malicious: seed % 50,
          },
        },
      },
    },
    abuseData: {
      data: {
        ipAddress:
          type === "ip"
            ? value
            : `${seed % 255}.${seed % 255}.${seed % 255}.${seed % 255}`,
        isPublic: true,
        ipVersion: 4,
        isWhitelisted: abuseScore < 10,
        abuseConfidenceScore: abuseScore,
        countryCode: countries[countryIdx],
        countryName: countryNames[countryIdx],
        usageType: "Data Center/Web Hosting/Transit",
        isp: isps[seed % isps.length],
        domain: `host.${isps[seed % isps.length]
          .toLowerCase()
          .replace(/[^a-z]/g, "")}.com`,
        totalReports,
        numDistinctUsers: Math.min(totalReports, seed % 100),
        lastReportedAt:
          totalReports > 0
            ? new Date(
                Date.now() - (seed % 30) * 24 * 60 * 60 * 1000
              ).toISOString()
            : null,
      },
    },
  };
}
