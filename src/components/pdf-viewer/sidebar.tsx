"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "next-auth"
import { Star, FileText, Menu, X, Download, Share2 } from "lucide-react"
import FileUpload from "../animations/FileUpload"
import PdfGalleryModal from "@/components/pdf-viewer/pdfGallery"
import type Pdf from "@/lib/props/PdfProps"
import Link from "next/link"

interface SidebarProps {
  user: User | null
  pdf: {
    id: string
    name: string
    createdAt: string
    isStarred: boolean
  } | null
  numPages: number | null
  isStarred: boolean
  onToggleStar: () => void
  onShare: () => void
  onDownload: () => void
  onBackToDashboard: () => void
  onChangeBackground: (color: string) => void
  isMobile: boolean
  onSelectPdf?: (pdf: Pdf) => void
}

export default function Sidebar({
  user,
  pdf,
  numPages,
  isStarred,
  onToggleStar,
  onShare,
  onDownload,
  onBackToDashboard,
  onChangeBackground,
  isMobile,
  onSelectPdf = () => {},
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(!isMobile)
  const [showPdfGallery, setShowPdfGallery] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleToggleStar = (id: string) => {
    if (pdf && pdf.id === id) {
      onToggleStar()
    }
  }

  const handleDownload = (id: string) => {
    if (pdf && pdf.id === id) {
      onDownload()
    }
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#111827] to-[#0f172a] text-white">
      {/* Header with logo */}
      <div className="flex items-center gap-2 border-b border-zinc-800/50 p-4">
        <div className="flex items-center">
          <div className="text-purple-400">
            <FileText size={24} className="mr-2" />
          </div>
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">NeoPDF</span>
          </div>
        </div>

        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="ml-auto rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* All PDFs button */}
      <div className="p-3">
        <button
          onClick={() => setShowPdfGallery(true)}
          className="w-full rounded-md bg-purple-600/20 p-3 text-center text-sm font-medium text-white transition-colors hover:bg-purple-600/30"
        >
          Todos os PDFs
        </button>
      </div>

      {/* New section */}
      <div className="p-3">
        <h3 className="mb-2 px-2 text-sm font-medium text-white">Novo PDF</h3>
        <div className="flex mb-2">
          <FileUpload className="w-[100%] h-[50%]" showLabel={false} />
        </div>
      </div>

      {/* Favorites section */}
      <div className="p-3">
        <h3 className="mb-2 flex items-center gap-2 px-2 text-sm font-medium text-zinc-400">
          <Star size={16} className="text-purple-400" />
          Favoritos
        </h3>
        <div className="space-y-2">
          <button
            className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm text-white transition-colors hover:bg-purple-600/20"
            onClick={onToggleStar}
          >
            <FileText size={16} className="text-orange-400" />
            PDF
          </button>
        </div>
      </div>

      {/* Resumir PDF/Doc section */}
      <div className="p-3">
        <h3 className="mb-2 px-2 text-sm font-medium text-zinc-400">Resumir PDF/Doc</h3>
        <div className="space-y-2">
          <button className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm text-white transition-colors hover:bg-purple-600/20">
            <FileText size={16} className="text-orange-400" />
            PDF
          </button>
          <button className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm text-white transition-colors hover:bg-purple-600/20">
            <FileText size={16} className="text-blue-400" />
            Documento
          </button>
          <button className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm text-white transition-colors hover:bg-purple-600/20">
            <FileText size={16} className="text-teal-400" />
            Artigo Científico
          </button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="mb-2 px-2 text-sm font-medium text-zinc-400">Opções</h3>
        <div className="space-y-2">
          <Link href="/dashboard">
            <button className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm text-white transition-colors hover:bg-purple-600/20">
              <Menu size={16} className="text-orange-400" />
              Voltar para o Dashboard
            </button>
          </Link>
        </div>
      </div>

      {pdf && (
        <div className="mt-auto border-t border-zinc-800/50 p-4">
          <h3 className="mb-2 text-xs font-medium text-zinc-400">Documento Atual</h3>
          <div className="rounded-md bg-purple-600/10 p-3">
            <p className="mb-1 truncate text-sm font-medium text-white">{pdf.name}</p>
            <p className="text-xs text-zinc-400">Páginas: {numPages || "..."}</p>
          </div>

          <div className="mt-3 flex justify-between gap-3">
            <button
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isStarred
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-purple-300"
              }`}
              onClick={onToggleStar}
            >
              <Star size={14} fill={isStarred ? "currentColor" : "none"} />
              {isStarred ? "Favorito" : "Favoritar"}
            </button>

            <button
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-purple-300"
              onClick={onDownload}
            >
              <Download size={14} className="hidden sm:block" />
              Baixar
            </button>

            <button
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-purple-300"
              onClick={onShare}
            >
              <Share2 size={14} className="hidden sm:block" />
              Compartilhar
            </button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile toggle button - Improved positioning */}
      {isMobile && !isOpen && (
        <div className="fixed top-0 left-0 z-30 p-2 bg-gradient-to-r from-[#111827]/90 to-transparent">
          <button
            onClick={toggleSidebar}
            className="rounded-md bg-purple-600/90 p-1.5 text-white shadow-lg hover:bg-purple-700/90 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
        </div>
      )}

      {/* Sidebar Desktop */}
      {!isMobile && <div className="h-full w-72 flex-shrink-0 overflow-y-auto">{sidebarContent}</div>}

      {/* Sidebar Mobile */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={toggleSidebar}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto"
              >
                {sidebarContent}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* PDF Gallery Modal */}
      <PdfGalleryModal
        isOpen={showPdfGallery}
        onClose={() => setShowPdfGallery(false)}
        onSelectPdf={(selectedPdf) => {
          onSelectPdf(selectedPdf)
          setShowPdfGallery(false)
        }}
        onToggleStar={handleToggleStar}
        onDownload={handleDownload}
      />
    </>
  )
}

