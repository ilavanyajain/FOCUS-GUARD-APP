const CACHE_NAME = "focus-guard-v1"
const urlsToCache = ["/", "/manifest.json"]

// Install event - simplified
self.addEventListener("install", (event) => {
  console.log("Service worker installing...")
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache opened")
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error("Cache failed:", error)
      }),
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service worker activating...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - simplified
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response
      }
      return fetch(event.request).catch(() => {
        // Return a basic offline page if available
        if (event.request.destination === "document") {
          return caches.match("/")
        }
      })
    }),
  )
})

// Push notifications
self.addEventListener("push", (event) => {
  console.log("Push event received")

  let notificationData = {
    title: "Focus Guard",
    body: "Focus Guard notification",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
  }

  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() }
    } catch (e) {
      notificationData.body = event.data.text()
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: Math.random(),
    },
    actions: [
      {
        action: "open",
        title: "Open Focus Guard",
      },
      {
        action: "close",
        title: "Close",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification(notificationData.title, options))
})

// Notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked")
  event.notification.close()

  if (event.action === "open" || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === self.registration.scope && "focus" in client) {
            return client.focus()
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow("/")
        }
      }),
    )
  }
})

// Message handling
self.addEventListener("message", (event) => {
  console.log("Service worker received message:", event.data)

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

// Simulate app launch detection (simplified for demo)
let simulationInterval
function startAppLaunchSimulation() {
  if (simulationInterval) return

  simulationInterval = setInterval(() => {
    // Randomly simulate app launch detection
    if (Math.random() < 0.05) {
      // 5% chance every interval
      const apps = [
        { id: "instagram", name: "Instagram" },
        { id: "tiktok", name: "TikTok" },
        { id: "youtube", name: "YouTube" },
        { id: "twitter", name: "Twitter" },
      ]
      const randomApp = apps[Math.floor(Math.random() * apps.length)]

      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: "APP_LAUNCH_DETECTED",
            appId: randomApp.id,
            appName: randomApp.name,
          })
        })
      })
    }
  }, 15000) // Check every 15 seconds
}

// Start simulation when service worker becomes active
self.addEventListener("activate", () => {
  startAppLaunchSimulation()
})
