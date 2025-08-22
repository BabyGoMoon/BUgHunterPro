import { NextResponse } from "next/server";
import { resolve as dnsResolve } from "node:dns/promises";

// Make sure this runs on Node.js (not Edge)
export const runtime = "nodejs";
// Avoid static optimization issues
export const dynamic = "force-dynamic";

type Payload = {
  domain?: string;
  wordlist?: string[];
};

export async function POST(req: Request) {
  try {
    const { domain, wordlist }: Payload = await req.json();

    if (!domain || !Array.isArray(wordlist)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const found: string[] = [];

    // Resolve each candidate subdomain; collect the ones that resolve
    await Promise.all(
      wordlist.map(async (word) => {
        const sub = `${word}.${domain}`;
        try {
          await dnsResolve(sub);
          found.push(sub);
        } catch {
          // not valid, skip
        }
      })
    );

    return NextResponse.json({ results: found }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: simple health check
export async function GET() {
  return NextResponse.json({ ok: true });
}
