// GPS and location utilities for the railway management system

export interface GPSCoordinates {
  lat: number
  lng: number
  accuracy?: number
  altitude?: number
  heading?: number
  speed?: number
  timestamp?: number
}

export interface TrackingVehicle {
  id: string
  name: string
  type: 'maintenance' | 'emergency' | 'inspection'
  coordinates: GPSCoordinates
  status: 'active' | 'idle' | 'offline'
  assignedTask?: string
  lastUpdate: string
}

// Calculate distance between two GPS coordinates using Haversine formula
export function calculateGPSDistance(coord1: GPSCoordinates, coord2: GPSCoordinates): number {
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

// Calculate bearing between two points
export function calculateBearing(coord1: GPSCoordinates, coord2: GPSCoordinates): number {
  const dLng = toRadians(coord2.lng - coord1.lng)
  const lat1 = toRadians(coord1.lat)
  const lat2 = toRadians(coord2.lat)
  
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  
  const bearing = Math.atan2(y, x)
  return (bearing * 180 / Math.PI + 360) % 360
}

// Check if GPS coordinates are within a geofence
export function isWithinGeofence(
  point: GPSCoordinates, 
  center: GPSCoordinates, 
  radiusKm: number
): boolean {
  const distance = calculateGPSDistance(point, center)
  return distance <= radiusKm
}

// Get GPS accuracy level description
export function getAccuracyLevel(accuracy: number): string {
  if (accuracy <= 5) return 'Excellent'
  if (accuracy <= 10) return 'Good'
  if (accuracy <= 20) return 'Fair'
  return 'Poor'
}

// Format GPS coordinates for display
export function formatCoordinates(coord: GPSCoordinates): string {
  return `${coord.lat.toFixed(6)}, ${coord.lng.toFixed(6)}`
}

// Convert speed from m/s to km/h
export function convertSpeedToKmh(speedMs: number): number {
  return speedMs * 3.6
}

// Generate geofence points for a circular area
export function generateGeofencePoints(
  center: GPSCoordinates, 
  radiusKm: number, 
  points: number = 32
): GPSCoordinates[] {
  const coordinates: GPSCoordinates[] = []
  const radiusInDegrees = radiusKm / 111.32 // Approximate conversion
  
  for (let i = 0; i < points; i++) {
    const angle = (i * 360) / points
    const lat = center.lat + radiusInDegrees * Math.cos(toRadians(angle))
    const lng = center.lng + radiusInDegrees * Math.sin(toRadians(angle))
    coordinates.push({ lat, lng })
  }
  
  return coordinates
}

// Check if device supports GPS
export function isGPSSupported(): boolean {
  return 'geolocation' in navigator
}

// Get current GPS position with error handling
export function getCurrentPosition(): Promise<GPSCoordinates> {
  return new Promise((resolve, reject) => {
    if (!isGPSSupported()) {
      reject(new Error('GPS not supported'))
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
          timestamp: position.timestamp
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  })
}
