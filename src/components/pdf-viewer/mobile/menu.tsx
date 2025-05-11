"use client"

import { motion } from "framer-motion"
import { Download, Printer, Maximize2, Star, Share2, Bookmark, RotateCw, X, Layers } from "lucide-react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onDownload: () => void
  onPrint: () => void
  onFullScreen: () => void
  onToggleStar: () => void
  onShare: () => void
  onToggleBookmark?: () => void
  onRotate?: () => void
  onToggleSidebar?: () => void
  isStarred: boolean
  isDarkTheme?: boolean
  showSidebar?: boolean
}

export default function MobileMenu({
  isOpen,
  onClose,
  onDownload,
  onPrint,
  onFullScreen,
  onToggleStar,
  onShare,
  onToggleBookmark,
  onRotate,
  onToggleSidebar,
  isStarred,
  isDarkTheme = true,
  showSidebar = false,
}: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="w-full max-w-md rounded-t-xl p-4"
        style={{ backgroundColor: isDarkTheme ? "#0f0423" : "#ffffff" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium" style={{ color: isDarkTheme ? "#ffffff" : "#1e293b" }}>
            Opções
          </h3>
          <button
            onClick={onClose}
            className={`rounded-full p-1.5 ${
              isDarkTheme ? "hover:bg-[#151525] text-white" : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={() => {
              onToggleStar()
              onClose()
            }}
            className={`flex flex-col items-center justify-center rounded-lg p-3 ${
              isDarkTheme ? "hover:bg-[#151525]" : "hover:bg-gray-100"
            }`}
          >
            <Star
              size={24}
              fill={isStarred ? "#FCD34D" : "none"}
              color={isStarred ? "#FCD34D" : isDarkTheme ? "#ffffff" : "#4b5563"}
            />
            <span className="mt-1 text-xs" style={{ color: isDarkTheme ? "#e2e8f0" : "#4b5563" }}>
              Favorito
            </span>
          </button>

          <button
            onClick={() => {
              onShare()
              onClose()
            }}
            className={`flex flex-col items-center justify-center rounded-lg p-3 ${
              isDarkTheme ? "hover:bg-[#151525]" : "hover:bg-gray-100"
            }`}
          >
            <Share2 size={24} color={isDarkTheme ? "#ffffff" : "#4b5563"} />
            <span className="mt-1 text-xs" style={{ color: isDarkTheme ? "#e2e8f0" : "#4b5563" }}>
              Compartilhar
            </span>
          </button>

          <button
            onClick={() => {
              onDownload()
              onClose()
            }}
            className={`flex flex-col items-center justify-center rounded-lg p-3 ${
              isDarkTheme ? "hover:bg-[#151525]" : "hover:bg-gray-100"
            }`}
          >
            <Download size={24} color={isDarkTheme ? "#ffffff" : "#4b5563"} />
            <span className="mt-1 text-xs" style={{ color: isDarkTheme ? "#e2e8f0" : "#4b5563" }}>
              Download
            </span>
          </button>

          <button
            onClick={() => {
              onPrint()
              onClose()
            }}
            className={`flex flex-col items-center justify-center rounded-lg p-3 ${
              isDarkTheme ? "hover:bg-[#151525]" : "hover:bg-gray-100"
            }`}
          >
            <Printer size={24} color={isDarkTheme ? "#ffffff" : "#4b5563"} />
            <span className="mt-1 text-xs" style={{ color: isDarkTheme ? "#e2e8f0" : "#4b5563" }}>
              Imprimir
            </span>
          </button>

          <button
            onClick={() => {
              onFullScreen()
              onClose()
            }}
            className={`flex flex-col items-center justify-center rounded-lg p-3 ${
              isDarkTheme ? "hover:bg-[#151525]" : "hover:bg-gray-100"
            }`}
          >
            <Maximize2 size={24} color={isDarkTheme ? "#ffffff" : "#4b5563"} />
            <span className="mt-1 text-xs" style={{ color: isDarkTheme ? "#e2e8f0" : "#4b5563" }}>
              Tela cheia
            </span>
          </button>

          {onToggleBookmark && (
            <button
              onClick={() => {
                onToggleBookmark()
                onClose()
              }}
              className={`flex flex-col items-center justify-center rounded-lg p-3 ${
                isDarkTheme ? "hover:bg-[#151525]" : "hover:bg-gray-100"
              }`}
            >
              <Bookmark size={24} color={isDarkTheme ? "#ffffff" : "#4b5563"} />
              <span className="mt-1 text-xs" style={{ color: isDarkTheme ? "#e2e8f0" : "#4b5563" }}>
                Marcador
              </span>
            </button>
          )}

          {onRotate && (
            <button
              onClick={() => {
                onRotate()
                onClose()
              }}
              className={`flex flex-col items-center justify-center rounded-lg p-3 ${
                isDarkTheme ? "hover:bg-[#151525]" : "hover:bg-gray-100"
              }`}
            >
              <RotateCw size={24} color={isDarkTheme ? "#ffffff" : "#4b5563"} />
              <span className="mt-1 text-xs" style={{ color: isDarkTheme ? "#e2e8f0" : "#4b5563" }}>
                Girar
              </span>
            </button>
          )}

          {onToggleSidebar && (
            <button
              onClick={() => {
                onToggleSidebar()
                onClose()
              }}
              className={`flex flex-col items-center justify-center rounded-lg p-3 ${
                isDarkTheme ? "hover:bg-[#151525]" : "hover:bg-gray-100"
              }`}
            >
              <Layers size={24} color={isDarkTheme ? "#ffffff" : "#4b5563"} />
              <span className="mt-1 text-xs" style={{ color: isDarkTheme ? "#e2e8f0" : "#4b5563" }}>
                Miniaturas
              </span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
