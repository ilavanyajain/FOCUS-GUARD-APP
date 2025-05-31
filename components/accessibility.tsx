"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Type, Zap, Mic, VolumeX, MousePointer, Keyboard, Info } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface AccessibilityFeature {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled: boolean
  category: "visual" | "motor" | "audio" | "cognitive"
}

export function Accessibility() {
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<AccessibilityFeature[]>([
    {
      id: "high_contrast",
      name: "High Contrast Mode",
      description: "Enhance visibility with higher contrast colors",
      icon: <Eye className="w-5 h-5" />,
      enabled: false,
      category: "visual",
    },
    {
      id: "large_text",
      name: "Large Text",
      description: "Increase text size throughout the app",
      icon: <Type className="w-5 h-5" />,
      enabled: true,
      category: "visual",
    },
    {
      id: "reduce_motion",
      name: "Reduce Motion",
      description: "Minimize animations and motion effects",
      icon: <Zap className="w-5 h-5" />,
      enabled: false,
      category: "visual",
    },
    {
      id: "screen_reader",
      name: "Screen Reader Support",
      description: "Enhanced compatibility with screen readers",
      icon: <VolumeX className="w-5 h-5" />,
      enabled: true,
      category: "visual",
    },
    {
      id: "voice_control",
      name: "Voice Control",
      description: "Control the app using voice commands",
      icon: <Mic className="w-5 h-5" />,
      enabled: false,
      category: "motor",
    },
    {
      id: "touch_accommodations",
      name: "Touch Accommodations",
      description: "Adjust touch sensitivity and response",
      icon: <MousePointer className="w-5 h-5" />,
      enabled: false,
      category: "motor",
    },
    {
      id: "keyboard_navigation",
      name: "Keyboard Navigation",
      description: "Navigate the app using keyboard shortcuts",
      icon: <Keyboard className="w-5 h-5" />,
      enabled: true,
      category: "motor",
    },
    {
      id: "color_blind",
      name: "Color Blind Support",
      description: "Adjust colors for different types of color blindness",
      icon: <Eye className="w-5 h-5" />,
      enabled: false,
      category: "visual",
    },
  ])

  const [textSize, setTextSize] = useState([100])
  const [animationSpeed, setAnimationSpeed] = useState([100])

  const toggleFeature = (featureId: string) => {
    setAccessibilityFeatures((prev) =>
      prev.map((feature) => (feature.id === featureId ? { ...feature, enabled: !feature.enabled } : feature)),
    )
  }

  const enabledFeatures = accessibilityFeatures.filter((f) => f.enabled).length

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-full">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Accessibility Features</h3>
              <p className="text-sm text-muted-foreground">
                {enabledFeatures} of {accessibilityFeatures.length} features enabled
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              WCAG 2.1 AA Compliant
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Text Size */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Text Size
          </CardTitle>
          <CardDescription>Adjust the size of text throughout the app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Text Size</span>
              <Badge variant="secondary">{textSize[0]}%</Badge>
            </div>
            <Slider value={textSize} onValueChange={setTextSize} min={75} max={200} step={5} className="w-full" />
          </div>

          <div className="space-y-2">
            <p className="text-sm" style={{ fontSize: `${textSize[0]}%` }}>
              Sample text at {textSize[0]}% size
            </p>
            <p className="text-xs text-muted-foreground" style={{ fontSize: `${textSize[0]}%` }}>
              This is how smaller text will appear
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Animation Speed */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Animation Speed
          </CardTitle>
          <CardDescription>Adjust the speed of animations or disable them completely</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Animation Speed</span>
              <Badge variant="secondary">{animationSpeed[0]}%</Badge>
            </div>
            <Slider
              value={animationSpeed}
              onValueChange={setAnimationSpeed}
              min={0}
              max={200}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Off</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`w-8 h-8 bg-blue-500 rounded-full transition-transform ${
                animationSpeed[0] > 0 ? "animate-pulse" : ""
              }`}
              style={{ animationDuration: `${3000 / (animationSpeed[0] / 100)}ms` }}
            ></div>
            <span className="text-sm">Animation preview</span>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Features */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle>Accessibility Features</CardTitle>
          <CardDescription>Enable or disable accessibility features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {accessibilityFeatures.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">{feature.icon}</div>
                <div>
                  <h3 className="font-medium">{feature.name}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
              <Switch checked={feature.enabled} onCheckedChange={() => toggleFeature(feature.id)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Accessibility Statement */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Focus Guard is committed to accessibility. We continuously work to ensure our app is usable by everyone,
          regardless of ability or technology.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button variant="outline">View Full Accessibility Statement</Button>
      </div>
    </div>
  )
}
