"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Download, Calendar, Clock, Eye, Settings } from 'lucide-react'

export function Reports() {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const reportTemplates = [
    {
      id: "monthly-maintenance",
      name: "Monthly Maintenance Summary",
      description: "Comprehensive monthly maintenance activities report",
      category: "Maintenance"
    },
    {
      id: "fault-analysis",
      name: "Fault Analysis Report",
      description: "Analysis of fault reports and resolution trends",
      category: "Faults"
    },
    {
      id: "compliance-report",
      name: "Compliance Report",
      description: "Station-wise compliance status and metrics",
      category: "Compliance"
    },
    {
      id: "cable-inventory",
      name: "Cable Inventory Report",
      description: "Complete inventory of cable routes and assets",
      category: "Inventory"
    }
  ]

  const reportHistory = [
    {
      id: "RPT001",
      name: "Monthly Maintenance Summary - January 2024",
      type: "Monthly Maintenance Summary",
      generatedDate: "2024-02-01",
      generatedBy: "System Admin",
      status: "Completed",
      fileSize: "2.4 MB"
    },
    {
      id: "RPT002",
      name: "Fault Analysis - Q4 2023",
      type: "Fault Analysis Report",
      generatedDate: "2024-01-15",
      generatedBy: "Officer",
      status: "Completed",
      fileSize: "1.8 MB"
    },
    {
      id: "RPT003",
      name: "Compliance Report - December 2023",
      type: "Compliance Report",
      generatedDate: "2024-01-05",
      generatedBy: "Supervisor",
      status: "Completed",
      fileSize: "3.2 MB"
    },
    {
      id: "RPT004",
      name: "Cable Inventory - Annual 2023",
      type: "Cable Inventory Report",
      generatedDate: "2023-12-31",
      generatedBy: "System Admin",
      status: "Completed",
      fileSize: "5.1 MB"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and manage system reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Generate New Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="template">Report Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report template" />
                </SelectTrigger>
                <SelectContent>
                  {reportTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <p className="text-sm text-gray-600 mt-1">
                  {reportTemplates.find(t => t.id === selectedTemplate)?.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date-from">From Date</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date-to">To Date</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="station-filter">Station Filter</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All stations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stations</SelectItem>
                  <SelectItem value="gonda">Gonda Junction</SelectItem>
                  <SelectItem value="lucknow">Lucknow</SelectItem>
                  <SelectItem value="delhi">Delhi Junction</SelectItem>
                  <SelectItem value="kanpur">Kanpur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="format">Output Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button className="flex-1 bg-[#1E3A8A] hover:bg-blue-800">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Available Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Scheduled Reports
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Manage Schedule
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Monthly Maintenance Summary</p>
                <p className="text-sm text-gray-600">Every 1st of month at 9:00 AM</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Weekly Fault Summary</p>
                <p className="text-sm text-gray-600">Every Monday at 8:00 AM</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Report History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead>Generated By</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportHistory.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.generatedDate}</TableCell>
                    <TableCell>{report.generatedBy}</TableCell>
                    <TableCell>{report.fileSize}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
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
    </div>
  )
}
