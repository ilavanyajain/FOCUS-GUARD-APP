"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Smartphone, Search, Plus, Clock, Zap, X, Check } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { StyledToggleSwitch } from "@/components/ui/styled-toggle-switch"

interface AppBlockingTabProps {
  onTriggerBreathing: () => void
}

interface BlockedApp {
  id: string
  name: string
  category: string
  isBlocked: boolean
  icon: string
  openAttempts: number
}

export function AppBlockingTab({ onTriggerBreathing }: AppBlockingTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [apps, setApps] = useState<BlockedApp[]>([
    { id: "1", name: "Instagram", category: "Social Media", isBlocked: true, icon: "📷", openAttempts: 12 },
    { id: "2", name: "TikTok", category: "Social Media", isBlocked: true, icon: "🎵", openAttempts: 8 },
    { id: "3", name: "Twitter", category: "Social Media", isBlocked: false, icon: "🐦", openAttempts: 5 },
    { id: "4", name: "YouTube", category: "Entertainment", isBlocked: true, icon: "📺", openAttempts: 15 },
    { id: "5", name: "Reddit", category: "Social Media", isBlocked: false, icon: "🤖", openAttempts: 3 },
    { id: "6", name: "Netflix", category: "Entertainment", isBlocked: false, icon: "🎬", openAttempts: 2 },
  ])

  const filteredApps = apps.filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const toggleAppBlocking = useCallback(
    (appId: string) => {
      setApps(apps.map((app) => (app.id === appId ? { ...app, isBlocked: !app.isBlocked } : app)))
    },
    [apps],
  )

  const blockedCount = apps.filter((app) => app.isBlocked).length
  const totalAttempts = apps.reduce((sum, app) => sum + app.openAttempts, 0)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Blocked Apps</p>
                <p className="text-3xl font-bold">{blockedCount}</p>
              </div>
              <Smartphone className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Interventions Today</p>
                <p className="text-3xl font-bold">{totalAttempts}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Time Saved</p>
                <p className="text-3xl font-bold">2.5h</p>
              </div>
              <Clock className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Management */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Manage Blocked Apps
          </CardTitle>
          <CardDescription>Select which apps should trigger breathing interventions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-gray-700/50"
            />
          </div>

          {/* App List */}
          <div className="space-y-3">
            {filteredApps.map((app) => (
              <div key={app.id} className="relative overflow-hidden">
                {/* App Item */}
                <div
                  className={`flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-white/20 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{app.icon}</div>
                    <div>
                      <h3 className="font-medium">{app.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {app.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{app.openAttempts} attempts today</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StyledToggleSwitch 
                      checked={app.isBlocked} 
                      onCheckedChange={() => toggleAppBlocking(app.id)} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add App Button */}
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Custom App
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
