import React, { useState, useEffect } from "react";
import { projectId } from "../utils/supabase/info";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Download, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

interface HistoryPageProps {
  accessToken: string;
}

interface HistoryItem {
  analysisId: string;
  fileName: string;
  format: string;
  downloadedAt: string;
}

export function HistoryPage({ accessToken }: HistoryPageProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("History fetch error:", data);
        toast.error("Failed to load history");
        return;
      }

      setHistory(data.history || []);
    } catch (error) {
      console.error("History fetch processing error:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleRedownload = async (item: HistoryItem) => {
    try {
      // Fetch the original analysis
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/analysis/${item.analysisId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Analysis fetch error:", data);
        toast.error("Failed to fetch analysis data");
        return;
      }

      // Generate downloadable file content
      const content = generateReportContent(data.analysis);
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.fileName;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Report re-downloaded successfully");
    } catch (error) {
      console.error("Re-download error:", error);
      toast.error("Failed to re-download report");
    }
  };

  const generateReportContent = (analysis: any) => {
    return `
CYBER THREAT INTELLIGENCE REPORT
================================

Analysis Type: ${analysis.type?.toUpperCase() || "N/A"}
Analysis Target: ${analysis.value || "N/A"}
Generated: ${new Date(analysis.timestamp).toLocaleString()}

${analysis.aiAnalysis || "No AI analysis available"}

---
RAW DATA
---

VirusTotal Data:
${JSON.stringify(analysis.vtData, null, 2)}

${
  analysis.abuseData
    ? `\nAbuseIPDB Data:\n${JSON.stringify(analysis.abuseData, null, 2)}`
    : ""
}
`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          Download History
        </h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.9375rem" }}>
          View and re-download your previous threat analysis reports
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Downloaded Reports</CardTitle>
          <CardDescription>
            All reports you've downloaded are stored here for easy access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No download history yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Downloaded reports will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Downloaded At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.fileName}</TableCell>
                    <TableCell>
                      <span className="uppercase text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                        {item.format}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(item.downloadedAt)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRedownload(item)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Re-download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
