"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, LayoutGrid, Star, Clock, Settings, Users, BarChart2, Calendar, PieChart } from 'lucide-react'
import type { User } from "next-auth"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SideBarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user?: User | null
  onLogout?: () => void
}

interface MenuItem {
  id: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  href: string;
}

const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, setSidebarOpen, user, onLogout = () => {} }) => {
  const pathname = usePathname()
  const [notifications] = useState({
    messages: 2,
    calls: 3,
  })

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const menuItems: MenuItem[] = [
    { id: "dashboard", icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
    { id: "files", icon: FileText, label: "Meus Arquivos", badge: 3, href: "/dashboard/files" },
    { id: "starred", icon: Star, label: "Favoritos", href: "/dashboard/starred" },
    { id: "recent", icon: Clock, label: "Recentes", href: "/dashboard/recent" },
    { id: "shared", icon: Users, label: "Compartilhados", href: "/dashboard/shared" },
  ]

  const analyticsItems: MenuItem[] = [
    { id: "analytics", icon: BarChart2, label: "Análises", href: "/dashboard/analytics" },
    { id: "calendar", icon: Calendar, label: "Calendário", href: "/dashboard/calendar" },
    { id: "reports", icon: PieChart, label: "Relatórios", href: "/dashboard/reports" },
  ]

  const verticalIconBar = (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center py-6 rounded-full bg-[#151525] shadow-xl shadow-purple-900/20 border border-purple-900/20">
      {/* Main icons */}
      <div className="flex flex-col items-center gap-5 px-3 py-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            <Link href={item.href} passHref>
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full 
                  ${pathname === item.href ? "bg-purple-600 text-white" : "bg-[#1A1A2E] text-white/70 hover:text-white"}
                  hover:scale-110 transition-transform duration-200
                `}
              >
                <item.icon size={18} />
                
                {item.badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-xs font-medium text-white"
                  >
                    {item.badge}
                  </motion.div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-purple-900/20 my-2"></div>

      {/* Secondary icons */}
      <div className="flex flex-col items-center gap-5 px-3 py-4">
        {analyticsItems.slice(0, 2).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (index + 5) * 0.05 }}
            className="relative"
          >
            <Link href={item.href} passHref>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full 
                  ${pathname === item.href ? "bg-purple-600 text-white" : "bg-[#1A1A2E] text-white/70 hover:text-white"}
                  hover:scale-110 transition-transform duration-200
                `}
              >
                <item.icon size={18} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Settings button */}
      <div className="w-8 h-px bg-purple-900/20 my-2"></div>
      <div className="px-3 py-4">
        <Link href="/dashboard/settings" passHref>
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full 
              ${pathname === "/dashboard/settings" ? "bg-purple-600 text-white" : "bg-[#1A1A2E] text-white/70 hover:text-white"}
              hover:scale-110 transition-transform duration-200
            `}
          >
            <Settings size={18} />
          </div>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar - nixito style flutuante */}
      <div className="hidden md:block">{verticalIconBar}</div>
    </>
  )
}

export default SideBar