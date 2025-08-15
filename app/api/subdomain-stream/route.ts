import dns from "dns/promises";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// --- Concurrency Helper ---
// This function allows us to run multiple DNS checks at the same time.
async function pMap<T, R>(
  arr: T[],
  mapper: (item: T) => Promise<R>,
  concurrency = 25 // Set to check 25 subdomains in parallel
): Promise<R[]> {
  const results: R[] = [];
  let i = 0;
  const workers = new Array(Math.max(1, concurrency)).fill(0).map(async () => {
    while (i < arr.length) {
      const idx = i++;
      try {
        results[idx] = await mapper(arr[idx]);
      } catch (e) {
        results[idx] = undefined as any; // Store undefined on error to maintain order
      }
    }
  });
  await Promise.all(workers);
  return results.filter(r => r !== undefined); // Filter out any errors
}

// --- DNS Verification ---
// This function checks if a subdomain actually exists.
async function verifySubdomain(subdomain: string): Promise<string | null> {
  try {
    const addresses = await dns.resolve(subdomain);
    return addresses && addresses.length > 0 ? subdomain : null;
  } catch (error: any) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return null;
    }
    return null;
  }
}

// --- Wildcard Detection ---
// This function checks if the server responds to any random subdomain.
async function detectWildcard(domain: string): Promise<boolean> {
  const randomSubdomain = `${crypto.randomBytes(6).toString("hex")}.${domain}`;
  try {
    await dns.resolve(randomSubdomain);
    return true; // If a random subdomain resolves, a wildcard is likely configured
  } catch {
    return false;
  }
}

// --- Main API Route ---
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
        // 1. Wildcard Detection
        sendEvent("status", { message: "Detecting wildcard DNS..." });
        const hasWildcard = await detectWildcard(domain);
        if (hasWildcard) {
          sendEvent("status", { message: "Warning: Wildcard DNS detected. This may affect results." });
        } else {
          sendEvent("status", { message: "No wildcard DNS detected. Starting scan." });
        }

        // 2. Read Wordlist from your uploaded file
        const wordlistPath = path.join(process.cwd(), "wordlists", "subdomains-top1million-5000.txt");
        let wordlist: string[] = [];
        if (fs.existsSync(wordlistPath)) {
          wordlist = fs.readFileSync(wordlistPath, "utf8").split(/\r?\n/).filter(Boolean);
        }
        
        if (wordlist.length === 0) {
            sendEvent("error", { message: "Wordlist not found or is empty. Please check the 'wordlists' folder in your project root." });
            controller.close();
            return;
        }
        sendEvent("status", { message: `Loaded ${wordlist.length} subdomains. Verifying concurrently...` });

        const candidates = wordlist.map(sub => `${sub}.${domain}`);
        let totalFound = 0;

        // 3. Concurrent DNS Lookups
        await pMap(candidates, async (subdomain) => {
            const isLive = await verifySubdomain(subdomain);
            if(isLive) {
                totalFound++;
                const subPart = subdomain.replace(`.${domain}`, '');
                const riskLevel = ["admin", "dev", "staging", "test", "secure", "vpn", "sql", "db", "backup", "root", "cpanel", "internal", "private"].includes(subPart)
                  ? "high"
                  : ["api", "portal", "dashboard", "sso", "auth", "login"].includes(subPart)
                    ? "medium"
                    : "low";

                sendEvent("subdomain", {
                    subdomain,
                    riskLevel,
                    source: "Wordlist (Verified)",
                });
            }
        }, 25); // Concurrency of 25

        sendEvent("status", { message: `Wordlist scan complete. Found ${totalFound} live subdomains.` });

        sendEvent("complete", {
          total: totalFound,
          message: `Scan complete! Found ${totalFound} verified subdomains.`,
        });

      } catch (error) {
        sendEvent("error", { message: "An unexpected error occurred during the scan." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" } });
}
