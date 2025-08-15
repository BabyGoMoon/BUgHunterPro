// app/api/subdomain-finder/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import * as dns from "dns";

const resolver = dns.promises;
const API_KEY = process.env.SECURITYTRAILS_API_KEY || "";

// ---- DNS + HTTP verification helpers ----
async function dnsAlive(host: string): Promise<boolean> {
  try {
    const checks = await Promise.allSettled([
      resolver.resolve4(host),
      resolver.resolve6(host),
      resolver.resolveCname(host),
      resolver.resolveAny(host),
    ]);
    return checks.some((c) => c.status === "fulfilled");
  } catch {
    return false;
  }
}

const ALIVE_CODES = new Set([
  200, 201, 202, 204, 206, // success
  301, 302, 303, 307, 308, // redirects
  401, 403, 405, 429       // protected/rate-limited still proves presence
]);

async function checkUrl(url: string, timeoutMs = 5000): Promise<boolean> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
    if (ALIVE_CODES.has(res.status)) return true;

    res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
    return ALIVE_CODES.has(res.status);
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

async function httpAlive(host: string): Promise<{ http: boolean; https: boolean }> {
  const [httpsOk, httpOk] = await Promise.all([
    checkUrl(`https://${host}`).catch(() => false),
    checkUrl(`http://${host}`).catch(() => false),
  ]);
  return { https: httpsOk, http: httpOk };
}

async function mapLimit<T, R>(items: T[], limit: number, worker: (item: T, idx: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length) as R[];
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

// ---- API handler ----
export async function GET() {
  return NextResponse.json({ message: "Subdomain Finder API is working" });
}

export async function POST(req: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: "Server missing SECURITYTRAILS_API_KEY" }, { status: 500 });
    }

    const { domain, verify = true, maxConcurrency = 20 } = await req.json();

    if (!domain || typeof domain !== "string" || !domain.includes(".")) {
      return NextResponse.json({ error: "Body must include { domain: 'example.com' }" }, { status: 400 });
    }

    // 1) enumerate with SecurityTrails
    const st = await fetch(
      `https://api.securitytrails.com/v1/domain/${encodeURIComponent(domain)}/subdomains?children_only=false`,
      { headers: { APIKEY: API_KEY } }
    );

    if (!st.ok) {
      const text = await st.text();
      return NextResponse.json({ error: "SecurityTrails error", details: text }, { status: st.status });
    }

    const json = await st.json();
    const candidates: string[] = Array.from(
      new Set((json.subdomains || []).map((s: string) => `${s}.${domain}`.toLowerCase()))
    );

    // 2) optional verification (DNS + HTTP/HTTPS)
    let verified = candidates.map((h) => ({ subdomain: h, dns: false, http: false, https: false }));

    if (verify) {
      const limit = Math.min(50, Math.max(1, Number(maxConcurrency) || 20));
      verified = await mapLimit(candidates, limit, async (host) => {
        const hasDns = await dnsAlive(host);
        if (!hasDns) return { subdomain: host, dns: false, http: false, https: false };
        const { http, https } = await httpAlive(host);
        return { subdomain: host, dns: true, http, https };
      });
    }

    // 3) keep only live subdomains
    const live = verified
      .filter((r) => r.dns && (r.http || r.https))
      .sort((a, b) => a.subdomain.localeCompare(b.subdomain));

    return NextResponse.json({
      domain,
      counts: { total: candidates.length, live: live.length },
      results: live,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Scan failed", details: String(err) }, { status: 500 });
  }
}
