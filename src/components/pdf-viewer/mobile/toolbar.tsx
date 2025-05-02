"use client"

import { Search, ChevronLeft, ChevronRight, Sun, Moon, MoreVertical, ZoomIn, ZoomOut } from 'lucide-react'

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
    <div className="flex h-12 w-full items-center justify-between bg-[#0f0423] px-5 text-white">
      <div className="flex items-center space-x-2">
        <button
          onClick={onSearch}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#151525]"
          title="Buscar"
        >
          <Search size={18} />
        </button>

        <div className="flex items-center">
          <input
            type="text"
            value={currentPage}
            onChange={onPageChange}
            className="w-9 bg-transparent text-center text-sm focus:outline-none"
            aria-label="Número da página atual"
          />
          <span className="mx-1 text-xs text-gray-400">/</span>
          <span className="text-xs text-gray-400">{totalPages || "-"}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex h-8 w-full items-center justify-center space-x-2 rounded-full bg-[#151525] p-1 shadow-lg">
          <button
            onClick={onZoomOut}
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#1f1f3a]"
            title="Diminuir zoom"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={onZoomIn}
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#1f1f3a]"
            title="Aumentar zoom"
          >
            <ZoomIn size={18} />
          </button>
        </div>

        <button
          onClick={onToggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#151525]"
          title="Alternar tema"
        >
          {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={onShowMenu}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#151525]"
          title="Menu"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  )
}
