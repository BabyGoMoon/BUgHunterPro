"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Download,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChartIcon as PieIcon,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, Cell } from "recharts"

const vulnerabilityTrends = [
  { month: "Jan", critical: 12, high: 28, medium: 45, low: 23 },
  { month: "Feb", critical: 8, high: 32, medium: 38, low: 19 },
  { month: "Mar", critical: 15, high: 25, medium: 42, low: 31 },
  { month: "Apr", critical: 6, high: 29, medium: 35, low: 28 },
  { month: "May", critical: 11, high: 22, medium: 48, low: 25 },
  { month: "Jun", critical: 4, high: 18, medium: 52, low: 22 },
]

const severityDistribution = [
  { name: "Critical", value: 56, color: "#ef4444" },
  { name: "High", value: 154, color: "#f97316" },
  { name: "Medium", value: 260, color: "#eab308" },
  { name: "Low", value: 148, color: "#22c55e" },
]

const recentReports = [
  {
    id: 1,
    title: "Quarterly Security Assessment - Q1 2024",
    date: "2024-03-31",
    type: "Comprehensive",
    status: "Completed",
    vulnerabilities: 47,
    severity: "High",
    description: "Complete security assessment covering web applications, network infrastructure, and API endpoints.",
  },
  {
    id: 2,
    title: "E-commerce Platform Penetration Test",
    date: "2024-03-28",
    type: "Penetration Test",
    status: "Completed",
    vulnerabilities: 23,
    severity: "Medium",
    description: "Focused penetration testing of customer-facing e-commerce platform and payment processing.",
  },
  {
    id: 3,
    title: "API Security Audit - Mobile App",
    date: "2024-03-25",
    type: "API Audit",
    status: "In Progress",
    vulnerabilities: 12,
    severity: "Low",
    description: "Security audit of REST API endpoints used by mobile applications.",
  },
  {
    id: 4,
    title: "Network Infrastructure Scan",
    date: "2024-03-22",
    type: "Network Scan",
    status: "Completed",
    vulnerabilities: 8,
    severity: "Critical",
    description: "Comprehensive network infrastructure vulnerability assessment and port scanning.",
  },
]

const complianceMetrics = [
  { framework: "OWASP Top 10", compliance: 85, issues: 3 },
  { framework: "ISO 27001", compliance: 92, issues: 2 },
  { framework: "NIST Framework", compliance: 78, issues: 5 },
  { framework: "PCI DSS", compliance: 96, issues: 1 },
]

export default function ReportsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="glass-panel p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary-green mb-2">Security Reports</h1>
            <p className="text-muted-foreground">
              Comprehensive security analytics, vulnerability reports, and compliance tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              Schedule Report
            </Button>
            <Button className="cyber-button flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-panel">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vulnerabilities</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-green">618</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">56</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fixed This Month</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">142</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+23%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieIcon className="h-5 w-5" />
                  Severity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <Pie
                    data={severityDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {severityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Vulnerability Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={vulnerabilityTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} />
                    <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={2} />
                    <Line type="monotone" dataKey="low" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceMetrics.map((metric, index) => (
              <Card key={index} className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {metric.framework}
                    <Badge
                      variant={
                        metric.compliance >= 90 ? "default" : metric.compliance >= 80 ? "secondary" : "destructive"
                      }
                    >
                      {metric.compliance}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={metric.compliance} className="mb-2" />
                  <p className="text-sm text-muted-foreground">{metric.issues} outstanding issues</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="space-y-4">
            {recentReports.map((report) => (
              <Card key={report.id} className="glass-panel">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{report.type}</Badge>
                      <Badge variant={report.status === "Completed" ? "default" : "secondary"}>{report.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{report.date}</span>
                      <span>{report.vulnerabilities} vulnerabilities</span>
                      <span
                        className={`font-medium ${
                          report.severity === "Critical"
                            ? "text-red-500"
                            : report.severity === "High"
                              ? "text-orange-500"
                              : report.severity === "Medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                        }`}
                      >
                        {report.severity} Risk
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
