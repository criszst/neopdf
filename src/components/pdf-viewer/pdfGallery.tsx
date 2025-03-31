"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Grid, List, Filter, ChevronDown, FileText, Star, Download, Clock, Calendar, Eye } from 'lucide-react'
import type Pdf from "@/lib/props/PdfProps"
import Link from "next/link"

interface PdfGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPdf: (pdf: Pdf) => void
  onToggleStar: (id: string) => void
  onDownload: (id: string) => void
  initialPdfs?: Pdf[] // Optional initial PDFs
}

export default function PdfGalleryModal({
  isOpen,
  onClose,
  onSelectPdf,
  onToggleStar,
  onDownload,
  initialPdfs = [],
}: PdfGalleryModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredPdfs, setFilteredPdfs] = useState<Pdf[]>(initialPdfs)
  const [sortBy, setSortBy] = useState<"name" | "date" | "views">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [pdfs, setPdfs] = useState<Pdf[]>(initialPdfs)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch PDFs function
  const fetchPDFs = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch("/api/pdf")
      if (!res.ok) throw new Error("Failed to fetch PDFs")
      const data = await res.json()

      // Map the API response to include the url property
      const mappedData = data.map((pdf: any) => ({
        ...pdf,
        url: pdf.s3Url || `#pdf-${pdf.id}` // Use s3Url as url or fallback to a placeholder
      }))

      setPdfs(mappedData)
      return data
    } catch (error) {
      setError("Error loading PDFs. Please try again.")
      console.error("Error fetching PDFs:", error)
      return
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch PDFs when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPDFs()
    }
  }, [isOpen])

  // Filter and sort PDFs when search term, sort options, or pdfs change
  useEffect(() => {
    let result = [...pdfs]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(pdf =>
        pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      } else if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "views") {
        const aViews = a.viewCount || 0
        const bViews = b.viewCount || 0
        return sortOrder === "asc" ? aViews - bViews : bViews - aViews
      }
      return 0
    })

    setFilteredPdfs(result)
  }, [pdfs, searchTerm, sortBy, sortOrder])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isOpen, onClose])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Desconhecido"

    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl bg-gradient-to-b from-[#111827] to-[#0f172a] shadow-xl"
          >
            {/* Header */}
            <div className="border-b border-zinc-800/50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Todos os PDFs</h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                  aria-label="Fechar"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search and filters */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar PDFs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg bg-zinc-800/50 py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-400 outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-zinc-800/50 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-purple-500/20 text-purple-400" : "text-white/70 hover:text-white"}`}
                      aria-label="Visualização em grade"
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-purple-500/20 text-purple-400" : "text-white/70 hover:text-white"}`}
                      aria-label="Visualização em lista"
                    >
                      <List size={18} />
                    </button>
                  </div>

                  <div className="relative group">
                    <button className="flex items-center gap-2 bg-zinc-800/50 text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-sm">
                      <Filter size={16} />
                      <span>Ordenar</span>
                      <ChevronDown size={14} />
                    </button>

                    <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-lg bg-zinc-800 p-1 shadow-lg group-hover:block z-10">
                      <button
                        onClick={() => {
                          setSortBy("name")
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${sortBy === "name" ? "bg-purple-500/20 text-purple-300" : "text-white hover:bg-zinc-700"}`}
                      >
                        <span>Nome</span>
                        {sortBy === "name" && (
                          <span className="ml-auto">{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSortBy("date")
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${sortBy === "date" ? "bg-purple-500/20 text-purple-300" : "text-white hover:bg-zinc-700"}`}
                      >
                        <span>Data</span>
                        {sortBy === "date" && (
                          <span className="ml-auto">{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSortBy("views")
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${sortBy === "views" ? "bg-purple-500/20 text-purple-300" : "text-white hover:bg-zinc-700"}`}
                      >
                        <span>Visualizações</span>
                        {sortBy === "views" && (
                          <span className="ml-auto">{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Gallery */}
            <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(90vh - 140px)" }}>
              {isLoading ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-zinc-800/30 p-6 text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
                  <p className="mt-4 text-sm text-zinc-400">Carregando PDFs...</p>
                </div>
              ) : error ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-zinc-800/30 p-6 text-center">
                  <p className="text-lg font-medium text-red-400">{error}</p>
                  <button
                    onClick={() => fetchPDFs()}
                    className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : filteredPdfs.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-zinc-800/30 p-6 text-center">
                  <FileText size={40} className="mb-2 text-zinc-500" />
                  <p className="text-lg font-medium text-zinc-400">Nenhum PDF encontrado</p>
                  <p className="text-sm text-zinc-500">Tente ajustar sua busca ou filtros</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredPdfs.map((pdf) => (
                     <Link href={`/pdf/${pdf.id}`} className="cursor-pointer sm:block">
                    <motion.div
                      key={pdf.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="group overflow-hidden rounded-lg bg-zinc-800/50 transition-all hover:bg-zinc-800 hover:shadow-lg"
                    >
                      <div
                        className="relative aspect-[3/4] bg-purple-900/20 cursor-pointer"
                        onClick={() => onSelectPdf(pdf)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FileText size={48} className="text-purple-400/70" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <h3 className="truncate text-sm font-medium text-white">{pdf.name}</h3>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-xs text-zinc-400">
                            <Calendar size={12} />
                            {formatDate(pdf.createdAt)}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onToggleStar(pdf.id)}
                              className={`rounded-full p-1 ${pdf.isStarred ? "text-yellow-400" : "text-zinc-500 hover:text-yellow-400"}`}
                              aria-label={pdf.isStarred ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            >
                              <Star size={14} fill={pdf.isStarred ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={() => onDownload(pdf.id)}
                              className="rounded-full p-1 text-zinc-500 hover:text-purple-400"
                              aria-label="Baixar PDF"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {pdf.viewCount || 0} visualizações
                          </span>
                          <span>{formatFileSize(pdf.fileSize)}</span>
                        </div>
                      </div>
                    </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/50 rounded-lg bg-zinc-800/30">
                  {filteredPdfs.map((pdf) => (
                     <Link href={`/pdf/${pdf.id}`} className="cursor-pointer sm:block">
                    <motion.div
                      key={pdf.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="group flex items-center gap-3 p-3 hover:bg-zinc-800"
                    >
                     
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-purple-900/20"
                        onClick={() => onSelectPdf(pdf)}
                      >
                        <FileText size={20} className="text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onSelectPdf(pdf)}>

                        <h3 className="truncate text-sm font-medium text-white">{pdf.name}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1 text-xs text-zinc-400">
                            <Calendar size={12} />
                            {formatDate(pdf.createdAt)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-zinc-400">
                            <Eye size={12} />
                            {pdf.viewCount || 0} visualizações
                          </span>
                          <span className="text-xs text-zinc-400">{formatFileSize(pdf.fileSize)}</span>
                        </div>

                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleStar(pdf.id)}
                          className={`rounded-full p-1.5 ${pdf.isStarred ? "text-yellow-400" : "text-zinc-500 hover:text-yellow-400"}`}
                          aria-label={pdf.isStarred ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                          <Star size={16} fill={pdf.isStarred ? "currentColor" : "none"} />
                        </button>

                        <button
                          onClick={() => onDownload(pdf.id)}
                          className="rounded-full p-1.5 text-zinc-500 hover:text-purple-400"
                          aria-label="Baixar PDF"
                        >
                          <Download size={16} />
                        </button>

                      </div>


                    </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
