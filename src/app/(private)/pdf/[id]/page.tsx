"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import type { User } from "next-auth"
import { AnimatePresence, motion } from "framer-motion"
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Printer,
  ChevronDown,
  Download,
  Star,
  Share2,
  ArrowLeft,
  Grid,
  Menu,
  SearchIcon,
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import ToastComponent from "@/components/ui/toast"
import PDFLoading from "@/components/pdf-viewer/pdfLoading"
import PdfGalleryModal from "@/components/pdf-viewer/pdfGallery"

// Import react-pdf-viewer
import { Viewer, Worker, type SpecialZoomLevel } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation"
import { zoomPlugin } from "@react-pdf-viewer/zoom"
import { searchPlugin } from "@react-pdf-viewer/search"
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen"
import { printPlugin } from "@react-pdf-viewer/print"

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/page-navigation/lib/styles/index.css"
import "@react-pdf-viewer/zoom/lib/styles/index.css"
import "@react-pdf-viewer/search/lib/styles/index.css"
import "@react-pdf-viewer/full-screen/lib/styles/index.css"
import "@react-pdf-viewer/print/lib/styles/index.css"

import { ToolbarPluginProps, ToolbarSlot, type SidebarTab } from "@react-pdf-viewer/default-layout"

// Import theme
import { theme } from "@/lib/colors/theme-config"
import type Pdf from "@/lib/props/PdfProps"

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
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isStarred, setIsStarred] = useState(false)
  const [zoomLevel, setZoomLevel] = useState<number | SpecialZoomLevel>(100)
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
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

  // Initialize plugins
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const zoomPluginInstance = zoomPlugin()
  const searchPluginInstance = searchPlugin()
  const fullScreenPluginInstance = fullScreenPlugin()
  const printPluginInstance = printPlugin()

  // Get plugin functions
  const { jumpToPage } = pageNavigationPluginInstance
  const { Zoom } = zoomPluginInstance
  const { zoomTo } = zoomPluginInstance

  const { EnterFullScreen } = fullScreenPluginInstance
  const { Print } = printPluginInstance

  // Create default layout plugin
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar: (ToolbarPluginProps) => ToolbarPluginProps[0],
  })

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

        const res = await fetch(`/api/pdf/${id}`)

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

  // Handle scroll to hide/show header on mobile
  useEffect(() => {
    if (!isMobile || !containerRef.current) return

    const handleScroll = () => {
      const scrollTop = containerRef.current?.scrollTop || 0
      if (scrollTop > lastScrollTop && scrollTop > 50) {
        setShowHeader(false)
      } else if (scrollTop < lastScrollTop || scrollTop < 10) {
        setShowHeader(true)
      }
      setLastScrollTop(scrollTop)
    }

    const container = containerRef.current
    container.addEventListener("scroll", handleScroll)
    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [isMobile, lastScrollTop])

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number.parseInt(e.target.value, 10)
    if (!isNaN(page) && page > 0 && page <= (numPages || 1)) {
      setCurrentPage(page)
      jumpToPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < (numPages || 1)) {
      setCurrentPage(currentPage + 1)
      jumpToPage(currentPage)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      jumpToPage(currentPage - 2)
    }
  }

  const handleZoomIn = () => {
    if (typeof zoomLevel === "number") {
      const newZoom = Math.min(zoomLevel + 25, 300)
      setZoomLevel(newZoom)
      zoomTo(newZoom / 100)
    } else {
      setZoomLevel(125)
      zoomTo(1.25)
    }
  }

  const handleZoomOut = () => {
    if (typeof zoomLevel === "number") {
      const newZoom = Math.max(zoomLevel - 25, 50)
      setZoomLevel(newZoom)
      zoomTo(newZoom / 100)
    } else {
      setZoomLevel(75)
      zoomTo(0.75)
    }
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
      await fetch(`/api/pdf/${id}/star`, {
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

  const handleOpenGallery = () => {
    setShowGallery(true)
  }

  const handleSelectPdf = (selectedPdf: Pdf) => {
    router.push(`/pdf/${selectedPdf.id}`)
  }

  const handlePrint = () => {
    const printButton = document.querySelector(".rpv-print__popover-toggle-button") as HTMLButtonElement
    if (printButton) {
      printButton.click()
    }
  }

  const handleFullScreen = () => {
    const fullScreenButton = document.querySelector(".rpv-full-screen__popover-toggle-button") as HTMLButtonElement
    if (fullScreenButton) {
      fullScreenButton.click()
    }
  }

  const handleSearch = () => {
    const searchButton = document.querySelector(".rpv-search__popover-toggle-button") as HTMLButtonElement
    if (searchButton) {
      searchButton.click()
    }
  }

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: theme.colors.background.primary }}
      >
        <PDFLoading />
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center text-white"
        style={{
          background: `linear-gradient(to bottom right, ${theme.colors.background.primary}, ${theme.colors.background.secondary})`,
        }}
      >
        <motion.div
          className="mb-6 rounded-full p-4"
          style={{ background: `rgba(139, 92, 246, 0.2)` }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <FileText size={32} style={{ color: theme.colors.purple.light }} />
        </motion.div>
        <h2 className="mb-2 text-xl font-bold" style={{ color: theme.colors.text.primary }}>
          Erro ao carregar o PDF
        </h2>
        <div className="mb-6 text-center" style={{ color: theme.colors.purple.light }}>
          {error}
        </div>
        <motion.button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 rounded-md px-4 py-2 text-white transition-colors"
          style={{ background: theme.colors.purple.primary }}
          whileHover={{ scale: 1.05, background: theme.colors.purple.dark }}
          whileTap={{ scale: 0.95 }}
        >
          Voltar ao Dashboard
        </motion.button>
      </div>
    )
  }

  // Renderização do PDF Viewer
  const renderPDFViewer = () => {
    if (!pdf?.s3Url) return null

    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="h-full">
          <Viewer
            fileUrl={pdf.s3Url}
            plugins={[
              defaultLayoutPluginInstance,
              pageNavigationPluginInstance,
              zoomPluginInstance,
              searchPluginInstance,
              fullScreenPluginInstance,
              printPluginInstance,
            ]}
            onDocumentLoad={(e) => {
              setNumPages(e.doc.numPages)
            }}
            onPageChange={(e) => {
              setCurrentPage(e.currentPage + 1)
            }}
            defaultScale={typeof zoomLevel === "number" ? zoomLevel / 100 : zoomLevel}
            renderLoader={(percentages) => (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                    Carregando PDF
                  </div>
                  <div
                    className="h-2 w-64 overflow-hidden rounded-full"
                    style={{ background: theme.colors.background.tertiary }}
                  >
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${Math.round(percentages)}%`,
                        background: `linear-gradient(to right, ${theme.colors.purple.gradient.from}, ${theme.colors.purple.gradient.to})`,
                      }}
                    />
                  </div>
                  <div className="mt-1" style={{ color: theme.colors.text.secondary }}>
                    {Math.round(percentages)}%
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </Worker>
    )
  }

  // Renderização da interface personalizada
  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ background: theme.colors.background.primary }}>
      {/* Barra de ferramentas superior */}
      <AnimatePresence>
        {(!isMobile || showHeader) && (
          <motion.div
            initial={isMobile ? { y: -50, opacity: 0 } : undefined}
            animate={isMobile ? { y: 0, opacity: 1 } : undefined}
            exit={isMobile ? { y: -50, opacity: 0 } : undefined}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between border-b px-2 py-2 z-10"
            style={{
              borderColor: theme.colors.border.primary,
              background: theme.colors.background.secondary,
            }}
          >
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBackToDashboard}
                className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20"
                style={{ color: theme.colors.text.primary }}
                title="Voltar ao Dashboard"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                onClick={handleOpenGallery}
                className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20"
                style={{ color: theme.colors.text.primary }}
                title="Ver todos os PDFs"
              >
                <Grid size={18} />
              </button>

              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20 disabled:opacity-50"
                  style={{ color: theme.colors.text.primary }}
                  title="Página anterior"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center">
                  <input
                    type="text"
                    value={currentPage}
                    onChange={handlePageChange}
                    className="w-8 rounded border px-1 text-center text-sm"
                    style={{
                      borderColor: theme.colors.border.primary,
                      background: theme.colors.background.tertiary,
                      color: theme.colors.text.primary,
                    }}
                    aria-label="Número da página atual"
                  />
                  <span className="mx-1" style={{ color: theme.colors.text.secondary }}>
                    /
                  </span>
                  <span style={{ color: theme.colors.text.secondary }}>{numPages || "-"}</span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= (numPages || 1)}
                  className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20 disabled:opacity-50"
                  style={{ color: theme.colors.text.primary }}
                  title="Próxima página"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {!isMobile && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                    {typeof zoomLevel === "number" ? `${zoomLevel}%` : "Ajustado"}
                  </span>
                  <div className="flex">
                    <button
                      onClick={handleZoomOut}
                      className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20"
                      style={{ color: theme.colors.text.primary }}
                      title="Diminuir zoom"
                    >
                      <ChevronDown size={18} />
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20"
                      style={{ color: theme.colors.text.primary }}
                      title="Aumentar zoom"
                    >
                      <ChevronDown size={18} style={{ transform: "rotate(180deg)" }} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20"
                  style={{ color: theme.colors.text.primary }}
                  title="Buscar no documento"
                >
                  <SearchIcon size={18} />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-1">
              <button
                onClick={handleToggleStar}
                className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20"
                style={{ color: isStarred ? "#FCD34D" : theme.colors.text.primary }}
                title={isStarred ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Star size={18} fill={isStarred ? "#FCD34D" : "none"} />
              </button>

              <button
                onClick={handleShare}
                className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20"
                style={{ color: theme.colors.text.primary }}
                title="Compartilhar"
              >
                <Share2 size={18} />
              </button>

              <button
                onClick={handleDownload}
                className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20"
                style={{ color: theme.colors.text.primary }}
                title="Download"
              >
                <Download size={18} />
              </button>

              {!isMobile && (
                <>
                  <button
                    onClick={handlePrint}
                    className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20"
                    style={{ color: theme.colors.text.primary }}
                    title="Imprimir"
                  >
                    <Printer size={18} />
                  </button>

                  <button
                    onClick={handleFullScreen}
                    className="rounded p-1.5 hover:bg-opacity-20 hover:bg-purple-900/20"
                    style={{ color: theme.colors.text.primary }}
                    title="Tela cheia"
                  >
                    <Maximize size={18} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Button (quando o header está escondido) */}
      {isMobile && !showHeader && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 right-4 z-20 rounded-full p-3 shadow-lg"
          style={{ background: theme.colors.purple.primary }}
          onClick={() => setShowHeader(true)}
        >
          <Menu size={20} color="white" />
        </motion.button>
      )}

      {/* Área do PDF */}
      <div className="flex-1 overflow-auto" ref={containerRef}>
        {renderPDFViewer()}
      </div>

      {/* Mobile Floating Controls */}
      {isMobile && (
        <div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 rounded-full px-4 py-2 shadow-lg z-20"
          style={{ background: theme.colors.background.secondary, borderColor: theme.colors.border.primary }}
        >
          <button
            onClick={handleZoomOut}
            className="rounded-full p-2 hover:bg-opacity-20 hover:bg-purple-900/20"
            style={{ color: theme.colors.text.primary }}
          >
            <ChevronDown size={18} />
          </button>

          <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
            {typeof zoomLevel === "number" ? `${zoomLevel}%` : "Ajustado"}
          </span>

          <button
            onClick={handleZoomIn}
            className="rounded-full p-2 hover:bg-opacity-20 hover:bg-purple-900/20"
            style={{ color: theme.colors.text.primary }}
          >
            <ChevronDown size={18} style={{ transform: "rotate(180deg)" }} />
          </button>
        </div>
      )}

      {/* PDF Gallery Modal */}
      <PdfGalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        onSelectPdf={handleSelectPdf}
        onToggleStar={async (pdfId) => {
          try {
            await fetch(`/api/pdf/${pdfId}/star`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                isStarred: true,
              }),
            })
          } catch (error) {
            console.error("Error toggling star:", error)
          }
        }}
        onDownload={(pdfId) => {
          window.open(`/api/pdf/${pdfId}`, "_blank")
        }}
      />

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

      <style jsx global>{`
        /* Estilos personalizados para o PDF Viewer */
        .rpv-core__viewer {
          --rpv-color-primary: ${theme.colors.purple.primary} !important;
          --rpv-color-primary-light: ${theme.colors.purple.light} !important;
        }
        
        /* Esconder a barra de ferramentas padrão */
        .rpv-core__inner-pages {
          padding-top: 0 !important;
        }
        
        .rpv-core__toolbar {
          display: none !important;
        }
        
        /* Estilizar o fundo e as páginas */
        .rpv-core__viewer-container {
          background-color: ${theme.colors.background.primary} !important;
        }
        
        .rpv-core__page-layer {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
          border-radius: 4px !important;
          margin: 1rem auto !important;
        }
        
        /* Estilizar a barra lateral */
        .rpv-core__sidebar {
          background-color: ${theme.colors.background.tertiary} !important;
          border-color: ${theme.colors.border.primary} !important;
        }
        
        .rpv-core__sidebar-tabs {
          background-color: ${theme.colors.background.secondary} !important;
        }
        
        .rpv-core__sidebar-tab {
          color: ${theme.colors.text.secondary} !important;
        }
        
        .rpv-core__sidebar-tab--selected {
          background-color: ${theme.colors.purple.primary} !important;
          color: white !important;
        }
        
        /* Estilizar miniaturas */
        .rpv-thumbnail__item {
          background-color: ${theme.colors.background.tertiary} !important;
          border-color: ${theme.colors.border.primary} !important;
        }
        
        .rpv-thumbnail__item--selected {
          border-color: ${theme.colors.purple.primary} !important;
        }
        
        /* Estilizar a busca */
        .rpv-search__popover {
          background-color: ${theme.colors.background.tertiary} !important;
          border-color: ${theme.colors.border.primary} !important;
          color: ${theme.colors.text.primary} !important;
        }
        
        .rpv-search__input {
          background-color: ${theme.colors.background.secondary} !important;
          border-color: ${theme.colors.border.primary} !important;
          color: ${theme.colors.text.primary} !important;
        }
        
        /* Ajustes responsivos */
        @media (max-width: 768px) {
          .rpv-core__page-layer {
            margin: 0.5rem auto !important;
          }
          
          .rpv-core__text-layer {
            font-size: 0.9em !important;
          }
        }
      `}</style>
    </div>
  )
}
