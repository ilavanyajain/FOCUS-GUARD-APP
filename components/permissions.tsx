"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePermissions, type Permission } from "@/hooks/use-permissions"
import { Shield, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"

export function Permissions() {
  const { permissions, requestPermission } = usePermissions()
  const [isRequesting, setIsRequesting] = useState<string | null>(null)

  const handleRequestPermission = async (permissionId: string) => {
    setIsRequesting(permissionId)
    await requestPermission(permissionId)
    setIsRequesting(null)
  }

  const requiredPermissions = permissions.filter((p) => p.required)
  const optionalPermissions = permissions.filter((p) => !p.required)

  const requiredGranted = requiredPermissions.filter((p) => p.granted).length
  const requiredTotal = requiredPermissions.length
  const optionalGranted = optionalPermissions.filter((p) => p.granted).length

  return (
    <div className="space-y-6">
      {/* Permission Status Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Permission Status</h3>
              <p className="text-sm text-muted-foreground">
                Required: {requiredGranted}/{requiredTotal} granted • Optional: {optionalGranted}/
                {optionalPermissions.length} granted
              </p>
            </div>
          </div>

          {requiredGranted < requiredTotal && (
            <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-600 dark:text-yellow-400">
                Some required permissions are missing. Focus Guard needs these to function properly.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Required Permissions */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle>Required Permissions</CardTitle>
          <CardDescription>These permissions are necessary for Focus Guard to function properly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requiredPermissions.map((permission) => (
            <PermissionItem
              key={permission.id}
              permission={permission}
              onRequest={handleRequestPermission}
              isRequesting={isRequesting === permission.id}
            />
          ))}
        </CardContent>
      </Card>

      {/* Optional Permissions */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle>Optional Permissions</CardTitle>
          <CardDescription>These permissions enable additional features but are not required</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {optionalPermissions.map((permission) => (
            <PermissionItem
              key={permission.id}
              permission={permission}
              onRequest={handleRequestPermission}
              isRequesting={isRequesting === permission.id}
            />
          ))}
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Focus Guard only requests permissions that are necessary for its functionality. All data is processed locally
          on your device.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function PermissionItem({
  permission,
  onRequest,
  isRequesting,
}: {
  permission: Permission
  onRequest: (id: string) => void
  isRequesting: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-white/20">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{permission.icon}</div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{permission.name}</h3>
            {permission.granted ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{permission.description}</p>
        </div>
      </div>
      <div>
        {permission.granted ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            Granted
          </Badge>
        ) : (
          <Button variant="outline" size="sm" onClick={() => onRequest(permission.id)} disabled={isRequesting}>
            {isRequesting ? "Requesting..." : "Request"}
          </Button>
        )}
      </div>
    </div>
  )
}
