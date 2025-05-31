"use client"

interface NotificationAction {
  action: string
  title: string
}

interface NotificationConfig {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
  actions?: NotificationAction[]
}

interface FocusReminder {
  id: string
  time: string
  message: string
  enabled: boolean
}

class NotificationService {
  private permission: NotificationPermission = "default"
  private registration: ServiceWorkerRegistration | null = null

  async initialize(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications")
      return false
    }

    // Request permission first, even without service worker
    this.permission = await this.requestPermission()

    // Try to register service worker, but don't fail if it doesn't work
    if ("serviceWorker" in navigator) {
      try {
        // Check if service worker is already registered
        this.registration = await navigator.serviceWorker.getRegistration()

        if (!this.registration) {
          // Try to register our service worker
          this.registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          })
          console.log("Service worker registered successfully")
        } else {
          console.log("Service worker already registered")
        }
      } catch (error) {
        console.warn("Service worker registration failed, using fallback notifications:", error)
        // Continue without service worker - we can still show basic notifications
      }
    }

    return this.permission === "granted"
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (this.permission === "granted") {
      return this.permission
    }

    this.permission = await Notification.requestPermission()
    return this.permission
  }

  async showNotification(config: NotificationConfig): Promise<void> {
    if (this.permission !== "granted") {
      throw new Error("Notifications not permitted")
    }

    // If we have a service worker registration, use it
    if (this.registration) {
      try {
        await this.registration.showNotification(config.title, {
          body: config.body,
          icon: config.icon || "/icons/icon-192.png",
          badge: config.badge || "/icons/icon-192.png",
          tag: config.tag,
          requireInteraction: config.requireInteraction || false,
          actions: config.actions || [],
          data: {
            timestamp: Date.now(),
            url: window.location.origin,
          },
        })
        return
      } catch (error) {
        console.warn("Service worker notification failed, falling back to basic notification:", error)
      }
    }

    // Fallback to basic browser notification
    try {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || "/icons/icon-192.png",
        tag: config.tag,
        requireInteraction: config.requireInteraction || false,
        data: {
          timestamp: Date.now(),
          url: window.location.origin,
        },
      })

      // Handle click events for basic notifications
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // Auto-close after 5 seconds if not requiring interaction
      if (!config.requireInteraction) {
        setTimeout(() => {
          notification.close()
        }, 5000)
      }
    } catch (error) {
      console.error("Failed to show notification:", error)
      throw error
    }
  }

  async showInterventionReminder(appName: string): Promise<void> {
    await this.showNotification({
      title: "Focus Guard Intervention",
      body: `Take a moment to breathe before opening ${appName}`,
      tag: "intervention",
      requireInteraction: true,
      actions: [
        {
          action: "breathe",
          title: "Start Breathing Exercise",
        },
        {
          action: "skip",
          title: "Skip",
        },
      ],
    })
  }

  async showFocusReminder(message: string): Promise<void> {
    await this.showNotification({
      title: "Focus Reminder",
      body: message,
      tag: "focus-reminder",
      actions: [
        {
          action: "start-focus",
          title: "Start Focus Session",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    })
  }

  async showProgressUpdate(stats: { interventions: number; timeSaved: string }): Promise<void> {
    await this.showNotification({
      title: "Daily Progress Update",
      body: `You've completed ${stats.interventions} interventions and saved ${stats.timeSaved} today!`,
      tag: "progress-update",
    })
  }

  async scheduleFocusReminders(reminders: FocusReminder[]): Promise<void> {
    if (!this.registration) return

    // Clear existing reminders
    const existingNotifications = await this.registration.getNotifications({ tag: "scheduled-reminder" })
    existingNotifications.forEach((notification) => notification.close())

    // Schedule new reminders
    for (const reminder of reminders.filter((r) => r.enabled)) {
      const [hours, minutes] = reminder.time.split(":").map(Number)
      const now = new Date()
      const reminderTime = new Date()
      reminderTime.setHours(hours, minutes, 0, 0)

      // If the time has passed today, schedule for tomorrow
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1)
      }

      const delay = reminderTime.getTime() - now.getTime()

      setTimeout(async () => {
        await this.showFocusReminder(reminder.message)
      }, delay)
    }
  }

  async showAppBlockedNotification(appName: string, interventionCount: number): Promise<void> {
    await this.showNotification({
      title: "App Access Blocked",
      body: `${appName} was blocked. This is your ${interventionCount} intervention today.`,
      tag: "app-blocked",
      requireInteraction: false,
    })
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission
  }

  isSupported(): boolean {
    return "Notification" in window && "serviceWorker" in navigator
  }
}

export const notificationService = new NotificationService()
