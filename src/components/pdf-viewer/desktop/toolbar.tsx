"use client"

import { useState, useEffect } from "react"
import { Search, ChevronUp, ChevronDown, Download, Printer, Maximize2, MoreVertical, Sun, Moon, Bookmark, RotateCw, Layers } from 'lucide-react'
import { motion } from "framer-motion"

interface DesktopToolbarProps {
  currentPage: number
  totalPages: number | null
  zoomLevel: number | string
  onPrevPage: () => void
  onNextPage: () => void
  onPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onSearch: () => void
  onDownload: () => void
  onPrint: () => void
  onFullScreen: () => void
  onToggleTheme?: () => void
  onToggleBookmark?: () => void
  onRotate?: () => void
  onToggleSidebar?: () => void
  isDarkTheme?: boolean
  showSidebar?: boolean
}

export default function DesktopToolbar({
  currentPage,
  totalPages,
  zoomLevel,
  onPrevPage,
  onNextPage,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onSearch,
  onDownload,
  onPrint,
  onFullScreen,
  onToggleTheme,
  onToggleBookmark,
  onRotate,
  onToggleSidebar,
  isDarkTheme = true,
  showSidebar = false,
}: DesktopToolbarProps) {
  const [showMoreOptions, setShowMoreOptions] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMoreOptions(false)
    }

    if (showMoreOptions) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [showMoreOptions])

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
          onClick={onToggleSidebar}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            showSidebar
              ? isDarkTheme
                ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-600"
              : isDarkTheme
              ? "text-white hover:bg-[#151525]"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={showSidebar ? "Ocultar miniaturas" : "Mostrar miniaturas"}
        >
          <Layers size={20} />
        </button>

        <button
          onClick={onSearch}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            isDarkTheme ? "text-white hover:bg-[#151525]" : "text-gray-700 hover:bg-gray-100"
          }`}
          title="Buscar"
        >
          <Search size={20} />
        </button>

        <div
          className="flex items-center space-x-1 rounded-md px-3 py-1.5"
          style={{ backgroundColor: isDarkTheme ? "#151525" : "#f1f5f9" }}
        >
          <button
            onClick={onPrevPage}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              isDarkTheme ? "hover:bg-[#1f1f3a]" : "hover:bg-gray-200"
            } ${currentPage <= 1 ? "opacity-50" : ""}`}
            title="Página anterior"
            disabled={currentPage <= 1}
          >
            <ChevronUp size={18} />
          </button>

          <div className="flex items-center">
            <input
              type="text"
              value={currentPage}
              onChange={onPageChange}
              className="w-10 bg-transparent text-center text-sm focus:outline-none"
              style={{ color: isDarkTheme ? "#ffffff" : "#1e293b" }}
              aria-label="Número da página atual"
            />
            <span className="mx-1 text-gray-400">/</span>
            <span className="text-sm text-gray-400">{totalPages || "-"}</span>
          </div>

          <button
            onClick={onNextPage}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              isDarkTheme ? "hover:bg-[#1f1f3a]" : "hover:bg-gray-200"
            } ${currentPage >= (totalPages || 1) ? "opacity-50" : ""}`}
            title="Próxima página"
            disabled={currentPage >= (totalPages || 1)}
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div
          className="flex items-center space-x-1 rounded-md px-3 py-1.5"
          style={{ backgroundColor: isDarkTheme ? "#151525" : "#f1f5f9" }}
        >
          <span className="text-sm" style={{ color: isDarkTheme ? "#e2e8f0" : "#4b5563" }}>
            {typeof zoomLevel === "number" ? `${zoomLevel}%` : zoomLevel}
          </span>
          <div className="flex flex-col">
            <button
              onClick={onZoomIn}
              className={`flex h-3.5 w-6 items-center justify-center rounded-t transition-colors ${
                isDarkTheme ? "hover:bg-[#1f1f3a]" : "hover:bg-gray-200"
              }`}
              title="Aumentar zoom"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={onZoomOut}
              className={`flex h-3.5 w-6 items-center justify-center rounded-b transition-colors ${
                isDarkTheme ? "hover:bg-[#1f1f3a]" : "hover:bg-gray-200"
              }`}
              title="Diminuir zoom"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onToggleTheme}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isDarkTheme ? "text-white hover:bg-[#151525]" : "text-gray-700 hover:bg-gray-100"
            }`}
            title="Alternar tema"
          >
            {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={onDownload}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isDarkTheme ? "text-white hover:bg-[#151525]" : "text-gray-700 hover:bg-gray-100"
            }`}
            title="Download"
          >
            <Download size={20} />
          </button>

          <button
            onClick={onPrint}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isDarkTheme ? "text-white hover:bg-[#151525]" : "text-gray-700 hover:bg-gray-100"
            }`}
            title="Imprimir"
          >
            <Printer size={20} />
          </button>

          <button
            onClick={onFullScreen}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isDarkTheme ? "text-white hover:bg-[#151525]" : "text-gray-700 hover:bg-gray-100"
            }`}
            title="Tela cheia"
          >
            <Maximize2 size={20} />
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMoreOptions(!showMoreOptions)
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                isDarkTheme ? "text-white hover:bg-[#151525]" : "text-gray-700 hover:bg-gray-100"
              }`}
              title="Mais opções"
            >
              <MoreVertical size={20} />
            </button>

            {showMoreOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md py-1 shadow-lg"
                style={{
                  backgroundColor: isDarkTheme ? "#151525" : "#ffffff",
                  borderColor: isDarkTheme ? "#2a2a2a" : "#e2e8f0",
                  borderWidth: 1,
                }}
              >
                <button
                  onClick={() => {
                    onToggleBookmark?.()
                    setShowMoreOptions(false)
                  }}
                  className={`flex w-full items-center px-4 py-2 text-left text-sm ${
                    isDarkTheme ? "hover:bg-[#1f1f3a] text-white" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Bookmark size={16} className="mr-2" />
                  Adicionar marcador
                </button>
                <button
                  onClick={() => {
                    onRotate?.()
                    setShowMoreOptions(false)
                  }}
                  className={`flex w-full items-center px-4 py-2 text-left text-sm ${
                    isDarkTheme ? "hover:bg-[#1f1f3a] text-white" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <RotateCw size={16} className="mr-2" />
                  Girar página
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
