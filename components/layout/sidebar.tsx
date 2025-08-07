"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Cable, Map, Wrench, AlertTriangle, Shield, QrCode, FileText, Settings, X, Home } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Cable Routes", href: "/cable-routes", icon: Cable },
  { name: "GIS Map View", href: "/gis-map", icon: Map },
  { name: "Maintenance Tasks", href: "/maintenance", icon: Wrench },
  { name: "Fault Reports", href: "/fault-reports", icon: AlertTriangle },
  { name: "Compliance Monitor", href: "/compliance", icon: Shield },
  { name: "QR Scanner", href: "/qr-scanner", icon: QrCode },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="mt-4 lg:mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-[#1E3A8A] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => onClose()}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}
