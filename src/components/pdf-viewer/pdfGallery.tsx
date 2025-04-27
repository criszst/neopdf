"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Star, Download, FileText } from "lucide-react"
import type Pdf from "@/lib/props/PdfProps"
import { theme } from "@/lib/colors/theme-config"

interface PdfGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPdf: (pdf: Pdf) => void
  onToggleStar: (id: string) => void
  onDownload: (id: string) => void
}

export default function PdfGalleryModal({
  isOpen,
  onClose,
  onSelectPdf,
  onToggleStar,
  onDownload,
}: PdfGalleryModalProps) {
  const [pdfs, setPdfs] = useState<Pdf[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "starred">("all")

  useEffect(() => {
    if (isOpen) {
      fetchPdfs()
    }
  }, [isOpen])

  const fetchPdfs = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/pdf")
      if (!res.ok) throw new Error("Failed to fetch PDFs")
      const data = await res.json()
      setPdfs(data)
    } catch (error) {
      console.error("Error fetching PDFs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStar = async (id: string) => {
    // Optimistic update
    setPdfs((prev) => prev.map((pdf) => (pdf.id === id ? { ...pdf, isStarred: !pdf.isStarred } : pdf)))

    onToggleStar(id)
  }

  const filteredPdfs = pdfs
    .filter((pdf) => {
      if (filter === "starred") return pdf.isStarred
      return true
    })
    .filter((pdf) => pdf.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: "rgba(10, 1, 24, 0.7)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative mx-4 max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg shadow-xl"
            style={{ backgroundColor: theme.colors.background.tertiary }}
          >
            <div
              className="flex items-center justify-between border-b p-4"
              style={{ borderColor: theme.colors.border.primary }}
            >
              <h2 className="text-lg font-medium" style={{ color: theme.colors.text.primary }}>
                Todos os PDFs
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-opacity-20"
                style={{ color: theme.colors.text.secondary, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="border-b p-4" style={{ borderColor: theme.colors.border.primary }}>
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: theme.colors.text.muted }}
                />
                <input
                  type="text"
                  placeholder="Buscar PDFs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1"
                  style={{
                    backgroundColor: theme.colors.background.secondary,
                    borderColor: theme.colors.border.primary,
                    color: theme.colors.text.primary,
                  }}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-md px-3 py-1 text-sm`}
                  style={{
                    backgroundColor: filter === "all" ? `rgba(139, 92, 246, 0.2)` : theme.colors.background.secondary,
                    color: filter === "all" ? theme.colors.purple.primary : theme.colors.text.secondary,
                  }}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilter("starred")}
                  className={`rounded-md px-3 py-1 text-sm`}
                  style={{
                    backgroundColor:
                      filter === "starred" ? `rgba(139, 92, 246, 0.2)` : theme.colors.background.secondary,
                    color: filter === "starred" ? theme.colors.purple.primary : theme.colors.text.secondary,
                  }}
                >
                  Favoritos
                </button>
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-4">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <FileText className="h-8 w-8" style={{ color: theme.colors.purple.light }} />
                  </motion.div>
                </div>
              ) : filteredPdfs.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-center">
                  <FileText className="mb-2 h-10 w-10" style={{ color: `rgba(139, 92, 246, 0.3)` }} />
                  <p style={{ color: theme.colors.text.muted }}>
                    {searchTerm
                      ? "Nenhum PDF encontrado para sua busca"
                      : filter === "starred"
                        ? "Você não tem PDFs favoritos"
                        : "Você não tem PDFs"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {filteredPdfs.map((pdf) => (
                    <motion.div
                      key={pdf.id}
                      whileHover={{ scale: 1.02 }}
                      className="overflow-hidden rounded-lg border shadow-sm"
                      style={{
                        borderColor: theme.colors.border.primary,
                        backgroundColor: theme.colors.background.card,
                      }}
                    >
                      <div
                        className="flex items-center justify-between border-b px-3 py-2"
                        style={{
                          borderColor: theme.colors.border.primary,
                          backgroundColor: `rgba(139, 92, 246, 0.05)`,
                        }}
                      >
                        <div className="truncate text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                          {pdf.name}
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleToggleStar(pdf.id)}
                            className="rounded p-1 hover:bg-opacity-20"
                            style={{
                              color: pdf.isStarred ? "#FCD34D" : theme.colors.text.muted,
                              backgroundColor: pdf.isStarred ? "rgba(252, 211, 77, 0.1)" : "transparent",
                            }}
                          >
                            <Star size={16} fill={pdf.isStarred ? "currentColor" : "none"} />
                          </button>
                          <button
                            onClick={() => onDownload(pdf.id)}
                            className="rounded p-1 hover:bg-opacity-20"
                            style={{
                              color: theme.colors.text.muted,
                              backgroundColor: "transparent",
                            }}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                      <div
                        className="cursor-pointer p-3"
                        onClick={() => {
                          onSelectPdf(pdf)
                          onClose()
                        }}
                      >
                        <div
                          className="mb-2 flex h-24 items-center justify-center rounded"
                          style={{ backgroundColor: theme.colors.background.secondary }}
                        >
                          <FileText className="h-10 w-10" style={{ color: theme.colors.purple.light }} />
                        </div>
                        <div className="text-xs" style={{ color: theme.colors.text.muted }}>
                          {new Date(pdf.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
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
