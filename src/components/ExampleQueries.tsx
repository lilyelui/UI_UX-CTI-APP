import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface Example {
  type: string;
  value: string;
  description: string;
}

const examples: Example[] = [
  {
    type: "hash",
    value: "44d88612fea8a8f36de82e1278abb02f",
    description: "Known malicious file hash (EICAR test file)",
  },
  {
    type: "domain",
    value: "google.com",
    description: "Legitimate domain for testing",
  },
  {
    type: "ip",
    value: "8.8.8.8",
    description: "Google DNS server",
  },
  {
    type: "url",
    value: "https://www.virustotal.com",
    description: "VirusTotal website",
  },
];

export function ExampleQueries() {
  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Queries</CardTitle>
        <CardDescription>
          Try these examples to test the threat analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {examples.map((example, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                    {example.type}
                  </span>
                  <code className="text-sm">{example.value}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {example.description}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(example.value)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
