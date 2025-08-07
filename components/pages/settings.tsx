"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { SettingsIcon, User, Bell, Shield, Database, Map, Smartphone, Wifi, Download, Upload, RefreshCw, Trash2, Plus, Edit, Save } from 'lucide-react'

export function Settings() {
  const { toast } = useToast()
  
  // User Profile Settings
  const [userProfile, setUserProfile] = useState({
    name: "Railway Officer",
    email: "officer@indianrailways.gov.in",
    phone: "+91-9876543210",
    designation: "Assistant Signal Engineer",
    department: "Signal & Telecommunication",
    employeeId: "IR2024001",
    division: "Northern Railway"
  })

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30,
    defaultMapView: "satellite",
    enableGPS: true,
    enableNotifications: true,
    enableOfflineMode: true,
    dataRetentionDays: 90,
    backupFrequency: "daily",
    theme: "light",
    language: "english"
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    faultAlerts: true,
    maintenanceReminders: true,
    complianceAlerts: true,
    systemUpdates: false,
    weeklyReports: true
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 3,
    auditLogging: true,
    dataEncryption: true
  })

  // Map Settings
  const [mapSettings, setMapSettings] = useState({
    defaultZoom: 8,
    showGrid: false,
    showCoordinates: true,
    enableClustering: true,
    heatMapIntensity: 0.5,
    offlineMapSize: "2GB",
    cacheExpiry: 7
  })

  const handleSaveProfile = () => {
    // Validate required fields
    if (!userProfile.name || !userProfile.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated Successfully",
        description: "Your profile information has been saved and synchronized across all systems"
      })
    }, 1000)
  }

  const handleSaveSystemSettings = () => {
    // Validate settings
    if (systemSettings.refreshInterval < 10) {
      toast({
        title: "Invalid Setting",
        description: "Refresh interval must be at least 10 seconds",
        variant: "destructive"
      })
      return
    }

    setTimeout(() => {
      toast({
        title: "System Settings Updated",
        description: "System configuration has been saved. Some changes may require a restart."
      })
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setTimeout(() => {
      toast({
        title: "Notification Preferences Saved",
        description: "Your notification settings have been updated successfully"
      })
    }, 1000)
  }

  const handleSaveSecurity = () => {
    // Validate security settings
    if (securitySettings.sessionTimeout < 5) {
      toast({
        title: "Security Warning",
        description: "Session timeout should be at least 5 minutes for security",
        variant: "destructive"
      })
      return
    }

    setTimeout(() => {
      toast({
        title: "Security Settings Updated",
        description: "Security configuration has been updated. Please log in again for changes to take effect."
      })
    }, 1000)
  }

  const handleSaveMapSettings = () => {
    setTimeout(() => {
      toast({
        title: "Map Settings Saved",
        description: "Map configuration has been saved and will be applied to all map views"
      })
    }, 1000)
  }

  const handleExportSettings = () => {
    const allSettings = {
      userProfile,
      systemSettings,
      notificationSettings,
      securitySettings,
      mapSettings,
      exportDate: new Date().toISOString(),
      version: "2.1.4"
    }
    
    const dataStr = JSON.stringify(allSettings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `railway-settings-${userProfile.employeeId}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
    
    toast({
      title: "Settings Exported Successfully",
      description: `Settings exported for ${userProfile.name} (${userProfile.employeeId})`
    })
  }

  const handleImportSettings = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string)
            
            // Validate settings structure
            if (!settings.version) {
              throw new Error("Invalid settings file format")
            }
            
            // Apply imported settings with confirmation
            if (settings.userProfile) setUserProfile(settings.userProfile)
            if (settings.systemSettings) setSystemSettings(settings.systemSettings)
            if (settings.notificationSettings) setNotificationSettings(settings.notificationSettings)
            if (settings.securitySettings) setSecuritySettings(settings.securitySettings)
            if (settings.mapSettings) setMapSettings(settings.mapSettings)
            
            toast({
              title: "Settings Imported Successfully",
              description: `Settings from ${settings.exportDate ? new Date(settings.exportDate).toLocaleDateString() : 'unknown date'} have been applied`
            })
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Failed to import settings. Please check the file format and try again.",
              variant: "destructive"
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleResetSettings = () => {
    // Reset all settings to defaults
    setUserProfile({
      name: "Railway Officer",
      email: "officer@indianrailways.gov.in",
      phone: "+91-9876543210",
      designation: "Assistant Signal Engineer",
      department: "Signal & Telecommunication",
      employeeId: "IR2024001",
      division: "Northern Railway"
    })
    
    setSystemSettings({
      autoRefresh: true,
      refreshInterval: 30,
      defaultMapView: "satellite",
      enableGPS: true,
      enableNotifications: true,
      enableOfflineMode: true,
      dataRetentionDays: 90,
      backupFrequency: "daily",
      theme: "light",
      language: "english"
    })
    
    setNotificationSettings({
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      faultAlerts: true,
      maintenanceReminders: true,
      complianceAlerts: true,
      systemUpdates: false,
      weeklyReports: true
    })

    setSecuritySettings({
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 3,
      auditLogging: true,
      dataEncryption: true
    })

    setMapSettings({
      defaultZoom: 8,
      showGrid: false,
      showCoordinates: true,
      enableClustering: true,
      heatMapIntensity: 0.5,
      offlineMapSize: "2GB",
      cacheExpiry: 7
    })
  
    toast({
      title: "All Settings Reset",
      description: "All settings have been reset to their default values. Please save your preferences."
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure system preferences and user settings</p>
        </div>
        <div className="flex space-x-2 mt-4 lg:mt-0">
          <Button variant="outline" onClick={handleImportSettings}>
            <Upload className="w-4 h-4 mr-2" />
            Import Settings
          </Button>
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset All Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Are you sure you want to reset all settings to their default values? This action cannot be undone.
                </p>
                <div className="flex space-x-2 justify-end">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive" onClick={handleResetSettings}>
                    Reset Settings
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="map">Map Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={userProfile.employeeId}
                    onChange={(e) => setUserProfile({...userProfile, employeeId: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={userProfile.designation}
                    onChange={(e) => setUserProfile({...userProfile, designation: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={userProfile.department} onValueChange={(value) => setUserProfile({...userProfile, department: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Signal & Telecommunication">Signal & Telecommunication</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="division">Railway Division</Label>
                  <Select value={userProfile.division} onValueChange={(value) => setUserProfile({...userProfile, division: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Northern Railway">Northern Railway</SelectItem>
                      <SelectItem value="Central Railway">Central Railway</SelectItem>
                      <SelectItem value="Eastern Railway">Eastern Railway</SelectItem>
                      <SelectItem value="Western Railway">Western Railway</SelectItem>
                      <SelectItem value="Southern Railway">Southern Railway</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="bg-[#1E3A8A] hover:bg-blue-800">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="w-5 h-5 mr-2" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">General Settings</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoRefresh">Auto Refresh Data</Label>
                    <Switch
                      id="autoRefresh"
                      checked={systemSettings.autoRefresh}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoRefresh: checked})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                    <Input
                      id="refreshInterval"
                      type="number"
                      value={systemSettings.refreshInterval}
                      onChange={(e) => setSystemSettings({...systemSettings, refreshInterval: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={systemSettings.theme} onValueChange={(value) => setSystemSettings({...systemSettings, theme: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="bengali">Bengali</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Data & Storage</h3>
                  <div>
                    <Label htmlFor="dataRetention">Data Retention (days)</Label>
                    <Input
                      id="dataRetention"
                      type="number"
                      value={systemSettings.dataRetentionDays}
                      onChange={(e) => setSystemSettings({...systemSettings, dataRetentionDays: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select value={systemSettings.backupFrequency} onValueChange={(value) => setSystemSettings({...systemSettings, backupFrequency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableGPS">Enable GPS Tracking</Label>
                    <Switch
                      id="enableGPS"
                      checked={systemSettings.enableGPS}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, enableGPS: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableOfflineMode">Enable Offline Mode</Label>
                    <Switch
                      id="enableOfflineMode"
                      checked={systemSettings.enableOfflineMode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, enableOfflineMode: checked})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSystemSettings} className="bg-[#1E3A8A] hover:bg-blue-800">
                  <Save className="w-4 h-4 mr-2" />
                  Save System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Delivery Methods</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Notification Types</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="faultAlerts">Fault Alerts</Label>
                    <Switch
                      id="faultAlerts"
                      checked={notificationSettings.faultAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, faultAlerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenanceReminders">Maintenance Reminders</Label>
                    <Switch
                      id="maintenanceReminders"
                      checked={notificationSettings.maintenanceReminders}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, maintenanceReminders: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="complianceAlerts">Compliance Alerts</Label>
                    <Switch
                      id="complianceAlerts"
                      checked={notificationSettings.complianceAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, complianceAlerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="systemUpdates">System Updates</Label>
                    <Switch
                      id="systemUpdates"
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemUpdates: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weeklyReports">Weekly Reports</Label>
                    <Switch
                      id="weeklyReports"
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="bg-[#1E3A8A] hover:bg-blue-800">
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Authentication</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <Switch
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Access Control</h3>
                  <div>
                    <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                    <Input
                      id="loginAttempts"
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auditLogging">Audit Logging</Label>
                    <Switch
                      id="auditLogging"
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, auditLogging: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dataEncryption">Data Encryption</Label>
                    <Switch
                      id="dataEncryption"
                      checked={securitySettings.dataEncryption}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, dataEncryption: checked})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity} className="bg-[#1E3A8A] hover:bg-blue-800">
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="w-5 h-5 mr-2" />
                Map Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Display Settings</h3>
                  <div>
                    <Label htmlFor="defaultZoom">Default Zoom Level</Label>
                    <Input
                      id="defaultZoom"
                      type="number"
                      min="1"
                      max="18"
                      value={mapSettings.defaultZoom}
                      onChange={(e) => setMapSettings({...mapSettings, defaultZoom: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showGrid">Show Grid Lines</Label>
                    <Switch
                      id="showGrid"
                      checked={mapSettings.showGrid}
                      onCheckedChange={(checked) => setMapSettings({...mapSettings, showGrid: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showCoordinates">Show Coordinates</Label>
                    <Switch
                      id="showCoordinates"
                      checked={mapSettings.showCoordinates}
                      onCheckedChange={(checked) => setMapSettings({...mapSettings, showCoordinates: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableClustering">Enable Marker Clustering</Label>
                    <Switch
                      id="enableClustering"
                      checked={mapSettings.enableClustering}
                      onCheckedChange={(checked) => setMapSettings({...mapSettings, enableClustering: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Offline & Performance</h3>
                  <div>
                    <Label htmlFor="offlineMapSize">Offline Map Cache Size</Label>
                    <Select value={mapSettings.offlineMapSize} onValueChange={(value) => setMapSettings({...mapSettings, offlineMapSize: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1GB">1 GB</SelectItem>
                        <SelectItem value="2GB">2 GB</SelectItem>
                        <SelectItem value="5GB">5 GB</SelectItem>
                        <SelectItem value="10GB">10 GB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cacheExpiry">Cache Expiry (days)</Label>
                    <Input
                      id="cacheExpiry"
                      type="number"
                      value={mapSettings.cacheExpiry}
                      onChange={(e) => setMapSettings({...mapSettings, cacheExpiry: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="heatMapIntensity">Heat Map Intensity</Label>
                    <Input
                      id="heatMapIntensity"
                      type="number"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={mapSettings.heatMapIntensity}
                      onChange={(e) => setMapSettings({...mapSettings, heatMapIntensity: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveMapSettings} className="bg-[#1E3A8A] hover:bg-blue-800">
                  <Save className="w-4 h-4 mr-2" />
                  Save Map Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Advanced Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">API Configuration</h3>
                  <div>
                    <Label htmlFor="apiEndpoint">API Endpoint</Label>
                    <Input
                      id="apiEndpoint"
                      placeholder="https://api.indianrailways.gov.in"
                      defaultValue="https://api.indianrailways.gov.in"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apiTimeout">API Timeout (seconds)</Label>
                    <Input
                      id="apiTimeout"
                      type="number"
                      defaultValue="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxRetries">Max Retry Attempts</Label>
                    <Input
                      id="maxRetries"
                      type="number"
                      defaultValue="3"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Performance Tuning</h3>
                  <div>
                    <Label htmlFor="maxConcurrentRequests">Max Concurrent Requests</Label>
                    <Input
                      id="maxConcurrentRequests"
                      type="number"
                      defaultValue="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cacheSize">Memory Cache Size (MB)</Label>
                    <Input
                      id="cacheSize"
                      type="number"
                      defaultValue="256"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select defaultValue="info">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Database Maintenance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center"
                    onClick={() => {
                      toast({
                        title: "Database Optimization Started",
                        description: "Database optimization is running in the background. This may take a few minutes."
                      })
                      setTimeout(() => {
                        toast({
                          title: "Database Optimized",
                          description: "Database optimization completed successfully. Performance improved."
                        })
                      }, 5000)
                    }}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Optimize Database
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center"
                    onClick={() => {
                      toast({
                        title: "Cache Cleared",
                        description: "System cache has been cleared. You may notice improved performance."
                      })
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center justify-center text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Purge Old Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Purge Old Data</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          This will permanently delete data older than the specified retention period. This action cannot be undone.
                        </p>
                        <div>
                          <Label>Data older than (days)</Label>
                          <Input type="number" defaultValue="90" min="30" />
                        </div>
                        <div className="flex space-x-2 justify-end">
                          <Button variant="outline">Cancel</Button>
                          <Button 
                            variant="destructive"
                            onClick={() => {
                              toast({
                                title: "Data Purge Initiated",
                                description: "Old data purge has started. You will be notified when complete."
                              })
                              setTimeout(() => {
                                toast({
                                  title: "Data Purge Complete",
                                  description: "Old data has been successfully purged from the system."
                                })
                              }, 3000)
                            }}
                          >
                            Purge Data
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">System Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">System Version:</span>
                    <span>2.1.4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Database Version:</span>
                    <span>PostgreSQL 14.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last Update:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Uptime:</span>
                    <span>15 days, 8 hours</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
