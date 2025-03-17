"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "next-auth"
import { ArrowLeft, Star, Share, Download, FileText, Calendar, Layers, Menu, X } from "lucide-react"

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
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(!isMobile)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#111827] to-[#0f172a] text-white">
      <div className="border-b border-zinc-800/50 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 rounded-md bg-purple-600/20 px-3 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-600/30"
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-purple-600/30 to-purple-800/30 ring-2 ring-purple-500/20">
            {user?.image ? (
              <Image
                src={user.image || "/placeholder.svg"}
                alt={user.name || "User"}
                className="h-full w-full object-cover"
                width={48}
                height={48}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-medium text-white">
                {user?.name?.[0] || "U"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="truncate text-sm font-medium text-white">{user?.name}</h2>
            <p className="truncate text-xs text-zinc-400">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-zinc-800/50 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-medium text-zinc-400">
          <FileText size={14} className="text-purple-400" />
          Informações do Documento
        </h3>
        {pdf ? (
          <div className="space-y-2">
            <p className="truncate text-sm font-medium text-white">{pdf.name}</p>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Calendar size={12} className="text-zinc-500" />
              <span>Enviado em: {new Date(pdf.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Layers size={12} className="text-zinc-500" />
              <span>Páginas: {numPages || "..."}</span>
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-zinc-800/50 p-3 text-xs text-zinc-400">Carregando informações...</div>
        )}
      </div>

      <div className="border-b border-zinc-800/50 p-4">
        <div className="flex justify-between">
          <button
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              isStarred
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-yellow-300"
            }`}
            onClick={onToggleStar}
          >
            <Star size={14} fill={isStarred ? "currentColor" : "none"} />
            {isStarred ? "Favorito" : "Favoritar"}
          </button>

          <button
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-pink-300"
            onClick={onShare}
          >
            <Share size={14} />
            Compartilhar
          </button>

          <button
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-green-300"
            onClick={onDownload}
          >
            <Download size={14} />
            Baixar
          </button>
        </div>
      </div>

      <div className="border-b border-zinc-800/50 p-4">
        <h3 className="mb-3 text-xs font-medium text-zinc-400">Personalização</h3>
        <div>
          <p className="mb-2 text-xs text-zinc-500">Cor de Fundo</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onChangeBackground("#1e1e2e")}
              className="h-8 w-8 rounded-full border-2 border-zinc-700 bg-[#1e1e2e] transition-transform hover:scale-110 hover:border-purple-500"
              aria-label="Cor de fundo roxo escuro"
            />
            <button
              onClick={() => onChangeBackground("#1f2937")}
              className="h-8 w-8 rounded-full border-2 border-zinc-700 bg-zinc-800 transition-transform hover:scale-110 hover:border-purple-500"
              aria-label="Cor de fundo cinza escuro"
            />
            <button
              onClick={() => onChangeBackground("#111827")}
              className="h-8 w-8 rounded-full border-2 border-zinc-700 bg-[#111827] transition-transform hover:scale-110 hover:border-purple-500"
              aria-label="Cor de fundo azul escuro"
            />
            <button
              onClick={() => onChangeBackground("#374151")}
              className="h-8 w-8 rounded-full border-2 border-zinc-700 bg-zinc-700 transition-transform hover:scale-110 hover:border-purple-500"
              aria-label="Cor de fundo cinza médio"
            />
            <button
              onClick={() => onChangeBackground("#4f46e5")}
              className="h-8 w-8 rounded-full border-2 border-indigo-500 bg-indigo-600 transition-transform hover:scale-110 hover:border-purple-500"
              aria-label="Cor de fundo índigo"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-zinc-800/50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            <p className="font-medium text-purple-400">NeoPDF</p>
            <p>Versão 2.0</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/20">
            <FileText size={14} className="text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-30 rounded-full bg-purple-600/90 p-2 text-white shadow-lg"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar Desktop */}
      {!isMobile && <div className="h-full w-80 flex-shrink-0 overflow-y-auto">{sidebarContent}</div>}

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
                className="fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto"
              >
                {sidebarContent}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  )
}

