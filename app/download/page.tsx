"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Download, 
  Chrome, 
  Smartphone, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Zap,
  BarChart,
  Timer,
  Share2
} from "lucide-react"

export default function DownloadPage() {
  const [showInstallInstructions, setShowInstallInstructions] = useState(false)
  const [isPWAInstalled, setIsPWAInstalled] = useState(false)

  const features = [
    {
      icon: Shield,
      title: "Smart Website Blocking",
      description: "Block distracting websites with customizable rules"
    },
    {
      icon: Zap,
      title: "Mindful Interventions",
      description: "Breathing exercises before accessing blocked sites"
    },
    {
      icon: Timer,
      title: "Focus Sessions",
      description: "Pomodoro timer with enhanced blocking during focus time"
    },
    {
      icon: BarChart,
      title: "Detailed Analytics",
      description: "Track your progress and identify usage patterns"
    }
  ]

  const handleChromeDownload = () => {
    // In production, this would link to Chrome Web Store
    setShowInstallInstructions(true)
    // For now, provide the local extension
    const link = document.createElement('a')
    link.href = '/chrome-extension.zip'
    link.download = 'focus-guard-extension.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePWAInstall = async () => {
    // Check if PWA install is available
    const deferredPrompt = (window as any).deferredPrompt
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsPWAInstalled(true)
      }
    } else {
      // Fallback to showing instructions
      alert('To install on mobile: Open this page in Chrome/Safari, tap the share button, and select "Add to Home Screen"')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Focus Guard
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Take control of your digital habits with smart website blocking and mindful interventions
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free Forever
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              No Account Required
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Privacy First
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <feature.icon className="w-10 h-10 text-blue-600 mb-3" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Download Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Chrome Extension */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Chrome className="w-8 h-8 text-blue-600" />
                <div>
                  <CardTitle>Chrome Extension</CardTitle>
                  <CardDescription>For desktop browsers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Works on Chrome, Edge, Brave, and other Chromium browsers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Real-time website blocking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Sync across devices</span>
                </li>
              </ul>
              <Button 
                onClick={handleChromeDownload} 
                className="w-full"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Extension
              </Button>
            </CardContent>
          </Card>

          {/* Mobile PWA */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-purple-600" />
                <div>
                  <CardTitle>Mobile Web App</CardTitle>
                  <CardDescription>For iOS and Android</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Install directly from browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Works offline</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>No app store required</span>
                </li>
              </ul>
              <Button 
                onClick={handlePWAInstall}
                className="w-full"
                size="lg"
                variant={isPWAInstalled ? "secondary" : "default"}
              >
                <Smartphone className="w-5 h-5 mr-2" />
                {isPWAInstalled ? "Installed!" : "Install Web App"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Installation Instructions */}
        {showInstallInstructions && (
          <Alert className="mb-8 bg-blue-50 border-blue-200">
            <AlertDescription className="space-y-3">
              <p className="font-semibold">Chrome Extension Installation:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Extract the downloaded ZIP file</li>
                <li>Open Chrome and go to chrome://extensions/</li>
                <li>Enable "Developer mode" in the top right</li>
                <li>Click "Load unpacked" and select the extracted folder</li>
                <li>The Focus Guard extension will appear in your toolbar!</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {/* How It Works */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Install</h3>
                <p className="text-sm text-muted-foreground">
                  Add the extension to Chrome or install the web app on mobile
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Configure</h3>
                <p className="text-sm text-muted-foreground">
                  Select which websites to block and customize interventions
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Stay productive with mindful interventions when you need them
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who have improved their digital wellbeing
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/'}
            >
              Try Web Version
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share with Friends
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 