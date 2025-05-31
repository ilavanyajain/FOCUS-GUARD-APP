import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Permissions } from "@/components/permissions"
import { AppIntegration } from "@/components/app-integration"
import { Accessibility } from "@/components/accessibility"
import { DeviceIntegration } from "@/components/device-integration"

export function PermissionsTab() {
  return (
    <Tabs defaultValue="permissions" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="apps">App Integration</TabsTrigger>
        <TabsTrigger value="device">Device</TabsTrigger>
        <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
      </TabsList>
      <TabsContent value="permissions" className="space-y-4">
        <Permissions />
      </TabsContent>
      <TabsContent value="apps" className="space-y-4">
        <AppIntegration />
      </TabsContent>
      <TabsContent value="device" className="space-y-4">
        <DeviceIntegration />
      </TabsContent>
      <TabsContent value="accessibility" className="space-y-4">
        <Accessibility />
      </TabsContent>
    </Tabs>
  )
}
