"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Filter, MapPin, Cable, Edit, Trash2, Eye, Download, Upload } from 'lucide-react'

export function CableRoutes() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [addRouteOpen, setAddRouteOpen] = useState(false)
  const [editRouteOpen, setEditRouteOpen] = useState(false)
  const [viewRouteOpen, setViewRouteOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<any>(null)

  const [newRoute, setNewRoute] = useState({
    routeId: '',
    name: '',
    startPoint: '',
    endPoint: '',
    length: '',
    cableType: '',
    status: 'active',
    description: ''
  })

  const [routes] = useState([
    {
      id: 'CR-001',
      name: 'Main Line Delhi-Mumbai',
      startPoint: 'New Delhi',
      endPoint: 'Mumbai Central',
      length: '1384 km',
      cableType: 'Fiber Optic',
      status: 'active',
      lastInspection: '2024-01-15',
      nextMaintenance: '2024-02-15'
    },
    {
      id: 'CR-002', 
      name: 'Branch Line Chennai-Bangalore',
      startPoint: 'Chennai Central',
      endPoint: 'Bangalore City',
      length: '362 km',
      cableType: 'Copper',
      status: 'maintenance',
      lastInspection: '2024-01-10',
      nextMaintenance: '2024-02-10'
    }
  ])

  const handleAddRoute = () => {
    if (!newRoute.routeId || !newRoute.name || !newRoute.startPoint || !newRoute.endPoint) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Route Added Successfully",
      description: `Cable route ${newRoute.name} has been added to the system.`
    })
    
    setNewRoute({
      routeId: '',
      name: '',
      startPoint: '',
      endPoint: '',
      length: '',
      cableType: '',
      status: 'active',
      description: ''
    })
    setAddRouteOpen(false)
  }

  const handleEditRoute = (route: any) => {
    setSelectedRoute(route)
    setEditRouteOpen(true)
  }

  const handleViewRoute = (route: any) => {
    setSelectedRoute(route)
    setViewRouteOpen(true)
  }

  const handleDeleteRoute = (routeId: string) => {
    toast({
      title: "Route Deleted",
      description: `Cable route ${routeId} has been removed from the system.`
    })
  }

  const handleExportRoutes = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Route ID,Name,Start Point,End Point,Length,Cable Type,Status\n" +
      routes.map(route => 
        `${route.id},${route.name},${route.startPoint},${route.endPoint},${route.length},${route.cableType},${route.status}`
      ).join("\n")

    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", "cable-routes.csv")
    link.click()

    toast({
      title: "Export Complete",
      description: "Cable routes data has been exported to CSV file."
    })
  }

  const handleImportRoutes = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,.xlsx'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        toast({
          title: "Import Started",
          description: `Processing ${file.name}...`
        })
        // Simulate import process
        setTimeout(() => {
          toast({
            title: "Import Complete",
            description: "Cable routes have been imported successfully."
          })
        }, 2000)
      }
    }
    input.click()
  }

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.endPoint.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cable Routes</h1>
          <p className="text-gray-600">Manage railway cable infrastructure and routing</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleImportRoutes}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExportRoutes}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={addRouteOpen} onOpenChange={setAddRouteOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Cable Route</DialogTitle>
                <DialogDescription>
                  Create a new cable route entry in the system
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="routeId">Route ID *</Label>
                    <Input
                      id="routeId"
                      value={newRoute.routeId}
                      onChange={(e) => setNewRoute({...newRoute, routeId: e.target.value})}
                      placeholder="CR-XXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Route Name *</Label>
                    <Input
                      id="name"
                      value={newRoute.name}
                      onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
                      placeholder="Main Line Delhi-Mumbai"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startPoint">Start Point *</Label>
                    <Input
                      id="startPoint"
                      value={newRoute.startPoint}
                      onChange={(e) => setNewRoute({...newRoute, startPoint: e.target.value})}
                      placeholder="Station name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endPoint">End Point *</Label>
                    <Input
                      id="endPoint"
                      value={newRoute.endPoint}
                      onChange={(e) => setNewRoute({...newRoute, endPoint: e.target.value})}
                      placeholder="Station name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length</Label>
                    <Input
                      id="length"
                      value={newRoute.length}
                      onChange={(e) => setNewRoute({...newRoute, length: e.target.value})}
                      placeholder="1384 km"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cableType">Cable Type</Label>
                    <Select value={newRoute.cableType} onValueChange={(value) => setNewRoute({...newRoute, cableType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cable type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fiber-optic">Fiber Optic</SelectItem>
                        <SelectItem value="copper">Copper</SelectItem>
                        <SelectItem value="coaxial">Coaxial</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRoute.description}
                    onChange={(e) => setNewRoute({...newRoute, description: e.target.value})}
                    placeholder="Additional route details..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddRoute}>Add Route</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search routes by ID, name, or stations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map((route) => (
          <Card key={route.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{route.name}</CardTitle>
                  <CardDescription>{route.id}</CardDescription>
                </div>
                <Badge variant={route.status === 'active' ? 'default' : 'secondary'}>
                  {route.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{route.startPoint} → {route.endPoint}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cable className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{route.cableType} • {route.length}</span>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Last Inspection: {route.lastInspection}</p>
                  <p>Next Maintenance: {route.nextMaintenance}</p>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewRoute(route)}>
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditRoute(route)}>
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteRoute(route.id)}>
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRoutes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Cable className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No routes match your search criteria.' : 'Get started by adding your first cable route.'}
            </p>
            {!searchTerm && (
              <Dialog open={addRouteOpen} onOpenChange={setAddRouteOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Route
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
          </CardContent>
        </Card>
      )}

      {/* View Route Dialog */}
      <Dialog open={viewRouteOpen} onOpenChange={setViewRouteOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Route Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedRoute?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedRoute && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Route ID</Label>
                  <p className="text-sm text-gray-600">{selectedRoute.id}</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge variant={selectedRoute.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                    {selectedRoute.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="font-medium">Route Name</Label>
                <p className="text-sm text-gray-600">{selectedRoute.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Start Point</Label>
                  <p className="text-sm text-gray-600">{selectedRoute.startPoint}</p>
                </div>
                <div>
                  <Label className="font-medium">End Point</Label>
                  <p className="text-sm text-gray-600">{selectedRoute.endPoint}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Length</Label>
                  <p className="text-sm text-gray-600">{selectedRoute.length}</p>
                </div>
                <div>
                  <Label className="font-medium">Cable Type</Label>
                  <p className="text-sm text-gray-600">{selectedRoute.cableType}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Last Inspection</Label>
                  <p className="text-sm text-gray-600">{selectedRoute.lastInspection}</p>
                </div>
                <div>
                  <Label className="font-medium">Next Maintenance</Label>
                  <p className="text-sm text-gray-600">{selectedRoute.nextMaintenance}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewRouteOpen(false)}>Close</Button>
            <Button onClick={() => {
              setViewRouteOpen(false)
              handleEditRoute(selectedRoute)
            }}>
              Edit Route
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Route Dialog */}
      <Dialog open={editRouteOpen} onOpenChange={setEditRouteOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Cable Route</DialogTitle>
            <DialogDescription>
              Update route information for {selectedRoute?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedRoute && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Route ID</Label>
                  <Input value={selectedRoute.id} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue={selectedRoute.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Route Name</Label>
                <Input defaultValue={selectedRoute.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Point</Label>
                  <Input defaultValue={selectedRoute.startPoint} />
                </div>
                <div className="space-y-2">
                  <Label>End Point</Label>
                  <Input defaultValue={selectedRoute.endPoint} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Length</Label>
                  <Input defaultValue={selectedRoute.length} />
                </div>
                <div className="space-y-2">
                  <Label>Cable Type</Label>
                  <Select defaultValue={selectedRoute.cableType.toLowerCase().replace(' ', '-')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiber-optic">Fiber Optic</SelectItem>
                      <SelectItem value="copper">Copper</SelectItem>
                      <SelectItem value="coaxial">Coaxial</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRouteOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({
                title: "Route Updated",
                description: `Changes to ${selectedRoute?.name} have been saved.`
              })
              setEditRouteOpen(false)
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
