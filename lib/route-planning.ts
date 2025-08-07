// Route planning and optimization utilities

export interface Waypoint {
  id: string
  lat: number
  lng: number
  name: string
  type?: 'station' | 'joint' | 'maintenance' | 'custom'
  priority?: number
  estimatedTime?: number // minutes
}

export interface RouteSegment {
  from: Waypoint
  to: Waypoint
  distance: number // km
  duration: number // minutes
  difficulty: 'easy' | 'moderate' | 'difficult'
  terrain: 'road' | 'rail' | 'field'
}

export interface OptimizedRoute {
  waypoints: Waypoint[]
  segments: RouteSegment[]
  totalDistance: number
  totalDuration: number
  estimatedFuelCost: number
  optimizationMethod: string
}

// Calculate route distance using Haversine formula
function calculateDistance(point1: Waypoint, point2: Waypoint): number {
  const R = 6371 // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180
  const dLng = (point2.lng - point1.lng) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Estimate travel time based on distance and terrain
function estimateTravelTime(distance: number, terrain: string): number {
  const speedMap = {
    'road': 60, // km/h
    'rail': 40, // km/h
    'field': 20 // km/h
  }
  const speed = speedMap[terrain] || 40
  return (distance / speed) * 60 // convert to minutes
}

// Determine terrain type based on waypoint types
function determineTerrain(from: Waypoint, to: Waypoint): 'road' | 'rail' | 'field' {
  if (from.type === 'station' && to.type === 'station') return 'rail'
  if (from.type === 'joint' || to.type === 'joint') return 'field'
  return 'road'
}

// Simple nearest neighbor algorithm for route optimization
export function optimizeRouteNearestNeighbor(waypoints: Waypoint[]): OptimizedRoute {
  if (waypoints.length < 2) {
    throw new Error('At least 2 waypoints required')
  }

  const unvisited = [...waypoints.slice(1)] // Start from first waypoint
  const optimizedWaypoints = [waypoints[0]]
  let currentWaypoint = waypoints[0]
  
  while (unvisited.length > 0) {
    let nearestIndex = 0
    let nearestDistance = calculateDistance(currentWaypoint, unvisited[0])
    
    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(currentWaypoint, unvisited[i])
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = i
      }
    }
    
    currentWaypoint = unvisited[nearestIndex]
    optimizedWaypoints.push(currentWaypoint)
    unvisited.splice(nearestIndex, 1)
  }
  
  return buildRouteFromWaypoints(optimizedWaypoints, 'Nearest Neighbor')
}

// Genetic algorithm for route optimization (simplified)
export function optimizeRouteGenetic(waypoints: Waypoint[]): OptimizedRoute {
  if (waypoints.length < 2) {
    throw new Error('At least 2 waypoints required')
  }

  // For simplicity, we'll use a basic genetic approach
  const populationSize = 50
  const generations = 100
  const mutationRate = 0.1
  
  // Generate initial population
  let population = []
  for (let i = 0; i < populationSize; i++) {
    const route = [waypoints[0], ...shuffleArray([...waypoints.slice(1)])]
    population.push(route)
  }
  
  // Evolution loop
  for (let gen = 0; gen < generations; gen++) {
    // Calculate fitness for each route
    const fitness = population.map(route => 1 / calculateTotalDistance(route))
    
    // Selection and crossover (simplified)
    const newPopulation = []
    for (let i = 0; i < populationSize; i++) {
      const parent1 = selectParent(population, fitness)
      const parent2 = selectParent(population, fitness)
      let child = crossover(parent1, parent2)
      
      if (Math.random() < mutationRate) {
        child = mutate(child)
      }
      
      newPopulation.push(child)
    }
    
    population = newPopulation
  }
  
  // Return best route
  const fitness = population.map(route => 1 / calculateTotalDistance(route))
  const bestIndex = fitness.indexOf(Math.max(...fitness))
  const bestRoute = population[bestIndex]
  
  return buildRouteFromWaypoints(bestRoute, 'Genetic Algorithm')
}

// Priority-based route optimization
export function optimizeRoutePriority(waypoints: Waypoint[]): OptimizedRoute {
  if (waypoints.length < 2) {
    throw new Error('At least 2 waypoints required')
  }

  // Sort waypoints by priority (higher priority first)
  const sortedWaypoints = [
    waypoints[0], // Keep starting point
    ...waypoints.slice(1).sort((a, b) => (b.priority || 0) - (a.priority || 0))
  ]
  
  return buildRouteFromWaypoints(sortedWaypoints, 'Priority-based')
}

