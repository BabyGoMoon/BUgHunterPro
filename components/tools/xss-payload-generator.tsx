"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Zap, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function XssPayloadGenerator() {
  const [payloads, setPayloads] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generatePayloads = async () => {
    setIsLoading(true);
    setPayloads([]);
    try {
      const response = await fetch('/api/xss-payload-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 50 }), // Generate 50 payloads
      });
      const data = await response.json();
      if (data.payloads) {
        setPayloads(data.payloads);
      }
    } catch (error) {
      console.error("Failed to fetch payloads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-primary-green flex items-center gap-2">
            <Zap className="h-5 w-5" />
            XSS Payload Generator
          </CardTitle>
          <p className="text-muted-foreground">
            Generate dynamic XSS payloads for authorized security testing.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button onClick={generatePayloads} disabled={isLoading} className="cyber-button px-8 py-6 text-lg">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-5 w-5 mr-2" />}
            {isLoading ? "Generating..." : "Generate Payloads"}
          </Button>
        </CardContent>
      </Card>

      {payloads.length > 0 && (
        <Card className="glass-panel">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-primary-green">Generated Payloads</CardTitle>
                <Badge variant="secondary">{payloads.length} Payloads</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 border border-primary-green/20 rounded-md p-2 bg-black/20">
                <div className="space-y-2 p-2">
                    {payloads.map((payload, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg group">
                            <pre className="text-sm text-yellow-300 font-mono break-all pr-4">
                                <code>{payload}</code>
                            </pre>
                            <Button size="icon" variant="ghost" className="h-8 w-8 opacity-20 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(payload)}>
                                <Copy className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card className="border-red-500/30 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Disclaimer
          </CardTitle>
          <p className="text-red-400/80 text-sm">
            These payloads are for educational and authorized security testing purposes only. Using them on websites without explicit permission is illegal.
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}
