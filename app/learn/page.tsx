"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Clock, Trophy, Search, Star } from "lucide-react"
import Link from "next/link"

const tutorials = [
  {
    id: 1,
    title: "Web Application Security Fundamentals",
    description:
      "Learn the basics of web application security, including common vulnerabilities and how to prevent them.",
    difficulty: "Beginner",
    duration: "45 min",
    points: 100,
    category: "Web Security",
    rating: 4.8,
    students: 1234,
    image: "/cybersecurity-tutorial.png",
  },
  {
    id: 2,
    title: "Advanced SQL Injection Techniques",
    description: "Deep dive into SQL injection attacks, detection methods, and advanced exploitation techniques.",
    difficulty: "Advanced",
    duration: "90 min",
    points: 250,
    category: "Database Security",
    rating: 4.9,
    students: 856,
    image: "/sql-injection-hacking.png",
  },
  {
    id: 3,
    title: "Cross-Site Scripting (XSS) Mastery",
    description: "Master XSS vulnerabilities, from basic reflected XSS to advanced DOM-based attacks.",
    difficulty: "Intermediate",
    duration: "60 min",
    points: 150,
    category: "Web Security",
    rating: 4.7,
    students: 967,
    image: "/xss-cross-site-scripting.png",
  },
  {
    id: 4,
    title: "Network Reconnaissance & Enumeration",
    description: "Learn professional reconnaissance techniques used by ethical hackers and penetration testers.",
    difficulty: "Intermediate",
    duration: "75 min",
    points: 200,
    category: "Network Security",
    rating: 4.6,
    students: 743,
    image: "/network-reconnaissance-hacking.png",
  },
  {
    id: 5,
    title: "API Security Testing",
    description: "Comprehensive guide to testing REST APIs for security vulnerabilities and misconfigurations.",
    difficulty: "Advanced",
    duration: "120 min",
    points: 300,
    category: "API Security",
    rating: 4.8,
    students: 542,
    image: "/api-security-testing.png",
  },
  {
    id: 6,
    title: "Mobile Application Security",
    description: "Security testing methodologies for iOS and Android applications.",
    difficulty: "Advanced",
    duration: "100 min",
    points: 275,
    category: "Mobile Security",
    rating: 4.5,
    students: 398,
    image: "/mobile-app-security.png",
  },
]

const blogPosts = [
  {
    id: 1,
    title: "The Rise of AI-Powered Cyber Attacks",
    excerpt: "How artificial intelligence is changing the cybersecurity landscape and what defenders need to know.",
    author: "Dr. Sarah Chen",
    date: "2024-01-15",
    readTime: "8 min",
    points: 50,
    category: "Threat Intelligence",
    image: "/ai-cybersecurity-threats.png",
  },
  {
    id: 2,
    title: "Zero-Day Vulnerabilities: A Deep Dive",
    excerpt: "Understanding zero-day exploits, their impact, and how organizations can protect themselves.",
    author: "Marcus Rodriguez",
    date: "2024-01-12",
    readTime: "12 min",
    points: 75,
    category: "Vulnerability Research",
    image: "/zero-day-vulnerability.png",
  },
  {
    id: 3,
    title: "Building a Career in Cybersecurity",
    excerpt: "Essential skills, certifications, and career paths for aspiring cybersecurity professionals.",
    author: "Jennifer Park",
    date: "2024-01-10",
    readTime: "6 min",
    points: 40,
    category: "Career",
    image: "/cybersecurity-career.png",
  },
]

export default function LearnPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const categories = ["All", "Web Security", "Network Security", "Database Security", "API Security", "Mobile Security"]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || tutorial.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || tutorial.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-panel m-6 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-green mb-4">Learning Hub</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master cybersecurity through hands-on tutorials, expert insights, and real-world scenarios. Earn points and
            unlock achievements as you learn.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tutorials and articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-foreground"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-foreground"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tutorials Section */}
      <div className="mx-6 mb-8">
        <h2 className="text-2xl font-bold text-primary-green mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Interactive Tutorials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial.id} className="glass-panel hover:neon-border transition-all duration-300 group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={tutorial.image || "/placeholder.svg"}
                  alt={tutorial.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 right-2 bg-primary-green text-black">+{tutorial.points} XP</Badge>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs">
                    {tutorial.category}
                  </Badge>
                  <Badge
                    variant={
                      tutorial.difficulty === "Beginner"
                        ? "default"
                        : tutorial.difficulty === "Intermediate"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {tutorial.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary-green transition-colors">
                  {tutorial.title}
                </CardTitle>
                <CardDescription className="text-sm">{tutorial.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {tutorial.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {tutorial.rating}
                  </div>
                  <div>{tutorial.students} students</div>
                </div>
                <Link href={`/learn/tutorial/${tutorial.id}`}>
                  <Button className="w-full cyber-button">Start Tutorial</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="mx-6 mb-8">
        <h2 className="text-2xl font-bold text-primary-green mb-6 flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Expert Insights & Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="glass-panel hover:neon-border transition-all duration-300 group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 right-2 bg-primary-green text-black">+{post.points} XP</Badge>
              </div>
              <CardHeader>
                <Badge variant="outline" className="text-xs w-fit">
                  {post.category}
                </Badge>
                <CardTitle className="text-lg group-hover:text-primary-green transition-colors">{post.title}</CardTitle>
                <CardDescription className="text-sm">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div>By {post.author}</div>
                  <div>{post.readTime} read</div>
                </div>
                <div className="text-xs text-muted-foreground mb-4">{post.date}</div>
                <Link href={`/learn/article/${post.id}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Read Article
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
