"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, Target, Award, Calendar, Clock, ZoomIn } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function AnalyticsTab() {
  const [chartScale, setChartScale] = useState(1)
  const [isPinching, setIsPinching] = useState(false)
  const touchStartRef = useRef<{ x1: number; y1: number; x2?: number; y2?: number } | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const weeklyData = [
    { day: "Mon", attempts: 15, prevented: 12 },
    { day: "Tue", attempts: 18, prevented: 14 },
    { day: "Wed", attempts: 12, prevented: 10 },
    { day: "Thu", attempts: 20, prevented: 16 },
    { day: "Fri", attempts: 25, prevented: 18 },
    { day: "Sat", attempts: 30, prevented: 22 },
    { day: "Sun", attempts: 28, prevented: 20 },
  ]

  const topApps = [
    { name: "Instagram", attempts: 45, prevented: 38, reduction: 84 },
    { name: "TikTok", attempts: 32, prevented: 28, reduction: 88 },
    { name: "YouTube", attempts: 28, prevented: 22, reduction: 79 },
    { name: "Twitter", attempts: 15, prevented: 12, reduction: 80 },
  ]

  // Touch handlers for pinch-to-zoom on charts
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return

    if (e.touches.length === 1) {
      touchStartRef.current = {
        x1: e.touches[0].clientX,
        y1: e.touches[0].clientY,
      }
    } else if (e.touches.length === 2) {
      touchStartRef.current = {
        x1: e.touches[0].clientX,
        y1: e.touches[0].clientY,
        x2: e.touches[1].clientX,
        y2: e.touches[1].clientY,
      }
      setIsPinching(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !touchStartRef.current || !isPinching || e.touches.length !== 2) return

    const touch1 = e.touches[0]
    const touch2 = e.touches[1]

    const startDistance =
      touchStartRef.current.x2 && touchStartRef.current.y2
        ? Math.hypot(
            touchStartRef.current.x1 - touchStartRef.current.x2,
            touchStartRef.current.y1 - touchStartRef.current.y2,
          )
        : 0

    const currentDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY)

    if (startDistance > 0) {
      const scaleFactor = currentDistance / startDistance
      const newScale = Math.max(0.8, Math.min(1.5, scaleFactor))
      setChartScale(newScale)
    }
  }

  const handleTouchEnd = () => {
    touchStartRef.current = null
    setIsPinching(false)

    // Reset scale with animation after a delay
    if (chartScale !== 1) {
      setTimeout(() => {
        setChartScale(1)
      }, 1000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold">84%</p>
              </div>
              <Target className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Time Saved</p>
                <p className="text-3xl font-bold">18h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Streak</p>
                <p className="text-3xl font-bold">12</p>
                <p className="text-purple-100 text-xs">days</p>
              </div>
              <Award className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Avg Reduction</p>
                <p className="text-3xl font-bold">67%</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="apps">By App</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Progress
              </CardTitle>
              <CardDescription>Your intervention success rate over the past week</CardDescription>
              {isMobile && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ZoomIn className="w-3 h-3" />
                  <span>Pinch to zoom chart</span>
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div
                className="space-y-4 transition-transform duration-300"
                ref={chartRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `scale(${chartScale})`,
                  transformOrigin: "center",
                  touchAction: "none",
                }}
              >
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-muted-foreground">
                        {day.prevented}/{day.attempts} prevented
                      </span>
                    </div>
                    <Progress value={(day.prevented / day.attempts) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apps" className="space-y-4">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle>App-Specific Analytics</CardTitle>
              <CardDescription>Breakdown of interventions by application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topApps.map((app, index) => (
                  <div
                    key={app.name}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{app.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {app.prevented}/{app.attempts} interventions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={app.reduction >= 80 ? "default" : "secondary"} className="mb-1">
                        {app.reduction}% reduced
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingDown className="w-4 h-4" />
                        <span>Improving</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Peak Usage Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Morning (6-12 PM)</span>
                    <Badge variant="secondary">23 attempts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Afternoon (12-6 PM)</span>
                    <Badge variant="secondary">45 attempts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Evening (6-12 AM)</span>
                    <Badge variant="secondary">67 attempts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Night (12-6 AM)</span>
                    <Badge variant="secondary">12 attempts</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Habit Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Most Active Day</p>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      Saturdays show 40% more app opening attempts
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Best Success Rate</p>
                    <p className="text-xs text-green-600 dark:text-green-300">Mornings have 92% intervention success</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Improvement Trend</p>
                    <p className="text-xs text-purple-600 dark:text-purple-300">
                      25% reduction in attempts over 2 weeks
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
