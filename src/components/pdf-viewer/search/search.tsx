"use client"

import { useState, useEffect, useRef } from "react"
import { SearchIcon, X, ChevronUp, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface SearchBarProps {
  onSearch: (keyword: string) => void
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  matchesCount: number
  currentMatch: number
  isOpen: boolean
  isDarkTheme: boolean
}

export default function SearchBar({
  onSearch,
  onNext,
  onPrevious,
  onClose,
  matchesCount,
  currentMatch,
  isOpen,
  isDarkTheme,
}: SearchBarProps) {
  const [keyword, setKeyword] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSearch = () => {
    if (keyword.trim()) {
      onSearch(keyword)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute left-1/2 top-16 z-50 w-full max-w-md -translate-x-1/2 transform rounded-lg border shadow-lg"
        style={{
          backgroundColor: isDarkTheme ? "#151525" : "#ffffff",
          borderColor: isDarkTheme ? "#2a2a2a" : "#e2e8f0",
        }}
      >
        <div className="flex items-center p-3">
          <div
            className="flex flex-1 items-center rounded-md px-3 py-2"
            style={{ backgroundColor: isDarkTheme ? "#0f0423" : "#f1f5f9" }}
          >
            <SearchIcon size={18} className="mr-2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar no documento..."
              className="w-full bg-transparent text-sm focus:outline-none"
              style={{ color: isDarkTheme ? "#ffffff" : "#1e293b" }}
            />
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="ml-1 rounded-full p-1 hover:bg-gray-700/20"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "#8B5CF6" }}
          >
            Buscar
          </button>
          <button onClick={onClose} className="ml-2 rounded-full p-1 hover:bg-gray-700/20">
            <X size={20} className={isDarkTheme ? "text-gray-300" : "text-gray-600"} />
          </button>
        </div>

        {matchesCount > 0 && (
          <div
            className="flex items-center justify-between border-t p-3"
            style={{ borderColor: isDarkTheme ? "#2a2a2a" : "#e2e8f0" }}
          >
            <div className="text-sm" style={{ color: isDarkTheme ? "#e2e8f0" : "#4b5563" }}>
              {currentMatch} de {matchesCount} resultados
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={onPrevious}
                className="rounded p-1 hover:bg-gray-700/20"
                disabled={matchesCount === 0}
              >
                <ChevronUp
                  size={20}
                  className={matchesCount === 0 ? "text-gray-500" : isDarkTheme ? "text-gray-300" : "text-gray-600"}
                />
              </button>
              <button
                onClick={onNext}
                className="rounded p-1 hover:bg-gray-700/20"
                disabled={matchesCount === 0}
              >
                <ChevronDown
                  size={20}
                  className={matchesCount === 0 ? "text-gray-500" : isDarkTheme ? "text-gray-300" : "text-gray-600"}
                />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
