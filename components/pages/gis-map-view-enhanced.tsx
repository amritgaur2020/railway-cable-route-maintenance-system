"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { CONFIG } from "@/lib/config"
import { Map, Layers, ZoomIn, ZoomOut, Navigation, Search, MapPin, Cable, Wrench, AlertTriangle, Settings, Download, Maximize, Eye, EyeOff, Wifi, WifiOff, Route, Thermometer, Users, Navigation2, Target, Compass } from 'lucide-react'

// Enhanced railway network data with GPS coordinates - ALL VALUES SET TO ZERO
const railwayStations = [
  { id: "GD", name: "Gonda Junction", lat: 27.1333, lng: 81.9667, type: "junction", elevation: 0 },
  { id: "LKO", name: "Lucknow", lat: 26.8467, lng: 80.9462, type: "major", elevation: 0 },
  { id: "NDLS", name: "New Delhi", lat: 28.6448, lng: 77.2097, type: "terminal", elevation: 0 },
  { id: "CNB", name: "Kanpur Central", lat: 26.4499, lng: 80.3319, type: "major", elevation: 0 },
  { id: "AGC", name: "Agra Cantt", lat: 27.1767, lng: 78.0081, type: "major", elevation: 0 },
  { id: "MTJ", name: "Mathura Junction", lat: 27.4924, lng: 77.6737, type: "junction", elevation: 0 },
  { id: "FZD", name: "Faizabad", lat: 26.7751, lng: 82.1490, type: "major", elevation: 0 },
  { id: "BSB", name: "Varanasi", lat: 25.3176, lng: 82.9739, type: "major", elevation: 0 }
]

const cableRoutes = [
  {
    id: "CR001",
    name: "Gonda-Lucknow Quad Cable",
    type: "quad",
    coordinates: [
      [81.9667, 27.1333], [81.5000, 27.0000], [81.0000, 26.9000], [80.9462, 26.8467]
    ],
    status: "good",
    lastMaintenance: "Not Set",
    length: "0 km",
    faultHistory: 0,
    maintenanceFrequency: 0,
    joints: [
      { id: "J001", lat: 27.0000, lng: 81.5000, status: "good" },
      { id: "J002", lat: 26.9000, lng: 81.0000, status: "good" }
    ]
  },
  {
    id: "CR002",
    name: "Lucknow-Delhi PIJF Cable",
    type: "pijf",
    coordinates: [
      [80.9462, 26.8467], [79.5000, 27.2000], [78.5000, 27.8000], [77.2097, 28.6448]
    ],
    status: "good",
    lastMaintenance: "Not Set",
    length: "0 km",
    faultHistory: 0,
    maintenanceFrequency: 0,
    joints: [
      { id: "J003", lat: 27.2000, lng: 79.5000, status: "good" },
      { id: "J004", lat: 27.8000, lng: 78.5000, status: "good" }
    ]
  },
  {
    id: "CR003",
    name: "Delhi-Agra Power Cable",
    type: "power",
    coordinates: [
      [77.2097, 28.6448], [77.5000, 28.0000], [78.0081, 27.1767]
    ],
    status: "good",
    lastMaintenance: "Not Set",
    length: "0 km",
    faultHistory: 0,
    maintenanceFrequency: 0,
    joints: [
      { id: "J005", lat: 28.0000, lng: 77.5000, status: "good" }
    ]
  }
]

// GPS tracking data - ALL VALUES SET TO ZERO
const gpsTrackedVehicles = [
  {
    id: "V001",
    name: "Maintenance Team Alpha",
    lat: 0,
    lng: 0,
    speed: 0,
    heading: 0,
    status: "idle",
    assignedTask: "No Task Assigned",
    lastUpdate: new Date().toISOString()
  },
  {
    id: "V002",
    name: "Emergency Response Unit",
    lat: 0,
    lng: 0,
    speed: 0,
    heading: 0,
    status: "idle",
    assignedTask: "No Task Assigned",
    lastUpdate: new Date().toISOString()
  }
]

