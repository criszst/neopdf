"use client"

import { motion } from "framer-motion"
import { Download, Printer, Maximize2, Star, Share2, Bookmark, RotateCw, X } from 'lucide-react'

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
  isStarred: boolean
  // togglePdfGallery: () => boolean
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
  isStarred,
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
        className="w-full max-w-md rounded-t-xl bg-[#0f0423] p-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Opções</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-[#151525]"
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
            className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-[#151525]"
          >
            <Star size={24} fill={isStarred ? "#FCD34D" : "none"} color={isStarred ? "#FCD34D" : "white"} />
            <span className="mt-1 text-xs">Favorito</span>
          </button>

          <button
            onClick={() => {
              onShare()
              onClose()
            }}
            className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-[#151525]"
          >
            <Share2 size={24} />
            <span className="mt-1 text-xs">Compartilhar</span>
          </button>

          <button
            onClick={() => {
              onDownload()
              onClose()
            }}
            className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-[#151525]"
          >
            <Download size={24} />
            <span className="mt-1 text-xs">Download</span>
          </button>

          <button
            onClick={() => {
              onPrint()
              onClose()
            }}
            className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-[#151525]"
          >
            <Printer size={24} />
            <span className="mt-1 text-xs">Imprimir</span>
          </button>

          <button
            onClick={() => {
              onFullScreen()
              onClose()
            }}
            className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-[#151525]"
          >
            <Maximize2 size={24} />
            <span className="mt-1 text-xs">Tela cheia</span>
          </button>

          {onToggleBookmark && (
            <button
              onClick={() => {
                onToggleBookmark()
                onClose()
              }}
              className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-[#151525]"
            >
              <Bookmark size={24} />
              <span className="mt-1 text-xs">Marcador</span>
            </button>
          )}

          {/* <button
            onClick={() => {
              togglePdfGallery()
              onClose()
            }}
            className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-[#151525]"
          >
            <Bookmark size={24} />
            <span className="mt-1 text-xs">Marcador</span>
          </button> */}

          {onRotate && (
            <button
              onClick={() => {
                onRotate()
                onClose()
              }}
              className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-[#151525]"
            >
              <RotateCw size={24} />
              <span className="mt-1 text-xs">Girar</span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}