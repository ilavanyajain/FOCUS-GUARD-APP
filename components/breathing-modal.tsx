"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wind, SkipForward } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface BreathingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BreathingModal({ isOpen, onClose }: BreathingModalProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [canSkip, setCanSkip] = useState(false)
  const [touchScale, setTouchScale] = useState(1)
  const isMobile = useMobile()
  const circleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setTimeLeft(20)
      setCanSkip(false)
      setPhase("inhale")
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const skipTimer = setTimeout(() => {
      setCanSkip(true)
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(skipTimer)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return

    const breathingCycle = () => {
      // 4-7-8 breathing pattern
      const phases = [
        { name: "inhale" as const, duration: 4000 },
        { name: "hold" as const, duration: 7000 },
        { name: "exhale" as const, duration: 8000 },
      ]

      let currentPhaseIndex = 0

      const runPhase = () => {
        const currentPhase = phases[currentPhaseIndex]
        setPhase(currentPhase.name)

        let elapsed = 0
        const interval = setInterval(() => {
          elapsed += 100
          setProgress((elapsed / currentPhase.duration) * 100)

          if (elapsed >= currentPhase.duration) {
            clearInterval(interval)
            currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
            runPhase()
          }
        }, 100)
      }

      runPhase()
    }

    breathingCycle()
  }, [isOpen])

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In"
      case "hold":
        return "Hold"
      case "exhale":
        return "Breathe Out"
    }
  }

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "from-blue-400 to-blue-600"
      case "hold":
        return "from-purple-400 to-purple-600"
      case "exhale":
        return "from-green-400 to-green-600"
    }
  }

  // Touch handlers for the breathing circle
  const handleTouchStart = () => {
    if (phase === "inhale") {
      setTouchScale(1.15)
    } else if (phase === "exhale") {
      setTouchScale(0.9)
    }
  }

  const handleTouchEnd = () => {
    setTouchScale(1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Breathing Exercise</DialogTitle>
          <DialogDescription>
            A guided breathing exercise to help you refocus before proceeding.
          </DialogDescription>
        </DialogHeader>
        <div className="text-center space-y-6 p-6">
          {/* Breathing Circle */}
          <div
            className="relative mx-auto w-48 h-48 flex items-center justify-center"
            ref={circleRef}
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
            style={{ touchAction: "none" }}
          >
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${getPhaseColor()} opacity-20 transition-all duration-1000`}
              style={{
                transform: `scale(${phase === "inhale" ? 1.1 : phase === "hold" ? 1.05 : 0.95}) scale(${touchScale})`,
              }}
            />
            <div
              className={`absolute inset-4 rounded-full bg-gradient-to-r ${getPhaseColor()} opacity-40 transition-all duration-1000`}
              style={{
                transform: `scale(${phase === "inhale" ? 1.1 : phase === "hold" ? 1.05 : 0.95}) scale(${touchScale})`,
              }}
            />
            <div className="relative z-10 text-center">
              <Wind className="w-12 h-12 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{getPhaseText()}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">Breathing cycle progress</p>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Take a moment to breathe</h3>
            <p className="text-muted-foreground">
              This brief pause helps you make more intentional choices about your app usage.
            </p>
            {isMobile && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Touch and hold the circle while breathing in and out
              </p>
            )}
          </div>

          {/* Timer and Skip */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{timeLeft} seconds remaining</div>
            {canSkip && (
              <Button variant="outline" size="sm" onClick={onClose} className="flex items-center gap-2">
                <SkipForward className="w-4 h-4" />
                Continue to App
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
