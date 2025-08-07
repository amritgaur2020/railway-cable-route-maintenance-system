"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { QrCode, Camera, MapPin, Clock, AlertTriangle, Wrench, Eye } from 'lucide-react'

export function QRScanner() {
  const [manualId, setManualId] = useState("")
  const [scannedAsset, setScannedAsset] = useState(null)

  const recentScans = [
    {
      id: "AS001",
      assetType: "Signal Cable",
      location: "Gonda Junction - KM 45.2",
      scanTime: "2024-02-12 14:30",
      status: "Good"
    },
    {
      id: "AS002", 
      assetType: "Joint Pit",
      location: "Lucknow - KM 78.5",
      scanTime: "2024-02-12 13:15",
      status: "Needs Attention"
    },
    {
      id: "AS003",
      assetType: "Marker Post",
      location: "Delhi Junction - KM 102.8",
      scanTime: "2024-02-12 11:45",
      status: "Good"
    }
  ]

  const mockAssetData = {
    id: "AS001",
    type: "Signal Cable",
    location: "Gonda Junction - KM 45.2",
    installDate: "2022-03-15",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
    status: "Good",
    specifications: {
      cableType: "Quad",
      length: "2.5 km",
      burialDepth: "1.2m",
      voltage: "24V"
    },
    maintenanceHistory: [
      { date: "2024-01-15", type: "Meggering", result: "Pass" },
      { date: "2023-10-15", type: "Visual Inspection", result: "Pass" },
      { date: "2023-07-15", type: "Joint Cleaning", result: "Pass" }
    ]
  }

  const handleScan = () => {
    // Simulate QR code scan
    setScannedAsset(mockAssetData)
  }

  const handleManualEntry = () => {
    if (manualId) {
      setScannedAsset(mockAssetData)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "bg-green-100 text-green-800"
      case "Needs Attention":
        return "bg-yellow-100 text-yellow-800"
      case "Critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">QR Scanner</h1>
        <p className="text-gray-600 mt-1">Scan QR codes to access asset information and perform quick actions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              QR Code Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera View */}
            <div className="bg-gray-900 rounded-lg h-64 flex items-center justify-center relative">
              <div className="text-center text-white">
                <Camera className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Position QR code in frame</p>
                <p className="text-sm opacity-75">Camera will auto-detect QR codes</p>
              </div>
              {/* Scanning overlay */}
              <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg opacity-50"></div>
            </div>

            <Button 
              onClick={handleScan}
              className="w-full bg-[#1E3A8A] hover:bg-blue-800"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Scanning
            </Button>

            {/* Manual Entry */}
            <div className="border-t pt-4">
              <Label htmlFor="manual-id">Manual Asset ID Entry</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="manual-id"
                  placeholder="Enter Asset ID (e.g., AS001)"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                />
                <Button onClick={handleManualEntry} variant="outline">
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scanned Asset Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Asset Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scannedAsset ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Asset ID</Label>
                    <p className="font-medium">{scannedAsset.id}</p>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <p className="font-medium">{scannedAsset.type}</p>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <p className="font-medium">{scannedAsset.location}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(scannedAsset.status)}>
                      {scannedAsset.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Specifications</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Cable Type:</span>
                      <span>{scannedAsset.specifications.cableType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Length:</span>
                      <span>{scannedAsset.specifications.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Burial Depth:</span>
                      <span>{scannedAsset.specifications.burialDepth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voltage:</span>
                      <span>{scannedAsset.specifications.voltage}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Maintenance Info</Label>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Last Maintenance:</span>
                      <span>{scannedAsset.lastMaintenance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Maintenance:</span>
                      <span>{scannedAsset.nextMaintenance}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2 pt-4">
                  <Button size="sm" className="bg-[#F97316] hover:bg-orange-600">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Report Issue
                  </Button>
                  <Button size="sm" variant="outline">
                    <Wrench className="w-4 h-4 mr-1" />
                    Update Status
                  </Button>
                  <Button size="sm" variant="outline">
                    <MapPin className="w-4 h-4 mr-1" />
                    View Location
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Scan a QR code or enter Asset ID</p>
                <p className="text-sm text-gray-500 mt-2">
                  Asset information will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Scans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Scan Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentScans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium">{scan.id}</TableCell>
                    <TableCell>{scan.assetType}</TableCell>
                    <TableCell>{scan.location}</TableCell>
                    <TableCell>{scan.scanTime}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(scan.status)}>
                        {scan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
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

      {/* Maintenance History */}
      {scannedAsset && (
        <Card>
          <CardHeader>
            <CardTitle>Maintenance History - {scannedAsset.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scannedAsset.maintenanceHistory.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{record.type}</p>
                    <p className="text-sm text-gray-600">{record.date}</p>
                  </div>
                  <Badge className={record.result === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {record.result}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
