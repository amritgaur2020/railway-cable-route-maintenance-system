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
import { Plus, Search, Filter, AlertTriangle, MapPin, Clock, User, Camera, Eye, Edit, CheckCircle, XCircle } from 'lucide-react'

export function FaultReports() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [addFaultOpen, setAddFaultOpen] = useState(false)
  const [viewFaultOpen, setViewFaultOpen] = useState(false)
  const [selectedFault, setSelectedFault] = useState<any>(null)
  const [gpsLocation, setGpsLocation] = useState<string>('')

  const [newFault, setNewFault] = useState({
    title: '',
    description: '',
    priority: '',
    location: '',
    station: '',
    reportedBy: '',
    category: ''
  })

  const [faults, setFaults] = useState([
    {
      id: 'FR-001',
      title: 'Signal Cable Damage',
      description: 'Fiber optic cable damaged due to construction work',
      priority: 'critical',
      status: 'open',
      location: 'KM 45.2, Delhi-Mumbai Route',
      station: 'Gurgaon Junction',
      reportedBy: 'Station Master',
      reportedDate: '2024-01-15',
      category: 'cable-damage',
      estimatedRepairTime: '4 hours',
      assignedTo: 'John Smith'
    },
    {
      id: 'FR-002',
      title: 'Communication Equipment Failure',
      description: 'Radio communication system not responding',
      priority: 'high',
      status: 'in-progress',
      location: 'Control Room, Platform 3',
      station: 'Mumbai Central',
      reportedBy: 'Control Officer',
      reportedDate: '2024-01-14',
      category: 'equipment-failure',
      estimatedRepairTime: '2 hours',
      assignedTo: 'Sarah Johnson'
    },
    {
      id: 'FR-003',
      title: 'Power Supply Interruption',
      description: 'Intermittent power supply to signal equipment',
      priority: 'medium',
      status: 'resolved',
      location: 'Signal Box B-12',
      station: 'Chennai Central',
      reportedBy: 'Signal Maintainer',
      reportedDate: '2024-01-12',
      category: 'power-issue',
      estimatedRepairTime: '1 hour',
      assignedTo: 'Mike Wilson'
    }
  ])

  const handleAddFault = () => {
    if (!newFault.title || !newFault.priority || !newFault.location || !newFault.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const fault = {
      id: `FR-${String(faults.length + 1).padStart(3, '0')}`,
      ...newFault,
      status: 'open',
      reportedDate: new Date().toISOString().split('T')[0],
      reportedBy: 'Current User',
      assignedTo: '',
      estimatedRepairTime: 'TBD'
    }

    setFaults([...faults, fault])
    toast({
      title: "Fault Reported Successfully",
      description: `Fault report ${fault.id} has been created and assigned for review.`
    })
    
    setNewFault({
      title: '',
      description: '',
      priority: '',
      location: '',
      station: '',
      reportedBy: '',
      category: ''
    })
    setAddFaultOpen(false)
  }

  const handleCaptureGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          setGpsLocation(location)
          setNewFault({...newFault, location: location})
          toast({
            title: "GPS Location Captured",
            description: `Location: ${location}`
          })
        },
        (error) => {
          toast({
            title: "GPS Error",
            description: "Unable to capture GPS location. Please enter manually.",
            variant: "destructive"
          })
        }
      )
    } else {
      toast({
        title: "GPS Not Supported",
        description: "GPS is not supported by this browser.",
        variant: "destructive"
      })
    }
  }

  const handlePhotoUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        toast({
          title: "Photo Uploaded",
          description: `${file.name} has been attached to the fault report.`
        })
      }
    }
    input.click()
  }

  const handleViewFault = (fault: any) => {
    setSelectedFault(fault)
    setViewFaultOpen(true)
  }

  const handleUpdateStatus = (faultId: string, newStatus: string) => {
    setFaults(faults.map(fault => 
      fault.id === faultId ? { ...fault, status: newStatus } : fault
    ))
    toast({
      title: "Status Updated",
      description: `Fault ${faultId} status changed to ${newStatus}.`
    })
  }

  const filteredFaults = faults.filter(fault =>
    fault.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fault.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fault.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fault.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'default'
      case 'in-progress': return 'secondary'
      case 'open': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fault Reports</h1>
          <p className="text-gray-600">Track and manage infrastructure faults</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={addFaultOpen} onOpenChange={setAddFaultOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Report Fault
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report New Fault</DialogTitle>
                <DialogDescription>
                  Submit a detailed fault report for immediate attention
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Fault Title *</Label>
                  <Input
                    id="title"
                    value={newFault.title}
                    onChange={(e) => setNewFault({...newFault, title: e.target.value})}
                    placeholder="Brief description of the fault"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    value={newFault.description}
                    onChange={(e) => setNewFault({...newFault, description: e.target.value})}
                    placeholder="Provide detailed information about the fault..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={newFault.priority} onValueChange={(value) => setNewFault({...newFault, priority: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newFault.category} onValueChange={(value) => setNewFault({...newFault, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cable-damage">Cable Damage</SelectItem>
                        <SelectItem value="equipment-failure">Equipment Failure</SelectItem>
                        <SelectItem value="power-issue">Power Issue</SelectItem>
                        <SelectItem value="signal-problem">Signal Problem</SelectItem>
                        <SelectItem value="communication-failure">Communication Failure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="station">Station</Label>
                  <Select value={newFault.station} onValueChange={(value) => setNewFault({...newFault, station: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New Delhi">New Delhi</SelectItem>
                      <SelectItem value="Mumbai Central">Mumbai Central</SelectItem>
                      <SelectItem value="Chennai Central">Chennai Central</SelectItem>
                      <SelectItem value="Kolkata">Kolkata</SelectItem>
                      <SelectItem value="Gurgaon Junction">Gurgaon Junction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Specific Location *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="location"
                      value={newFault.location}
                      onChange={(e) => setNewFault({...newFault, location: e.target.value})}
                      placeholder="Exact location or GPS coordinates"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleCaptureGPS}>
                      <MapPin className="w-4 h-4 mr-2" />
                      GPS
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={handlePhotoUpload} className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddFault}>Submit Fault Report</Button>
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
            placeholder="Search faults by ID, title, station, or location..."
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

      {/* Faults Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaults.map((fault) => (
          <Card key={fault.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{fault.title}</CardTitle>
                  <CardDescription>{fault.id}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(fault.priority)}`} title={`${fault.priority} priority`}></div>
                  <Badge variant={getStatusColor(fault.status)}>
                    {fault.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{fault.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{fault.station}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Reported: {fault.reportedDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  <span>{fault.reportedBy}</span>
                </div>
                {fault.assignedTo && (
                  <div className="text-sm text-gray-500">
                    <span>Assigned to: {fault.assignedTo}</span>
                  </div>
                )}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewFault(fault)}>
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  {fault.status === 'open' && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(fault.id, 'in-progress')}>
                      <Edit className="w-3 h-3 mr-1" />
                      Assign
                    </Button>
                  )}
                  {fault.status === 'in-progress' && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(fault.id, 'resolved')}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFaults.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No faults found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No faults match your search criteria.' : 'No fault reports have been submitted yet.'}
            </p>
            {!searchTerm && (
              <Dialog open={addFaultOpen} onOpenChange={setAddFaultOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Report First Fault
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
          </CardContent>
        </Card>
      )}

      {/* View Fault Dialog */}
      <Dialog open={viewFaultOpen} onOpenChange={setViewFaultOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Fault Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedFault?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedFault && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Fault ID</Label>
                  <p className="text-sm text-gray-600">{selectedFault.id}</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge variant={getStatusColor(selectedFault.status)} className="ml-2">
                    {selectedFault.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="font-medium">Title</Label>
                <p className="text-sm text-gray-600">{selectedFault.title}</p>
              </div>
              <div>
                <Label className="font-medium">Description</Label>
                <p className="text-sm text-gray-600">{selectedFault.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Priority</Label>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedFault.priority)}`}></div>
                    <span className="text-sm text-gray-600 capitalize">{selectedFault.priority}</span>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Category</Label>
                  <p className="text-sm text-gray-600 capitalize">{selectedFault.category?.replace('-', ' ')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Station</Label>
                  <p className="text-sm text-gray-600">{selectedFault.station}</p>
                </div>
                <div>
                  <Label className="font-medium">Reported Date</Label>
                  <p className="text-sm text-gray-600">{selectedFault.reportedDate}</p>
                </div>
              </div>
              <div>
                <Label className="font-medium">Location</Label>
                <p className="text-sm text-gray-600">{selectedFault.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Reported By</Label>
                  <p className="text-sm text-gray-600">{selectedFault.reportedBy}</p>
                </div>
                <div>
                  <Label className="font-medium">Assigned To</Label>
                  <p className="text-sm text-gray-600">{selectedFault.assignedTo || 'Unassigned'}</p>
                </div>
              </div>
              <div>
                <Label className="font-medium">Estimated Repair Time</Label>
                <p className="text-sm text-gray-600">{selectedFault.estimatedRepairTime}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewFaultOpen(false)}>Close</Button>
            {selectedFault?.status === 'open' && (
              <Button onClick={() => {
                handleUpdateStatus(selectedFault.id, 'in-progress')
                setViewFaultOpen(false)
              }}>
                Assign & Start Work
              </Button>
            )}
            {selectedFault?.status === 'in-progress' && (
              <Button onClick={() => {
                handleUpdateStatus(selectedFault.id, 'resolved')
                setViewFaultOpen(false)
              }}>
                Mark as Resolved
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
