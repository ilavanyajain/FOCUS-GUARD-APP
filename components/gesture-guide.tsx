"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShuffleIcon as Swipe, Hand, ZoomIn, X } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function GestureGuide() {
  const [isOpen, setIsOpen] = useState(true)
  const isMobile = useMobile()

  if (!isMobile || !isOpen) return null

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200 dark:border-blue-800 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-medium">Mobile Gesture Guide</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full">
              <Swipe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium">Swipe between tabs</p>
              <p className="text-muted-foreground">Swipe left/right to navigate between main tabs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-full">
              <Swipe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium">Swipe app items</p>
              <p className="text-muted-foreground">Swipe left on apps to reveal quick actions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full">
              <Hand className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium">Touch breathing circle</p>
              <p className="text-muted-foreground">Touch and hold during breathing exercises</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded-full">
              <ZoomIn className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="font-medium">Pinch to zoom</p>
              <p className="text-muted-foreground">Use pinch gestures on charts and analytics</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
