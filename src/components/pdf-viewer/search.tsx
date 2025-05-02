"use client"

import { useState, useEffect, useRef } from "react"
import { SearchIcon, X, ChevronUp, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface SearchProps {
  onSearch: (term: string) => void
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  matchesCount: number
  currentMatch: number
  isOpen: boolean
  isDarkTheme?: boolean
}

export default function Search({
  onSearch,
  onNext,
  onPrevious,
  onClose,
  matchesCount,
  currentMatch,
  isOpen,
  isDarkTheme = true,
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSearch = () => {
    onSearch(searchTerm)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null

  const bgColor = isDarkTheme ? "#151525" : "#f8f9fa"
  const textColor = isDarkTheme ? "#fff" : "#333"
  const borderColor = isDarkTheme ? "#333" : "#ddd"
  const accentColor = "#8B5CF6"

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute left-1/2 top-16 z-50 w-full max-w-md -translate-x-1/2 rounded-lg shadow-lg"
        style={{ backgroundColor: bgColor, borderColor: borderColor, borderWidth: 1 }}
      >
        <div className="flex items-center p-2">
          <div className="flex flex-1 items-center rounded-md px-2" style={{ backgroundColor: isDarkTheme ? "#0f0423" : "#eee" }}>
            <SearchIcon size={16} className="mr-2" style={{ color: isDarkTheme ? "#aaa" : "#666" }} />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar no documento..."
              className="w-full bg-transparent py-2 text-sm focus:outline-none"
              style={{ color: textColor }}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="ml-1 rounded-full p-1 hover:bg-opacity-10 hover:bg-white">
                <X size={14} style={{ color: isDarkTheme ? "#aaa" : "#666" }} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="ml-2 rounded-md px-3 py-2 text-sm"
            style={{ backgroundColor: accentColor, color: "white" }}
          >
            Buscar
          </button>
          <button
            onClick={onClose}
            className="ml-2 rounded-full p-1 hover:bg-opacity-10 hover:bg-white"
          >
            <X size={18} style={{ color: textColor }} />
          </button>
        </div>

        {matchesCount > 0 && (
          <div className="flex items-center justify-between border-t p-2" style={{ borderColor: borderColor }}>
            <div className="text-sm" style={{ color: textColor }}>
              {currentMatch} de {matchesCount} resultados
            </div>
            <div className="flex items-center">
              <button
                onClick={onPrevious}
                className="rounded p-1 hover:bg-opacity-10 hover:bg-white"
                disabled={matchesCount === 0}
              >
                <ChevronUp size={18} style={{ color: matchesCount === 0 ? (isDarkTheme ? "#555" : "#ccc") : textColor }} />
              </button>
              <button
                onClick={onNext}
                className="rounded p-1 hover:bg-opacity-10 hover:bg-white"
                disabled={matchesCount === 0}
              >
                <ChevronDown size={18} style={{ color: matchesCount === 0 ? (isDarkTheme ? "#555" : "#ccc") : textColor }} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
