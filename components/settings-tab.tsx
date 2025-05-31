"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Wind, Shield, Moon, Download, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function SettingsTab() {
  const [interventionDuration, setInterventionDuration] = useState([20])
  const [breathingPattern, setBreathingPattern] = useState("4-7-8")
  const [allowSkip, setAllowSkip] = useState(true)
  const [skipDelay, setSkipDelay] = useState([5])
  const [enableScheduling, setEnableScheduling] = useState(true)
  const [enableAnalytics, setEnableAnalytics] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="space-y-6">
      {/* Intervention Settings */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5" />
            Breathing Intervention
          </CardTitle>
          <CardDescription>
            Customize how breathing interventions work when you try to open blocked apps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Intervention Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Intervention Duration</label>
              <Badge variant="secondary">{interventionDuration[0]} seconds</Badge>
            </div>
            <Slider
              value={interventionDuration}
              onValueChange={setInterventionDuration}
              max={60}
              min={5}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How long the breathing screen appears before you can access the app
            </p>
          </div>

          <Separator />

          {/* Breathing Pattern */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Breathing Pattern</label>
            <Select value={breathingPattern} onValueChange={setBreathingPattern}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4-7-8">4-7-8 Breathing (Inhale 4, Hold 7, Exhale 8)</SelectItem>
                <SelectItem value="4-4-4-4">Box Breathing (4-4-4-4)</SelectItem>
                <SelectItem value="simple">Simple (Inhale-Exhale)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Choose the breathing technique that works best for you</p>
          </div>

          <Separator />

          {/* Skip Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Allow Skip</label>
                <p className="text-xs text-muted-foreground">Let users skip the intervention after a delay</p>
              </div>
              <Switch checked={allowSkip} onCheckedChange={setAllowSkip} />
            </div>

            {allowSkip && (
              <div className="space-y-3 ml-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Skip Delay</label>
                  <Badge variant="secondary">{skipDelay[0]} seconds</Badge>
                </div>
                <Slider value={skipDelay} onValueChange={setSkipDelay} max={30} min={3} step={1} className="w-full" />
                <p className="text-xs text-muted-foreground">Minimum time before skip button appears</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* App Behavior */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            App Behavior
          </CardTitle>
          <CardDescription>Control how Focus Guard operates and what features are enabled</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Enable Scheduling</label>
              <p className="text-xs text-muted-foreground">Allow time-based blocking schedules</p>
            </div>
            <Switch checked={enableScheduling} onCheckedChange={setEnableScheduling} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Usage Analytics</label>
              <p className="text-xs text-muted-foreground">Track and analyze your app usage patterns</p>
            </div>
            <Switch checked={enableAnalytics} onCheckedChange={setEnableAnalytics} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Notifications</label>
              <p className="text-xs text-muted-foreground">Receive reminders and progress updates</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of Focus Guard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Dark Mode</label>
              <p className="text-xs text-muted-foreground">Use dark theme for better night usage</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export your data or reset the app to start fresh</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Settings
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </Button>
            <p className="text-xs text-muted-foreground">
              This will permanently delete all your usage data, settings, and blocked apps. This action cannot be
              undone.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">Privacy First</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                All your data stays on your device. Focus Guard never sends your usage data, app preferences, or
                personal information to any servers. Your privacy is completely protected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
