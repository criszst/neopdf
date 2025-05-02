"use client"

import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Loader2 } from 'lucide-react'
import { useMediaQuery } from "@/hooks/use-media-query"
import { motion } from "framer-motion"

interface ThumbnailsProps {
  pdfUrl: string
  currentPage: number
  numPages: number
  onPageClick: (page: number) => void
  isDarkTheme?: boolean
}

export default function Thumbnails({ pdfUrl, currentPage, numPages, onPageClick, isDarkTheme = true }: ThumbnailsProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useMediaQuery("(max-width: 1024px)")

  useEffect(() => {
    // Ensure the PDF.js worker is set up
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
    }
  }, [])

  function onDocumentLoadSuccess() {
    setLoading(false)
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF thumbnails:", error)
    setError("Não foi possível carregar as miniaturas.")
    setLoading(false)
  }

  // Calculate thumbnail width based on screen size
  const getThumbnailWidth = () => {
    if (isMobile) return 0
    if (isSmallScreen) return 120
    return 150
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  const thumbnailVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.1 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  }

  const bgColor = isDarkTheme ? "#151525" : "#f8f9fa"
  const textColor = isDarkTheme ? "#fff" : "#333"
  const accentColor = "#8B5CF6"

  return (
    <div className="h-full w-full overflow-y-auto p-2" style={{ backgroundColor: bgColor }}>
      <h3 className="mb-3 px-2 text-xs font-medium" style={{ color: accentColor }}>Páginas</h3>

      {loading && (
        <div className="flex h-20 items-center justify-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
          >
            <Loader2 className="h-5 w-5" style={{ color: accentColor }} />
          </motion.div>
        </div>
      )}

      <div className={`${isMobile ? "flex flex-row overflow-x-auto pb-2 gap-2" : "space-y-2"}`}>
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} loading={null}>
          {Array.from(new Array(numPages), (_, index) => (
            <motion.div
              key={`thumbnail-${index + 1}`}
              className={`${isMobile ? "flex-shrink-0" : "block"} cursor-pointer overflow-hidden rounded-md transition-all ${
                currentPage === index + 1
                  ? "ring-2 ring-purple-500 ring-offset-2"
                  : "hover:ring-1 hover:ring-purple-400 hover:ring-offset-1"
              }`}

              onClick={() => onPageClick(index + 1)}
              variants={thumbnailVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
            >
              <Page
                pageNumber={index + 1}
                width={getThumbnailWidth()}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="thumbnail-page"
                loading={
                  <div
                    className={`flex items-center justify-center ${
                      isMobile ? "h-[100px] w-[80px]" : "h-[150px] w-[100px]"
                    }`}
                    style={{ backgroundColor: isDarkTheme ? "#0f0423" : "#eee" }}
                  >
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                      }}
                    >
                      <Loader2 className="h-4 w-4" style={{ color: accentColor }} />
                    </motion.div>
                  </div>
                }
              />
              <div className="py-1 text-center text-xs" style={{ backgroundColor: isDarkTheme ? "#0f0423" : "#eee", color: accentColor }}>{index + 1}</div>
            </motion.div>
          ))}
        </Document>
      </div>

      <style jsx global>{`
        .thumbnail-page {
          margin: 0 !important;
        }
        .thumbnail-page .react-pdf__Page__canvas {
          width: 100% !important;
          height: auto !important;
          border-radius: 4px 4px 0 0;
        }
      `}</style>
    </div>
  )
}
