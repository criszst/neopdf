"use client"

import type React from "react"
import { useEffect } from "react"
import { useState } from "react"
import type { User } from "next-auth"
import Image from "next/image"

import { Settings, Star, Clock, Search, ChevronDown, LayoutGrid, Folder, BarChart3, Calendar, X } from "lucide-react"

interface SideBarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session")
        if (!res.ok) throw new Error("Failed to fetch session")
        const data = await res.json()
        setUser(data?.user || null)
      } catch (error) {
        console.error(error)
      }
    }

    fetchSession()
  }, [])

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a0f24] transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 md:p-6 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                Neo
              </span>
              <span className="text-xl md:text-2xl font-bold text-white">PDF</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-purple-400 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 mb-4 md:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
              <input
                type="text"
                placeholder="Search PDFs..."
                className="w-full bg-[#1a0f24] border border-purple-500/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {[
              { icon: LayoutGrid, label: "Dashboard", active: true },
              { icon: Folder, label: "My Files" },
              { icon: Star, label: "Starred" },
              { icon: Clock, label: "Recent" },
              { icon: BarChart3, label: "Analytics" },
              { icon: Calendar, label: "Calendar" },
              { icon: Settings, label: "Settings" },
            ].map((item) => (
              <button
                key={item.label}
                className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                  item.active
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Storage */}
          <div className="p-4 mt-auto">
            <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20">
              <h4 className="text-sm font-medium text-white mb-2">Storage</h4>
              <div className="w-full h-2 bg-[#1C1F2E] rounded-full overflow-hidden">
                <div className="h-full w-[82%] bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" />
              </div>
              <p className="text-xs text-purple-300/70 mt-2">82% of 10GB used</p>
            </div>
          </div>

          {/* User */}
          <div className="p-4 border-t border-purple-900/20 lg:hidden">
            <button className="flex items-center space-x-3 w-full p-2 rounded-full hover:bg-white/5 group">
              {user?.image ? (
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full flex-shrink-0"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                  {user?.name?.[0] || "U"}
                </div>
              )}
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors truncate">
                  {user?.name || "User"}
                </div>
                <div className="text-xs text-zinc-400 truncate">{user?.email || "user@example.com"}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-purple-400 transition-colors flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBar

