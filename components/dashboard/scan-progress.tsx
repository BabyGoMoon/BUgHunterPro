"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Clock, Zap } from "lucide-react"

interface ScanProgressProps {
  isScanning: boolean
  onComplete: () => void
  currentScan: string | null
}

const scanSteps = [
  { id: "discovery", label: "Target Discovery", duration: 3000 },
  { id: "ports", label: "Port Scanning", duration: 4000 },
  { id: "services", label: "Service Detection", duration: 3500 },
  { id: "vulnerabilities", label: "Vulnerability Assessment", duration: 5000 },
  { id: "analysis", label: "Risk Analysis", duration: 2500 },
]

export function ScanProgress({ isScanning, onComplete, currentScan }: ScanProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  useEffect(() => {
    if (!isScanning) {
      setCurrentStep(0)
      setProgress(0)
      setCompletedSteps([])
      return
    }

    let stepIndex = 0
    let progressInterval: NodeJS.Timeout

    const runStep = () => {
      if (stepIndex >= scanSteps.length) {
        onComplete()
        return
      }

      const step = scanSteps[stepIndex]
      setCurrentStep(stepIndex)
      setProgress(0)

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100 / (step.duration / 100)
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            setCompletedSteps((prev) => [...prev, step.id])
            stepIndex++
            setTimeout(runStep, 500)
            return 100
          }
          return newProgress
        })
      }, 100)
    }

    runStep()

    return () => {
      if (progressInterval) clearInterval(progressInterval)
    }
  }, [isScanning, onComplete])

  return (
    <Card className="glass-panel p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-green">Scan Progress</h3>
          {isScanning && (
            <Badge className="bg-primary-green/10 text-primary-green border-primary-green/20 animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              Scanning...
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {scanSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = currentStep === index && isScanning
            const isPending = index > currentStep

            return (
              <div key={step.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-primary-green" />
                    ) : isCurrent ? (
                      <div className="h-5 w-5 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
                    ) : isPending ? (
                      <Clock className="h-5 w-5 text-foreground/40" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    <span
                      className={`font-medium ${
                        isCompleted ? "text-primary-green" : isCurrent ? "text-foreground" : "text-foreground/60"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      isCompleted
                        ? "border-primary-green/20 text-primary-green"
                        : isCurrent
                          ? "border-yellow-500/20 text-yellow-500"
                          : "border-foreground/20 text-foreground/60"
                    }`}
                  >
                    {isCompleted ? "Complete" : isCurrent ? "Running" : "Pending"}
                  </Badge>
                </div>
                {isCurrent && (
                  <Progress value={progress} className="h-2 bg-secondary">
                    <div
                      className="h-full bg-gradient-to-r from-primary-green to-vibrant-green transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </Progress>
                )}
              </div>
            )
          })}
        </div>

        {!isScanning && completedSteps.length === 0 && (
          <div className="text-center py-8 text-foreground/60">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Ready to start scanning. Enter a target URL and click "Start Scan".</p>
          </div>
        )}
      </div>
    </Card>
  )
}
