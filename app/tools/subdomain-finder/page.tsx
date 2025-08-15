// app/tools/subdomain-finder/page.tsx
import React from "react";
import dynamic from "next/dynamic";

const SubdomainFinderClient = dynamic(() => import("../../../components/SubdomainFinderClient"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Subdomain Finder</h1>
      <div className="bg-white shadow rounded p-4">
        <SubdomainFinderClient />
      </div>
    </div>
  );
}
