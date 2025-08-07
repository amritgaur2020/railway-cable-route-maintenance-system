"use client"

import { Bell, Menu, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Cable Fault Detected", message: "Section A-12 requires immediate attention", time: "2 min ago", type: "urgent" },
    { id: 2, title: "Maintenance Scheduled", message: "Routine inspection for Zone B tomorrow", time: "1 hour ago", type: "info" },
    { id: 3, title: "Compliance Alert", message: "Safety audit due for Station XYZ", time: "3 hours ago", type: "warning" }
  ])
  const { toast } = useToast()

  return (
    <header className="bg-[#1E3A8A] text-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-white hover:bg-blue-700"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1E3A8A] font-bold text-sm">IR</span>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold">
                Railway Cable Route & Maintenance Management System
              </h1>
              <p className="text-blue-200 text-sm hidden lg:block">
                Indian Railways - Signal & Telecommunication Department
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-blue-700">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#F97316] text-xs p-0 flex items-center justify-center">
                  {notifications.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                  <div className="flex justify-between w-full">
                    <span className="font-medium text-sm">{notification.title}</span>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <span className="text-sm text-gray-600 mt-1">{notification.message}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  setNotifications([])
                  toast({ title: "Notifications cleared", description: "All notifications have been marked as read" })
                }}
              >
                Clear All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-blue-700">
                <User className="h-5 w-5" />
                <span className="hidden lg:block">Officer</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Change Password</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
