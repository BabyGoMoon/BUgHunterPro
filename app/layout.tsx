import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bug Hunter Pro",
  description: "Web bug hunting tool – prototype",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <header className="border-b">
          <nav className="container flex h-14 items-center gap-6">
            <a href="/" className="font-semibold">Bug Hunter Pro</a>
            <a href="/scan" className="text-sm">Scan</a>
            <a href="/reports" className="text-sm">Reports</a>
          </nav>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="border-t mt-12">
          <div className="container py-6 text-sm text-gray-500">
            © {new Date().getFullYear()} Bug Hunter Pro
          </div>
        </footer>
      </body>
    </html>
  );
}
