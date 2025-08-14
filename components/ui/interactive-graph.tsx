"use client"
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

interface Node {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  label: string
  severity: "critical" | "high" | "medium" | "low"
}

export function InteractiveGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 500
    canvas.height = 400

    const nodes: Node[] = [
      {
        id: "1",
        x: 250,
        y: 200,
        vx: 0,
        vy: 0,
        radius: 20,
        color: "#00FF00",
        label: "SQL Injection",
        severity: "critical",
      },
      { id: "2", x: 150, y: 150, vx: 0, vy: 0, radius: 15, color: "#18FF6D", label: "XSS", severity: "high" },
      { id: "3", x: 350, y: 150, vx: 0, vy: 0, radius: 15, color: "#009862", label: "CSRF", severity: "medium" },
      { id: "4", x: 200, y: 300, vx: 0, vy: 0, radius: 12, color: "#34403A", label: "Info Leak", severity: "low" },
      { id: "5", x: 300, y: 300, vx: 0, vy: 0, radius: 18, color: "#00FF00", label: "RCE", severity: "critical" },
      { id: "6", x: 100, y: 250, vx: 0, vy: 0, radius: 14, color: "#18FF6D", label: "LFI", severity: "high" },
    ]

    const connections = [
      ["1", "2"],
      ["1", "3"],
      ["2", "4"],
      ["3", "5"],
      ["4", "6"],
      ["5", "6"],
    ]

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = "rgba(0, 255, 0, 0.3)"
      ctx.lineWidth = 2
      connections.forEach(([nodeId1, nodeId2]) => {
        const node1 = nodes.find((n) => n.id === nodeId1)
        const node2 = nodes.find((n) => n.id === nodeId2)
        if (node1 && node2) {
          ctx.beginPath()
          ctx.moveTo(node1.x, node1.y)
          ctx.lineTo(node2.x, node2.y)
          ctx.stroke()
        }
      })

      // Draw nodes
      nodes.forEach((node, index) => {
        // Simple physics simulation
        if (isAnimating) {
          node.x += Math.sin(Date.now() * 0.001 + index) * 0.5
          node.y += Math.cos(Date.now() * 0.001 + index) * 0.3
        }

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Draw glow effect
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2)
        ctx.fillStyle = `${node.color}20`
        ctx.fill()

        // Draw label
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px monospace"
        ctx.textAlign = "center"
        ctx.fillText(node.label, node.x, node.y - node.radius - 10)
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isAnimating])

  return (
    <Card className="glass-panel p-6 neon-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-green">Live Vulnerability Map</h3>
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="text-sm text-foreground/60 hover:text-primary-green transition-colors"
          >
            {isAnimating ? "Pause" : "Resume"}
          </button>
        </div>

        <canvas ref={canvasRef} className="w-full h-auto rounded-lg bg-background/50" style={{ maxWidth: "100%" }} />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-critical rounded-full"></div>
            <span className="text-foreground/70">Critical (2)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-high rounded-full"></div>
            <span className="text-foreground/70">High (2)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-medium rounded-full"></div>
            <span className="text-foreground/70">Medium (1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-low rounded-full"></div>
            <span className="text-foreground/70">Low (1)</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
