"use client"

import type React from "react"

import { Search, ZoomIn, ZoomOut, Sun, Moon, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface MobileToolbarProps {
  currentPage: number
  totalPages: number | null
  onPrevPage: () => void
  onNextPage: () => void
  onPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onSearch: () => void
  onToggleTheme?: () => void
  onShowMenu: () => void
  isDarkTheme?: boolean
}

export default function MobileToolbar({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onSearch,
  onToggleTheme,
  onShowMenu,
  isDarkTheme = true,
}: MobileToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-14 w-full items-center justify-between border-b px-4"
      style={{
        backgroundColor: isDarkTheme ? "#0f0423" : "#ffffff",
        borderColor: isDarkTheme ? "#151525" : "#e2e8f0",
      }}
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={onSearch}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            isDarkTheme ? "text-white hover:bg-[#151525]" : "text-gray-700 hover:bg-gray-100"
          }`}
          title="Buscar"
        >
          <Search size={20} />
        </button>

        <div className="flex items-center space-x-1">
          <button
            onClick={onPrevPage}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isDarkTheme ? "text-white hover:bg-[#151525]" : "text-gray-700 hover:bg-gray-100"
            } ${currentPage <= 1 ? "opacity-50" : ""}`}
            disabled={currentPage <= 1}
          >
            <ChevronLeft size={20} />
          </button>

          <div
            className="flex items-center rounded-md px-2 py-1"
            style={{ backgroundColor: isDarkTheme ? "#151525" : "#f1f5f9" }}
          >
            <input
              type="text"
              value={currentPage}
              onChange={onPageChange}
              className="w-8 bg-transparent text-center text-sm focus:outline-none"
              style={{ color: isDarkTheme ? "#ffffff" : "#1e293b" }}
              aria-label="Número da página atual"
            />
            <span className="mx-1 text-xs text-gray-400">/</span>
            <span className="text-xs text-gray-400">{totalPages || "-"}</span>
          </div>

          <button
            onClick={onNextPage}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isDarkTheme ? "text-white hover:bg-[#151525]" : "text-gray-700 hover:bg-gray-100"
            } ${currentPage >= (totalPages || 1) ? "opacity-50" : ""}`}
            disabled={currentPage >= (totalPages || 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div
          className="flex h-8 items-center justify-center space-x-1 rounded-full px-2"
          style={{ backgroundColor: isDarkTheme ? "#151525" : "#f1f5f9" }}
        >
          <button
            onClick={onZoomOut}
            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
              isDarkTheme ? "text-white hover:bg-[#1f1f3a]" : "text-gray-700 hover:bg-gray-200"
            }`}
            title="Diminuir zoom"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={onZoomIn}
            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
              isDarkTheme ? "text-white hover:bg-[#1f1f3a]" : "text-gray-700 hover:bg-gray-200"
            }`}
            title="Aumentar zoom"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        <button
          onClick={onToggleTheme}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            isDarkTheme ? "text-white hover:bg-[#151525]" : "text-gray-700 hover:bg-gray-100"
          }`}
          title="Alternar tema"
        >
          {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={onShowMenu}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            isDarkTheme ? "text-white hover:bg-[#151525]" : "text-gray-700 hover:bg-gray-100"
          }`}
          title="Menu"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </motion.div>
  )
}
