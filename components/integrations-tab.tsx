"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, Zap, Heart, Brain, Target, CheckCircle, ExternalLink, Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: "productivity" | "health" | "social" | "automation"
  isConnected: boolean
  isPremium: boolean
  features: string[]
}

export function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google_calendar",
      name: "Google Calendar",
      description: "Sync focus sessions with your calendar events",
      icon: <Calendar className="w-5 h-5" />,
      category: "productivity",
      isConnected: false,
      isPremium: false,
      features: ["Auto-schedule focus time", "Block apps during meetings", "Calendar-based blocking rules"],
    },
    {
      id: "apple_health",
      name: "Apple Health",
      description: "Track mindfulness and screen time in Health app",
      icon: <Heart className="w-5 h-5" />,
      category: "health",
      isConnected: true,
      isPremium: false,
      features: ["Mindfulness minutes tracking", "Screen time correlation", "Health insights"],
    },
    {
      id: "rescue_time",
      name: "RescueTime",
      description: "Advanced productivity analytics and insights",
      icon: <Clock className="w-5 h-5" />,
      category: "productivity",
      isConnected: false,
      isPremium: true,
      features: ["Detailed time tracking", "Productivity scoring", "Goal setting"],
    },
    {
      id: "slack",
      name: "Slack",
      description: "Share focus status with your team",
      icon: <Users className="w-5 h-5" />,
      category: "social",
      isConnected: false,
      isPremium: false,
      features: ["Auto status updates", "Focus session notifications", "Team accountability"],
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automate workflows with 5000+ apps",
      icon: <Zap className="w-5 h-5" />,
      category: "automation",
      isConnected: false,
      isPremium: true,
      features: ["Custom automations", "Trigger actions", "Data sync"],
    },
    {
      id: "headspace",
      name: "Headspace",
      description: "Enhanced meditation and mindfulness features",
      icon: <Brain className="w-5 h-5" />,
      category: "health",
      isConnected: false,
      isPremium: true,
      features: ["Guided breathing sessions", "Meditation reminders", "Mindfulness tracking"],
    },
    {
      id: "todoist",
      name: "Todoist",
      description: "Block distracting apps when tasks are due",
      icon: <Target className="w-5 h-5" />,
      category: "productivity",
      isConnected: true,
      isPremium: false,
      features: ["Task-based blocking", "Deadline reminders", "Productivity insights"],
    },
  ])

  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})

  const toggleIntegration = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId ? { ...integration, isConnected: !integration.isConnected } : integration,
      ),
    )
  }

  const updateApiKey = (integrationId: string, apiKey: string) => {
    setApiKeys((prev) => ({ ...prev, [integrationId]: apiKey }))
  }

  const getIntegrationsByCategory = (category: string) => {
    return integrations.filter((integration) => integration.category === category)
  }

  const connectedIntegrations = integrations.filter((i) => i.isConnected).length

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-full">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Third-Party Integrations</h3>
              <p className="text-sm text-muted-foreground">Connect Focus Guard with your favorite apps and services</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              {connectedIntegrations} Connected
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              {integrations.length - connectedIntegrations} Available
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="productivity" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="productivity" className="space-y-4">
          <IntegrationCategory
            integrations={getIntegrationsByCategory("productivity")}
            onToggle={toggleIntegration}
            apiKeys={apiKeys}
            onUpdateApiKey={updateApiKey}
          />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <IntegrationCategory
            integrations={getIntegrationsByCategory("health")}
            onToggle={toggleIntegration}
            apiKeys={apiKeys}
            onUpdateApiKey={updateApiKey}
          />
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <IntegrationCategory
            integrations={getIntegrationsByCategory("social")}
            onToggle={toggleIntegration}
            apiKeys={apiKeys}
            onUpdateApiKey={updateApiKey}
          />
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <IntegrationCategory
            integrations={getIntegrationsByCategory("automation")}
            onToggle={toggleIntegration}
            apiKeys={apiKeys}
            onUpdateApiKey={updateApiKey}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function IntegrationCategory({
  integrations,
  onToggle,
  apiKeys,
  onUpdateApiKey,
}: {
  integrations: Integration[]
  onToggle: (id: string) => void
  apiKeys: Record<string, string>
  onUpdateApiKey: (id: string, key: string) => void
}) {
  return (
    <div className="space-y-4">
      {integrations.map((integration) => (
        <Card key={integration.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">{integration.icon}</div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {integration.name}
                    {integration.isPremium && (
                      <Badge variant="secondary" className="text-xs">
                        Premium
                      </Badge>
                    )}
                    {integration.isConnected && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </div>
              </div>
              <Switch checked={integration.isConnected} onCheckedChange={() => onToggle(integration.id)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Features */}
              <div>
                <h4 className="text-sm font-medium mb-2">Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {integration.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* API Key Input (for some integrations) */}
              {integration.isConnected && ["rescue_time", "zapier"].includes(integration.id) && (
                <div className="space-y-2">
                  <Label htmlFor={`api-key-${integration.id}`} className="text-sm font-medium">
                    API Key
                  </Label>
                  <Input
                    id={`api-key-${integration.id}`}
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKeys[integration.id] || ""}
                    onChange={(e) => onUpdateApiKey(integration.id, e.target.value)}
                    className="bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {integration.isConnected ? (
                  <>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open {integration.name}
                    </Button>
                  </>
                ) : (
                  <Button size="sm">Connect to {integration.name}</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
