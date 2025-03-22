"use client"

import type React from "react"
import { Download, ExternalLink, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PDF {
  id: string
  name: string
  url: string
  createdAt?: string
}

interface PDFListProps {
  pdfs: PDF[]
  onDelete: (id: string) => void
  viewMode: "grid" | "list"; 
}

const PDFList: React.FC<PDFListProps> = ({ pdfs, onDelete }) => {
  const handleDelete = (id: string) => {
    onDelete(id)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {pdfs.map((pdf) => (
          <motion.div
            key={pdf.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
            layout
            className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate" title={pdf.name}>
                {pdf.name}
              </h3>
              <p className="text-xs text-white/60 mt-1">
                {pdf.createdAt ? new Date(pdf.createdAt).toLocaleString() : "Recently uploaded"}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={`/pdf/${pdf.id}`}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Open PDF"
              >
                <ExternalLink size={16} />
              </a>
              <a
                href={pdf.url}
                download
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Download PDF"
              >
                <Download size={16} />
              </a>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDelete(pdf.id)}
                className="p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
                title="Delete PDF"
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
