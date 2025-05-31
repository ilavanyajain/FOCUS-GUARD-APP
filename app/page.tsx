"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppBlockingTab } from "@/components/app-blocking-tab"
import { AnalyticsTab } from "@/components/analytics-tab"
import { FocusSessionTab } from "@/components/focus-session-tab"
import { SettingsTab } from "@/components/settings-tab"
import { BreathingModal } from "@/components/breathing-modal"
import { InterventionModal } from "@/components/intervention-modal"
import { GestureGuide } from "@/components/gesture-guide"
import { Shield, BarChart3, Timer, Settings, Zap, Wifi, WifiOff, Download } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useSwipe } from "@/hooks/use-swipe"
import { PermissionsTab } from "@/components/permissions-tab"
import { IntegrationsTab } from "@/components/integrations-tab"
import { appMonitor } from "@/services/app-monitor"
import { offlineService } from "@/services/offline-service"
import { notificationService } from "@/services/notification-service"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function FocusGuardApp() {
  const [showBreathingModal, setShowBreathingModal] = useState(false)
  const [showInterventionModal, setShowInterventionModal] = useState(false)
  const [currentInterventionApp, setCurrentInterventionApp] = useState<{ name: string; icon: string } | null>(null)
  const [activeTab, setActiveTab] = useState("blocking")
  const [isOnline, setIsOnline] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [blockedApps] = useState(["instagram", "tiktok", "youtube", "twitter"])
  const isMobile = useMobile()

  const tabOrder = ["blocking", "analytics", "focus", "permissions", "integrations", "settings"]

  useEffect(() => {
    // Initialize services
    const initializeServices = async () => {
      try {
        // Initialize offline service first
        await offlineService.initialize()
        console.log("Offline service initialized")

        // Initialize notifications (with fallback)
        try {
          const notificationPermission = await notificationService.initialize()
          setNotificationsEnabled(notificationPermission)
          console.log("Notification service initialized:", notificationPermission)
        } catch (error) {
          console.warn("Notification service failed to initialize:", error)
          setNotificationsEnabled(false)
        }

        // Initialize app monitoring
        appMonitor.initialize({
          blockedApps,
          onAppLaunch: (appId: string, appName: string) => {
            handleAppLaunchIntervention(appId, appName)
          },
          onInterventionComplete: (appId: string, wasSkipped: boolean) => {
            handleInterventionComplete(appId, wasSkipped)
          },
        })

        console.log("All services initialized successfully")
      } catch (error) {
        console.error("Failed to initialize some services:", error)
        // Continue anyway - the app should still work without all services
      }
    }

    initializeServices()

    // Online/offline detection
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Service worker messages (with error handling)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        try {
          if (event.data && event.data.type === "START_BREATHING_EXERCISE") {
            setCurrentInterventionApp({
              name: event.data.appName,
              icon: "📱",
            })
            setShowInterventionModal(true)
          }
        } catch (error) {
          console.error("Error handling service worker message:", error)
        }
      })
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      appMonitor.stopMonitoring()
    }
  }, [blockedApps])

  const handleAppLaunchIntervention = async (appId: string, appName: string) => {
    const appIcons: Record<string, string> = {
      instagram: "📷",
      tiktok: "🎵",
      youtube: "📺",
      twitter: "🐦",
    }

    setCurrentInterventionApp({
      name: appName,
      icon: appIcons[appId] || "📱",
    })
    setShowInterventionModal(true)

    // Show notification if enabled (with error handling)
    if (notificationsEnabled) {
      try {
        await notificationService.showInterventionReminder(appName)
      } catch (error) {
        console.warn("Failed to show intervention notification:", error)
        // Continue without notification
      }
    }
  }

  const handleInterventionComplete = async (appId: string, wasSkipped: boolean) => {
    // Save intervention record
    const intervention = {
      id: `${Date.now()}-${appId}`,
      appId,
      appName: currentInterventionApp?.name || "Unknown",
      timestamp: new Date(),
      duration: wasSkipped ? 10 : 60, // Assume 60s full intervention, 10s if skipped
      wasSkipped,
      completionRate: wasSkipped ? 0.17 : 1.0,
    }

    try {
      await offlineService.saveIntervention(intervention)

      if (notificationsEnabled && !wasSkipped) {
        await notificationService.showNotification({
          title: "Intervention Complete!",
          body: `Great job taking a mindful moment before opening ${intervention.appName}`,
          tag: "intervention-complete",
        })
      }
    } catch (error) {
      console.error("Failed to save intervention:", error)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleSwipeLeft = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1])
    }
  }

  const handleSwipeRight = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1])
    }
  }

  const swipeHandlers = useSwipe({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
  })

  const triggerTestIntervention = () => {
    appMonitor.triggerTestIntervention("instagram", "Instagram")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Wifi className="w-3 h-3 mr-1" />
                Online
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </Badge>
            )}
            {notificationsEnabled && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                🔔 Notifications On
              </Badge>
            )}
          </div>
        </div>

        {/* Offline Alert */}
        {!isOnline && (
          <Alert className="mb-6 bg-orange-50 border-orange-200">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              You're currently offline. Focus Guard will continue to work and sync your data when you're back online.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Focus Guard
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Take control of your digital habits with mindful app usage and breathing interventions
          </p>
          <Button 
            onClick={() => window.location.href = '/download'}
            variant="outline"
            className="group"
          >
            <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Get Chrome Extension & Mobile App
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 h-14 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="blocking" className="flex items-center gap-2 text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">App Blocking</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="focus" className="flex items-center gap-2 text-sm font-medium">
              <Timer className="w-4 h-4" />
              <span className="hidden sm:inline">Focus</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2 text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2 text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 text-sm font-medium">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <div {...(isMobile ? swipeHandlers : {})} className="touch-pan-y">
            <TabsContent value="blocking">
              <AppBlockingTab onTriggerBreathing={triggerTestIntervention} />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>

            <TabsContent value="focus">
              <FocusSessionTab />
            </TabsContent>

            <TabsContent value="permissions">
              <PermissionsTab />
            </TabsContent>

            <TabsContent value="integrations">
              <IntegrationsTab />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </div>
        </Tabs>

        {/* Breathing Modal (for manual triggers) */}
        <BreathingModal isOpen={showBreathingModal} onClose={() => setShowBreathingModal(false)} />

        {/* Intervention Modal (for app launch blocking) */}
        <InterventionModal
          isOpen={showInterventionModal}
          onClose={() => setShowInterventionModal(false)}
          onComplete={(wasSkipped) => {
            if (currentInterventionApp) {
              handleInterventionComplete("test", wasSkipped)
            }
            setShowInterventionModal(false)
            setCurrentInterventionApp(null)
          }}
          appName={currentInterventionApp?.name || "Unknown App"}
          appIcon={currentInterventionApp?.icon}
          interventionDuration={60}
          allowSkip={true}
          skipDelay={10}
        />

        {/* Gesture Guide for mobile users */}
        <GestureGuide />
      </div>
    </div>
  )
}
