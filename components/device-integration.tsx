"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Smartphone,
  Wifi,
  Bluetooth,
  Battery,
  Volume2,
  Vibrate,
  MapPin,
  Camera,
  Mic,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface DeviceFeature {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  isAvailable: boolean
  isEnabled: boolean
  batteryImpact: "low" | "medium" | "high"
  privacyLevel: "low" | "medium" | "high"
}

export function DeviceIntegration() {
  const [deviceFeatures, setDeviceFeatures] = useState<DeviceFeature[]>([
    {
      id: "location",
      name: "Location Services",
      description: "Context-aware blocking based on your location",
      icon: <MapPin className="w-5 h-5" />,
      isAvailable: true,
      isEnabled: false,
      batteryImpact: "medium",
      privacyLevel: "high",
    },
    {
      id: "camera",
      name: "Camera Access",
      description: "Scan QR codes for quick app setup",
      icon: <Camera className="w-5 h-5" />,
      isAvailable: true,
      isEnabled: false,
      batteryImpact: "low",
      privacyLevel: "medium",
    },
    {
      id: "microphone",
      name: "Microphone",
      description: "Voice commands for hands-free control",
      icon: <Mic className="w-5 h-5" />,
      isAvailable: true,
      isEnabled: false,
      batteryImpact: "medium",
      privacyLevel: "high",
    },
    {
      id: "vibration",
      name: "Haptic Feedback",
      description: "Vibration alerts for focus reminders",
      icon: <Vibrate className="w-5 h-5" />,
      isAvailable: true,
      isEnabled: true,
      batteryImpact: "low",
      privacyLevel: "low",
    },
    {
      id: "bluetooth",
      name: "Bluetooth",
      description: "Connect with wearables and smart devices",
      icon: <Bluetooth className="w-5 h-5" />,
      isAvailable: true,
      isEnabled: false,
      batteryImpact: "medium",
      privacyLevel: "low",
    },
    {
      id: "wifi",
      name: "WiFi Monitoring",
      description: "Network-based blocking rules",
      icon: <Wifi className="w-5 h-5" />,
      isAvailable: true,
      isEnabled: true,
      batteryImpact: "low",
      privacyLevel: "medium",
    },
  ])

  const [deviceInfo, setDeviceInfo] = useState({
    batteryLevel: 85,
    isCharging: false,
    networkType: "WiFi",
    storageUsed: 45,
    ramUsage: 60,
  })

  const toggleFeature = (featureId: string) => {
    setDeviceFeatures((prev) =>
      prev.map((feature) => (feature.id === featureId ? { ...feature, isEnabled: !feature.isEnabled } : feature)),
    )
  }

  const getBatteryImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "text-green-600 dark:text-green-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "high":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 dark:text-green-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "high":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const enabledFeatures = deviceFeatures.filter((f) => f.isEnabled).length

  return (
    <div className="space-y-6">
      {/* Device Status */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Device Status
          </CardTitle>
          <CardDescription>Current device information and resource usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4" />
                <span className="text-sm font-medium">Battery</span>
              </div>
              <div className="space-y-1">
                <Progress value={deviceInfo.batteryLevel} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {deviceInfo.batteryLevel}% {deviceInfo.isCharging && "(Charging)"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Network</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {deviceInfo.networkType}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm font-medium">Storage</span>
              </div>
              <div className="space-y-1">
                <Progress value={deviceInfo.storageUsed} className="h-2" />
                <p className="text-xs text-muted-foreground">{deviceInfo.storageUsed}% used</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-medium">RAM</span>
              </div>
              <div className="space-y-1">
                <Progress value={deviceInfo.ramUsage} className="h-2" />
                <p className="text-xs text-muted-foreground">{deviceInfo.ramUsage}% used</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Features */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle>Device Features</CardTitle>
          <CardDescription>
            Manage device integrations and hardware access ({enabledFeatures}/{deviceFeatures.length} enabled)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {deviceFeatures.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">{feature.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{feature.name}</h3>
                    {feature.isEnabled && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-xs ${getBatteryImpactColor(feature.batteryImpact)}`}>
                      Battery: {feature.batteryImpact}
                    </span>
                    <span className={`text-xs ${getPrivacyLevelColor(feature.privacyLevel)}`}>
                      Privacy: {feature.privacyLevel}
                    </span>
                  </div>
                </div>
              </div>
              <Switch
                checked={feature.isEnabled}
                onCheckedChange={() => toggleFeature(feature.id)}
                disabled={!feature.isAvailable}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          All device integrations respect your privacy. Data is processed locally on your device and never sent to
          external servers without your explicit consent.
        </AlertDescription>
      </Alert>

      {/* Battery Optimization Notice */}
      {enabledFeatures > 3 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have multiple device features enabled. Consider disabling unused features to optimize battery life.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
