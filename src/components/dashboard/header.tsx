"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"


import { motion, AnimatePresence } from "framer-motion"
import { Bell, Search, ChevronDown, Settings, LogOut, HelpCircle, X } from "lucide-react"

import Notification from "@/components/ui/notification"

import HeaderProps from "@/lib/props/HeaderProps"


const Header: React.FC<HeaderProps> = ({ user }) => {
  const [showNotification, setShowNotification] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showIcon, setShowIcon] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleNotification = () => {
    setShowNotification(!showNotification)
    setShowIcon(false)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 bg-[#0e0525]/90 backdrop-blur-md border-b border-purple-900/20"
    >
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center rounded-full bg-[#1a0f24]/80 w-54 left-10 border border-purple-500/20">
            <Search size={16} className="absolute left-3 text-purple-400/70" />
            <input
              type="text"
              placeholder="Search PDFs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-30 max-w-xs xs:w-40 bg-transparent py-1.5 pl-9 pr-8 text-sm text-white placeholder-purple-300/50 outline-none rounded-full"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute right-3 text-purple-400/70 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>


        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <button
            className="relative p-2 text-white/70 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all duration-200"
            onClick={() => setShowNotification(true)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {showIcon && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-500"></span>}
          </button>


          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-full hover:bg-purple-500/10 p-1.5 transition-colors"
              aria-label="User menu"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-purple-500/30 to-purple-700/30 ring-2 ring-purple-500/20">
                  {user?.image ? (
                    <Image
                      src={user.image || "/placeholder.svg"}
                      alt={user.name || "User"}
                      className="h-full w-full object-cover"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-white">
                      {user?.name?.[0] || "U"}
                    </div>
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
                  <div className="flex items-center">
                    <span className="text-xs text-purple-400">Premium</span>
                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  </div>
                </div>
              </div>
              <ChevronDown size={14} className="text-white/70 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-lg bg-[#1a0f24] shadow-lg ring-1 ring-purple-500/20 overflow-hidden"
                >
                  <div className="p-3 border-b border-purple-900/20">
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-purple-300/70 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-purple-500/10 hover:text-white transition-colors">
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-purple-500/10 hover:text-white transition-colors">
                      <HelpCircle size={16} />
                      <span>Help & Support</span>
                    </button>
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-purple-500/10 hover:text-white transition-colors">
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Notification component */}
      <Notification
        isOpen={showNotification}
        onClose={() => toggleNotification()}
        title="Nova Notificação"
        message="Email não foi verificado. Por favor, verifique seu email."
        type="info"
        action={{
          label: "Ver detalhes",
          onClick: () => {
            setShowNotification(false)
          },
        }}
      />
    </motion.header>
  )
}

export default Header

