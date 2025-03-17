"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import type { User } from "next-auth"
import { Document, Page, pdfjs } from "react-pdf"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, RotateCw } from 'lucide-react'
import PageLoading from "@/components/ui/page-loading"

import Sidebar from "@/components/pdf-viewer/sidebar"
import Controls from "@/components/pdf-viewer/controls"
import ToastComponent from "@/components/ui/toast"

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
  const [bgColor, setBgColor] = useState("#1e1e2e")
  const [user, setUser] = useState<User | null>(null)
  const [isStarred, setIsStarred] = useState(false)
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

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setDocumentLoading(false)
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

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
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
      const printWindow = window.open(pdf.s3Url, '_blank')
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print()
        })
      }
    }
  }

  if (loading) {
    return <PageLoading />
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0e0525] to-[#1a0f24] text-white">
        <div className="mb-6 rounded-full bg-red-500/20 p-4">
          <Loader2 size={32} className="animate-spin text-red-400" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">Erro ao carregar o PDF</h2>
        <div className="mb-6 text-center text-red-400">{error}</div>
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
        >
          Voltar ao Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-[#0e0525] text-white">
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
        <div className="flex flex-1 flex-col">
          {/* PDF Viewer */}
          <div
            ref={containerRef}
            className="relative flex flex-1 items-center justify-center overflow-auto transition-colors duration-300"
            style={{ backgroundColor: bgColor }}
          >
            {documentLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <Loader2 size={40} className="mb-4 animate-spin text-purple-400" />
                  <p className="text-white">Carregando documento...</p>
                </div>
              </div>
            )}

            {/* Custom container for PDF */}
            {pdf && (
              <div className="pdf-container my-4">
                <Document
                  file={pdf.s3Url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={null}
                  className="pdf-document"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-2xl"
                    loading={
                      <div className="flex h-[600px] w-[400px] items-center justify-center rounded-lg bg-zinc-800/50">
                        <Loader2 size={32} className="animate-spin text-purple-400" />
                      </div>
                    }
                  />
                </Document>
              </div>
            )}

            {/* Custom style for PDF via CSS-in-JS */}
            <style jsx global>{`
              .pdf-container {
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                transition: transform 0.3s ease;
              }
              
              .pdf-document {
                display: flex;
                justify-content: center;
              }
              
              .react-pdf__Page {
                margin: 0 auto;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
              }
              
              .react-pdf__Page__canvas {
                border-radius: 8px;
                display: block !important;
              }
              
              @media (max-width: 640px) {
                .pdf-container {
                  padding: 10px;
                }
              }
            `}</style>
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
