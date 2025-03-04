import React from "react"
import { Bell, Upload, MenuIcon } from 'lucide-react'
import Image from "next/image"
import { User } from "next-auth"
import { motion } from "framer-motion"

interface HeaderProps {
  user: User | null
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onUpload: () => void
}

const Header: React.FC<HeaderProps> = ({ user, sidebarOpen, setSidebarOpen, onUpload }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 bg-[#0e0525]/80 backdrop-blur-md border-b border-purple-900/20"
    >
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 text-white lg:hidden hover:text-purple-400 transition-colors"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-sans font-semibold text-white">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-zinc-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-500"></span>
          </button>
          <button
            onClick={onUpload}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-purple-500/20"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload PDF</span>
          </button>

          <div className="hidden md:block">
            <button className="flex items-center space-x-2 rounded-full hover:bg-white/5 group p-1">
              {user?.image ? (
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name || "User"}
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-purple-500/30"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-medium border-2 border-purple-500/30">
                  {user?.name?.[0] || "U"}
                </div>
              )}
              <div className="hidden md:block flex-1 text-left">
                <div className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                  {user?.name || "User"}
                </div>
                <div className="text-xs text-zinc-400">{user?.email || "user@example.com"}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
