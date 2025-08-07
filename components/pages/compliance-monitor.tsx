"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Calendar, FileText, Download, RefreshCw, Search, Filter, Eye, Settings } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"

// Mock compliance data - ALL VALUES SET TO ZERO
const complianceStations = [
  {
    id: "GD",
    name: "Gonda Junction",
    overallScore: 0,
    status: "not_assessed",
    lastAudit: "Not Conducted",
    nextAudit: "Not Scheduled",
    categories: {
      safety: { score: 0, status: "not_assessed", issues: 0 },
      maintenance: { score: 0, status: "not_assessed", issues: 0 },
      documentation: { score: 0, status: "not_assessed", issues: 0 },
      training: { score: 0, status: "not_assessed", issues: 0 },
      equipment: { score: 0, status: "not_assessed", issues: 0 }
    },
    trends: {
      current: 0,
      previous: 0,
      change: 0
    },
    criticalIssues: 0,
    openActions: 0
  },
  {
    id: "LKO",
    name: "Lucknow",
    overallScore: 0,
    status: "not_assessed",
    lastAudit: "Not Conducted",
    nextAudit: "Not Scheduled",
    categories: {
      safety: { score: 0, status: "not_assessed", issues: 0 },
      maintenance: { score: 0, status: "not_assessed", issues: 0 },
      documentation: { score: 0, status: "not_assessed", issues: 0 },
      training: { score: 0, status: "not_assessed", issues: 0 },
      equipment: { score: 0, status: "not_assessed", issues: 0 }
    },
    trends: {
      current: 0,
      previous: 0,
      change: 0
    },
    criticalIssues: 0,
    openActions: 0
  },
  {
    id: "NDLS",
    name: "New Delhi",
    overallScore: 0,
    status: "not_assessed",
    lastAudit: "Not Conducted",
    nextAudit: "Not Scheduled",
    categories: {
      safety: { score: 0, status: "not_assessed", issues: 0 },
      maintenance: { score: 0, status: "not_assessed", issues: 0 },
      documentation: { score: 0, status: "not_assessed", issues: 0 },
      training: { score: 0, status: "not_assessed", issues: 0 },
      equipment: { score: 0, status: "not_assessed", issues: 0 }
    },
    trends: {
      current: 0,
      previous: 0,
      change: 0
    },
    criticalIssues: 0,
    openActions: 0
  },
  {
    id: "CNB",
    name: "Kanpur Central",
    overallScore: 0,
    status: "not_assessed",
    lastAudit: "Not Conducted",
    nextAudit: "Not Scheduled",
    categories: {
      safety: { score: 0, status: "not_assessed", issues: 0 },
      maintenance: { score: 0, status: "not_assessed", issues: 0 },
      documentation: { score: 0, status: "not_assessed", issues: 0 },
      training: { score: 0, status: "not_assessed", issues: 0 },
      equipment: { score: 0, status: "not_assessed", issues: 0 }
    },
    trends: {
      current: 0,
      previous: 0,
      change: 0
    },
    criticalIssues: 0,
    openActions: 0
  }
]

const complianceStandards = [
  {
    id: "IS001",
    name: "Cable Installation Standards",
    category: "Technical",
    description: "Standards for proper cable installation and burial depth",
    compliance: 0,
    lastUpdated: "Not Set",
    applicableStations: 0,
    violations: 0
  },
  {
    id: "IS002",
    name: "Maintenance Schedule Compliance",
    category: "Operational",
    description: "Adherence to scheduled maintenance activities",
    compliance: 0,
    lastUpdated: "Not Set",
    applicableStations: 0,
    violations: 0
  },
  {
    id: "IS003",
    name: "Safety Protocol Adherence",
    category: "Safety",
    description: "Compliance with safety protocols during maintenance",
    compliance: 0,
    lastUpdated: "Not Set",
    applicableStations: 0,
    violations: 0
  },
  {
    id: "IS004",
    name: "Documentation Requirements",
    category: "Administrative",
    description: "Proper documentation of all maintenance activities",
    compliance: 0,
    lastUpdated: "Not Set",
    applicableStations: 0,
    violations: 0
  }
]

const auditHistory = [
  // Empty array - no audit history initially
]

