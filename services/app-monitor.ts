"use client"

interface AppLaunchEvent {
  appId: string
  appName: string
  timestamp: Date
  wasBlocked: boolean
}

interface AppMonitorConfig {
  onAppLaunch: (appId: string, appName: string) => void
  onInterventionComplete: (appId: string, wasSkipped: boolean) => void
  blockedApps: string[]
}

class AppMonitorService {
  private config: AppMonitorConfig | null = null
  private isMonitoring = false
  private launchHistory: AppLaunchEvent[] = []
  private worker: Worker | null = null

  initialize(config: AppMonitorConfig) {
    this.config = config
    this.startMonitoring()
  }

  private startMonitoring() {
    if (this.isMonitoring || !this.config) return

    this.isMonitoring = true

    // Simulate app launch detection using various browser APIs
    this.setupVisibilityChangeDetection()
    this.setupFocusDetection()
    this.setupServiceWorkerCommunication()

    console.log("App monitoring started")
  }

  private setupVisibilityChangeDetection() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // User switched away from our app
        this.simulateAppLaunch()
      }
    })
  }

  private setupFocusDetection() {
    window.addEventListener("blur", () => {
      // Window lost focus - user might be opening another app
      setTimeout(() => {
        if (document.hidden) {
          this.simulateAppLaunch()
        }
      }, 100)
    })
  }

  private setupServiceWorkerCommunication() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "APP_LAUNCH_DETECTED") {
          this.handleAppLaunch(event.data.appId, event.data.appName)
        }
      })

      // Also listen for service worker registration updates
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("Service worker controller changed")
      })
    }
  }

  private simulateAppLaunch() {
    // Only simulate if we don't have service worker communication
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
      const blockedApps = [
        { id: "instagram", name: "Instagram" },
        { id: "tiktok", name: "TikTok" },
        { id: "youtube", name: "YouTube" },
        { id: "twitter", name: "Twitter" },
      ]

      const randomApp = blockedApps[Math.floor(Math.random() * blockedApps.length)]

      // Only trigger if this app is in our blocked list
      if (this.config?.blockedApps.includes(randomApp.id)) {
        setTimeout(
          () => {
            this.handleAppLaunch(randomApp.id, randomApp.name)
          },
          Math.random() * 3000 + 1000,
        ) // Random delay 1-4s
      }
    }
  }

  private handleAppLaunch(appId: string, appName: string) {
    if (!this.config) return

    const isBlocked = this.config.blockedApps.includes(appId)

    this.launchHistory.push({
      appId,
      appName,
      timestamp: new Date(),
      wasBlocked: isBlocked,
    })

    if (isBlocked) {
      this.config.onAppLaunch(appId, appName)
    }
  }

  triggerTestIntervention(appId: string, appName: string) {
    if (this.config) {
      this.config.onAppLaunch(appId, appName)
    }
  }

  getRecentLaunches(limit = 10): AppLaunchEvent[] {
    return this.launchHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)
  }

  stopMonitoring() {
    this.isMonitoring = false
    console.log("App monitoring stopped")
  }
}

export const appMonitor = new AppMonitorService()
