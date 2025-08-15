"use client";

import { useState } from "react";

// 🔹 Helper to call our API route
async function runScan(domain: string) {
  const res = await fetch("/api/subdomain-finder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain }),
  });
  return res.json();
}

export default function SubdomainFinderPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Called when user clicks "Scan"
  async function handleScan() {
    setError(null);
    if (!domain.includes(".")) {
      setError("Enter a valid domain (e.g., example.com)");
      return;
    }
    setLoading(true);
    try {
      const data = await runScan(domain.trim().toLowerCase());
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results || []);
      }
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Subdomain Finder</h1>

      {/* Input + Button */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder="Enter domain (e.g., example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button
          onClick={handleScan}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Subdomain</th>
              <th className="border p-2 text-left">DNS</th>
              <th className="border p-2 text-left">HTTP</th>
              <th className="border p-2 text-left">HTTPS</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td className="border p-2">{r.subdomain}</td>
                <td className="border p-2">{r.dns || "N/A"}</td>
                <td className="border p-2">
                  {r.http ? "✅" : "❌"}
                </td>
                <td className="border p-2">
                  {r.https ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
