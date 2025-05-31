"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, Square, Timer, Coffee, Target } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function FocusSessionTab() {
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [sessionType, setSessionType] = useState("pomodoro")
  const [completedSessions, setCompletedSessions] = useState(3)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null)
  const timerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      setCompletedSessions((prev) => prev + 1)
      // Reset timer based on session type
      if (sessionType === "pomodoro") {
        setTimeLeft(5 * 60) // 5 minute break
      } else {
        setTimeLeft(25 * 60) // 25 minute work session
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, isPaused, timeLeft, sessionType])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = () => {
    setIsActive(true)
    setIsPaused(false)
  }

  const pauseTimer = () => {
    setIsPaused(!isPaused)
  }

  const stopTimer = () => {
    setIsActive(false)
    setIsPaused(false)
    setTimeLeft(sessionType === "pomodoro" ? 25 * 60 : Number.parseInt(sessionType) * 60)
  }

  const getSessionDuration = () => {
    switch (sessionType) {
      case "pomodoro":
        return 25 * 60
      case "15":
        return 15 * 60
      case "30":
        return 30 * 60
      case "45":
        return 45 * 60
      case "60":
        return 60 * 60
      default:
        return 25 * 60
    }
  }

  const progress = ((getSessionDuration() - timeLeft) / getSessionDuration()) * 100

  // Touch handlers for the timer
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return
    setTouchStartY(e.touches[0].clientY)
    setTouchStartTime(Date.now())
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || touchStartY === null || !isActive) return

    const touchY = e.touches[0].clientY
    const deltaY = touchStartY - touchY

    // Adjust time based on vertical swipe (10px = 1 minute)
    if (Math.abs(deltaY) > 10) {
      const timeAdjustment = Math.floor(deltaY / 10) * 60 // 60 seconds per minute
      const newTime = Math.max(60, Math.min(getSessionDuration(), timeLeft - timeAdjustment))
      setTimeLeft(newTime)
      setTouchStartY(touchY)
    }
  }

  const handleTouchEnd = () => {
    setTouchStartY(null)

    // Detect tap to toggle pause/play
    if (touchStartTime && Date.now() - touchStartTime < 300) {
      if (isActive) {
        pauseTimer()
      } else {
        startTimer()
      }
    }

    setTouchStartTime(null)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Today's Sessions</p>
                <p className="text-3xl font-bold">{completedSessions}</p>
              </div>
              <Target className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Focus Time</p>
                <p className="text-3xl font-bold">2.5h</p>
              </div>
              <Timer className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Weekly Goal</p>
                <p className="text-3xl font-bold">85%</p>
              </div>
              <Coffee className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Focus Timer */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Focus Session
          </CardTitle>
          <CardDescription>Start a focused work session with enhanced app blocking</CardDescription>
          {isMobile && (
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Tip:</span> Tap timer to play/pause, swipe up/down to adjust time
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div
              ref={timerRef}
              className="relative w-48 h-48 mx-auto"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: "none" }}
            >
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className="text-blue-500 transition-all duration-1000 ease-in-out"
                  strokeLinecap="round"
                />
              </svg>
              <div
                className={`absolute inset-0 flex items-center justify-center rounded-full ${
                  isMobile ? "cursor-pointer active:bg-blue-50/30 dark:active:bg-blue-900/30" : ""
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800 dark:text-white">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-muted-foreground">
                    {isActive ? (isPaused ? "Paused" : "Focus Time") : "Ready to Start"}
                  </div>
                </div>
              </div>
            </div>

            {/* Session Type Selector */}
            <div className="flex items-center gap-4 justify-center">
              <label className="text-sm font-medium">Session Type:</label>
              <Select value={sessionType} onValueChange={setSessionType} disabled={isActive}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pomodoro">Pomodoro (25m)</SelectItem>
                  <SelectItem value="15">Short (15m)</SelectItem>
                  <SelectItem value="30">Medium (30m)</SelectItem>
                  <SelectItem value="45">Long (45m)</SelectItem>
                  <SelectItem value="60">Extended (60m)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 justify-center">
              {!isActive ? (
                <Button onClick={startTimer} size="lg" className="px-8">
                  <Play className="w-5 h-5 mr-2" />
                  Start Focus
                </Button>
              ) : (
                <>
                  <Button onClick={pauseTimer} variant="outline" size="lg">
                    <Pause className="w-5 h-5 mr-2" />
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  <Button onClick={stopTimer} variant="destructive" size="lg">
                    <Square className="w-5 h-5 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Enhanced Blocking Notice */}
          {isActive && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Enhanced Blocking Active</span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                All distracting apps are now blocked with stricter interventions during your focus session.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>Your focus session history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "2:30 PM", duration: "25 min", type: "Pomodoro", completed: true },
              { time: "1:45 PM", duration: "15 min", type: "Short Break", completed: true },
              { time: "1:00 PM", duration: "25 min", type: "Pomodoro", completed: true },
              { time: "12:15 PM", duration: "30 min", type: "Deep Work", completed: false },
            ].map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${session.completed ? "bg-green-500" : "bg-gray-300"}`} />
                  <div>
                    <p className="font-medium text-sm">{session.type}</p>
                    <p className="text-xs text-muted-foreground">{session.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={session.completed ? "default" : "secondary"}>{session.duration}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