export function GISMapViewEnhanced() {
  const { toast } = useToast()
  const [selectedLayer, setSelectedLayer] = useState("all")
  const [zoomLevel, setZoomLevel] = useState(CONFIG.MAP_SETTINGS.DEFAULT_ZOOM)
  const [mapCenter, setMapCenter] = useState([CONFIG.MAP_SETTINGS.DEFAULT_CENTER.lng, CONFIG.MAP_SETTINGS.DEFAULT_CENTER.lat])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [offlineProgress, setOfflineProgress] = useState(0)
  const [isDownloadingOfflineMap, setIsDownloadingOfflineMap] = useState(false)
  const [gpsEnabled, setGpsEnabled] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [routePlanningMode, setRoutePlanningMode] = useState(false)
  const [routePoints, setRoutePoints] = useState([])
  const [plannedRoute, setPlannedRoute] = useState(null)
  const [heatMapType, setHeatMapType] = useState("none")
  const [heatMapIntensity, setHeatMapIntensity] = useState([0.5])
  const [mapStyle, setMapStyle] = useState(CONFIG.MAP_SETTINGS.MAP_STYLES.SATELLITE)
  const mapRef = useRef(null)
  const watchIdRef = useRef(null)

  // Layer visibility states
  const [layers, setLayers] = useState({
    stations: true,
    cableRoutes: true,
    joints: true,
    faults: true,
    maintenanceAreas: false,
    markers: true,
    gpsTracking: true,
    heatMap: false
  })

  // Generate Google Maps URL with proper API key
  const generateMapUrl = useCallback(() => {
    const baseUrl = "https://maps.googleapis.com/maps/api/staticmap"
    const params = new URLSearchParams({
      center: `${mapCenter[1]},${mapCenter[0]}`,
      zoom: zoomLevel.toString(),
      size: "1200x800",
      maptype: mapStyle,
      key: CONFIG.GOOGLE_MAPS_API_KEY
    })
    return `${baseUrl}?${params.toString()}`
  }, [mapCenter, zoomLevel, mapStyle])

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // GPS tracking
  useEffect(() => {
    if (gpsEnabled && navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            speed: position.coords.speed
          })
        },
        (error) => {
          toast({
            title: "GPS Error",
            description: "Unable to get current location",
            variant: "destructive"
          })
          setGpsEnabled(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [gpsEnabled, toast])

  const toggleLayer = (layerName: string) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }))
  }

  const handleSearch = useCallback((query: string) => {
    const station = railwayStations.find(s => 
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase())
    )
    if (station) {
      setMapCenter([station.lng, station.lat])
      setZoomLevel(12)
      toast({
        title: "Location Found",
        description: `Navigated to ${station.name}`
      })
    } else {
      toast({
        title: "Location Not Found",
        description: "Please try a different search term",
        variant: "destructive"
      })
    }
  }, [toast])

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 1, CONFIG.MAP_SETTINGS.MAX_ZOOM))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 1, CONFIG.MAP_SETTINGS.MIN_ZOOM))
  }, [])

  const handleResetView = useCallback(() => {
    setMapCenter([CONFIG.MAP_SETTINGS.DEFAULT_CENTER.lng, CONFIG.MAP_SETTINGS.DEFAULT_CENTER.lat])
    setZoomLevel(CONFIG.MAP_SETTINGS.DEFAULT_ZOOM)
    toast({
      title: "View Reset",
      description: "Map view has been reset to default"
    })
  }, [toast])

  const handleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }, [isFullscreen])

  const handleGPSToggle = useCallback(() => {
    if (!gpsEnabled) {
      if (navigator.geolocation) {
        setGpsEnabled(true)
        toast({
          title: "GPS Enabled",
          description: "Starting location tracking..."
        })
      } else {
        toast({
          title: "GPS Not Available",
          description: "GPS is not supported on this device",
          variant: "destructive"
        })
      }
    } else {
      setGpsEnabled(false)
      setCurrentLocation(null)
      toast({
        title: "GPS Disabled",
        description: "Location tracking stopped"
      })
    }
  }, [gpsEnabled, toast])

  const handleDownloadOfflineMap = useCallback(async () => {
    setIsDownloadingOfflineMap(true)
    setOfflineProgress(0)
    
    // Simulate offline map download
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setOfflineProgress(i)
    }
    
    setIsDownloadingOfflineMap(false)
    toast({
      title: "Offline Map Downloaded",
      description: "Map tiles cached for offline use"
    })
  }, [toast])

  const handleExportMap = useCallback(() => {
    const mapData = {
      center: mapCenter,
      zoom: zoomLevel,
      layers: layers,
      stations: railwayStations,
      routes: cableRoutes,
      timestamp: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(mapData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `railway-map-export-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
    
    toast({
      title: "Map Exported",
      description: "Map data exported successfully"
    })
  }, [mapCenter, zoomLevel, layers, toast])

  const getCableColor = (type: string, status: string) => {
    const baseColors = {
      quad: '#3B82F6',
      pijf: '#10B981',
      power: '#F59E0B'
    }
    
    if (status === 'critical') return '#EF4444'
    if (status === 'needs_attention') return '#F97316'
    return baseColors[type] || '#6B7280'
  }

  const getStationIcon = (type: string) => {
    switch (type) {
      case 'terminal': return '🚉'
      case 'junction': return '🚇'
      case 'major': return '🚂'
      default: return '🚉'
    }
  }

  const MapComponent = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border-2 border-gray-200 shadow-inner">
      {/* Enhanced Offline Map Indicator */}
      {!isOnline && (
        <div className="absolute top-4 left-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center animate-pulse">
          <WifiOff className="w-4 h-4 mr-2" />
          <span className="font-medium">Offline Mode Active</span>
        </div>
      )}

      {/* Map Container with Google Maps API */}
      <div 
        ref={mapRef}
        className="w-full h-full relative cursor-crosshair"
        style={{
          backgroundImage: isOnline ? 
            `url("${generateMapUrl()}")` :
            `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e2e8f0' fillOpacity='0.6'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: isOnline ? 'cover' : '40px 40px',
          backgroundPosition: 'center',
          backgroundRepeat: isOnline ? 'no-repeat' : 'repeat'
        }}
      >
        {/* Grid overlay for better reference */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1E3A8A" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Railway Stations */}
        {layers.stations && railwayStations.map(station => (
          <div
            key={station.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{
              left: `${((station.lng - 75) / 10) * 100}%`,
              top: `${((30 - station.lat) / 5) * 100}%`
            }}
            onClick={() => setSelectedFeature({
              type: 'station',
              data: station
            })}
          >
            <div className="relative group">
              <div className="bg-white rounded-full p-4 shadow-2xl border-4 border-blue-600 hover:scale-125 transition-all duration-300 hover:shadow-3xl">
                <span className="text-2xl">{getStationIcon(station.type)}</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-blue-900 text-white px-4 py-2 rounded-xl shadow-2xl text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 border border-blue-700">
                <div className="text-center">
                  <div className="font-bold text-white">{station.name}</div>
                  <div className="text-xs text-blue-200 mt-1">{station.id} • {station.type}</div>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-b-blue-900"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Cable Routes */}
        {layers.cableRoutes && cableRoutes.map(cable => (
          <svg
            key={cable.id}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <polyline
              points={cable.coordinates.map(coord => 
                `${((coord[0] - 75) / 10) * 100},${((30 - coord[1]) / 5) * 100}`
              ).join(' ')}
              fill="none"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="8"
              transform="translate(3,3)"
            />
            <polyline
              points={cable.coordinates.map(coord => 
                `${((coord[0] - 75) / 10) * 100},${((30 - coord[1]) / 5) * 100}`
              ).join(' ')}
              fill="none"
              stroke={getCableColor(cable.type, cable.status)}
              strokeWidth="5"
              strokeDasharray={cable.status === 'needs_attention' ? '10,5' : 'none'}
              className="cursor-pointer pointer-events-auto hover:stroke-width-7 transition-all duration-200 drop-shadow-lg"
              onClick={() => setSelectedFeature({
                type: 'cable',
                data: cable
              })}
            />
            <polyline
              points={cable.coordinates.map(coord => 
                `${((coord[0] - 75) / 10) * 100},${((30 - coord[1]) / 5) * 100}`
              ).join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="1"
              className="pointer-events-none"
            />
          </svg>
        ))}
      </div>

      {/* Enhanced Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 bg-white rounded-xl shadow-2xl p-3 border-2 border-gray-100">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white hover:bg-blue-50 border-blue-200 shadow-md" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4 text-blue-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom In</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white hover:bg-blue-50 border-blue-200 shadow-md" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4 text-blue-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom Out</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white hover:bg-green-50 border-green-200 shadow-md" onClick={handleResetView}>
                <Navigation className="w-4 h-4 text-green-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Reset View</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="border-t border-gray-200 my-2"></div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className={`shadow-md ${gpsEnabled ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white hover:bg-blue-50 border-blue-200'}`}
                onClick={handleGPSToggle}
              >
                {gpsEnabled ? <Navigation2 className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">{gpsEnabled ? 'Disable GPS' : 'Enable GPS'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50 border-gray-200 shadow-md" onClick={handleFullscreen}>
                <Maximize className="w-4 h-4 text-gray-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Toggle Fullscreen</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Enhanced Scale Indicator */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-gray-200 text-sm font-medium">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Zoom: {zoomLevel}</span>
          </div>
          <div className="border-l border-gray-300 h-5"></div>
          <span>Scale: 1:{Math.pow(2, 15 - zoomLevel) * 1000}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">GIS Map View</h1>
          <p className="text-gray-600 mt-1">Interactive railway network with real Google Maps integration</p>
        </div>
        <div className="flex space-x-2 mt-4 lg:mt-0">
          <Button variant="outline" onClick={handleExportMap}>
            <Download className="w-4 h-4 mr-2" />
            Export Map
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowLegend(!showLegend)}
          >
            {showLegend ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            Legend
          </Button>
          <Button 
            variant="outline"
            onClick={handleDownloadOfflineMap}
            disabled={isDownloadingOfflineMap}
          >
            {isOnline ? <Wifi className="w-4 h-4 mr-2" /> : <WifiOff className="w-4 h-4 mr-2" />}
            {isDownloadingOfflineMap ? 'Downloading...' : 'Offline Maps'}
          </Button>
        </div>
      </div>

      {/* Offline Download Progress */}
      {isDownloadingOfflineMap && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>Downloading offline map tiles...</span>
                  <span>{offlineProgress}%</span>
                </div>
                <Progress value={offlineProgress} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search & Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="pl-10"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleSearch(searchQuery)}
              >
                Search
              </Button>
              
              {/* Map Style Selector */}
              <div className="border-t pt-3">
                <Label>Map Style</Label>
                <Select value={mapStyle} onValueChange={setMapStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="roadmap">Roadmap</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* GPS Controls */}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-2">
                  <Label>GPS Tracking</Label>
                  <Switch checked={gpsEnabled} onCheckedChange={handleGPSToggle} />
                </div>
                {currentLocation && (
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Lat: {currentLocation.lat.toFixed(6)}</div>
                    <div>Lng: {currentLocation.lng.toFixed(6)}</div>
                    <div>Accuracy: ±{currentLocation.accuracy?.toFixed(0)}m</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Layer Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                Map Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(layers).map(([layerName, isVisible]) => (
                <div key={layerName} className="flex items-center justify-between">
                  <Label htmlFor={layerName} className="text-sm capitalize">
                    {layerName.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Switch
                    id={layerName}
                    checked={isVisible}
                    onCheckedChange={() => toggleLayer(layerName)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Network Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Network Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Stations:</span>
                <span className="font-medium">{railwayStations.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cable Routes:</span>
                <span className="font-medium">{cableRoutes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tracked Vehicles:</span>
                <span className="font-medium">{gpsTrackedVehicles.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Length:</span>
                <span className="font-medium">0 km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Online Status:</span>
                <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-orange-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          {showLegend && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Stations</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <span>🚉</span>
                      <span>Terminal Station</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🚇</span>
                      <span>Junction</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🚂</span>
                      <span>Major Station</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Cable Types</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-blue-500"></div>
                      <span>Quad Cable</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-green-500"></div>
                      <span>PIJF Cable</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-amber-500"></div>
                      <span>Power Cable</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Status</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Good</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Needs Attention</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Critical</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Map */}
        <div className="lg:col-span-3">
          <Card className="h-[700px]">
            <CardContent className="p-0 h-full">
              <MapComponent />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature Details Modal */}
      {selectedFeature && (
        <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedFeature.type === 'station' && `Station: ${selectedFeature.data.name}`}
                {selectedFeature.type === 'cable' && `Cable Route: ${selectedFeature.data.name}`}
                {selectedFeature.type === 'joint' && `Joint: ${selectedFeature.data.id}`}
                {selectedFeature.type === 'vehicle' && `Vehicle: ${selectedFeature.data.name}`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedFeature.type === 'station' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Station Code</Label>
                    <p className="font-medium">{selectedFeature.data.id}</p>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Badge variant="outline">{selectedFeature.data.type}</Badge>
                  </div>
                  <div>
                    <Label>Coordinates</Label>
                    <p className="text-sm">{selectedFeature.data.lat.toFixed(4)}, {selectedFeature.data.lng.toFixed(4)}</p>
                  </div>
                  <div>
                    <Label>Elevation</Label>
                    <p className="text-sm">{selectedFeature.data.elevation}m</p>
                  </div>
                </div>
              )}

              {selectedFeature.type === 'cable' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cable ID</Label>
                      <p className="font-medium">{selectedFeature.data.id}</p>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Badge variant="outline">{selectedFeature.data.type.toUpperCase()}</Badge>
                    </div>
                    <div>
                      <Label>Length</Label>
                      <p className="font-medium">{selectedFeature.data.length}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={
                        selectedFeature.data.status === 'good' ? 'bg-green-100 text-green-800' :
                        selectedFeature.data.status === 'needs_attention' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {selectedFeature.data.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Last Maintenance</Label>
                    <p className="font-medium">{selectedFeature.data.lastMaintenance}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fault History</Label>
                      <p className="font-medium">{selectedFeature.data.faultHistory} incidents</p>
                    </div>
                    <div>
                      <Label>Maintenance Frequency</Label>
                      <p className="font-medium">{selectedFeature.data.maintenanceFrequency}/year</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
