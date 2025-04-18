"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, ExternalLink, Trash2, MoreHorizontal, Star, Clock, Calendar, FileText } from "lucide-react"
import type Pdf from "@/lib/props/PdfProps"
import Image from "next/image"

interface PDFListProps {
  pdfs: Pdf[]
  onDelete: (id: string) => void
  viewMode?: "grid" | "list"
}

const PDFList: React.FC<PDFListProps> = ({ pdfs, onDelete, viewMode = "grid" }) => {
  const [hoveredPdf, setHoveredPdf] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {pdfs.map((pdf, index) => (
            <motion.div
              key={pdf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-[#1A1A2E] rounded-lg border border-purple-900/20 overflow-hidden hover:border-purple-500/30 transition-all duration-200 group shadow-lg"
              onMouseEnter={() => setHoveredPdf(pdf.id)}
              onMouseLeave={() => setHoveredPdf(null)}
            >
              <div className="relative aspect-[4/3] bg-[#0A0118] flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  {/* <Image src={pdf.} alt={pdf.name} width={500} height={500} /> */}
                  <FileText size={48} className="text-purple-500/30" />
                </motion.div>

                {/* Hover overlay */}
                <AnimatePresence>
                  {hoveredPdf === pdf.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3"
                    >
                      <motion.a
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        href={`/pdf/${pdf.id}`}
                        className="p-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-full transition-colors"
                        title="Abrir PDF"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ExternalLink size={20} />
                      </motion.a>
                      <motion.a
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        href={pdf.url}
                        download
                        className="p-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-full transition-colors"
                        title="Download PDF"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Download size={20} />
                      </motion.a>
                      <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => onDelete(pdf.id)}
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full transition-colors"
                        title="Excluir PDF"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-4">
                <h3
                  className="font-medium text-white truncate w-full max-w-full group-hover:text-purple-400 transition-colors"
                  title={pdf.name}
                >
                  {pdf.name}
                </h3>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-white/50">
                    <Calendar size={12} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{pdf.createdAt ? formatDate(pdf.createdAt) : "Recente"}</span>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.2, color: "#F59E0B" }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white/50 hover:text-yellow-400 transition-colors"
                    >
                      <Star size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2, color: "#8B5CF6" }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white/50 hover:text-purple-400 transition-colors"
                    >
                      <MoreHorizontal size={14} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {pdfs.map((pdf, index) => (
          <motion.div
            key={pdf.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 bg-[#1A1A2E] hover:bg-[#251539] rounded-lg transition-colors flex items-center justify-between group shadow-md border border-purple-900/20 hover:border-purple-500/30"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-[#0A0118] flex items-center justify-center flex-shrink-0">
                <motion.div
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <FileText size={20} className="text-purple-400" />
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-medium text-white truncate max-w-full group-hover:text-purple-400 transition-colors"
                  title={pdf.name}
                >
                  {pdf.name}
                </h3>
                <div className="flex items-center text-xs text-white/50 mt-1">
                  <Clock size={12} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{pdf.createdAt ? formatDate(pdf.createdAt) : "Recentemente enviado"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <motion.a
                whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                whileTap={{ scale: 0.9 }}
                href={`/pdf/${pdf.id}`}
                className="p-2 text-white/50 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-colors"
                title="Abrir PDF"
              >
                <ExternalLink size={16} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                whileTap={{ scale: 0.9 }}
                href={pdf.url}
                download
                className="p-2 text-white/50 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-colors"
                title="Download PDF"
              >
                <Download size={16} />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(pdf.id)}
                className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                title="Excluir PDF"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default PDFList
