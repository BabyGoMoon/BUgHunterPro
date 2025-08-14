import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface SubdomainScannerProgressProps {
  domain: string;
  statusMessage: string;
}

export default function SubdomainScannerProgress({ domain, statusMessage }: SubdomainScannerProgressProps) {
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
            <span className="text-primary-green font-semibold">100%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-inner" style={{ width: '40%' }}></div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
          <Zap className="h-4 w-4 text-yellow-400" />
          <p>This may take a few moments. AI-powered analysis and certificate transparency logs are being queried.</p>
        </div>
      </CardContent>
    </Card>
  );
}
