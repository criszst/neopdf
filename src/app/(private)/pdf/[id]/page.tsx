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
  Search,
  Download,
  Star,
  Share2,
  Plus,
  ZoomIn,
  ZoomOut,
  Menu,
  X,
  List,
  RotateCw,
  Printer,
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

// Components
import ToastComponent from "@/components/ui/toast"
import PDFLoading from "@/components/pdf-viewer/pdfLoading"

// React PDF Viewer
import { Viewer, Worker, type SpecialZoomLevel } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation"
import { zoomPlugin } from "@react-pdf-viewer/zoom"
import { searchPlugin, type SearchPlugin } from "@react-pdf-viewer/search"
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen"
import { printPlugin } from "@react-pdf-viewer/print"
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail"
import { bookmarkPlugin } from "@react-pdf-viewer/bookmark"
import { rotatePlugin } from "@react-pdf-viewer/rotate"

import type { SidebarTab } from "@react-pdf-viewer/default-layout"

// Styles
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/page-navigation/lib/styles/index.css"
import "@react-pdf-viewer/zoom/lib/styles/index.css"
import "@react-pdf-viewer/search/lib/styles/index.css"
import "@react-pdf-viewer/full-screen/lib/styles/index.css"
import "@react-pdf-viewer/print/lib/styles/index.css"
import "@react-pdf-viewer/thumbnail/lib/styles/index.css"
import "@react-pdf-viewer/bookmark/lib/styles/index.css"

import { pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


// Document from react-pdf for thumbnails
import { Document, Page } from "react-pdf"

interface PDF {
  id: string
  name: string
  s3Url: string
  createdAt: string
  isStarred: boolean
  fileSize?: string
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
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showOutline, setShowOutline] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [searchMatches, setSearchMatches] = useState(0)
  const [currentMatch, setCurrentMatch] = useState(0)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchPluginRef = useRef<SearchPlugin | null>(null)

  // Initialize plugins
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const zoomPluginInstance = zoomPlugin()
  const searchPluginInstance = searchPlugin()
  const fullScreenPluginInstance = fullScreenPlugin()
  const printPluginInstance = printPlugin()
  const thumbnailPluginInstance = thumbnailPlugin()
  const bookmarkPluginInstance = bookmarkPlugin()
  const rotatePluginInstance = rotatePlugin()


  // Get plugin functions
  const { jumpToPage } = pageNavigationPluginInstance
  const { zoomTo } = zoomPluginInstance
  const { Rotate } = rotatePluginInstance

  // Store search plugin instance
  searchPluginRef.current = searchPluginInstance

  // Create default layout plugin
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs: SidebarTab[]) => [],
    renderToolbar: (toolbarProps) => toolbarProps[0],
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

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
            throw new Error("PDF not found")
          } else if (res.status === 401 || res.status === 403) {
            throw new Error("You don't have permission to view this PDF")
          } else {
            throw new Error("Failed to fetch PDF")
          }
        }

        const data = await res.json()

        // Add mock file size for the example
        const enhancedData = {
          ...data,
          fileSize: "2.4 MB",
        }

        setPdf(enhancedData)
        setIsStarred(data.isStarred)

        // Register view activity
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
        setError(error.message || "Failed to load PDF")
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

  // Subscribe to search plugin store
  // useEffect(() => {
  //   const plugin = searchPluginRef.current
  //   if (!plugin) return

  //   const unsubscribeMatchesCount = plugin.store?.subscribe("matchesCount", (matchesCount: number) => {
  //     setSearchMatches(matchesCount)
  //   })

  //   const unsubscribeCurrentMatch = plugin.store?.subscribe("currentMatch", (currentMatch: number) => {
  //     setCurrentMatch(currentMatch + 1)
  //   })

  //   return () => {
  //     unsubscribeMatchesCount?.()
  //     unsubscribeCurrentMatch?.()
  //   }
  // }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F to open search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault()
        setShowSearch(true)
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 100)
      }

      // Escape to close search
      if (e.key === "Escape" && showSearch) {
        setShowSearch(false)
      }

      // Arrow keys for navigation
      if (e.key === "ArrowLeft" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        handlePrevPage()
      }

      if (e.key === "ArrowRight" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        handleNextPage()
      }

      // F3 or Enter in search to find next
      if (e.key === "F3" || (e.key === "Enter" && showSearch && !e.shiftKey)) {
        e.preventDefault()
        handleNextSearchResult()
      }

      // Shift+F3 or Shift+Enter in search to find previous
      if ((e.key === "F3" && e.shiftKey) || (e.key === "Enter" && showSearch && e.shiftKey)) {
        e.preventDefault()
        handlePreviousSearchResult()
      }

      // Ctrl/Cmd + '+' to zoom in
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault()
        handleZoomIn()
      }

      // Ctrl/Cmd + '-' to zoom out
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault()
        handleZoomOut()
      }

      // Ctrl/Cmd + '0' to reset zoom
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault()
        setZoomLevel(100)
        zoomTo(1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [showSearch, currentPage, numPages])

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

      // Register download activity
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
        title: "Download started",
        message: "Your download has started in a new tab.",
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

      // Register activity
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

      // Update in database
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
        title: newStarredState ? "Added to favorites" : "Removed from favorites",
        message: newStarredState
          ? "This PDF has been added to your favorites."
          : "This PDF has been removed from your favorites.",
      })
    } catch (error) {
      console.error("Error toggling star:", error)
      setIsStarred(!isStarred) // Revert in case of error

      setToast({
        show: true,
        type: "error",
        title: "Error",
        message: "Could not update favorites. Please try again.",
      })
    }
  }

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/pdf/${id}`

      if (navigator.share) {
        await navigator.share({
          title: pdf?.name || "Shared PDF",
          text: "Check out this PDF on NeoPDF",
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)

        setToast({
          show: true,
          type: "success",
          title: "Link copied",
          message: "The link has been copied to your clipboard!",
        })
      }

      // Register share activity
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
        title: "Error sharing",
        message: "Could not share this PDF. Please try again.",
      })
    }
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

  const handleToggleSearch = () => {
    setShowSearch(!showSearch)
    if (!showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    // e.preventDefault()
    // if (searchKeyword.trim() && searchPluginRef.current) {
    //   searchPluginRef.current.Search(searchKeyword)
    // }
  }

  const handleNextSearchResult = () => {
    if (searchPluginRef.current) {
      searchPluginRef.current.jumpToNextMatch()
    }
  }

  const handlePreviousSearchResult = () => {
    if (searchPluginRef.current) {
      searchPluginRef.current.jumpToPreviousMatch()
    }
  }

  const handleRotate = () => {
    // rotate(90)
  }

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar)
    setShowOutline(false)
  }

  const handleToggleOutline = () => {
    setShowOutline(!showOutline)
    setShowSidebar(false)
  }

  const handleGoToPage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= (numPages || 1)) {
      setCurrentPage(pageNumber)
      jumpToPage(pageNumber - 1)
    }
  }

  const handleCreateNewPdf = () => {
    router.push("/dashboard/upload")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#0f0f1a" }}>
        <PDFLoading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white" style={{ background: "#0f0f1a" }}>
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
          <FileText size={32} className="text-purple-400" />
        </motion.div>
        <h2 className="mb-2 text-xl font-bold text-white">Error loading PDF</h2>
        <div className="mb-6 text-center text-purple-400">{error}</div>
        <motion.button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Dashboard
        </motion.button>
      </div>
    )
  }

  // Render PDF Viewer
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
              thumbnailPluginInstance,
              bookmarkPluginInstance,
              rotatePluginInstance,
            ]}
            onDocumentLoad={(e) => {
              setNumPages(e.doc.numPages)
            }}
            onPageChange={(e) => {
              setCurrentPage(e.currentPage + 1)
            }}
            defaultScale={typeof zoomLevel === "number" ? zoomLevel / 100 : zoomLevel}
            theme="dark"
            renderLoader={(percentages) => (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 text-xl font-semibold text-white">Loading PDF</div>
                  <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-400"
                      style={{ width: `${Math.round(percentages)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-gray-400">{Math.round(percentages)}%</div>
                </div>
              </div>
            )}
          />
        </div>
      </Worker>
    )
  }

  // Render thumbnails
  const renderThumbnails = () => {
    if (!pdf?.s3Url || !numPages) return null

    return (
      <div className="h-full overflow-y-auto p-4">
        <h3 className="mb-4 text-sm font-medium text-purple-400">Pages</h3>
        <div className="space-y-4">
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={`thumb-${index}`}
              className={`cursor-pointer overflow-hidden rounded-md transition-all ${
                currentPage === index + 1 ? "ring-2 ring-purple-500" : "hover:ring-1 hover:ring-purple-400"
              }`}
              onClick={() => {
                setCurrentPage(index + 1)
                jumpToPage(index)
              }}
            >
              <Document file={pdf.s3Url} loading={null}>
                <Page
                  pageNumber={index + 1}
                  width={180}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={
                    <div className="flex h-[240px] w-[180px] items-center justify-center bg-gray-800">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                    </div>
                  }
                />
              </Document>
              <div className="bg-gray-800 py-1 text-center text-xs text-gray-300">{index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0f0f1a]">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        <div className="flex items-center">
          <button onClick={handleBackToDashboard} className="flex items-center gap-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-700">
              <FileText size={20} />
            </div>
            <span className="text-lg font-medium">NeoPDF</span>
          </button>
        </div>

        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full rounded-full bg-gray-800 py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              onClick={handleToggleSearch}
              readOnly
            />
          </div>
        </div>

        <div>
          <button
            onClick={handleCreateNewPdf}
            className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            <Plus size={18} />
            <span className="hidden md:inline">New PDF</span>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-800 bg-gray-900"
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center p-2">
              <div className="flex flex-1 items-center rounded-md bg-gray-800 px-3 py-1.5">
                <Search size={16} className="mr-2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search in document..."
                  className="w-full bg-transparent text-sm text-white focus:outline-none"
                />
                {searchKeyword && (
                  <button
                    type="button"
                    onClick={() => setSearchKeyword("")}
                    className="ml-1 rounded-full p-1 hover:bg-gray-700"
                  >
                    <X size={14} className="text-gray-400" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="ml-2 rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="ml-2 rounded-full p-1.5 text-gray-400 hover:bg-gray-700"
              >
                <X size={16} />
              </button>
            </form>

            {searchMatches > 0 && (
              <div className="flex items-center justify-between border-t border-gray-800 p-2">
                <div className="text-sm text-gray-300">
                  {currentMatch} of {searchMatches} results
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handlePreviousSearchResult}
                    className="rounded p-1 hover:bg-gray-700"
                    disabled={searchMatches === 0}
                    title="Previous match (Shift+F3)"
                  >
                    <ChevronLeft size={16} className={searchMatches === 0 ? "text-gray-600" : "text-gray-300"} />
                  </button>
                  <button
                    onClick={handleNextSearchResult}
                    className="rounded p-1 hover:bg-gray-700"
                    disabled={searchMatches === 0}
                    title="Next match (F3)"
                  >
                    <ChevronRight size={16} className={searchMatches === 0 ? "text-gray-600" : "text-gray-300"} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content with sidebars */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left sidebar with icons */}
        <div className="flex w-16 flex-col items-center border-r border-gray-800 py-4">
          <button
            onClick={handleToggleSidebar}
            className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              showSidebar ? "bg-purple-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
            title="Thumbnails"
          >
            <FileText size={20} />
          </button>

          <button
            onClick={handleToggleStar}
            className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              isStarred ? "bg-yellow-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
            title={isStarred ? "Remove from favorites" : "Add to favorites"}
          >
            <Star size={20} fill={isStarred ? "currentColor" : "none"} />
          </button>

          <button
            onClick={handleDownload}
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            title="Download"
          >
            <Download size={20} />
          </button>

          <button
            onClick={handleToggleOutline}
            className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              showOutline ? "bg-purple-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
            title="Table of Contents"
          >
            <List size={20} />
          </button>

          <button
            onClick={handleShare}
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            title="Share"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Left sidebar content (thumbnails or outline) */}
        <AnimatePresence>
          {(showSidebar || showOutline) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-hidden border-r border-gray-800 bg-[#0f0f1a]"
            >
              {showSidebar && renderThumbnails()}
              {showOutline && (
                <div className="h-full p-4">
                  <h3 className="mb-4 text-sm font-medium text-purple-400">Table of Contents</h3>
                  <div className="text-sm text-gray-400">
                    {/* This would be populated by the outline plugin */}
                    The document outline will appear here if available.
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content area */}
        <div className="relative flex flex-1 flex-col">
          {/* Navigation controls */}
          <div className="flex h-12 items-center justify-between border-b border-gray-800 px-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-800 ${
                  currentPage <= 1 ? "text-gray-600" : "text-gray-300"
                }`}
                disabled={currentPage <= 1}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={handleNextPage}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-800 ${
                  currentPage >= (numPages || 1) ? "text-gray-600" : "text-gray-300"
                }`}
                disabled={currentPage >= (numPages || 1)}
              >
                <ChevronRight size={18} />
              </button>

              <div className="text-sm text-gray-300">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{numPages || "-"}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-gray-800"
                title="Zoom out"
              >
                <ZoomOut size={18} />
              </button>

              <div className="text-sm text-gray-300">{typeof zoomLevel === "number" ? `${zoomLevel}%` : zoomLevel}</div>

              <button
                onClick={handleZoomIn}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-gray-800"
                title="Zoom in"
              >
                <ZoomIn size={18} />
              </button>

              {!isMobile && (
                <>
                  <button
                    onClick={handleRotate}
                    className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-gray-800"
                    title="Rotate"
                  >
                    <RotateCw size={18} />
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-gray-800"
                    title="Print"
                  >
                    <Printer size={18} />
                  </button>
                </>
              )}

              {isMobile && (
                <button
                  onClick={() => setShowMobileMenu(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-gray-800"
                >
                  <Menu size={18} />
                </button>
              )}
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto" ref={containerRef}>
            {renderPDFViewer()}
          </div>
        </div>

        {/* Right sidebar (document properties) */}
        {!isTablet && (
          <div className="w-72 border-l border-gray-800 bg-[#0f0f1a] p-6">
            <h2 className="mb-6 text-lg font-medium text-white">Document Properties</h2>

            <div className="mb-6">
              <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">Name</h3>
              <p className="text-sm text-white">{pdf?.name || "Untitled Document"}</p>
            </div>

            <div className="mb-6">
              <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">Size</h3>
              <p className="text-sm text-white">{pdf?.fileSize || "Unknown"}</p>
            </div>

            <div className="mb-6">
              <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">Created</h3>
              <p className="text-sm text-white">{pdf?.createdAt ? formatDate(pdf.createdAt) : "Unknown"}</p>
            </div>

            <div className="mb-6">
              <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">Pages</h3>
              <p className="text-sm text-white">{numPages || "Unknown"}</p>
            </div>

            <button
              onClick={handleDownload}
              className="mb-4 w-full rounded-md bg-purple-600 py-2 text-center text-sm font-medium text-white hover:bg-purple-700"
            >
              Download
            </button>

            <button
              onClick={handleShare}
              className="w-full rounded-md border border-gray-700 py-2 text-center text-sm font-medium text-gray-300 hover:bg-gray-800"
            >
              Share
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-md rounded-t-xl bg-gray-900 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Options</h3>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    handleToggleStar()
                    setShowMobileMenu(false)
                  }}
                  className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-gray-800"
                >
                  <Star
                    size={24}
                    fill={isStarred ? "#F59E0B" : "none"}
                    className={isStarred ? "text-yellow-500" : "text-gray-400"}
                  />
                  <span className="mt-1 text-xs text-gray-400">Favorite</span>
                </button>

                <button
                  onClick={() => {
                    handleShare()
                    setShowMobileMenu(false)
                  }}
                  className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-gray-800"
                >
                  <Share2 size={24} className="text-gray-400" />
                  <span className="mt-1 text-xs text-gray-400">Share</span>
                </button>

                <button
                  onClick={() => {
                    handleDownload()
                    setShowMobileMenu(false)
                  }}
                  className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-gray-800"
                >
                  <Download size={24} className="text-gray-400" />
                  <span className="mt-1 text-xs text-gray-400">Download</span>
                </button>

                <button
                  onClick={() => {
                    handlePrint()
                    setShowMobileMenu(false)
                  }}
                  className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-gray-800"
                >
                  <Printer size={24} className="text-gray-400" />
                  <span className="mt-1 text-xs text-gray-400">Print</span>
                </button>

                <button
                  onClick={() => {
                    handleRotate()
                    setShowMobileMenu(false)
                  }}
                  className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-gray-800"
                >
                  <RotateCw size={24} className="text-gray-400" />
                  <span className="mt-1 text-xs text-gray-400">Rotate</span>
                </button>

                <button
                  onClick={() => {
                    handleToggleSidebar()
                    setShowMobileMenu(false)
                  }}
                  className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-gray-800"
                >
                  <FileText size={24} className="text-gray-400" />
                  <span className="mt-1 text-xs text-gray-400">Pages</span>
                </button>

                <button
                  onClick={() => {
                    handleToggleOutline()
                    setShowMobileMenu(false)
                  }}
                  className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-gray-800"
                >
                  <List size={24} className="text-gray-400" />
                  <span className="mt-1 text-xs text-gray-400">Contents</span>
                </button>

                <button
                  onClick={() => {
                    handleToggleSearch()
                    setShowMobileMenu(false)
                  }}
                  className="flex flex-col items-center justify-center rounded-lg p-3 hover:bg-gray-800"
                >
                  <Search size={24} className="text-gray-400" />
                  <span className="mt-1 text-xs text-gray-400">Search</span>
                </button>
              </div>

              <div className="mt-4 rounded-md bg-gray-800 p-4">
                <h4 className="mb-2 text-sm font-medium text-white">Document Info</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-400">Name:</div>
                  <div className="text-white truncate">{pdf?.name || "Untitled"}</div>

                  <div className="text-gray-400">Pages:</div>
                  <div className="text-white">{numPages || "Unknown"}</div>

                  <div className="text-gray-400">Size:</div>
                  <div className="text-white">{pdf?.fileSize || "Unknown"}</div>

                  <div className="text-gray-400">Created:</div>
                  <div className="text-white">{pdf?.createdAt ? formatDate(pdf.createdAt) : "Unknown"}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        /* Custom styles for PDF Viewer */
        .rpv-core__viewer {
          --rpv-color-primary: #8B5CF6 !important;
          --rpv-color-primary-light: #A78BFA !important;
        }
        
        /* Hide default toolbar */
        .rpv-core__inner-pages {
          padding-top: 0 !important;
        }
        
        .rpv-core__toolbar {
          display: none !important;
        }
        
        /* Style background and pages */
        .rpv-core__viewer-container {
          background-color: #0f0f1a !important;
        }
        
        .rpv-core__page-layer {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
          border-radius: 4px !important;
          margin: 1rem auto !important;
        }
        
        /* Style sidebar */
        .rpv-core__sidebar {
          background-color: #0f0f1a !important;
          border-color: #1f1f2e !important;
        }
        
        .rpv-core__sidebar-tabs {
          background-color: #0f0f1a !important;
        }
        
        .rpv-core__sidebar-tab {
          color: #e2e8f0 !important;
        }
        
        .rpv-core__sidebar-tab--selected {
          background-color: #8B5CF6 !important;
          color: white !important;
        }
        
        /* Style thumbnails */
        .rpv-thumbnail__item {
          background-color: #1f1f2e !important;
          border-color: #2d2d3a !important;
        }
        
        .rpv-thumbnail__item--selected {
          border-color: #8B5CF6 !important;
        }
        
        /* Style search */
        .rpv-search__popover {
          background-color: #1f1f2e !important;
          border-color: #2d2d3a !important;
          color: #e2e8f0 !important;
        }
        
        .rpv-search__input {
          background-color: #0f0f1a !important;
          border-color: #2d2d3a !important;
          color: #e2e8f0 !important;
        }
        
        /* Highlight search results */
        .rpv-search__highlight {
          background-color: rgba(139, 92, 246, 0.4) !important;
          border-radius: 2px;
          box-shadow: 0 0 3px rgba(139, 92, 246, 0.7) !important;
        }
        
        .rpv-search__highlight--selected {
          background-color: rgba(139, 92, 246, 0.7) !important;
          box-shadow: 0 0 5px rgba(139, 92, 246, 0.9) !important;
        }
        
        /* React-PDF styles for thumbnails */
        .react-pdf__Document {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .react-pdf__Page {
          margin: 0 !important;
          border-radius: 4px 4px 0 0;
          overflow: hidden;
        }
        
        .react-pdf__Page__canvas {
          width: 100% !important;
          height: auto !important;
          display: block;
        }
        
        /* Responsive adjustments */
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
