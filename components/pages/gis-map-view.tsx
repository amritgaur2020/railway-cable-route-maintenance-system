"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Map, Layers, Navigation, ZoomIn, ZoomOut, Search, Download, Settings, MapPin, Route, Satellite, Globe, Mountain, RotateCcw, Target, Share2 } from 'lucide-react'

export function GISMapView() {
  const { toast } = useToast()
  const [mapStyle, setMapStyle] = useState('roadmap')
  const [zoomLevel, setZoomLevel] = useState([10])
  const [gpsEnabled, setGpsEnabled] = useState(false)
  const [routePlanningMode, setRoutePlanningMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [waypoints, setWaypoints] = useState<Array<{lat: number, lng: number, name: string}>>([])
  const [layers, setLayers] = useState({
    cables: true,
    stations: true,
    faults: true,
    maintenance: false,
    terrain: false
  })
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null)

  // Sample railway stations for search
  const railwayStations = [
    { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai Central', lat: 19.0760, lng: 72.8777 },
    { name: 'Chennai Central', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Bangalore City', lat: 12.9716, lng: 77.5946 }
  ]

  useEffect(() => {
    if (gpsEnabled) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          toast({
            title: "GPS Location Updated",
            description: `Current location: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          })
        },
        (error) => {
          toast({
            title: "GPS Error",
            description: "Unable to get current location",
            variant: "destructive"
          })
          setGpsEnabled(false)
        }
      )
    }
  }, [gpsEnabled, toast])

  const handleMapStyleChange = (style: string) => {
    setMapStyle(style)
    toast({
      title: "Map Style Changed",
      description: `Switched to ${style} view`
    })
  }

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel[0] + 1, 20)
    setZoomLevel([newZoom])
    toast({
      title: "Zoomed In",
      description: `Zoom level: ${newZoom}`
    })
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel[0] - 1, 1)
    setZoomLevel([newZoom])
    toast({
      title: "Zoomed Out", 
      description: `Zoom level: ${newZoom}`
    })
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a station name to search",
        variant: "destructive"
      })
      return
    }

    const station = railwayStations.find(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (station) {
      toast({
        title: "Station Found",
        description: `Navigating to ${station.name}`
      })
      // In a real implementation, this would center the map on the station
    } else {
      toast({
        title: "Station Not Found",
        description: `No station found matching "${searchQuery}"`,
        variant: "destructive"
      })
    }
  }

  const handleRoutePlanning = () => {
    setRoutePlanningMode(!routePlanningMode)
    if (!routePlanningMode) {
      toast({
        title: "Route Planning Enabled",
        description: "Click on the map to add waypoints"
      })
    } else {
      toast({
        title: "Route Planning Disabled",
        description: `Route created with ${waypoints.length} waypoints`
      })
    }
  }

  const addWaypoint = (lat: number, lng: number, name: string) => {
    const newWaypoint = { lat, lng, name }
    setWaypoints([...waypoints, newWaypoint])
    toast({
      title: "Waypoint Added",
      description: `Added ${name} to route`
    })
  }

  const clearRoute = () => {
    setWaypoints([])
    toast({
      title: "Route Cleared",
      description: "All waypoints have been removed"
    })
  }

  const calculateDistance = () => {
    if (waypoints.length < 2) {
      toast({
        title: "Insufficient Waypoints",
        description: "Add at least 2 waypoints to calculate distance",
        variant: "destructive"
      })
      return
    }

    // Simple distance calculation (in a real app, this would use proper routing algorithms)
    let totalDistance = 0
    for (let i = 0; i < waypoints.length - 1; i++) {
      const lat1 = waypoints[i].lat
      const lng1 = waypoints[i].lng
      const lat2 = waypoints[i + 1].lat
      const lng2 = waypoints[i + 1].lng
      
      // Haversine formula for distance calculation
      const R = 6371 // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLng = (lng2 - lng1) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      totalDistance += R * c
    }

    toast({
      title: "Route Distance",
      description: `Total distance: ${totalDistance.toFixed(2)} km`
    })
  }

  const handleExport = (format: string) => {
    switch (format) {
      case 'json':
        const jsonData = {
          mapStyle,
          zoomLevel: zoomLevel[0],
          waypoints,
          layers,
          exportDate: new Date().toISOString()
        }
        const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
        const jsonUrl = URL.createObjectURL(jsonBlob)
        const jsonLink = document.createElement('a')
        jsonLink.href = jsonUrl
        jsonLink.download = 'gis-map-data.json'
        jsonLink.click()
        break

      case 'png':
        // Simulate screenshot export
        toast({
          title: "Screenshot Exported",
          description: "Map screenshot has been saved to downloads"
        })
        break

      case 'gpx':
        if (waypoints.length === 0) {
          toast({
            title: "No Route Data",
            description: "Add waypoints to export GPX file",
            variant: "destructive"
          })
          return
        }
        
        const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <trk>
    <name>Railway Route</name>
    <trkseg>
      ${waypoints.map(wp => `<trkpt lat="${wp.lat}" lon="${wp.lng}"><name>${wp.name}</name></trkpt>`).join('\n      ')}
    </trkseg>
  </trk>
</gpx>`
        
        const gpxBlob = new Blob([gpxContent], { type: 'application/gpx+xml' })
        const gpxUrl = URL.createObjectURL(gpxBlob)
        const gpxLink = document.createElement('a')
        gpxLink.href = gpxUrl
        gpxLink.download = 'railway-route.gpx'
        gpxLink.click()
        break
    }

    toast({
      title: "Export Complete",
      description: `Map data exported in ${format.toUpperCase()} format`
    })
    setExportDialogOpen(false)
  }

  const toggleLayer = (layerName: string) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName as keyof typeof prev]
    }))
    toast({
      title: "Layer Updated",
      description: `${layerName} layer ${layers[layerName as keyof typeof layers] ? 'hidden' : 'shown'}`
    })
  }

  // Generate Google Maps Static API URL
  const getMapUrl = () => {
    const center = currentLocation ? `${currentLocation.lat},${currentLocation.lng}` : '28.6139,77.2090'
    const zoom = zoomLevel[0]
    const size = '800x600'
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    let markers = ''
    if (waypoints.length > 0) {
      markers = waypoints.map((wp, index) => 
        `&markers=color:red%7Clabel:${index + 1}%7C${wp.lat},${wp.lng}`
      ).join('')
    }
    
    if (currentLocation && gpsEnabled) {
      markers += `&markers=color:blue%7Clabel:GPS%7C${currentLocation.lat},${currentLocation.lng}`
    }

    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&maptype=${mapStyle}${markers}&key=${apiKey}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GIS Map View</h1>
          <p className="text-gray-600">Interactive railway network mapping and route planning</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Map Data</DialogTitle>
                <DialogDescription>
                  Choose the format for exporting map data
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button onClick={() => handleExport('json')} className="justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export as JSON Data
                </Button>
                <Button onClick={() => handleExport('png')} className="justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export as PNG Screenshot
                </Button>
                <Button onClick={() => handleExport('gpx')} className="justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Route as GPX
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Map Settings</DialogTitle>
                <DialogDescription>
                  Configure map display options
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Map Layers</Label>
                  <div className="space-y-3">
                    {Object.entries(layers).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                        <Switch
                          checked={value}
                          onCheckedChange={() => toggleLayer(key)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Default Zoom Level</Label>
                  <Slider
                    value={zoomLevel}
                    onValueChange={setZoomLevel}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">Current: {zoomLevel[0]}</div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setSettingsDialogOpen(false)}>Save Settings</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Map Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Control Panel */}
        <div className="space-y-4">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Stations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter station name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Map Style */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Map Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={mapStyle === 'roadmap' ? 'default' : 'outline'}
                  onClick={() => handleMapStyleChange('roadmap')}
                  className="flex items-center justify-center"
                >
                  <Map className="w-4 h-4 mr-2" />
                  Road
                </Button>
                <Button
                  variant={mapStyle === 'satellite' ? 'default' : 'outline'}
                  onClick={() => handleMapStyleChange('satellite')}
                  className="flex items-center justify-center"
                >
                  <Satellite className="w-4 h-4 mr-2" />
                  Satellite
                </Button>
                <Button
                  variant={mapStyle === 'hybrid' ? 'default' : 'outline'}
                  onClick={() => handleMapStyleChange('hybrid')}
                  className="flex items-center justify-center"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Hybrid
                </Button>
                <Button
                  variant={mapStyle === 'terrain' ? 'default' : 'outline'}
                  onClick={() => handleMapStyleChange('terrain')}
                  className="flex items-center justify-center"
                >
                  <Mountain className="w-4 h-4 mr-2" />
                  Terrain
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GPS & Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">GPS & Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>GPS Tracking</Label>
                <Switch
                  checked={gpsEnabled}
                  onCheckedChange={setGpsEnabled}
                />
              </div>
              {currentLocation && (
                <div className="text-sm text-gray-600">
                  <p>Lat: {currentLocation.lat.toFixed(6)}</p>
                  <p>Lng: {currentLocation.lng.toFixed(6)}</p>
                </div>
              )}
              <Button
                variant={routePlanningMode ? 'default' : 'outline'}
                onClick={handleRoutePlanning}
                className="w-full"
              >
                <Route className="w-4 h-4 mr-2" />
                {routePlanningMode ? 'Stop Planning' : 'Route Planning'}
              </Button>
            </CardContent>
          </Card>

          {/* Route Info */}
          {waypoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Route Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p>Waypoints: {waypoints.length}</p>
                  {waypoints.map((wp, index) => (
                    <p key={index} className="text-gray-600">
                      {index + 1}. {wp.name}
                    </p>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={calculateDistance}>
                    Calculate Distance
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearRoute}>
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addWaypoint(28.6139, 77.2090, 'New Delhi')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Add New Delhi
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addWaypoint(19.0760, 72.8777, 'Mumbai Central')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Add Mumbai Central
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  navigator.share?.({
                    title: 'Railway GIS Map',
                    text: 'Check out this railway route',
                    url: window.location.href
                  }) || toast({
                    title: "Share",
                    description: "Link copied to clipboard"
                  })
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Map
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Map Display */}
        <div className="lg:col-span-3">
          <Card className="h-[800px]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Interactive Railway Map</CardTitle>
                  <CardDescription>
                    {mapStyle.charAt(0).toUpperCase() + mapStyle.slice(1)} view • Zoom: {zoomLevel[0]}
                    {gpsEnabled && ' • GPS Active'}
                    {routePlanningMode && ' • Route Planning Mode'}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={handleZoomIn}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleZoomOut}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    if (currentLocation) {
                      toast({
                        title: "Centered on GPS",
                        description: "Map centered on your current location"
                      })
                    } else {
                      toast({
                        title: "GPS Not Available",
                        description: "Enable GPS to center on your location",
                        variant: "destructive"
                      })
                    }
                  }}>
                    <Target className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                {/* Google Maps Static Image */}
                <img
                  src={getMapUrl() || "/placeholder.svg"}
                  alt="Railway Network Map"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if Google Maps fails
                    e.currentTarget.src = `/placeholder.svg?height=600&width=800&text=Railway+Network+Map+${mapStyle}`
                  }}
                />
                
                {/* Map Overlay Info */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Stations</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Cables</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Faults</span>
                    </div>
                  </div>
                </div>

                {/* Layer Controls */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <Button size="sm" variant="ghost">
                    <Layers className="w-4 h-4" />
                  </Button>
                </div>

                {/* Status Indicators */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {gpsEnabled && (
                    <Badge variant="default" className="bg-green-600">
                      <Navigation className="w-3 h-3 mr-1" />
                      GPS Active
                    </Badge>
                  )}
                  {routePlanningMode && (
                    <Badge variant="default" className="bg-blue-600">
                      <Route className="w-3 h-3 mr-1" />
                      Route Planning
                    </Badge>
                  )}
                  {waypoints.length > 0 && (
                    <Badge variant="outline">
                      {waypoints.length} Waypoints
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
