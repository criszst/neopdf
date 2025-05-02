"use client"

import { useState, useEffect } from "react"
import { Search, ChevronUp, ChevronDown, Download, Printer, Maximize2, MoreVertical, Sun, Moon, Bookmark, RotateCw } from 'lucide-react'
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
  isDarkTheme?: boolean
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
  isDarkTheme = true,
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
    <div className="flex h-12 w-full items-center justify-between bg-[#0f0423] px-4 text-white">
      <div className="flex items-center space-x-2">
        <button
          onClick={onSearch}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#0f0423]"
          title="Buscar"
        >
          <Search size={18} />
        </button>
        
        <div className="flex items-center space-x-1 rounded-md bg-[#151525] px-2 py-1">
          <button
            onClick={onPrevPage}
            className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#1f1f3a]"
            title="Página anterior"
            disabled={currentPage <= 1}
          >
            <ChevronUp size={16} className={currentPage <= 1 ? "opacity-50" : ""} />
          </button>
          
          <div className="flex items-center">
            <input
              type="text"
              value={currentPage}
              onChange={onPageChange}
              className="w-12 bg-transparent text-center text-sm focus:outline-none"
              aria-label="Número da página atual"
            />
            <span className="mx-1 text-gray-400">/</span>
            <span className="text-sm text-gray-400">{totalPages || "-"}</span>
          </div>
          
          <button
            onClick={onNextPage}
            className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#1f1f3a]"
            title="Próxima página"
            disabled={currentPage >= (totalPages || 1)}
          >
            <ChevronDown size={16} className={currentPage >= (totalPages || 1) ? "opacity-50" : ""} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 px-2 py-1">
        <div className="flex items-center space-x-1 rounded-md bg-[#151525] px-2 py-1">
          <span className="text-sm text-gray-300">
            {typeof zoomLevel === "number" ? `${zoomLevel}%` : zoomLevel}
          </span>
          <div className="flex items-center">
            <button
              onClick={onZoomIn}
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#1f1f3a]"
              title="Aumentar zoom"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={onZoomOut}
              className="flex h-5 w-5 items-center justify-center rounded hover:bg-[#1f1f3a]"
              title="Diminuir zoom"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#151525]"
            title="Alternar tema"
          >
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button
            onClick={onDownload}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#151525]"
            title="Download"
          >
            <Download size={18} />
          </button>
          
          <button
            onClick={onPrint}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#151525]"
            title="Imprimir"
          >
            <Printer size={18} />
          </button>
          
          <button
            onClick={onFullScreen}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#151525]"
            title="Tela cheia"
          >
            <Maximize2 size={18} />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMoreOptions(!showMoreOptions)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#151525]"
              title="Mais opções"
            >
              <MoreVertical size={18} />
            </button>
            
            {showMoreOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md bg-[#151525] py-1 shadow-lg"
              >
                <button
                  onClick={onToggleBookmark}
                  className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-[#1f1f3a]"
                >
                  <Bookmark size={16} className="mr-2" />
                  Adicionar marcador
                </button>
                <button
                  onClick={onRotate}
                  className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-[#1f1f3a]"
                >
                  <RotateCw size={16} className="mr-2" />
                  Girar página
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
