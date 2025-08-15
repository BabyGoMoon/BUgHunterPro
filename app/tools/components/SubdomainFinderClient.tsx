// components/SubdomainFinderClient.tsx
"use client";
import React, { useState } from "react";

type Hit = {
  subdomain: string;
  ips: string[];
  http: { protocol: string; status: number } | null;
  wildcard?: boolean;
  ct?: boolean;
};

export default function SubdomainFinderClient({ initialDomain = "" }: { initialDomain?: string }) {
  const [domain, setDomain] = useState(initialDomain);
  const [results, setResults] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [logs, setLogs] = useState<string[]>([]);

  function addLog(s: string) {
    setLogs((l) => [s, ...l].slice(0, 500));
  }

  async function startScan() {
    if (!domain) return;
    setLoading(true);
    setResults([]);
    setProgress({ done: 0, total: 0 });
    addLog("Initializing scan...");

    // 1) init
    const initRes = await fetch("/api/subdomain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "init", domain }),
    }).then((r) => r.json());

    const total = initRes.totalWords || 0;
    const recommendedBatchSize = initRes.recommendedBatchSize || 300;
    const wildcard = !!initRes.wildcard;
    addLog(`Wordlist size: ${total} — wildcard: ${wildcard}`);

    // 2) crt.sh
    addLog("Fetching crt.sh entries...");
    const ctRes = await fetch("/api/subdomain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "crt", domain }),
    }).then((r) => r.json());
    const ctSet = new Set(((ctRes.ct || []) as string[]).map((s) => s.toLowerCase()));
    addLog(`crt.sh entries: ${ctSet.size}`);

    // 3) chunked scanning
    let start = 0;
    const batchSize = Number(recommendedBatchSize);
    while (start < total) {
      addLog(`Scanning chunk ${start} → ${Math.min(start + batchSize, total) - 1}`);
      try {
        const chunkRes = await fetch("/api/subdomain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "chunk",
            domain,
            start,
            size: batchSize,
            validate: true,
            wildcard,
            concurrency: 25,
          }),
        }).then((r) => r.json());

        const hits: Hit[] = (chunkRes.results || []).map((h: any) => {
          const isCt = ctSet.has(h.subdomain.toLowerCase());
          return { ...h, ct: isCt } as Hit;
        });

        // prefer validated: http or crt or (no wildcard)
        const validated = hits.filter((h: any) => {
          if (h.http) return true;
          if ((h as any).ct) return true;
          if (!wildcard) return true;
          return false;
        });

        setResults((prev) => {
          const existing = new Set(prev.map((p) => p.subdomain));
          const merged = [...prev];
          for (const r of validated) {
            if (!existing.has(r.subdomain)) merged.push(r);
          }
          return merged;
        });

        start = chunkRes.nextStart ?? start + batchSize;
        setProgress({ done: Math.min(start, total), total });
      } catch (e) {
        addLog("Chunk failed: " + String(e));
        start += batchSize;
        setProgress({ done: Math.min(start, total), total });
      }
    }

    addLog("Scan complete.");
    setLoading(false);
  }

  function exportCSV() {
    if (!results.length) return;
    const rows = [
      ["subdomain", "ips", "protocol", "status", "in_crt_logs", "wildcard_flag"],
      ...results.map((r) => [
        r.subdomain,
        (r.ips || []).join(";"),
        r.http?.protocol || "",
        r.http?.status ? String(r.http.status) : "",
        r.ct ? "1" : "0",
        r.wildcard ? "1" : "0",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subdomains-${domain}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          className="border px-3 py-2 rounded flex-1"
        />
        <button onClick={startScan} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Scanning…" : "Scan"}
        </button>
        <button onClick={exportCSV} disabled={!results.length} className="bg-gray-700 text-white px-4 py-2 rounded">
          Export CSV
        </button>
      </div>

      <div className="mt-4">
        <div className="text-sm text-muted">Progress: {progress.done}/{progress.total}</div>
        <div className="mt-3">
          <table className="w-full text-sm table-auto">
            <thead className="text-left">
              <tr>
                <th>Subdomain</th>
                <th>IPs</th>
                <th>HTTP</th>
                <th>CRT</th>
                <th>Wildcard</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.subdomain} className="border-t">
                  <td className="py-1">{r.subdomain}</td>
                  <td>{(r.ips || []).join(", ")}</td>
                  <td>{r.http ? `${r.http.protocol} (${r.http.status})` : "-"}</td>
                  <td>{r.ct ? "yes" : "no"}</td>
                  <td>{r.wildcard ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <details>
          <summary className="cursor-pointer">Logs</summary>
          <div className="max-h-40 overflow-auto mt-2 text-xs">
            {logs.map((l, i) => (
              <div key={i} className="text-gray-600">
                {l}
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
