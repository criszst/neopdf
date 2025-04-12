"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import type { User } from "next-auth"

import { Bell, Search, ChevronDown, Settings, LogOut, HelpCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import Notification from "@/components/ui/notification"

import fetchPDFs from "@/lib/api/fetchPdfs"
import Pdf from "@/lib/props/PdfProps"

interface HeaderProps {
  user: User | null
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onUpload: () => void
}

const Header: React.FC<HeaderProps> = ({ user, sidebarOpen, setSidebarOpen, onUpload }) => {
  const [showNotification, setShowNotification] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showIcon, setShowIcon] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)

  const [pdfs, setPdfs] = useState<Pdf[]>([])

  const userMenuRef = useRef<HTMLDivElement>(null)

  // search pdfs when searchQuery is true

  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        const pdfs = fetchPDFs()

        pdfs.then((data) => {
          const filteredPdfs = data.filter((pdf: any) => pdf.name.toLowerCase().includes(searchQuery.toLowerCase()))
          setPdfs(filteredPdfs)
        })
      }, 500)

      return () => clearTimeout(timer)
    }
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", handleScroll)
    }
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
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled ? "bg-[#0A0118]/90 backdrop-blur-md shadow-lg shadow-purple-900/10" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative flex items-center rounded-full left-10 bg-[#1a0f24]/80 overflow-hidden group"
          >
            <Search size={16} className="absolute left-3 text-purple-400/70" />
            <input
              type="text"
              placeholder="Pesquisar PDFs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-1.5 pl-10 text-sm text-white placeholder-purple-300/50 outline-none rounded-full"
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={clearSearch}
                className="absolute right-3 text-purple-400/70 hover:text-white"
              >
                <X size={14} />
              </motion.button>
            )}

            {/* Animated border on focus */}
            <motion.div
              className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-purple-400 to-purple-600"
              animate={{ width: searchQuery ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-white/70 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all duration-200"
            onClick={() => setShowNotification(true)}
            aria-label="Notificações"
          >
            <Bell size={18} />
            {showIcon && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-500"
              />
            )}
          </motion.button>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
            ref={userMenuRef}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-full hover:bg-purple-500/10 p-1.5 transition-colors"
              aria-label="Menu do usuário"
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
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute right-0 mt-2 w-56 rounded-lg bg-[#1a0f24] shadow-lg shadow-purple-900/20 ring-1 ring-purple-500/20 overflow-hidden"
                >
                  <div className="p-3 border-b border-purple-900/20">
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-purple-300/70 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <motion.button
                      whileHover={{ x: 5, backgroundColor: "rgba(147, 51, 234, 0.1)" }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <Settings size={16} />
                      <span>Configurações</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 5, backgroundColor: "rgba(147, 51, 234, 0.1)" }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <HelpCircle size={16} />
                      <span>Ajuda & Suporte</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 5, backgroundColor: "rgba(147, 51, 234, 0.1)" }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
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

