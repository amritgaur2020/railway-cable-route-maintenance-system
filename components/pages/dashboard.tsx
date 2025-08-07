"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, CheckCircle, Clock, MapPin, Wrench, FileText, TrendingUp, Activity, Users, Shield } from 'lucide-react'

export function Dashboard() {
  const { toast } = useToast()
  const [faultDialogOpen, setFaultDialogOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)
  const [mapDialogOpen, setMapDialogOpen] = useState(false)

  const [faultForm, setFaultForm] = useState({
    station: '',
    priority: '',
    description: '',
    location: ''
  })

  const [reportForm, setReportForm] = useState({
    type: '',
    dateRange: '',
    format: ''
  })

  const handleFaultSubmit = () => {
    if (!faultForm.station || !faultForm.priority || !faultForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Fault Reported Successfully",
      description: `Fault report submitted for ${faultForm.station}. Ticket #FR-${Date.now().toString().slice(-6)} created.`
    })
    
    setFaultForm({ station: '', priority: '', description: '', location: '' })
    setFaultDialogOpen(false)
  }

  const handleReportGenerate = () => {
    if (!reportForm.type || !reportForm.dateRange || !reportForm.format) {
      toast({
        title: "Error",
        description: "Please select all report parameters",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Report Generated",
      description: `${reportForm.type} report for ${reportForm.dateRange} is being prepared in ${reportForm.format} format.`
    })
    
    // Simulate file download
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Railway ${reportForm.type} Report\nDate Range: ${reportForm.dateRange}\nGenerated: ${new Date().toLocaleString()}`)
      link.download = `railway-${reportForm.type.toLowerCase()}-report.${reportForm.format.toLowerCase()}`
      link.click()
      
      toast({
        title: "Download Ready",
        description: "Your report has been downloaded successfully."
      })
    }, 2000)
    
    setReportForm({ type: '', dateRange: '', format: '' })
    setReportDialogOpen(false)
  }

  const handleMaintenanceSchedule = () => {
    toast({
      title: "Maintenance Scheduled",
      description: "New maintenance task has been added to the schedule."
    })
    setMaintenanceDialogOpen(false)
  }

  const handleMapNavigation = () => {
    toast({
      title: "Opening GIS Map",
      description: "Navigating to interactive map view..."
    })
    setMapDialogOpen(false)
    // In a real app, this would navigate to the map page
    window.location.href = '/gis-map'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Railway Cable Route & Maintenance Overview</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={faultDialogOpen} onOpenChange={setFaultDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Fault
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Cable Fault</DialogTitle>
                <DialogDescription>
                  Submit a new fault report for immediate attention
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="station" className="text-right">Station</Label>
                  <Select value={faultForm.station} onValueChange={(value) => setFaultForm({...faultForm, station: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-delhi">New Delhi</SelectItem>
                      <SelectItem value="mumbai-central">Mumbai Central</SelectItem>
                      <SelectItem value="chennai-central">Chennai Central</SelectItem>
                      <SelectItem value="kolkata">Kolkata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">Priority</Label>
                  <Select value={faultForm.priority} onValueChange={(value) => setFaultForm({...faultForm, priority: value})}>
                    <SelectTrigger className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input
                    id="location"
                    value={faultForm.location}
                    onChange={(e) => setFaultForm({...faultForm, location: e.target.value})}
                    placeholder="Specific location details"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    value={faultForm.description}
                    onChange={(e) => setFaultForm({...faultForm, description: e.target.value})}
                    placeholder="Describe the fault in detail..."
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleFaultSubmit}>Submit Fault Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate System Report</DialogTitle>
                <DialogDescription>
                  Create comprehensive reports for analysis and compliance
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reportType" className="text-right">Report Type</Label>
                  <Select value={reportForm.type} onValueChange={(value) => setReportForm({...reportForm, type: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance Summary</SelectItem>
                      <SelectItem value="fault">Fault Analysis</SelectItem>
                      <SelectItem value="compliance">Compliance Report</SelectItem>
                      <SelectItem value="performance">Performance Metrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateRange" className="text-right">Date Range</Label>
                  <Select value={reportForm.dateRange} onValueChange={(value) => setReportForm({...reportForm, dateRange: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="format" className="text-right">Format</Label>
                  <Select value={reportForm.format} onValueChange={(value) => setReportForm({...reportForm, format: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Excel">Excel</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleReportGenerate}>Generate Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cable Routes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Faults</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              0 critical, 0 high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Tasks</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              0 pending, 0 in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Faults */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Fault Reports</CardTitle>
            <CardDescription>Latest cable and infrastructure issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No fault reports found</p>
                <p className="text-sm">All systems are operating normally</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog open={faultDialogOpen} onOpenChange={setFaultDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Report New Fault
                </Button>
              </DialogTrigger>
            </Dialog>

            <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <Wrench className="w-4 h-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Maintenance</DialogTitle>
                  <DialogDescription>
                    Plan routine or emergency maintenance tasks
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Task Type</Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select maintenance type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine Inspection</SelectItem>
                        <SelectItem value="repair">Cable Repair</SelectItem>
                        <SelectItem value="replacement">Equipment Replacement</SelectItem>
                        <SelectItem value="testing">Signal Testing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Priority</Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Scheduled Date</Label>
                    <Input type="date" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleMaintenanceSchedule}>Schedule Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </DialogTrigger>
            </Dialog>

            <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  View GIS Map
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Navigate to GIS Map</DialogTitle>
                  <DialogDescription>
                    Open the interactive map view for route planning and monitoring
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>The GIS map provides:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Real-time cable route visualization</li>
                    <li>GPS tracking and navigation</li>
                    <li>Fault location mapping</li>
                    <li>Maintenance point identification</li>
                  </ul>
                </div>
                <DialogFooter>
                  <Button onClick={handleMapNavigation}>Open GIS Map</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Current system metrics and health indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network Connectivity</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Signal Strength</span>
                <span>98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Equipment Status</span>
                <span>95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Maintenance Compliance</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System initialized successfully</p>
                  <p className="text-xs text-gray-500">All modules loaded - Just now</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Database connection established</p>
                  <p className="text-xs text-gray-500">Ready for operations - Just now</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Awaiting initial data setup</p>
                  <p className="text-xs text-gray-500">Configure routes and stations - Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
