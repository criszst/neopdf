"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Grid, List, Filter, ChevronDown, FileText, Star, Download, Calendar, Eye } from "lucide-react"
import type Pdf from "@/lib/props/PdfProps"
import { useRouter } from "next/navigation"

interface PdfGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPdf: (pdf: Pdf) => void
  onToggleStar: (id: string) => void
  onDownload: (id: string) => void
  initialPdfs?: Pdf[]
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
  const router = useRouter()

  const fetchPDFs = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch("/api/pdf")
      if (!res.ok) throw new Error("Failed to fetch PDFs")
      const data = await res.json()

      const mappedData = data.map((pdf: any) => ({
        ...pdf,
        url: pdf.s3Url || `#pdf-${pdf.id}`,
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

  useEffect(() => {
    if (isOpen) {
      fetchPDFs()
    }
  }, [isOpen])

  useEffect(() => {
    let result = [...pdfs]

    if (searchTerm) {
      result = result.filter((pdf) => pdf.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    result.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
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

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isOpen, onClose])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Desconhecido"

    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handlePdfClick = (pdf: Pdf) => {
    onClose()
    router.push(`/pdf/${pdf.id}`)
  }

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  }

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.9, transition: { duration: 0.1 } },
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
            className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl bg-gradient-to-b from-[#0e0525] to-[#1a0f24] shadow-xl border border-purple-900/20"
          >
            {/* Header */}
            <div className="border-b border-purple-900/20 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Todos os PDFs</h2>
                <motion.button
                  onClick={onClose}
                  className="rounded-full p-2 text-purple-300/70 transition-colors hover:bg-purple-500/10 hover:text-white"
                  aria-label="Fechar"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Search and filters */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300/70" />
                  <input
                    type="text"
                    placeholder="Buscar PDFs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg bg-[#151823]/90 py-2 pl-9 pr-3 text-sm text-white placeholder-purple-300/50 outline-none focus:ring-1 focus:ring-purple-500 border border-purple-900/20"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#151823]/90 rounded-lg p-1 border border-purple-900/20">
                    <motion.button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-purple-600/30 text-purple-400" : "text-purple-300/70 hover:text-white"}`}
                      aria-label="Visualização em grade"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Grid size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-purple-600/30 text-purple-400" : "text-purple-300/70 hover:text-white"}`}
                      aria-label="Visualização em lista"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <List size={18} />
                    </motion.button>
                  </div>

                  <div className="relative group">
                    <motion.button
                      className="flex items-center gap-2 bg-[#151823]/90 text-purple-300/70 hover:text-white px-3 py-1.5 rounded-lg text-sm border border-purple-900/20"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Filter size={16} />
                      <span>Ordenar</span>
                      <ChevronDown size={14} />
                    </motion.button>

                    <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-lg bg-[#151823]/90 p-1 shadow-lg group-hover:block z-10 border border-purple-900/20">
                      {/* Sort buttons */}
                      {[
                        { id: "name", label: "Nome" },
                        { id: "date", label: "Data" },
                        { id: "views", label: "Visualizações" },
                      ].map((sortOption) => (
                        <motion.button
                          key={sortOption.id}
                          onClick={() => {
                            setSortBy(sortOption.id as "name" | "date" | "views")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                          className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${sortBy === sortOption.id ? "bg-purple-600/30 text-purple-300" : "text-white hover:bg-purple-500/10"}`}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <span>{sortOption.label}</span>
                          {sortBy === sortOption.id && (
                            <span className="ml-auto">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Gallery */}
            <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(90vh - 140px)" }}>
              {isLoading ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-[#151823]/90 p-6 text-center border border-purple-900/20">
                  <motion.div
                    className="h-8 w-8 rounded-full border-2 border-purple-500 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <p className="mt-4 text-sm text-purple-300/70">Carregando PDFs...</p>
                </div>
              ) : error ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-[#151823]/90 p-6 text-center border border-purple-900/20">
                  <p className="text-lg font-medium text-red-400">{error}</p>
                  <motion.button
                    onClick={() => fetchPDFs()}
                    className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Tentar novamente
                  </motion.button>
                </div>
              ) : filteredPdfs.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-[#151823]/90 p-6 text-center border border-purple-900/20">
                  <FileText size={40} className="mb-2 text-purple-500/30" />
                  <p className="text-lg font-medium text-purple-300/70">Nenhum PDF encontrado</p>
                  <p className="text-sm text-purple-300/50">Tente ajustar sua busca ou filtros</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredPdfs.map((pdf) => (
                    <div key={pdf.id} className="cursor-pointer sm:block">
                      <motion.div
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        whileTap="tap"
                        className="group overflow-hidden rounded-lg bg-[#151823]/90 transition-all border border-purple-900/20"
                      >
                        <div
                          className="relative aspect-[3/4] bg-gradient-to-br from-purple-900/30 to-purple-700/10 cursor-pointer"
                          onClick={() => handlePdfClick(pdf)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.7, 0.9, 0.7],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            >
                              <FileText size={48} className="text-purple-400" />
                            </motion.div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <h3 className="truncate text-sm font-medium text-white">{pdf.name}</h3>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-1 text-xs text-purple-300/70">
                              <Calendar size={12} />
                              {formatDate(pdf.createdAt)}
                            </span>
                            <div className="flex items-center gap-1">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onToggleStar(pdf.id)
                                }}
                                className={`rounded-full p-1 ${pdf.isStarred ? "text-yellow-400" : "text-purple-300/50 hover:text-yellow-400"}`}
                                aria-label={pdf.isStarred ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                              >
                                <Star size={14} fill={pdf.isStarred ? "currentColor" : "none"} />
                              </motion.button>
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDownload(pdf.id)
                                }}
                                className="rounded-full p-1 text-purple-300/50 hover:text-purple-400"
                                aria-label="Baixar PDF"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                              >
                                <Download size={14} />
                              </motion.button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-purple-300/50">
                            <span className="flex items-center gap-1">
                              <Eye size={12} />
                              {pdf.viewCount || 0} visualizações
                            </span>
                            <span>{formatFileSize(pdf.fileSize)}</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-purple-900/20 rounded-lg bg-[#151823]/90 border border-purple-900/20">
                  {filteredPdfs.map((pdf) => (
                    <div key={pdf.id} className="cursor-pointer">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="group flex items-center gap-3 p-3 hover:bg-purple-500/10"
                        onClick={() => handlePdfClick(pdf)}
                        whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                      >
                        <motion.div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-purple-900/20 border border-purple-900/30"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.3)" }}
                        >
                          <FileText size={20} className="text-purple-400" />
                        </motion.div>
                        <div className="min-w-0 flex-1 cursor-pointer">
                          <h3 className="truncate text-sm font-medium text-white">{pdf.name}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center gap-1 text-xs text-purple-300/70">
                              <Calendar size={12} />
                              {formatDate(pdf.createdAt)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-purple-300/70">
                              <Eye size={12} />
                              {pdf.viewCount || 0} visualizações
                            </span>
                            <span className="text-xs text-purple-300/70">{formatFileSize(pdf.fileSize)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              onToggleStar(pdf.id)
                            }}
                            className={`rounded-full p-1.5 ${pdf.isStarred ? "text-yellow-400" : "text-purple-300/50 hover:text-yellow-400"}`}
                            aria-label={pdf.isStarred ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Star size={16} fill={pdf.isStarred ? "currentColor" : "none"} />
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDownload(pdf.id)
                            }}
                            className="rounded-full p-1.5 text-purple-300/50 hover:text-purple-400"
                            aria-label="Baixar PDF"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Download size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
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

