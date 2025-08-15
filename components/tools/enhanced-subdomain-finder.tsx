"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Download,
  Copy,
  ExternalLink,
  Shield,
  Globe,
  Zap,
  CheckCircle,
} from "lucide-react";

// --- START: Progress Component ---
interface SubdomainScannerProgressProps {
  domain: string;
  statusMessage: string;
}

function SubdomainScannerProgress({
  domain,
  statusMessage,
}: SubdomainScannerProgressProps) {
  return (
    <Card className="glass-panel border-primary-green/30 animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="text-primary-green flex items-center gap-2">
          <div className="w-2 h-2 bg-vibrant-green rounded-full animate-pulse" />
          Scanning in Progress...
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-lg">
          Target: <span className="font-mono text-vibrant-green">{domain}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{statusMessage}</span>
            <span className="text-primary-green font-semibold">Verifying...</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-inner" style={{ width: "40%" }}></div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
          <Zap className="h-4 w-4 text-yellow-400" />
          <p>Performing live DNS checks. This may take a few moments.</p>
        </div>
      </CardContent>
    </Card>
  );
}
// --- END: Progress Component ---

interface SubdomainResult {
  subdomain: string;
  riskLevel: "high" | "medium" | "low";
  source: string;
}

interface ScanStats {
  total: number;
  fromWordlist: number;
  fromCertificates: number;
}

export default function EnhancedSubdomainFinder() {
  const [domainInput, setDomainInput] = useState("");
  const [scanTarget, setScanTarget] = useState<string | null>(null);
  const [lastScanTarget, setLastScanTarget] = useState<string | null>(null); // ✅ Keeps last scanned domain for CSV
  const [results, setResults] = useState<SubdomainResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [stats, setStats] = useState<ScanStats>({
    total: 0,
    fromWordlist: 0,
    fromCertificates: 0,
  });
  const eventSourceRef = useRef<EventSource | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => eventSourceRef.current?.close();
  }, []);

  const startScan = () => {
    if (!domainInput || isScanning) return;
    setIsScanning(true);
    setResults([]);
    setStats({ total: 0, fromWordlist: 0, fromCertificates: 0 });
    setStatusMessage("Initializing verified scan...");
    setScanTarget(domainInput);
    setLastScanTarget(domainInput); // ✅ Save for later export
  };

  useEffect(() => {
    if (!scanTarget) return;

    eventSourceRef.current?.close();

    const url = `/api/subdomain-stream?domain=${encodeURIComponent(scanTarget)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () =>
      console.log("SSE connection established for", scanTarget);

    es.addEventListener("status", (event) => {
      const data = JSON.parse(event.data);
      setStatusMessage(data.message || "");
    });

    es.addEventListener("subdomain", (event) => {
      const newSubdomain: SubdomainResult = JSON.parse(event.data);
      setResults((prev) => [...prev, newSubdomain]);

      setStats((prev) => ({
        total: prev.total + 1,
        fromWordlist:
          prev.fromWordlist +
          (newSubdomain.source.includes("wordlist") ? 1 : 0),
        fromCertificates:
          prev.fromCertificates +
          (newSubdomain.source.includes("certificate") ? 1 : 0),
      }));
    });

    es.addEventListener("complete", (event) => {
      const data = JSON.parse(event.data);
      setStatusMessage(data.message || "");
      setIsScanning(false);
      setScanTarget(null);
      es.close();
    });

    es.onerror = (error) => {
      console.error("EventSource failed:", error);
      setStatusMessage("An error occurred during the scan.");
      setIsScanning(false);
      setScanTarget(null);
      es.close();
    };

    return () => es.close();
  }, [scanTarget]);

  const exportToCSV = () => {
    const csvContent = [
      "Subdomain,Risk Level,Source",
      ...results.map((r) => `${r.subdomain},${r.riskLevel},${r.source}`),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `verified-subdomains-${
      lastScanTarget || "unknown"
    }.csv`; // ✅ Always uses last domain
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyAllSubdomains = () => {
    navigator.clipboard.writeText(results.map((r) => r.subdomain).join("\n"));
  };

  const getRiskColor = (risk: string) => {
    switch ((risk || "").toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "low":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getSourceIcon = (source: string) => {
    if (source.includes("wordlist"))
      return <Search className="h-3 w-3 text-primary-green" />;
    if (source.includes("certificate"))
      return <Shield className="h-3 w-3 text-blue-400" />;
    return <Globe className="h-3 w-3" />;
  };

  if (isScanning) {
    return (
      <SubdomainScannerProgress
        domain={scanTarget || ""}
        statusMessage={statusMessage}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-primary-green header-title">
            Verified Subdomain Finder
          </CardTitle>
          <p className="text-muted-foreground">
            Multi-source subdomain discovery with live DNS verification.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="example.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={startScan}
              disabled={!domainInput}
              className="cyber-button"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Start Verified Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {!isScanning && results.length > 0 && (
        <>
          <Card className="glass-panel">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-green">
                    {stats.total}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verified Subdomains
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-vibrant-green">
                    {stats.fromWordlist}
                  </div>
                  <p className="text-sm text-muted-foreground">From Wordlist</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {stats.fromCertificates}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    From Certificates
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">
                    {results.filter((r) => r.riskLevel === "high").length}
                  </div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-primary-green">
                  Discovered Subdomains
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyAllSubdomains}>
                    <Copy className="h-4 w-4 mr-2" /> Copy All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportToCSV}
                    className="export-csv"
                  >
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="results-container h-96">
                <div className="subdomain-list">
                  {results.map((result, index) => (
                    <div
                      key={`${result.subdomain}-${index}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-background/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://${result.subdomain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm hover:text-primary-green transition-colors"
                          >
                            {result.subdomain}
                          </a>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRiskColor(result.riskLevel)}>
                            {result.riskLevel} risk
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {getSourceIcon(result.source)}
                            <span>{result.source.replace(/_/g, " ")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
