"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePermissions, type DeviceApp } from "@/hooks/use-permissions"
import { Smartphone, Search, RefreshCw, Clock, CheckCircle, Filter } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function AppIntegration() {
  const { installedApps, toggleAppIntegration, scanForApps } = usePermissions()
  const [searchTerm, setSearchTerm] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleScanForApps = async () => {
    setIsScanning(true)
    await scanForApps()
    setIsScanning(false)
  }

  const filteredApps = installedApps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === null || app.category === selectedCategory),
  )

  const categories = Array.from(new Set(installedApps.map((app) => app.category)))
  const integratedApps = installedApps.filter((app) => app.isIntegrated).length

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full">
              <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">App Integration</h3>
              <p className="text-sm text-muted-foreground">
                {integratedApps} of {installedApps.length} apps integrated with Focus Guard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleScanForApps} disabled={isScanning}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
              {isScanning ? "Scanning..." : "Scan for Apps"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App List */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle>Installed Apps</CardTitle>
          <CardDescription>Select which apps to integrate with Focus Guard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-700/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                className="bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1 text-sm"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* App Categories */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="integrated">Integrated</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              <AppList apps={filteredApps} onToggleIntegration={toggleAppIntegration} />
            </TabsContent>

            <TabsContent value="integrated" className="space-y-4 mt-4">
              <AppList
                apps={filteredApps.filter((app) => app.isIntegrated)}
                onToggleIntegration={toggleAppIntegration}
              />
            </TabsContent>

            <TabsContent value="available" className="space-y-4 mt-4">
              <AppList
                apps={filteredApps.filter((app) => app.canIntegrate && !app.isIntegrated)}
                onToggleIntegration={toggleAppIntegration}
              />
            </TabsContent>

            <TabsContent value="social" className="space-y-4 mt-4">
              <AppList
                apps={filteredApps.filter((app) => app.category === "Social Media")}
                onToggleIntegration={toggleAppIntegration}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function AppList({
  apps,
  onToggleIntegration,
}: {
  apps: DeviceApp[]
  onToggleIntegration: (id: string) => void
}) {
  if (apps.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No apps found matching your criteria</p>
  }

  return (
    <div className="space-y-3">
      {apps.map((app) => (
        <div
          key={app.id}
          className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-white/20"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">{app.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{app.name}</h3>
                {app.isIntegrated && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {app.category}
                </Badge>
                {app.lastUsed && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(app.lastUsed)}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Switch
            checked={app.isIntegrated}
            onCheckedChange={() => onToggleIntegration(app.id)}
            disabled={!app.canIntegrate}
          />
        </div>
      ))}
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
