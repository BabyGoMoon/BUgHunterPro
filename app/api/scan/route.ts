import type { NextApiRequest, NextApiResponse } from "next";
import dns from "dns/promises";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { domain, wordlist } = req.body;
  if (!domain || !Array.isArray(wordlist)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const found: string[] = [];

  for (const word of wordlist) {
    const sub = `${word}.${domain}`;
    try {
      await dns.resolve(sub);
      found.push(sub);
    } catch {
      // not valid, skip
    }
  }

  return res.status(200).json({ results: found });
}
