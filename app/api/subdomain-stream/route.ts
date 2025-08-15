import dns from "dns/promises";

// Helper function to verify if a subdomain exists via DNS lookup
async function verifySubdomain(subdomain: string): Promise<boolean> {
  try {
    // We can check for A (IPv4), AAAA (IPv6), or CNAME records.
    // resolve() looks for A or AAAA records.
    const addresses = await dns.resolve(subdomain);
    // If we get any address back, the subdomain is live.
    return addresses && addresses.length > 0;
  } catch (error: any) {
    // Common errors for non-existent domains are ENOTFOUND, ENODATA
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return false;
    }
    // For other potential errors, we can log them but assume not found
    console.error(`DNS check failed for ${subdomain}:`, error.code);
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return new Response("Missing domain parameter", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: any) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      try {
        sendEvent("status", { message: "Initializing verified scan..." });
        
        const wordlist = [
            "www", "mail", "ftp", "localhost", "webmail", "smtp", "webdisk", "pop", "cpanel", "whm", "ns1", "ns2",
            "autodiscover", "autoconfig", "ns", "test", "m", "blog", "dev", "www2", "ns3", "pop3", "forum", "admin",
            "mail2", "vpn", "mx", "imap", "old", "new", "mobile", "mysql", "beta", "support", "cp", "secure", "shop",
            "demo", "dns2", "ns4", "dns1", "static", "lists", "web", "www1", "img", "news", "portal", "server", "wiki",
            "api", "media", "images", "backup", "dns", "sql", "intranet", "stats",
            "host", "video", "mail1", "mx1", "www3", "staging", "sip", "chat", "search", "crm", "mx2", "ads",
            "remote", "email", "my", "wap", "svn", "store", "cms", "download", "proxy", "mssql",
            "apps", "dns3", "exchange", "mail3", "forums", "ns5", "db", "office", "live", "files", "info", "owa",
            "monitor", "helpdesk", "panel", "sms", "newsletter", "ftp2", "web1", "web2", "upload", "home", "bbs",
            "login", "app", "en", "blogs", "it", "cdn", "stage", "gw", "dns4"
            // This is a truncated list for brevity. Your full list will be used.
        ];

        let totalFound = 0;
        let checkedCount = 0;

        // --- Verification from Wordlist ---
        sendEvent("status", { message: `Checking ${wordlist.length} potential subdomains...` });

        for (const sub of wordlist) {
          const subdomain = `${sub}.${domain}`;
          const isLive = await verifySubdomain(subdomain);
          checkedCount++;
          
          if (isLive) {
            totalFound++;
            const riskLevel = ["admin", "dev", "staging", "test", "secure", "vpn", "sql", "mysql", "db", "database", "backup", "root", "cpanel", "whm", "phpmyadmin", "internal", "private"].includes(sub)
              ? "high"
              : ["api", "portal", "dashboard", "beta", "demo", "sso", "auth", "login", "signin"].includes(sub)
                ? "medium"
                : "low";

            sendEvent("subdomain", {
              subdomain,
              riskLevel,
              source: "wordlist (verified)",
            });
          }
          // Optional: Send progress updates to the frontend
          if (checkedCount % 20 === 0) {
              sendEvent("status", { message: `Checked ${checkedCount}/${wordlist.length}... Found ${totalFound} live.` });
          }
        }

        // --- Verification from Certificate Transparency ---
        sendEvent("status", { message: "Querying and verifying certificate transparency logs..." });

        try {
          const ctUrl = `https://crt.sh/?q=%25.${domain}&output=json`;
          const response = await fetch(ctUrl, {
            headers: { "User-Agent": "BugHunter-Pro/1.0" },
            signal: AbortSignal.timeout(10000),
          });

          if (response.ok) {
            const data = await response.json();
            const ctSubdomains = new Set<string>();

            if (Array.isArray(data)) {
              data.forEach((entry: any) => {
                if (entry.name_value) {
                  entry.name_value.split("\n").forEach((name: string) => {
                    const cleanName = name.trim().toLowerCase().replace('*.', '');
                    if (cleanName.endsWith(`.${domain}`) && !wordlist.includes(cleanName.replace(`.${domain}`, ''))) {
                      ctSubdomains.add(cleanName);
                    }
                  });
                }
              });

              for (const subdomain of ctSubdomains) {
                const isLive = await verifySubdomain(subdomain);
                if (isLive) {
                  totalFound++;
                  const riskLevel = subdomain.includes("admin") || subdomain.includes("dev") || subdomain.includes("staging") ? "high" : "medium";
                  sendEvent("subdomain", {
                    subdomain,
                    riskLevel,
                    source: "certificate (verified)",
                  });
                }
              }
            }
          }
        } catch (ctError) {
          console.error("Certificate transparency error:", ctError);
          sendEvent("status", { message: "Certificate transparency query failed, continuing..." });
        }

        sendEvent("complete", {
          total: totalFound,
          message: `Scan complete! Found ${totalFound} verified subdomains.`,
        });
      } catch (error) {
        sendEvent("error", {
          message: error instanceof Error ? error.message : "An unknown error occurred",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
