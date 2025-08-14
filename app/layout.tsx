import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { AITonmoyBot } from "@/components/ai/ai-tonmoy-bot"
import "./globals.css"

export const metadata: Metadata = {
  title: "BugHunter Pro - Advanced Cybersecurity Platform",
  description:
    "Professional bug hunting and vulnerability assessment platform with real-time scanning, AI-powered suggestions, and gamified learning.",
  generator: "BugHunter Pro",
  keywords: ["cybersecurity", "bug hunting", "vulnerability assessment", "penetration testing", "security scanning"],
  authors: [{ name: "BugHunter Pro Team" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-geist-sans: ${GeistSans.style.fontFamily};
  --font-geist-mono: ${GeistMono.style.fontFamily};
}
        `}</style>
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          {children}
          <AITonmoyBot />
        </ThemeProvider>
      </body>
    </html>
  )
}
