"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wind, SkipForward, Clock, Brain, Heart } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface InterventionModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (wasSkipped: boolean) => void
  appName: string
  appIcon?: string
  interventionDuration?: number
  allowSkip?: boolean
  skipDelay?: number
}

export function InterventionModal({
  isOpen,
  onClose,
  onComplete,
  appName,
  appIcon = "📱",
  interventionDuration = 60,
  allowSkip = true,
  skipDelay = 10,
}: InterventionModalProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(interventionDuration)
  const [canSkip, setCanSkip] = useState(false)
  const [touchScale, setTouchScale] = useState(1)
  const [reflectionPrompts] = useState([
    "Is this the best use of my time right now?",
    "What am I hoping to achieve by opening this app?",
    "How will I feel after spending time on this app?",
    "Is there something more important I should be doing?",
    "Am I opening this app out of habit or intention?",
  ])
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const isMobile = useMobile()
  const circleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setTimeLeft(interventionDuration)
      setCanSkip(false)
      setPhase("inhale")
      setCurrentPrompt(Math.floor(Math.random() * reflectionPrompts.length))
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete(false)
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const skipTimer = setTimeout(() => {
      if (allowSkip) {
        setCanSkip(true)
      }
    }, skipDelay * 1000)

    return () => {
      clearInterval(timer)
      clearTimeout(skipTimer)
    }
  }, [isOpen, onClose, onComplete, interventionDuration, allowSkip, skipDelay, reflectionPrompts.length])

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

  const handleSkip = () => {
    onComplete(true)
    onClose()
  }

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

  const completionPercentage = ((interventionDuration - timeLeft) / interventionDuration) * 100

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent
        className="sm:max-w-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 border-0 [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>App Launch Intervention: {appName}</DialogTitle>
          <DialogDescription>
            A guided breathing exercise and reflection prompt before opening {appName}.
          </DialogDescription>
        </DialogHeader>
        <div className="text-center space-y-6 p-6">
          {/* App Info */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="text-3xl">{appIcon}</div>
            <div>
              <h2 className="text-xl font-bold">Opening {appName}</h2>
              <p className="text-sm text-muted-foreground">Take a moment to breathe and reflect</p>
            </div>
          </div>

          {/* Breathing Circle */}
          <div
            className="relative mx-auto w-56 h-56 flex items-center justify-center cursor-pointer"
            ref={circleRef}
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
            onMouseDown={!isMobile ? handleTouchStart : undefined}
            onMouseUp={!isMobile ? handleTouchEnd : undefined}
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
            <div
              className={`absolute inset-8 rounded-full bg-gradient-to-r ${getPhaseColor()} opacity-60 transition-all duration-1000`}
              style={{
                transform: `scale(${phase === "inhale" ? 1.1 : phase === "hold" ? 1.05 : 0.95}) scale(${touchScale})`,
              }}
            />
            <div className="relative z-10 text-center">
              <Wind className="w-16 h-16 mx-auto mb-3 text-blue-600" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{getPhaseText()}</p>
              <p className="text-sm text-muted-foreground mt-1">Follow the rhythm</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <Progress value={completionPercentage} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{timeLeft}s remaining</span>
              <Badge variant="outline">{Math.round(completionPercentage)}% complete</Badge>
            </div>
          </div>

          {/* Reflection Prompt */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800 dark:text-purple-200">Reflect</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{reflectionPrompts[currentPrompt]}"</p>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4" />
              <span>Take deep breaths and consider your intention</span>
            </div>
            {isMobile && (
              <p className="text-xs text-blue-600 dark:text-blue-400">Touch and hold the circle while breathing</p>
            )}
          </div>

          {/* Skip Button */}
          {canSkip && (
            <div className="pt-4">
              <Button variant="outline" onClick={handleSkip} className="flex items-center gap-2">
                <SkipForward className="w-4 h-4" />
                Continue to {appName}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Consider completing the full breathing exercise for maximum benefit
              </p>
            </div>
          )}

          {/* Timer Display */}
          <div className="flex items-center justify-center gap-2 text-lg font-mono">
            <Clock className="w-5 h-5" />
            <span>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
