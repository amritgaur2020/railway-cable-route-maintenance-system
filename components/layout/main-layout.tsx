"use client"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { Footer } from "./footer"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-6">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
