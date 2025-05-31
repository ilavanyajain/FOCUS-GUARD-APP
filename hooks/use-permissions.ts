"use client"

import { useState, useCallback } from "react"

export interface Permission {
  id: string
  name: string
  description: string
  required: boolean
  granted: boolean
  icon: string
  category: "core" | "optional" | "integration"
}

export interface DeviceApp {
  id: string
  name: string
  packageName: string
  icon: string
  category: string
  isInstalled: boolean
  canIntegrate: boolean
  isIntegrated: boolean
  usageTime?: number
  lastUsed?: Date
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "accessibility",
      name: "Accessibility Service",
      description: "Required to detect and block app launches",
      required: true,
      granted: false,
      icon: "🔒",
      category: "core",
    },
    {
      id: "usage_stats",
      name: "Usage Statistics",
      description: "Track app usage patterns and analytics",
      required: true,
      granted: false,
      icon: "📊",
      category: "core",
    },
    {
      id: "device_admin",
      name: "Device Administrator",
      description: "Enhanced app blocking capabilities",
      required: false,
      granted: false,
      icon: "🛡️",
      category: "core",
    },
    {
      id: "notifications",
      name: "Notifications",
      description: "Send focus reminders and progress updates",
      required: false,
      granted: true,
      icon: "🔔",
      category: "optional",
    },
    // {
    //   id: "camera",
    //   name: "Camera Access",
    //   description: "Scan QR codes for quick app blocking setup",
    //   required: false,
    //   granted: false,
    //   icon: "📷",
    //   category: "optional",
    // },
    // {
    //   id: "contacts",
    //   name: "Contacts",
    //   description: "Share focus sessions with accountability partners",
    //   required: false,
    //   granted: false,
    //   icon: "👥",
    //   category: "integration",
    // },
    // {
    //   id: "calendar",
    //   name: "Calendar Access",
    //   description: "Sync focus sessions with your calendar",
    //   required: false,
    //   granted: false,
    //   icon: "📅",
    //   category: "integration",
    // },
    // {
    //   id: "location",
    //   name: "Location Services",
    //   description: "Context-aware blocking based on location",
    //   required: false,
    //   granted: false,
    //   icon: "📍",
    //   category: "optional",
    // },
  ])

  const [installedApps, setInstalledApps] = useState<DeviceApp[]>([
    {
      id: "instagram",
      name: "Instagram",
      packageName: "com.instagram.android",
      icon: "📷",
      category: "Social Media",
      isInstalled: true,
      canIntegrate: true,
      isIntegrated: true,
      usageTime: 120,
      lastUsed: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "tiktok",
      name: "TikTok",
      packageName: "com.zhiliaoapp.musically",
      icon: "🎵",
      category: "Social Media",
      isInstalled: true,
      canIntegrate: true,
      isIntegrated: true,
      usageTime: 95,
      lastUsed: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "youtube",
      name: "YouTube",
      packageName: "com.google.android.youtube",
      icon: "📺",
      category: "Entertainment",
      isInstalled: true,
      canIntegrate: true,
      isIntegrated: false,
      usageTime: 180,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: "twitter",
      name: "Twitter",
      packageName: "com.twitter.android",
      icon: "🐦",
      category: "Social Media",
      isInstalled: true,
      canIntegrate: true,
      isIntegrated: false,
      usageTime: 45,
      lastUsed: new Date(Date.now() - 1000 * 60 * 120),
    },
    {
      id: "reddit",
      name: "Reddit",
      packageName: "com.reddit.frontpage",
      icon: "🤖",
      category: "Social Media",
      isInstalled: true,
      canIntegrate: true,
      isIntegrated: false,
      usageTime: 60,
      lastUsed: new Date(Date.now() - 1000 * 60 * 90),
    },
    {
      id: "netflix",
      name: "Netflix",
      packageName: "com.netflix.mediaclient",
      icon: "🎬",
      category: "Entertainment",
      isInstalled: true,
      canIntegrate: true,
      isIntegrated: false,
      usageTime: 240,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "spotify",
      name: "Spotify",
      packageName: "com.spotify.music",
      icon: "🎶",
      category: "Music",
      isInstalled: true,
      canIntegrate: false,
      isIntegrated: false,
      usageTime: 300,
      lastUsed: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      packageName: "com.whatsapp",
      icon: "💬",
      category: "Communication",
      isInstalled: true,
      canIntegrate: false,
      isIntegrated: false,
      usageTime: 150,
      lastUsed: new Date(Date.now() - 1000 * 60 * 5),
    },
  ])

  const requestPermission = useCallback(async (permissionId: string): Promise<boolean> => {
    // Simulate permission request
    return new Promise((resolve) => {
      setTimeout(() => {
        const granted = Math.random() > 0.3 // 70% success rate
        setPermissions((prev) => prev.map((p) => (p.id === permissionId ? { ...p, granted } : p)))
        resolve(granted)
      }, 1000)
    })
  }, [])

  const toggleAppIntegration = useCallback((appId: string) => {
    setInstalledApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, isIntegrated: !app.isIntegrated } : app)),
    )
  }, [])

  const scanForApps = useCallback(async (): Promise<DeviceApp[]> => {
    // Simulate scanning for installed apps
    return new Promise((resolve) => {
      setTimeout(() => {
        // Add some random apps to simulate discovery
        const newApps: DeviceApp[] = [
          {
            id: "discord",
            name: "Discord",
            packageName: "com.discord",
            icon: "🎮",
            category: "Communication",
            isInstalled: true,
            canIntegrate: true,
            isIntegrated: false,
            usageTime: 75,
            lastUsed: new Date(Date.now() - 1000 * 60 * 45),
          },
        ]

        setInstalledApps((prev) => [...prev, ...newApps.filter((app) => !prev.find((p) => p.id === app.id))])
        resolve(newApps)
      }, 2000)
    })
  }, [])

  return {
    permissions,
    installedApps,
    requestPermission,
    toggleAppIntegration,
    scanForApps,
  }
}
