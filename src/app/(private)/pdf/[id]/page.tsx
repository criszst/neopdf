"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import type { User } from "next-auth"
import { Document, Page, pdfjs } from "react-pdf"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, FileText, List } from "lucide-react"
import PageLoading from "@/components/ui/page-loading"
import PDFLoading from "@/components/pdf-viewer/pdfLoading"

import Sidebar from "@/components/pdf-viewer/sidebar"
import Controls from "@/components/pdf-viewer/controls"
import ToastComponent from "@/components/ui/toast"
import Thumbnails from "@/components/pdf-viewer/thumbnails"

import { useMediaQuery } from "@/hooks/use-media-query"

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDF {
  id: string
  name: string
  s3Url: string
  createdAt: string
  isStarred: boolean
}

export default function PDFViewer() {
  const params = useParams()
  const id = params.id as string
  const [pdf, setPdf] = useState<PDF | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [loading, setLoading] = useState(true)
  const [documentLoading, setDocumentLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState("#0e0525") // Dark background matching dashboard
  const [user, setUser] = useState<User | null>(null)
  const [isStarred, setIsStarred] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [toast, setToast] = useState<{
    show: boolean
    type: "success" | "error" | "info"
    title: string
    message: string
  }>({
    show: false,
    type: "success",
    title: "",
    message: "",
  })

  const isMobile = useMediaQuery("(max-width: 768px)")
  const containerRef = useRef<HTMLDivElement>(null)

  // Track the actual display scale separately from the user-controlled scale
  const [displayScale, setDisplayScale] = useState(1.0)

  const router = useRouter()

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session")
        if (!res.ok) throw new Error("Failed to fetch session")
        const data = await res.json()
        setUser(data?.user || null)

        if (!data?.user) {
          router.push("/login")
          return
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchSession()
  }, [router])

  useEffect(() => {
    async function fetchPDF() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/pdfs/${id}`)

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("PDF não encontrado")
          } else if (res.status === 401 || res.status === 403) {
            throw new Error("Você não tem permissão para visualizar este PDF")
          } else {
            throw new Error("Falha ao buscar o PDF")
          }
        }

        const data = await res.json()
        setPdf(data)
        setIsStarred(data.isStarred)

        // Registrar atividade de visualização
        await fetch("/api/activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "VIEW",
            pdfId: id,
          }),
        })
      } catch (error: any) {
        console.error("Error fetching PDF:", error)
        setError(error.message || "Falha ao carregar o PDF")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPDF()
    }
  }, [id])

  // Update display scale whenever scale or container size changes
  useEffect(() => {
    calculateResponsiveScale()
  }, [scale, isMobile])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setDocumentLoading(false)
    // Calculate initial responsive scale after document loads
    calculateResponsiveScale()
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error)
    setError("Não foi possível carregar o documento.")
    setDocumentLoading(false)
  }

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
  }

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number.parseInt(e.target.value)
    if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page)
    }
  }

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page)
    }
  }

  const handleZoomIn = () => {
    setScale((prev) => {
      const newScale = Math.min(prev + 0.2, 3)
      return newScale
    })
  }

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.2, 0.5)
      return newScale
    })
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleDownload = async () => {
    if (pdf?.s3Url) {
      window.open(pdf.s3Url, "_blank")

      // Registrar atividade de download
      await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "DOWNLOAD",
          pdfId: id,
        }),
      })

      setToast({
        show: true,
        type: "success",
        title: "Download iniciado",
        message: "Seu download começou em uma nova aba.",
      })
    }
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  const handleToggleStar = async () => {
    try {
      const newStarredState = !isStarred
      setIsStarred(newStarredState)

      // Registrar atividade
      await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: newStarredState ? "STAR" : "UNSTAR",
          pdfId: id,
        }),
      })

      // Atualizar no banco de dados
      await fetch(`/api/pdfs/${id}/star`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isStarred: newStarredState,
        }),
      })

      setToast({
        show: true,
        type: "success",
        title: newStarredState ? "Adicionado aos favoritos" : "Removido dos favoritos",
        message: newStarredState
          ? "Este PDF foi adicionado aos seus favoritos."
          : "Este PDF foi removido dos seus favoritos.",
      })
    } catch (error) {
      console.error("Error toggling star:", error)
      setIsStarred(!isStarred) // Reverter em caso de erro

      setToast({
        show: true,
        type: "error",
        title: "Erro",
        message: "Não foi possível atualizar os favoritos. Tente novamente.",
      })
    }
  }

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/pdf/${id}`

      if (navigator.share) {
        await navigator.share({
          title: pdf?.name || "PDF Compartilhado",
          text: "Confira este PDF no NeoPDF",
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)

        setToast({
          show: true,
          type: "success",
          title: "Link copiado",
          message: "O link foi copiado para a área de transferência!",
        })
      }

      // Registrar atividade de compartilhamento
      await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "SHARE",
          pdfId: id,
        }),
      })
    } catch (error) {
      console.error("Error sharing:", error)

      setToast({
        show: true,
        type: "error",
        title: "Erro ao compartilhar",
        message: "Não foi possível compartilhar este PDF. Tente novamente.",
      })
    }
  }

  // Function to change background color
  const changeBackground = (color: string) => {
    setBgColor(color)
  }

  const handlePrint = () => {
    if (pdf?.s3Url) {
      const printWindow = window.open(pdf.s3Url, "_blank")
      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.print()
        })
      }
    }
  }

  // Update the toggleThumbnails function to handle mobile differently
  const toggleThumbnails = () => {
    setShowThumbnails(!showThumbnails)
  }

  // Calculate appropriate scale based on container width
  const calculateResponsiveScale = () => {
    if (!containerRef.current) {
      setDisplayScale(scale)
      return
    }

    const containerWidth = containerRef.current.clientWidth || 0
    let newScale = scale

    if (isMobile) {
      if (containerWidth < 480) newScale = Math.min(scale, 0.6)
      else if (containerWidth < 768) newScale = Math.min(scale, 0.8)
    }

    setDisplayScale(newScale)
  }

  if (loading) {
    return <PageLoading />
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0e0525] to-[#1a0f24] text-white">
        <motion.div
          className="mb-6 rounded-full bg-red-500/20 p-4"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: ["0 0 0 rgba(239, 68, 68, 0)", "0 0 20px rgba(239, 68, 68, 0.3)", "0 0 0 rgba(239, 68, 68, 0)"],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Loader2 size={32} className="animate-spin text-red-400" />
        </motion.div>
        <h2 className="mb-2 text-xl font-bold text-white">Erro ao carregar o PDF</h2>
        <div className="mb-6 text-center text-red-400">{error}</div>
        <motion.button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Voltar ao Dashboard
        </motion.button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-[#0e0525] to-[#1a0f24] text-white overflow-hidden">
      {/* Top toolbar for document title and main actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between border-b border-purple-900/20 bg-[#151823]/90 backdrop-blur-md px-4 py-2"
      >
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-500" />
          <h1 className="truncate text-sm font-medium text-white md:text-base">{pdf?.name || "Documento"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggleThumbnails}
            className={`rounded-md p-1.5 ${
              showThumbnails
                ? "bg-purple-600/30 text-purple-400"
                : "text-gray-400 hover:bg-purple-500/10 hover:text-purple-400"
            }`}
            aria-label="Mostrar miniaturas"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <List size={18} />
          </motion.button>
        </div>
      </motion.div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          user={user}
          pdf={pdf}
          numPages={numPages}
          isStarred={isStarred}
          onToggleStar={handleToggleStar}
          onShare={handleShare}
          onDownload={handleDownload}
          onBackToDashboard={handleBackToDashboard}
          onChangeBackground={changeBackground}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Thumbnails - Mobile (top) */}
          <AnimatePresence>
            {showThumbnails && isMobile && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 120, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full border-b border-purple-900/20 bg-[#151823]/90 backdrop-blur-md"
                style={{ overflowY: "hidden" }}
              >
                <Thumbnails
                  pdfUrl={pdf?.s3Url || ""}
                  currentPage={pageNumber}
                  numPages={numPages || 0}
                  onPageClick={handlePageClick}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-1 overflow-hidden">
            {/* Thumbnails - Desktop (side) */}
            <AnimatePresence>
              {showThumbnails && !isMobile && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 180, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="h-full border-r border-purple-900/20 bg-[#151823]/90 backdrop-blur-md"
                >
                  <Thumbnails
                    pdfUrl={pdf?.s3Url || ""}
                    currentPage={pageNumber}
                    numPages={numPages || 0}
                    onPageClick={handlePageClick}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* PDF Viewer */}
            <div
              ref={containerRef}
              className="relative flex flex-1 items-center justify-center overflow-auto transition-colors duration-300 text-white"
              style={{ backgroundColor: bgColor }}
            >
              {documentLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <PDFLoading />
                </div>
              )}

              {pdf && (
                <motion.div
                  className="pdf-container my-4 mx-auto"
                  style={{ maxWidth: isMobile ? "100%" : "90%" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Document
                    file={pdf.s3Url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                    className="pdf-document"
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={displayScale}
                      rotate={rotation}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-xl"
                      width={isMobile && containerRef.current ? containerRef.current.clientWidth - 30 : undefined}
                      loading={
                        <div className="flex h-[600px] w-full max-w-[400px] items-center justify-center rounded-lg bg-[#151823]/90">
                          <PDFLoading />
                        </div>
                      }
                    />
                  </Document>
                </motion.div>
              )}

              {/* Custom style for PDF via CSS-in-JS */}
              <style jsx global>{`
                .pdf-container {
                  padding: 10px;
                  border-radius: 12px;
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
                  transition: transform 0.3s ease;
                  background: rgba(21, 24, 35, 0.7);
                  backdrop-filter: blur(8px);
                  border: 1px solid rgba(147, 51, 234, 0.2);
                }
                
                .pdf-document {                                       
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100%;
                  width: 100%;
                }
                
                .react-pdf__Page {
                  margin: 0 auto;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
                }
                
                .react-pdf__Page__canvas {
                  border-radius: 8px;
                  display: block !important;
                  max-width: 100% !important;
                  height: auto !important;
                }
                
                @media (max-width: 640px) {
                  .pdf-container {
                    padding: 5px;
                    margin: 5px;
                  }
                  
                  .react-pdf__Page {
                    width: 100% !important;
                  }
                }
              `}</style>
            </div>
          </div>

          {/* Controls */}
          <Controls
            pageNumber={pageNumber}
            numPages={numPages}
            scale={scale}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onPageChange={handlePageChange}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onRotate={handleRotate}
            onPrint={handlePrint}
          />
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast.show && (
          <ToastComponent
            title={toast.title}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

