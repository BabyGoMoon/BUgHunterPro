"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function EnhancedSubdomainFinder() {
  return (
    <div className="space-y-6">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-primary-green header-title">Ultimate Subdomain Enumeration</CardTitle>
          <p className="text-muted-foreground">
            Multi-source subdomain discovery with verification and risk assessment
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="example.com"
              className="flex-1"
            />
            <Button className="cyber-button">
              <Search className="h-4 w-4 mr-2" />
              Start Scan
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="glass-panel p-12 text-center">
        <p className="text-muted-foreground">Ready to scan. Awaiting final code update.</p>
      </Card>
    </div>
  );
}
