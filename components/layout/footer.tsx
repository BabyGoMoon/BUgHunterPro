import Link from "next/link"
import { Shield, Twitter, Github, Linkedin, Mail } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Tools", href: "/tools" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "/api" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Learning Hub", href: "/learn" },
    { name: "Blog", href: "/blog" },
    { name: "Community", href: "/community" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Security", href: "/security" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR", href: "/gdpr" },
  ],
}

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/bughunterpro", icon: Twitter },
  { name: "GitHub", href: "https://github.com/bughunterpro", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/company/bughunterpro", icon: Linkedin },
  { name: "Email", href: "mailto:contact@bughunterpro.com", icon: Mail },
]

export function Footer() {
  return (
    <footer className="bg-deep-green border-t border-primary-green/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary-green" />
                <div className="absolute inset-0 bg-primary-green/20 rounded-full blur-md" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-green to-vibrant-green bg-clip-text text-transparent">
                BugHunter Pro
              </span>
            </Link>
            <p className="text-foreground/60 mb-6 max-w-sm">
              Professional cybersecurity platform for penetration testers, bug bounty hunters, and security researchers.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="p-2 rounded-lg bg-primary-green/10 border border-primary-green/20 hover:bg-primary-green/20 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-primary-green" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-foreground/60 hover:text-primary-green transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-foreground/60 hover:text-primary-green transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-foreground/60 hover:text-primary-green transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-foreground/60 hover:text-primary-green transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-green/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm">
            © 2025 Anik Hossen Tonmoy. All rights reserved. Built with security in mind.
          </p>
          <p className="text-foreground/60 text-sm mt-4 md:mt-0">Made with ❤️ for the cybersecurity community</p>
        </div>
      </div>
    </footer>
  )
}
