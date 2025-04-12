"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  LayoutGrid,
  Star,
  Clock,
  Settings,
  HelpCircle,
  Menu,
  X,
  Users,
  BarChart2,
  Calendar,
  PieChart,
  ShoppingCart,
} from "lucide-react"
import fetchStats from "@/lib/api/fetchStats"
import type UserStats from "@/lib/interfaces/UserStats"

interface SideBarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [activeItem, setActiveItem] = useState("dashboard")
  const [isCollapsed, setIsCollapsed] = useState(false)

  const getStats = async () => {
    try {
      const session = fetchStats()
      const data = await session.then((res) => res.json())
      setStats(data || null)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  useEffect(() => {
    getStats()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      } else if (window.innerWidth >= 1280) {
        setIsCollapsed(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const menuItems = [
    { id: "dashboard", icon: LayoutGrid, label: "Dashboard" },
    { id: "files", icon: FileText, label: "Meus Arquivos" },
    { id: "starred", icon: Star, label: "Favoritos" },
    { id: "recent", icon: Clock, label: "Recentes" },
    { id: "shared", icon: Users, label: "Compartilhados" },
  ]

  const analyticsItems = [
    { id: "analytics", icon: BarChart2, label: "Análises" },
    { id: "calendar", icon: Calendar, label: "Calendário" },
    { id: "reports", icon: PieChart, label: "Reportes" },
  ]

  const renderMenuItem = (item: (typeof menuItems)[0]) => {
    const isActive = activeItem === item.id

    return (
      <button
        key={item.id}
        onClick={() => setActiveItem(item.id)}
        className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-purple-500/20 text-purple-400 border border-purple-500/20"
            : "text-white/70 hover:text-white hover:bg-purple-500/10"
        }`}
      >
        <item.icon size={18} className={isActive ? "text-purple-400" : ""} />
        {!isCollapsed && <span>{item.label}</span>}
      </button>
    )
  }

  const sidebarContent = (
    <div
      className={`flex h-full flex-col bg-[#0e0525] text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-purple-900/20">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <FileText size={16} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Neo
                </span>
                <span className="text-lg font-bold text-white">PDF</span>
              </div>
            </div>
            <button
              onClick={toggleCollapse}
              className="rounded-md p-1.5 text-white/70 hover:bg-purple-500/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={toggleCollapse}
            className="mx-auto rounded-md p-1.5 text-white/70 hover:bg-purple-500/10 hover:text-white"
          >
            <Menu size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Main menu */}
        <div className="space-y-1">{menuItems.map(renderMenuItem)}</div>

        {/* Analytics section */}
        {!isCollapsed && (
          <div className="pt-2">
            <p className="px-3 py-2 text-xs font-medium text-purple-400/70 uppercase tracking-wider">Análises</p>
          </div>
        )}

        <div className="space-y-1">{analyticsItems.map(renderMenuItem)}</div>

        {/* Settings section */}
        <div className="space-y-1 pt-2">
          {renderMenuItem({ id: "settings", icon: Settings, label: "Configurações" })}
          {renderMenuItem({ id: "help", icon: HelpCircle, label: "Ajuda & Suporte" })}
        </div>
      </div>

      {/* Storage */}
      {!isCollapsed && (
        <div className="p-4 mt-auto border-t border-purple-900/20">
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20">
            <h4 className="text-sm font-medium text-white mb-2">Armazenamento</h4>
            <div className="w-full h-2 bg-[#1a0f24] rounded-full overflow-hidden">
              <div
                style={{ width: `${stats?.storage?.percentage || 35}%` }}
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
              />
            </div>
            <p className="text-xs text-purple-300/70 mt-2">
              {stats?.storage?.used
                ? `${(stats.storage.used / (1024 * 1024)).toFixed(1)} MB / ${(stats.storage.limit / (1024 * 1024)).toFixed(1)} MB`
                : "3.5 GB / 10 GB usado"}
            </p>
          </div>
        </div>
      )}

      {/* Upgrade button */}
      {!isCollapsed && (
        <div className="p-4">
          <button className="w-full py-2 px-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20">
            <ShoppingCart size={16} />
            <span>Atualizar Plano</span>
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed left-2 top-4 z-50 rounded-md bg-purple-600 p-2 text-white shadow-lg"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block h-full sticky top-0">{sidebarContent}</div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 z-50 h-screen lg:hidden shadow-lg shadow-purple-900/30"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SideBar