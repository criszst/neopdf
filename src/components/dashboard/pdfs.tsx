"use client"

import type React from "react"
import { Download, ExternalLink, Trash2 } from "lucide-react"

interface PDF {
  id: string
  name: string
  url: string
  createdAt?: string
}

interface PDFListProps {
  pdfs: PDF[]
  onDelete: (id: string) => void
}

const PDFList: React.FC<PDFListProps> = ({ pdfs, onDelete }) => {
  const handleDelete = (id: string) => {
    onDelete(id)
  }

  return (
    <div>
      {pdfs.map((pdf) => (
        <div
          key={pdf.id}
          className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between"
        >
          <div>
            <h3 className="font-medium truncate max-w-xs" title={pdf.name}>
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
            <button
              onClick={() => handleDelete(pdf.id)}
              className="p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
              title="Delete PDF"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PDFList