// Build route object from waypoints
function buildRouteFromWaypoints(waypoints: Waypoint[], method: string): OptimizedRoute {
  const segments: RouteSegment[] = []
  let totalDistance = 0
  let totalDuration = 0
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i]
    const to = waypoints[i + 1]
    const distance = calculateDistance(from, to)
    const terrain = determineTerrain(from, to)
    const duration = estimateTravelTime(distance, terrain)
    
    const segment: RouteSegment = {
      from,
      to,
      distance,
      duration,
      difficulty: distance > 50 ? 'difficult' : distance > 20 ? 'moderate' : 'easy',
      terrain
    }
    
    segments.push(segment)
    totalDistance += distance
    totalDuration += duration
  }
  
  const estimatedFuelCost = totalDistance * 0.15 // ₹0.15 per km estimate
  
  return {
    waypoints,
    segments,
    totalDistance,
    totalDuration,
    estimatedFuelCost,
    optimizationMethod: method
  }
}

// Helper functions for genetic algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function calculateTotalDistance(waypoints: Waypoint[]): number {
  let total = 0
  for (let i = 0; i < waypoints.length - 1; i++) {
    total += calculateDistance(waypoints[i], waypoints[i + 1])
  }
  return total
}

function selectParent(population: Waypoint[][], fitness: number[]): Waypoint[] {
  const totalFitness = fitness.reduce((sum, f) => sum + f, 0)
  let random = Math.random() * totalFitness
  
  for (let i = 0; i < population.length; i++) {
    random -= fitness[i]
    if (random <= 0) {
      return population[i]
    }
  }
  
  return population[population.length - 1]
}

function crossover(parent1: Waypoint[], parent2: Waypoint[]): Waypoint[] {
  const start = Math.floor(Math.random() * parent1.length)
  const end = Math.floor(Math.random() * parent1.length)
  const [startIdx, endIdx] = [Math.min(start, end), Math.max(start, end)]
  
  const child = [...parent1]
  const segment = parent2.slice(startIdx, endIdx + 1)
  
  // Simple crossover - replace segment
  for (let i = startIdx; i <= endIdx; i++) {
    if (i < child.length) {
      child[i] = segment[i - startIdx]
    }
  }
  
  return child
}

function mutate(route: Waypoint[]): Waypoint[] {
  const mutated = [...route]
  if (mutated.length > 2) {
    const i = Math.floor(Math.random() * (mutated.length - 1)) + 1
    const j = Math.floor(Math.random() * (mutated.length - 1)) + 1
    ;[mutated[i], mutated[j]] = [mutated[j], mutated[i]]
  }
  return mutated
}

// Calculate estimated arrival times
export function calculateArrivalTimes(route: OptimizedRoute, startTime: Date): Date[] {
  const arrivalTimes = [startTime]
  let currentTime = new Date(startTime)
  
  for (const segment of route.segments) {
    currentTime = new Date(currentTime.getTime() + segment.duration * 60000)
    arrivalTimes.push(new Date(currentTime))
  }
  
  return arrivalTimes
}

// Export route to different formats
export function exportRouteToGPX(route: OptimizedRoute): string {
  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Railway Management System">
  <trk>
    <name>Maintenance Route</name>
    <trkseg>`
  
  const waypoints = route.waypoints.map(wp => 
    `      <trkpt lat="${wp.lat}" lon="${wp.lng}">
        <name>${wp.name}</name>
      </trkpt>`
  ).join('\n')
  
  const gpxFooter = `    </trkseg>
  </trk>
</gpx>`
  
  return gpxHeader + '\n' + waypoints + '\n' + gpxFooter
}

export function exportRouteToKML(route: OptimizedRoute): string {
  const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Railway Maintenance Route</name>
    <Placemark>
      <name>Route</name>
      <LineString>
        <coordinates>`
  
  const coordinates = route.waypoints.map(wp => `${wp.lng},${wp.lat},0`).join(' ')
  
  const kmlFooter = `        </coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>`
  
  return kmlHeader + '\n          ' + coordinates + '\n' + kmlFooter
}