export function ComplianceMonitor() {
  const { toast } = useToast()
  const [selectedStation, setSelectedStation] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTimeframe, setSelectedTimeframe] = useState("current")
  const [refreshing, setRefreshing] = useState(false)
  const [selectedStationDetails, setSelectedStationDetails] = useState(null)

  const handleRefreshData = async () => {
    setRefreshing(true)
    
    // Simulate API call with progress updates
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 300))
      // You could update a progress state here if needed
    }
    
    setRefreshing(false)
    toast({
      title: "Data Refreshed Successfully",
      description: `Updated compliance data for ${complianceStations.length} stations`
    })
  }

  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      stations: complianceStations,
      standards: complianceStandards,
      audits: auditHistory
    }
    
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
    
    toast({
      title: "Report Exported",
      description: "Compliance report has been downloaded"
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200"
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "needs_improvement":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "not_assessed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredStations = complianceStations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStation = selectedStation === "all" || station.id === selectedStation
    return matchesSearch && matchesStation
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Compliance Monitor</h1>
          <p className="text-gray-600 mt-1">Track and monitor compliance across all railway stations</p>
        </div>
        <div className="flex space-x-2 mt-4 lg:mt-0">
          <Button 
            variant="outline" 
            onClick={handleRefreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#1E3A8A] hover:bg-blue-800">
                <Settings className="w-4 h-4 mr-2" />
                Configure Standards
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configure Compliance Standards</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Standard Name</Label>
                    <Input placeholder="Enter standard name" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the compliance standard..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Minimum Score</Label>
                    <Input type="number" placeholder="70" />
                  </div>
                  <div>
                    <Label>Review Frequency (days)</Label>
                    <Input type="number" placeholder="30" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: "Standard Created",
                        description: "New compliance standard has been added to the system"
                      })
                    }}
                  >
                    Create Standard
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Standards Imported",
                        description: "Compliance standards imported from template"
                      })
                    }}
                  >
                    Import Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overall Compliance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {Math.round(complianceStations.reduce((sum, s) => sum + s.overallScore, 0) / complianceStations.length)}%
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4">
              <Progress 
                value={Math.round(complianceStations.reduce((sum, s) => sum + s.overallScore, 0) / complianceStations.length)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {complianceStations.reduce((sum, s) => sum + s.criticalIssues, 0)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Requires immediate attention
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Actions</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {complianceStations.reduce((sum, s) => sum + s.openActions, 0)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Pending corrective actions
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Audits This Month</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {auditHistory.filter(a => new Date(a.date).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Completed audits
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger>
                <SelectValue placeholder="All Stations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stations</SelectItem>
                {complianceStations.map(station => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Current Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Period</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="last_quarter">Last Quarter</SelectItem>
                <SelectItem value="last_year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stations">Station Compliance</TabsTrigger>
          <TabsTrigger value="standards">Standards</TabsTrigger>
          <TabsTrigger value="audits">Audit History</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="stations" className="space-y-6">
          {/* Station Compliance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStations.map(station => (
              <Card key={station.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{station.name}</CardTitle>
                      <p className="text-sm text-gray-600">{station.id}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(station.overallScore)}`}>
                        {station.overallScore}%
                      </div>
                      <Badge className={getStatusColor(station.status)}>
                        {station.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Category Scores */}
                  <div className="space-y-2">
                    {Object.entries(station.categories).map(([category, data]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm capitalize font-medium">{category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                data.score >= 90 ? 'bg-green-500' :
                                data.score >= 80 ? 'bg-blue-500' :
                                data.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${data.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{data.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{station.criticalIssues}</div>
                      <div className="text-xs text-gray-600">Critical Issues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{station.openActions}</div>
                      <div className="text-xs text-gray-600">Open Actions</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold flex items-center justify-center ${
                        station.trends.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {station.trends.change >= 0 ? 
                          <TrendingUp className="w-4 h-4 mr-1" /> : 
                          <TrendingDown className="w-4 h-4 mr-1" />
                        }
                        {Math.abs(station.trends.change)}%
                      </div>
                      <div className="text-xs text-gray-600">Trend</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setSelectedStationDetails(station)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Compliance Details - {station.name}</DialogTitle>
                        </DialogHeader>
                        {selectedStationDetails && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-semibold mb-3">Overall Performance</h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Current Score:</span>
                                    <span className="font-bold">{selectedStationDetails.overallScore}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Previous Score:</span>
                                    <span>{selectedStationDetails.trends.previous}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Change:</span>
                                    <span className={selectedStationDetails.trends.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                                      {selectedStationDetails.trends.change >= 0 ? '+' : ''}{selectedStationDetails.trends.change}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-3">Quick Actions</h3>
                                <div className="space-y-2">
                                  <Button 
                                    size="sm" 
                                    className="w-full"
                                    onClick={() => {
                                      toast({
                                        title: "Audit Scheduled",
                                        description: `Compliance audit scheduled for ${selectedStationDetails.name}`
                                      })
                                    }}
                                  >
                                    Schedule Audit
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => {
                                      toast({
                                        title: "Corrective Action",
                                        description: `Corrective action plan initiated for ${selectedStationDetails.name}`
                                      })
                                    }}
                                  >
                                    Create Action Plan
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => {
                                      toast({
                                        title: "Team Notified",
                                        description: `Compliance team notified about ${selectedStationDetails.name} status`
                                      })
                                    }}
                                  >
                                    Notify Team
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold mb-3">Category Breakdown</h3>
                              <div className="space-y-3">
                                {Object.entries(selectedStationDetails.categories).map(([category, data]) => (
                                  <div key={category} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium capitalize">{category}</span>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-bold">{data.score}%</span>
                                        <Badge className={getStatusColor(data.status)} variant="outline">
                                          {data.status.replace('_', ' ')}
                                        </Badge>
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          onClick={() => {
                                            toast({
                                              title: "Category Details",
                                              description: `Viewing detailed ${category} compliance data`
                                            })
                                          }}
                                        >
                                          <Eye className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    <Progress value={data.score} className="h-2" />
                                    <div className="text-sm text-gray-600 mt-1">
                                      {data.issues} open issues
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      className="bg-[#1E3A8A] hover:bg-blue-800"
                      onClick={() => {
                        const reportData = {
                          stationId: station.id,
                          stationName: station.name,
                          overallScore: station.overallScore,
                          categories: station.categories,
                          timestamp: new Date().toISOString(),
                          reportType: 'station_compliance'
                        }
                        
                        const dataStr = JSON.stringify(reportData, null, 2)
                        const dataBlob = new Blob([dataStr], { type: 'application/json' })
                        const url = URL.createObjectURL(dataBlob)
                        
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `compliance-report-${station.id}-${new Date().toISOString().split('T')[0]}.json`
                        link.click()
                        
                        URL.revokeObjectURL(url)
                        
                        toast({
                          title: "Report Generated",
                          description: `Compliance report for ${station.name} downloaded successfully`
                        })
                      }}
                    >
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="standards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Standards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Standard ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Compliance Rate</TableHead>
                      <TableHead>Violations</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceStandards.map(standard => (
                      <TableRow key={standard.id}>
                        <TableCell className="font-medium">{standard.id}</TableCell>
                        <TableCell>{standard.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{standard.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={standard.compliance} className="w-16 h-2" />
                            <span className="font-medium">{standard.compliance}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={standard.violations === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {standard.violations}
                          </Badge>
                        </TableCell>
                        <TableCell>{standard.lastUpdated}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit ID</TableHead>
                      <TableHead>Station</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Auditor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditHistory.map(audit => (
                      <TableRow key={audit.id}>
                        <TableCell className="font-medium">{audit.id}</TableCell>
                        <TableCell>{audit.station}</TableCell>
                        <TableCell>{audit.date}</TableCell>
                        <TableCell>{audit.auditor}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{audit.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`font-bold ${getScoreColor(audit.score)}`}>
                            {audit.score}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            audit.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            audit.status === 'Action Required' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {audit.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Total: {audit.findings}</div>
                            {audit.criticalFindings > 0 && (
                              <div className="text-red-600">Critical: {audit.criticalFindings}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Compliance Trend Chart</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Historical compliance data visualization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Category Performance Chart</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Performance breakdown by category
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {complianceStations.filter(s => s.status === 'excellent').length}
                  </div>
                  <div className="text-sm text-gray-600">Excellent Performance</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">
                    {complianceStations.filter(s => s.status === 'needs_improvement').length}
                  </div>
                  <div className="text-sm text-gray-600">Needs Improvement</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {complianceStations.filter(s => s.status === 'critical').length}
                  </div>
                  <div className="text-sm text-gray-600">Critical Issues</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
