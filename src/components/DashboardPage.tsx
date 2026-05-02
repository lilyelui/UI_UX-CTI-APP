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
      let finalResult: any = {};

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
      console.log(analysisResult);
      const apiData = await apiRes.json();

      console.log("CHAT API:", chatData);
      console.log("UNIFIED API:", apiData);
      console.log(chatData);
      
      if (chatData?.success) {
        finalResult.aiAnalysis          = chatData.aiAnalysis;
        finalResult.vtData              = chatData.vtData;
        finalResult.abuseData           = chatData.abuseData;
        finalResult.mispData            = chatData.mispData;
        finalResult.correlationInsights = chatData.correlationInsights;
        finalResult.confidence = chatData.confidence;
        finalResult.reasoning = chatData.reasoning;
        finalResult.cve = chatData.cve;
        finalResult.cwe = chatData.cwe;
        // Flat string for the MITRE Technique label
        finalResult.mitreTechnique = chatData.mitreTechnique ?? null;
        // ✅ Full objects array — THIS is what the card renders
        finalResult.mitreMitigations = Array.isArray(chatData.mitreMitigations)
          ? chatData.mitreMitigations
          : [];
        finalResult.mitigationActions = finalResult.mitreMitigations.map(
          (m: any) => m.name,
        );
        finalResult.mitigationDetails = finalResult.mitreMitigations;
        finalResult.nvdData = chatData.nvdData;
        finalResult.virusTotalIntel = chatData.virusTotalIntel ?? null;
      }
      console.log(finalResult.virusTotalIntel);
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
      finalResult.analyzedType = type;
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

  const getCorrelationScores = () => {
    const vtRatio = threatStats.malicious / Math.max(totalVendors, 1);
    const abuse = getAbuseIPData()?.abuseConfidenceScore || 0;
    const misp = getMISPData();

    const mispScore =
      (misp?.matchCount || 0) * 15 +
      (misp?.confidence === "High"
        ? 30
        : misp?.confidence === "Medium"
          ? 15
          : 5);

    return {
      malware: vtRatio * 100,
      reputation: abuse,
      intel: Math.min(mispScore, 100),
      confidence: vtRatio * 40 + (abuse / 100) * 30 + (mispScore / 100) * 30,
    };
  };

  // Correlation data for radar chart
  const getCorrelationData = () => {
    const scores = getCorrelationScores();

    return [
      { metric: "Malware", score: scores.malware },
      { metric: "Reputation", score: scores.reputation },
      { metric: "Intel", score: scores.intel },
      { metric: "Confidence", score: scores.confidence },
      { metric: "History", score: scores.intel * 0.8 },
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
  console.log("MISP FULL:", getMISPData());
  console.log("MISP TAGS:", getMISPData()?.tags);
  
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
          
          {/* VirusTotal Intel Card — adaptif berdasarkan tipe input */}
          {analysisResult.virusTotalIntel && (() => {
            const intel = analysisResult.virusTotalIntel;
            const isFile = ["hash-md5", "hash-sha1", "hash-sha256"].includes(detectedType) ||
              // fallback: jika ada file_size atau meaningful_name berarti file
              intel.meaningful_name || intel.file_size;
            
            const currentType = detectedType;
            const isIP = currentType === "ip";
            const hasCrowdsource = Array.isArray(intel.crowdsourced_context) && intel.crowdsourced_context.length > 0;
            const showCveDetected = intel.cve_extracted?.length > 0 && !(isIP && hasCrowdsource);

            // label judul indikator sesuai tipe
            const indicatorLabel: Record<string, string> = {
              "ip": "IP Address",
              "domain": "Domain",
              "url": "URL",
              "hash-md5": "Hash (MD5)",
              "hash-sha1": "Hash (SHA1)",
              "hash-sha256": "Hash (SHA256)",
              "subnet": "Subnet",
              "asn": "ASN",
            };
            const label = indicatorLabel[detectedType] ?? "Indicator";

            return (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" style={{ color: "#ef4444" }} />
                    <CardTitle className="text-base sm:text-lg">
                      VirusTotal Intelligence
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Detailed threat analysis and classification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* ── Detection Summary ── */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* Indicator */}
                    <div className="rounded-lg border p-3 space-y-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p
                        className="text-xs font-mono leading-relaxed max-w-full"
                        style={{ wordBreak: "break-all", overflowWrap: "anywhere" }}
                      >
                        {intel.indicator ?? intel.hash ?? "-"}
                      </p>
                    </div>
                  </div>

                  {/* ── File Metadata — hanya tampil jika file/hash ── */}
                  {isFile && (intel.meaningful_name || intel.type_description || intel.file_size) && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {intel.meaningful_name && (
                        <div className="rounded-lg border p-3 space-y-1">
                          <p className="text-xs text-muted-foreground">File Name</p>
                          <p className="text-sm font-semibold truncate">{intel.meaningful_name}</p>
                        </div>
                      )}
                      {intel.type_description && (
                        <div className="rounded-lg border p-3 space-y-1">
                          <p className="text-xs text-muted-foreground">File Type</p>
                          <p className="text-sm font-semibold">{intel.type_description}</p>
                        </div>
                      )}
                      {intel.file_size && (
                        <div className="rounded-lg border p-3 space-y-1">
                          <p className="text-xs text-muted-foreground">File Size</p>
                          <p className="text-sm font-semibold">
                            {(intel.file_size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Threat Classification ── */}
                  {intel.popular_threat_classification?.popular_threat_category && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                        Threat Classification
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="destructive" className="text-xs">
                          {intel.popular_threat_classification.popular_threat_category}
                        </Badge>
                        {intel.popular_threat_classification.popular_threat_name?.map(
                          (name: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">{name}</Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Tags & CVEs ── */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {intel.tags?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                          Tags
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {intel.tags.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-700 border"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {showCveDetected && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                          CVEs Detected
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {intel.cve_extracted.map((cve: string, i: number) => {
                            const nvdUrl = "https://nvd.nist.gov/vuln/detail/" + cve;
                            return (
                              <a
                                key={i}
                                href={nvdUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 text-xs rounded-md bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors"
                              >
                                {cve}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Crowdsourced Context (IP/domain — mirip screenshot VT) ── */}
                  {intel.crowdsourced_context?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                        Crowdsourced Context
                      </p>
                      <div className="space-y-2">
                        {intel.crowdsourced_context.map((ctx: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-start justify-between rounded-lg border p-3 gap-3"
                          >
                            <div className="space-y-1 flex-1">
                              <p className="text-xs">{ctx.detail}</p>
                              {ctx.source && (
                                <p className="text-xs text-muted-foreground">
                                  Source: {ctx.source}
                                </p>
                              )}
                              {ctx.cve?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {ctx.cve.map((cve: string, j: number) => {
                                    const url = "https://nvd.nist.gov/vuln/detail/" + cve;
                                    return (
                                      <a
                                        key={j}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                                      >
                                        {cve}
                                      </a>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            <Badge
                              variant={
                                ctx.severity === "HIGH" || ctx.severity === "CRITICAL"
                                  ? "destructive"
                                  : ctx.severity === "MEDIUM"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs shrink-0"
                            >
                              {ctx.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Behavior Summary — hanya untuk file ── */}
                  {isFile && intel.behavior_summary && (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                        Behavior Summary
                      </p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {intel.behavior_summary.network_communications?.length > 0 && (
                          <div className="rounded-lg border p-3 space-y-2">
                            <p className="text-xs font-semibold flex items-center gap-1">
                              <Globe className="h-3 w-3" /> Network Communications
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {intel.behavior_summary.network_communications.map((n: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                                  {n}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {intel.behavior_summary.drops_files?.length > 0 && (
                          <div className="rounded-lg border p-3 space-y-2">
                            <p className="text-xs font-semibold">📁 Dropped Files</p>
                            <ul className="space-y-1">
                              {intel.behavior_summary.drops_files.map((f: string, i: number) => (
                                <li key={i} className="text-xs font-mono text-orange-700 bg-orange-50 px-2 py-0.5 rounded">{f}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {intel.behavior_summary.registry_modifications?.length > 0 && (
                          <div className="rounded-lg border p-3 space-y-2">
                            <p className="text-xs font-semibold">🔑 Registry Modifications</p>
                            <ul className="space-y-1">
                              {intel.behavior_summary.registry_modifications.map((r: string, i: number) => (
                                <li key={i} className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded break-all">{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {intel.behavior_summary.processes_created?.length > 0 && (
                          <div className="rounded-lg border p-3 space-y-2">
                            <p className="text-xs font-semibold">⚙️ Processes Created</p>
                            <ul className="space-y-1">
                              {intel.behavior_summary.processes_created.map((p: string, i: number) => (
                                <li key={i} className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-0.5 rounded break-all">{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                          <span className="text-xs text-muted-foreground">Files Encrypted:</span>
                          <Badge variant={intel.behavior_summary.files_encrypted ? "destructive" : "secondary"} className="text-xs">
                            {intel.behavior_summary.files_encrypted ? "YES" : "NO"}
                          </Badge>
                        </div>
                        {intel.behavior_summary.mutex_created && (
                          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                            <span className="text-xs text-muted-foreground">Mutex:</span>
                            <span className="text-xs font-mono">{intel.behavior_summary.mutex_created}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Sigma / IDS Rules — hanya untuk file ── */}
                  {isFile && intel.sigma_analysis_results?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                        IDS / Sigma Rules Matched
                      </p>
                      <div className="space-y-2">
                        {intel.sigma_analysis_results.map((rule: any, i: number) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <p className="text-xs font-semibold">{rule.rule_title}</p>
                              <p className="text-xs text-muted-foreground font-mono">{rule.rule_id}</p>
                            </div>
                            <Badge
                              variant={rule.severity === "CRITICAL" || rule.severity === "HIGH" ? "destructive" : rule.severity === "MEDIUM" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {rule.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            );
          })()}

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
                    <p className="text-xs text-muted-foreground">Score </p>
                    <p className="text-2xl font-bold">
                      {getMISPData()?.score || "-"}
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
                      <p className="text-sm text-muted-foreground">Tags</p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {getMISPData()?.tags?.length ? (
                          getMISPData().tags.map(
                            (tag: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-700 border"
                              >
                                {tag}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Published
                      </p>

                      <p
                        className={`font-semibold mb-5 ${
                          getMISPData()?.published
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {getMISPData()?.published ? "Yes" : "No"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-md bg-blue-100 text-black text-sm font-medium">
                          First: {getMISPData()?.firstPublishDate}
                        </span>

                        <span className="px-3 py-1 rounded-md bg-blue-100 text-black text-sm font-medium">
                          Last: {getMISPData()?.lastPublishDate}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        First Recorded Change
                      </p>
                      <p className="font-semibold text-green-600">
                        {getMISPData()?.firstRecordedChange || "Unknown"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Last change
                      </p>
                      <p className="font-semibold text-green-600">
                        {getMISPData()?.lastChange || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/*Product Detection*/}
          {/* <Card>
            <CardHeader>
              <CardTitle>Technology Detection</CardTitle>
              <CardDescription>
                Fingerprint from Shodan / Censys
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="text-xl font-bold">
                    {analysisResult?.detectedProduct || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="text-xl font-bold">
                    {analysisResult?.detectedVersion || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}
          {/*Censys Data*/}
          {/* {getCensysData() && (
            <Card>
              <CardHeader>
                <CardTitle>Censys Exposure Intelligence</CardTitle>
                <CardDescription>Internet exposed services</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Services</p>
                    <p className="text-2xl font-bold">
                      {getCensysData()?.services?.length || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="text-2xl font-bold">
                      {getCensysData()?.location?.country || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">ASN</p>
                    <p className="text-base font-semibold">
                      {getCensysData()?.autonomous_system?.name || "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}
          {/*NVD Data & Kev*/}
          {/* {getNVDData() && (
            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Intelligence</CardTitle>
                <CardDescription>
                  NVD + CISA Known Exploited Vulnerabilities
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">CVE Count</p>
                    <p className="text-2xl font-bold">
                      {getNVDData()?.vulnerabilities?.length || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">KEV Status</p>

                    <Badge
                      variant={
                        getKEVData()?.exploited ? "destructive" : "secondary"
                      }
                    >
                      {getKEVData()?.exploited
                        ? "Known Exploited"
                        : "Not Listed"}
                    </Badge>
                  </div>
                </div>

                {getNVDData()
                  ?.vulnerabilities?.slice(0, 3)
                  .map((item: any, i: number) => (
                    <div key={i} className="border rounded p-3">
                      <p className="font-semibold">{item.cve?.id}</p>

                      <p className="text-sm text-muted-foreground">
                        {item.cve?.descriptions?.[0]?.value?.slice(0, 160)}...
                      </p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )} */}

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
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="whitespace-pre-wrap">
                        {analysisResult.correlationInsights}
                      </p>
                    </div>
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

              {/* CVE list */}
              {analysisResult.cveList?.length > 0 && (
                <div className="mt-2 text-xs sm:text-sm">
                  <strong>CVE:</strong>{" "}
                  {analysisResult.cveList.map((cve: string, i: number) => (
                    <span key={i} className="mr-2 text-blue-600">
                      {cve}
                    </span>
                  ))}
                </div>
              )}

              {/* Confidence + MITRE badge */}
              {analysisResult.confidence !== undefined && (
                <div className="mt-2 space-y-1 text-xs sm:text-sm">
                  <div>
                    <strong>Confidence:</strong>{" "}
                    <span
                      className={
                        analysisResult.confidence === "High"
                          ? "text-red-600"
                          : analysisResult.confidence === "Medium"
                            ? "text-yellow-500"
                            : "text-green-600"
                      }
                    >
                      {analysisResult.confidence}
                    </span>
                  </div>
                  {analysisResult.mitreTechnique && (
                    <div>
                      <strong>MITRE Technique:</strong>{" "}
                      {analysisResult.mitreTechnique}
                    </div>
                  )}
                </div>
              )}

              {/* Reasoning box */}
              {analysisResult.reasoning && (
                <div className="mt-2 p-2 rounded bg-muted text-xs whitespace-pre-wrap">
                  <strong>Reason:</strong>
                  <br />
                  {analysisResult.reasoning}
                </div>
              )}
            </CardHeader>

            <CardContent>
              {/*
                ✅ FIXED CONDITION:
                Use Array.isArray guard so an empty array doesn't
                accidentally fall through to the mock list.
              */}
              {Array.isArray(analysisResult.mitreMitigations) &&
              analysisResult.mitreMitigations.length > 0 ? (
                <ul className="space-y-3">
                  {analysisResult.mitreMitigations.map(
                    (m: any, index: number) => (
                      <li
                        key={m.id ?? index}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-muted/40"
                      >
                        {/* Step number badge */}
                        <Badge className="mt-0.5 text-xs shrink-0">
                          {index + 1}
                        </Badge>

                        <div className="space-y-1 min-w-0">
                          {/* Mitigation name + MITRE/NIST ID */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold">
                              {m.name}
                            </span>
                            {m.id && (
                              <Badge
                                variant="outline"
                                className="text-xs font-mono"
                              >
                                {m.id}
                              </Badge>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {m.description}
                          </p>

                          {/* Framework tag */}
                          {m.framework && (
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                              {m.framework}
                            </span>
                          )}
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                // ── Fallback: only shown when backend returns nothing ──
                <div className="flex items-center gap-2 p-3 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800 text-xs sm:text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    No specific mitigations returned from the analysis pipeline.
                    Ensure the backend <code>mitreMitigations</code> field is
                    populated and check the server console log.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}