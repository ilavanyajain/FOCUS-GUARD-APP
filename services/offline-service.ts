"use client"

interface OfflineData {
  interventions: InterventionRecord[]
  settings: AppSettings
  blockedApps: string[]
  lastSync: Date
}

interface InterventionRecord {
  id: string
  appId: string
  appName: string
  timestamp: Date
  duration: number
  wasSkipped: boolean
  completionRate: number
}

interface AppSettings {
  interventionDuration: number
  allowSkip: boolean
  skipDelay: number
  breathingPattern: string
  enableNotifications: boolean
}

class OfflineService {
  private dbName = "FocusGuardDB"
  private version = 1
  private db: IDBDatabase | null = null

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains("interventions")) {
          const interventionStore = db.createObjectStore("interventions", { keyPath: "id" })
          interventionStore.createIndex("timestamp", "timestamp", { unique: false })
          interventionStore.createIndex("appId", "appId", { unique: false })
        }

        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" })
        }

        if (!db.objectStoreNames.contains("blockedApps")) {
          db.createObjectStore("blockedApps", { keyPath: "id" })
        }
      }
    })
  }

  async saveIntervention(intervention: InterventionRecord): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["interventions"], "readwrite")
      const store = transaction.objectStore("interventions")
      const request = store.add(intervention)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getInterventions(limit = 100): Promise<InterventionRecord[]> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["interventions"], "readonly")
      const store = transaction.objectStore("interventions")
      const index = store.index("timestamp")
      const request = index.openCursor(null, "prev")

      const results: InterventionRecord[] = []
      let count = 0

      request.onerror = () => reject(request.error)
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor && count < limit) {
          results.push(cursor.value)
          count++
          cursor.continue()
        } else {
          resolve(results)
        }
      }
    })
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["settings"], "readwrite")
      const store = transaction.objectStore("settings")
      const request = store.put({ key: "appSettings", value: settings })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getSettings(): Promise<AppSettings | null> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["settings"], "readonly")
      const store = transaction.objectStore("settings")
      const request = store.get("appSettings")

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        resolve(request.result?.value || null)
      }
    })
  }

  async saveBlockedApps(apps: string[]): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["blockedApps"], "readwrite")
      const store = transaction.objectStore("blockedApps")

      // Clear existing data
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => {
        // Add new data
        let completed = 0
        apps.forEach((appId, index) => {
          const addRequest = store.add({ id: appId, index })
          addRequest.onsuccess = () => {
            completed++
            if (completed === apps.length) {
              resolve()
            }
          }
          addRequest.onerror = () => reject(addRequest.error)
        })

        if (apps.length === 0) resolve()
      }
      clearRequest.onerror = () => reject(clearRequest.error)
    })
  }

  async getBlockedApps(): Promise<string[]> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["blockedApps"], "readonly")
      const store = transaction.objectStore("blockedApps")
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const results = request.result.sort((a, b) => a.index - b.index)
        resolve(results.map((item) => item.id))
      }
    })
  }

  async exportData(): Promise<OfflineData> {
    const [interventions, settings, blockedApps] = await Promise.all([
      this.getInterventions(),
      this.getSettings(),
      this.getBlockedApps(),
    ])

    return {
      interventions,
      settings: settings || {
        interventionDuration: 60,
        allowSkip: true,
        skipDelay: 10,
        breathingPattern: "4-7-8",
        enableNotifications: true,
      },
      blockedApps,
      lastSync: new Date(),
    }
  }

  async importData(data: OfflineData): Promise<void> {
    await Promise.all([this.saveSettings(data.settings), this.saveBlockedApps(data.blockedApps)])

    // Import interventions
    for (const intervention of data.interventions) {
      await this.saveIntervention(intervention)
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["interventions", "settings", "blockedApps"], "readwrite")

      let completed = 0
      const stores = ["interventions", "settings", "blockedApps"]

      stores.forEach((storeName) => {
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onsuccess = () => {
          completed++
          if (completed === stores.length) {
            resolve()
          }
        }
        request.onerror = () => reject(request.error)
      })
    })
  }
}

export const offlineService = new OfflineService()
