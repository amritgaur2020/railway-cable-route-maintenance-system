// Configuration file for API keys and settings
export const CONFIG = {
  // Google Maps API Configuration
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBFw0Qbyq9zTFTd-tUY6dQHuMaABgwlXXX",
  
  // Map Settings
  MAP_SETTINGS: {
    DEFAULT_CENTER: { lat: 27.0, lng: 80.5 },
    DEFAULT_ZOOM: 8,
    MIN_ZOOM: 3,
    MAX_ZOOM: 18,
    MAP_STYLES: {
      SATELLITE: "satellite",
      ROADMAP: "roadmap", 
      HYBRID: "hybrid",
      TERRAIN: "terrain"
    }
  },
  
  // System Settings
  SYSTEM: {
    AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
    DATA_RETENTION_DAYS: 90,
    MAX_OFFLINE_CACHE_SIZE: "2GB",
    SESSION_TIMEOUT: 1800000 // 30 minutes
  },
  
  // Railway Specific Settings
  RAILWAY: {
    DIVISIONS: [
      "Northern Railway",
      "Central Railway", 
      "Eastern Railway",
      "Western Railway",
      "Southern Railway"
    ],
    DEPARTMENTS: [
      "Signal & Telecommunication",
      "Engineering",
      "Operations", 
      "Maintenance"
    ],
    CABLE_TYPES: ["quad", "pijf", "power"],
    STATION_TYPES: ["terminal", "junction", "major", "minor"]
  }
}
