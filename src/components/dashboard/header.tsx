"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "next-auth"
import { Bell, Search, ChevronDown, Settings, LogOut, HelpCircle, X, Plus, FileText, Clock, History } from 'lucide-react'
import Notification from "@/components/ui/notification"
import type Pdf from "@/lib/props/PdfProps"

interface HeaderProps {
  user: User | null
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onUpload: () => void
  pdfs?: Pdf[]
}

const Header: React.FC<HeaderProps> = ({ user, sidebarOpen, setSidebarOpen, onUpload, pdfs = [] }) => {
  const [showNotification, setShowNotification] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showIcon, setShowIcon] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [filteredPdfs, setFilteredPdfs] = useState<Pdf[]>([])
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = pdfs.filter(pdf => 
        pdf.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPdfs(filtered)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }, [searchQuery, pdfs])

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
        setShowMobileSearch(false)
      }
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

    // Load search history from localStorage
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }

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
    setShowSearchResults(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    // Add to search history if not already present
    if (query.trim() && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory].slice(0, 5)
      setSearchHistory(newHistory)
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))
    }
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch)
    setShowSearchResults(true)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled || showSearchResults || showMobileSearch ? "bg-[#0A0118]/95 backdrop-blur-md shadow-lg shadow-purple-900/10" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between py-3 lg:px-10 px-4">
        {/* Left section - Logo */}
        <div className="flex items-center gap-3 md:ml-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                Neo
              </span>
              <span className="text-lg font-bold text-white">PDF</span>
            </div>
          </Link>
        </div>

        {/* Center section - Search (hidden on mobile unless activated) */}
        <div 
          ref={searchRef} 
          className={`relative z-40 ${showMobileSearch 
            ? "fixed inset-0 bg-[#0A0118]/95 backdrop-blur-md flex items-center justify-center p-4" 
            : "hidden md:block w-full max-w-md mx-4"}`}
        >
          <div className={`relative ${showMobileSearch ? "w-full max-w-md" : ""}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative flex items-center rounded-lg bg-[#151525] border border-purple-500/20 overflow-hidden group"
            >
              <Search size={16} className="absolute left-3 text-purple-400/70" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Pesquisar PDFs..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-transparent py-2 pl-9 pr-8 text-sm text-white placeholder-purple-300/50 outline-none"
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
            </motion.div>
            
            {/* Mobile close button */}
            {showMobileSearch && (
              <button 
                onClick={() => setShowMobileSearch(false)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showSearchResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`${showMobileSearch 
                  ? "w-full max-w-md mt-2" 
                  : "absolute top-full left-0 right-0 mt-1"} 
                  bg-[#151525] border border-purple-500/20 rounded-lg shadow-xl overflow-hidden z-50`}
              >
                {/* Search History */}
                {searchQuery === "" && searchHistory.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center text-sm text-white/70">
                        <History size={14} className="mr-2" />
                        <span>Pesquisas recentes</span>
                      </div>
                      <button 
                        onClick={clearSearchHistory}
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Limpar histórico
                      </button>
                    </div>
                    
                    {searchHistory.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(query)}
                        className="w-full text-left px-3 py-2 hover:bg-purple-500/10 text-white/80 hover:text-white transition-colors flex items-center"
                      >
                        <Clock size={14} className="mr-2 text-purple-400/70" />
                        <span>{query}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Search Results */}
                {searchQuery !== "" && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm text-white/70">
                      {filteredPdfs.length > 0 
                        ? `${filteredPdfs.length} resultados encontrados` 
                        : "Nenhum resultado encontrado"}
                    </div>
                    
                    {filteredPdfs.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto">
                        {filteredPdfs.map((pdf) => (
                          <Link
                            key={pdf.id}
                            href={`/pdf/${pdf.id}`}
                            className="flex items-center px-3 py-2 hover:bg-purple-500/10 text-white/80 hover:text-white transition-colors rounded-md"
                            onClick={() => setShowMobileSearch(false)}
                          >
                            <div className="h-8 w-8 rounded-md bg-[#0A0118] flex items-center justify-center mr-3">
                              <FileText size={16} className="text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{pdf.name}</p>
                              <p className="text-xs text-white/50">
                                {pdf.createdAt ? formatDate(pdf.createdAt) : "Recente"}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-4 text-center text-white/50">
                        <FileText size={24} className="mx-auto mb-2 text-purple-400/50" />
                        <p>Nenhum PDF encontrado com {searchQuery}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Mobile search button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileSearch}
            className="md:hidden relative p-2 text-white/70 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all duration-200"
            aria-label="Pesquisar"
          >
            <Search size={18} />
          </motion.button>

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

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUpload}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-md flex items-center gap-2 transition-all duration-200 shadow-lg shadow-purple-500/20 text-sm font-medium"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Novo PDF</span>
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
                  className="absolute right-0 mt-2 w-56 rounded-lg bg-[#151525] shadow-lg shadow-purple-900/20 ring-1 ring-purple-500/20 overflow-hidden"
                >
                  <div className="p-3 border-b border-purple-900/20">
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-purple-300/70 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <motion.button
                      whileHover={{ x: 5, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <Settings size={16} />
                      <span>Configurações</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 5, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <HelpCircle size={16} />
                      <span>Ajuda & Suporte</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 5, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
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
