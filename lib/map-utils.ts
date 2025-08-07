// Utility functions for map calculations and data processing

export interface Coordinates {
  lat: number
  lng: number
}

export interface Station {
  id: string
  name: string
  lat: number
  lng: number
  type: 'terminal' | 'junction' | 'major' | 'minor'
}

export interface CableRoute {
  id: string
  name: string
  type: 'quad' | 'pijf' | 'power'
  coordinates: [number, number][]
  status: 'good' | 'needs_attention' | 'critical'
  lastMaintenance: string
  length: string
  joints: Joint[]
}

export interface Joint {
  id: string
  lat: number
  lng: number
  status: 'good' | 'needs_attention' | 'critical'
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat)
  const dLng = toRadians(coord2.lng - coord1.lng)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Convert coordinates to screen position
export function coordsToScreen(
  coords: Coordinates, 
  bounds: { north: number, south: number, east: number, west: number },
  screenSize: { width: number, height: number }
): { x: number, y: number } {
  const x = ((coords.lng - bounds.west) / (bounds.east - bounds.west)) * screenSize.width
  const y = ((bounds.north - coords.lat) / (bounds.north - bounds.south)) * screenSize.height
  
  return { x, y }
}

// Generate route path for SVG
export function generateRoutePath(coordinates: [number, number][]): string {
  if (coordinates.length === 0) return ''
  
  const pathCommands = coordinates.map((coord, index) => {
    const command = index === 0 ? 'M' : 'L'
    return `${command} ${coord[0]} ${coord[1]}`
  })
  
  return pathCommands.join(' ')
}

// Filter features by bounds
export function filterFeaturesByBounds<T extends { lat: number, lng: number }>(
  features: T[],
  bounds: { north: number, south: number, east: number, west: number }
): T[] {
  return features.filter(feature => 
    feature.lat >= bounds.south &&
    feature.lat <= bounds.north &&
    feature.lng >= bounds.west &&
    feature.lng <= bounds.east
  )
}

// Get map bounds for a set of coordinates
export function getBounds(coordinates: Coordinates[]): { north: number, south: number, east: number, west: number } {
  if (coordinates.length === 0) {
    return { north: 30, south: 25, east: 85, west: 75 }
  }
  
  const lats = coordinates.map(c => c.lat)
  const lngs = coordinates.map(c => c.lng)
  
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs)
  }
}

// Search stations by name or code
export function searchStations(stations: Station[], query: string): Station[] {
  const searchTerm = query.toLowerCase().trim()
  if (!searchTerm) return stations
  
  return stations.filter(station => 
    station.name.toLowerCase().includes(searchTerm) ||
    station.id.toLowerCase().includes(searchTerm)
  )
}

// Get cable route statistics
export function getCableRouteStats(routes: CableRoute[]) {
  const totalLength = routes.reduce((sum, route) => {
    const length = parseFloat(route.length.replace(' km', ''))
    return sum + length
  }, 0)
  
  const statusCounts = routes.reduce((counts, route) => {
    counts[route.status] = (counts[route.status] || 0) + 1
    return counts
  }, {} as Record<string, number>)
  
  const typeCounts = routes.reduce((counts, route) => {
    counts[route.type] = (counts[route.type] || 0) + 1
    return counts
  }, {} as Record<string, number>)
  
  return {
    totalLength: totalLength.toFixed(1),
    totalRoutes: routes.length,
    statusCounts,
    typeCounts
  }
}
