"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ZoomIn, ZoomOut, Navigation, Layers, Download, Settings, Search, MapPin } from 'lucide-react'

interface MapToolbarProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onResetView: () => void
  onSearch: (query: string) => void
  onExport: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function MapToolbar({
  onZoomIn,
  onZoomOut,
  onResetView,
  onSearch,
  onExport,
  searchQuery,
  setSearchQuery
}: MapToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stations, routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch(searchQuery)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => onSearch(searchQuery)}>
            Search
          </Button>
        </div>

        {/* Map Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 border rounded-lg p-1">
            <Button size="sm" variant="ghost" onClick={onZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onResetView}>
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          <Select defaultValue="satellite">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="satellite">Satellite</SelectItem>
              <SelectItem value="terrain">Terrain</SelectItem>
              <SelectItem value="roadmap">Roadmap</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
