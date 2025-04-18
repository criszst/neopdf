"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import type { User } from "next-auth"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Star,
  Clock,
  Filter,
  Grid,
  List,
  Search,
  Plus,
  ChevronDown,
  FolderOpen,
  Upload,
  MoreHorizontal,
  Download,
  Trash2,
  Share,
  Eye,
  X,
  CheckCircle2,
  SlidersHorizontal,
  ArrowUpDown,
  Calendar,
  Folder,
  Settings,
  BarChart2,
} from "lucide-react"

import SideBar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import PageLoading from "@/components/ui/page-loading"
import ToastComponent from "@/components/ui/toast"
import AnimatedAlert from "@/components/ui/alert"
import type ToastProps from "@/lib/props/ToastProps"
import type Pdf from "@/lib/props/PdfProps"

export default function FilesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pdfs, setPdfs] = useState<Pdf[]>([])
  const [filteredPdfs, setFilteredPdfs] = useState<Pdf[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "recent" | "starred" | "shared">("all")
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [toast, setToast] = useState<ToastProps>({
    show: false,
    type: "success",
    title: "",
    message: "",
  })

  const [activeItem, setActiveItem] = useState("dashboard")

  const filterMenuRef = useRef<HTMLDivElement>(null)
  const sortMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session")
        if (!res.ok) throw new Error("Failed to fetch session")
        const data = await res.json()
        setUser(data?.user || null)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  useEffect(() => {
    async function fetchPDFs() {
      try {
        const res = await fetch("/api/pdf")
        if (!res.ok) throw new Error("Failed to fetch PDFs")
        const data = await res.json()
        setPdfs(data)
      } catch (error) {
        console.error("Error fetching PDFs:", error)
      }
    }

    if (user) {
      fetchPDFs()
    }
  }, [user])

  // Filter and sort PDFs
  useEffect(() => {
    let result = [...pdfs]

    // Apply search filter
    if (searchQuery) {
      result = result.filter((pdf) => pdf.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply category filter
    if (activeFilter === "recent") {
      // Sort by date and take the 10 most recent
      result = [...result]
        .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
        .slice(0, 10)
    } else if (activeFilter === "starred") {
      result = result.filter((pdf) => pdf.isStarred)
    } else if (activeFilter === "shared") {
      // In a real app, you'd have a shared property
      // This is just a placeholder
      result = result.filter((_, index) => index % 3 === 0) // Just for demo
    }

    // Apply sorting
    result = result.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime()
          : new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
      } else if (sortBy === "size") {
        // In a real app, you'd use the actual file size
        // This is just a placeholder
        const aSize = a.fileSize || 0
        const bSize = b.fileSize || 0
        return sortOrder === "asc" ? aSize - bSize : bSize - aSize
      }
      return 0
    })

    setFilteredPdfs(result)
  }, [pdfs, searchQuery, activeFilter, sortBy, sortOrder])

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false)
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleUploadClick = () => {
    setShowUploadModal(true)
  }

  const handleDeleteRequest = (id: string) => {
    setSelectedPdf(id)
    setShowAlert(true)
  }

  const handleDeletePDF = async () => {
    if (!selectedPdf) return

    setIsDeleting(true)

    try {
      const res = await fetch(`/api/pdfs/${selectedPdf}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete PDF")

      // Registrar atividade
      await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "DELETE",
          pdfId: selectedPdf,
        }),
      })

      setPdfs((prev) => prev.filter((pdf) => pdf.id !== selectedPdf))

      setToast({
        show: true,
        type: "success",
        title: "Arquivo excluído",
        message: "O arquivo foi excluído com sucesso.",
      })
    } catch (error) {
      console.error("Error deleting PDF:", error)

      setToast({
        show: true,
        type: "error",
        title: "Erro ao excluir",
        message: "Não foi possível excluir o arquivo. Tente novamente.",
      })
    } finally {
      setShowAlert(false)
      setSelectedPdf(null)
      setIsDeleting(false)
    }
  }

  const handleStarToggle = async (id: string, isCurrentlyStarred: boolean) => {
    try {
      // Optimistic update
      setPdfs((prev) => prev.map((pdf) => (pdf.id === id ? { ...pdf, isStarred: !isCurrentlyStarred } : pdf)))

      // Update on server
      await fetch(`/api/pdfs/${id}/star`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isStarred: !isCurrentlyStarred,
        }),
      })

      // Register activity
      await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: isCurrentlyStarred ? "UNSTAR" : "STAR",
          pdfId: id,
        }),
      })
    } catch (error) {
      console.error("Error toggling star:", error)

      // Revert on error
      setPdfs((prev) => prev.map((pdf) => (pdf.id === id ? { ...pdf, isStarred: isCurrentlyStarred } : pdf)))

      setToast({
        show: true,
        type: "error",
        title: "Erro",
        message: "Não foi possível atualizar os favoritos. Tente novamente.",
      })
    }
  }

  const handleShare = async (id: string) => {
    try {
      const pdf = pdfs.find((p) => p.id === id)
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

      // Register activity
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
        message: "Não foi possível compartilhar este arquivo. Tente novamente.",
      })
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B"

    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (loading) {
    return <PageLoading />
  }

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="relative mb-6">
        <div className="h-24 w-24 rounded-full bg-purple-500/10 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <FolderOpen size={40} className="text-purple-400" />
          </motion.div>
        </div>
        <motion.div
          className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Plus size={20} className="text-white" />
        </motion.div>
      </div>
      <h3 className="text-xl font-medium text-white mb-3">Nenhum arquivo encontrado</h3>
      <p className="text-white/70 mb-8 max-w-md">
        {activeFilter === "all"
          ? "Você ainda não tem nenhum arquivo. Faça upload do seu primeiro arquivo para começar."
          : activeFilter === "starred"
            ? "Você ainda não tem nenhum arquivo favorito. Marque arquivos como favoritos para encontrá-los facilmente."
            : activeFilter === "shared"
              ? "Você ainda não compartilhou nenhum arquivo. Compartilhe arquivos para colaborar com outras pessoas."
              : "Nenhum arquivo recente encontrado."}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUploadClick}
        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-purple-500/20"
      >
        <Upload size={18} />
        <span>Fazer upload</span>
      </motion.button>
    </motion.div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredPdfs.map((pdf, index) => (
        <motion.div
          key={pdf.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          layout
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-[#1A1A2E] rounded-lg border border-purple-900/20 overflow-hidden hover:border-purple-500/30 transition-all duration-200 group shadow-lg"
        >
          <div className="relative aspect-[4/3] bg-gradient-to-br from-[#0A0118] to-[#1A0F24] flex items-center justify-center overflow-hidden">
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
              <FileText size={48} className="text-purple-500/30" />
            </motion.div>

            {/* File type badge */}
            <div className="absolute top-3 left-3 px-2 py-1 bg-purple-500/20 rounded-md text-xs font-medium text-purple-300">
              {pdf.fileType || "PDF"}
            </div>

            {/* Star button */}
            <button
              onClick={() => handleStarToggle(pdf.id, pdf.isStarred || false)}
              className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors ${
                pdf.isStarred
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-white/10 text-white/40 hover:text-yellow-400 hover:bg-yellow-500/20"
              }`}
            >
              <Star size={16} fill={pdf.isStarred ? "currentColor" : "none"} />
            </button>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <a
                href={`/pdf/${pdf.id}`}
                className="p-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-full transition-colors"
                title="Abrir PDF"
              >
                <Eye size={20} />
              </a>
              <a
                href={pdf.url}
                download
                className="p-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-full transition-colors"
                title="Download PDF"
              >
                <Download size={20} />
              </a>
              <button
                onClick={() => handleShare(pdf.id)}
                className="p-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-full transition-colors"
                title="Compartilhar"
              >
                <Share size={20} />
              </button>
              <button
                onClick={() => handleDeleteRequest(pdf.id)}
                className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full transition-colors"
                title="Excluir PDF"
              >
                <Trash2 size={20} />
              </button>
            </div>
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

              <div className="text-xs text-white/50">{formatFileSize(pdf.fileSize)}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-2">
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-white/50 border-b border-white/5">
        <div className="col-span-5">Nome</div>
        <div className="col-span-2">Tipo</div>
        <div className="col-span-2">Tamanho</div>
        <div className="col-span-2">Data</div>
        <div className="col-span-1">Ações</div>
      </div>

      {filteredPdfs.map((pdf, index) => (
        <motion.div
          key={pdf.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-[#1A1A2E] hover:bg-[#251539] rounded-lg transition-colors items-center group shadow-md border border-purple-900/20 hover:border-purple-500/30"
        >
          {/* Mobile view - stacked */}
          <div className="md:hidden flex flex-col space-y-2 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#0A0118] to-[#1A0F24] flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-medium text-white truncate max-w-full group-hover:text-purple-400 transition-colors"
                    title={pdf.name}
                  >
                    {pdf.name}
                  </h3>
                  <div className="flex items-center text-xs text-white/50 mt-1">
                    <span className="truncate">{pdf.fileType || "PDF"}</span>
                    <div className="mx-2 h-1 w-1 rounded-full bg-white/30"></div>
                    <span>{formatFileSize(pdf.fileSize)}</span>
                    <div className="mx-2 h-1 w-1 rounded-full bg-white/30"></div>
                    <Calendar size={12} className="mr-1 flex-shrink-0" />
                    <span>{pdf.createdAt ? formatDate(pdf.createdAt) : "Recente"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStarToggle(pdf.id, pdf.isStarred || false)}
                  className={`p-1.5 rounded-full transition-colors ${
                    pdf.isStarred ? "text-yellow-400" : "text-white/40 hover:text-yellow-400"
                  }`}
                >
                  <Star size={16} fill={pdf.isStarred ? "currentColor" : "none"} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => {
                      setSelectedPdf(selectedPdf === pdf.id ? null : pdf.id)
                    }}
                    className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {/* Dropdown menu */}
                  <AnimatePresence>
                    {selectedPdf === pdf.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-full mt-1 z-10 w-48 bg-[#151525] rounded-lg shadow-xl border border-purple-900/20 py-1 overflow-hidden"
                      >
                        <a
                          href={`/pdf/${pdf.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-purple-500/10 transition-colors"
                        >
                          <Eye size={16} className="text-purple-400" />
                          <span>Abrir</span>
                        </a>
                        <a
                          href={pdf.url}
                          download
                          className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-purple-500/10 transition-colors"
                        >
                          <Download size={16} className="text-purple-400" />
                          <span>Download</span>
                        </a>
                        <button
                          onClick={() => handleShare(pdf.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-purple-500/10 transition-colors w-full text-left"
                        >
                          <Share size={16} className="text-purple-400" />
                          <span>Compartilhar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(pdf.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
                        >
                          <Trash2 size={16} />
                          <span>Excluir</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop view - grid */}
          <div className="hidden md:flex md:col-span-5 items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#0A0118] to-[#1A0F24] flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-purple-400" />
            </div>
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <h3
                className="font-medium text-white truncate max-w-full group-hover:text-purple-400 transition-colors"
                title={pdf.name}
              >
                {pdf.name}
              </h3>
              <button
                onClick={() => handleStarToggle(pdf.id, pdf.isStarred || false)}
                className={`p-1 rounded-full transition-colors ${
                  pdf.isStarred
                    ? "text-yellow-400"
                    : "text-white/20 hover:text-yellow-400 opacity-0 group-hover:opacity-100"
                }`}
              >
                <Star size={14} fill={pdf.isStarred ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
          <div className="hidden md:block md:col-span-2 text-white/70 text-sm">{pdf.fileType || "PDF"}</div>
          <div className="hidden md:block md:col-span-2 text-white/70 text-sm">{formatFileSize(pdf.fileSize)}</div>
          <div className="hidden md:block md:col-span-2 text-white/70 text-sm">
            {pdf.createdAt ? formatDate(pdf.createdAt) : "Recente"}
          </div>
          <div className="hidden md:flex md:col-span-1 items-center justify-end gap-1">
            <a
              href={`/pdf/${pdf.id}`}
              className="p-1.5 text-white/50 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-colors"
              title="Abrir PDF"
            >
              <Eye size={16} />
            </a>
            <a
              href={pdf.url}
              download
              className="p-1.5 text-white/50 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-colors"
              title="Download PDF"
            >
              <Download size={16} />
            </a>
            <button
              onClick={() => handleShare(pdf.id)}
              className="p-1.5 text-white/50 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-colors"
              title="Compartilhar"
            >
              <Share size={16} />
            </button>
            <button
              onClick={() => handleDeleteRequest(pdf.id)}
              className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
              title="Excluir PDF"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Enhanced background with more pronounced gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0118] via-[#1A0F24] to-[#0A0118]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-40 w-96 h-96 rounded-full bg-purple-800/20 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Additional decorative elements */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full relative z-10">
        {/* Header */}
        <Header
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onUpload={handleUploadClick}
          pdfs={pdfs}
        />

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Title and actions */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between mb-6"
            >
              <div className="flex items-center gap-2 mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold text-white">Meus Arquivos</h1>
                <div className="px-2 py-1 bg-purple-500/20 rounded-md text-xs font-medium text-purple-300">
                  {filteredPdfs.length} {filteredPdfs.length === 1 ? "arquivo" : "arquivos"}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-auto">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
                  <input
                    type="text"
                    placeholder="Buscar arquivos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 bg-[#151525] border border-purple-500/20 rounded-lg py-2 pl-9 pr-4 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* View mode toggle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="flex items-center bg-[#1A1A2E] rounded-lg p-1"
                >
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-purple-500/20 text-purple-400" : "text-white/70 hover:text-white"}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-purple-500/20 text-purple-400" : "text-white/70 hover:text-white"}`}
                  >
                    <List size={18} />
                  </button>
                </motion.div>

                {/* Filter dropdown */}
                <div className="relative" ref={filterMenuRef}>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="flex items-center gap-2 bg-[#1A1A2E] text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-sm"
                  >
                    <Filter size={16} />
                    <span className="hidden sm:inline">
                      {activeFilter === "all"
                        ? "Todos"
                        : activeFilter === "recent"
                          ? "Recentes"
                          : activeFilter === "starred"
                            ? "Favoritos"
                            : "Compartilhados"}
                    </span>
                    <ChevronDown size={14} />
                  </motion.button>

                  <AnimatePresence>
                    {showFilterMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-1 z-10 w-48 bg-[#151525] rounded-lg shadow-xl border border-purple-900/20 py-1 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            setActiveFilter("all")
                            setShowFilterMenu(false)
                          }}
                          className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${
                            activeFilter === "all"
                              ? "bg-purple-500/10 text-purple-400"
                              : "text-white hover:bg-purple-500/10 hover:text-purple-400"
                          }`}
                        >
                          <Folder size={16} />
                          <span>Todos os arquivos</span>
                          {activeFilter === "all" && <CheckCircle2 size={14} className="ml-auto" />}
                        </button>
                        <button
                          onClick={() => {
                            setActiveFilter("recent")
                            setShowFilterMenu(false)
                          }}
                          className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${
                            activeFilter === "recent"
                              ? "bg-purple-500/10 text-purple-400"
                              : "text-white hover:bg-purple-500/10 hover:text-purple-400"
                          }`}
                        >
                          <Clock size={16} />
                          <span>Recentes</span>
                          {activeFilter === "recent" && <CheckCircle2 size={14} className="ml-auto" />}
                        </button>
                        <button
                          onClick={() => {
                            setActiveFilter("starred")
                            setShowFilterMenu(false)
                          }}
                          className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${
                            activeFilter === "starred"
                              ? "bg-purple-500/10 text-purple-400"
                              : "text-white hover:bg-purple-500/10 hover:text-purple-400"
                          }`}
                        >
                          <Star size={16} />
                          <span>Favoritos</span>
                          {activeFilter === "starred" && <CheckCircle2 size={14} className="ml-auto" />}
                        </button>
                        <button
                          onClick={() => {
                            setActiveFilter("shared")
                            setShowFilterMenu(false)
                          }}
                          className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${
                            activeFilter === "shared"
                              ? "bg-purple-500/10 text-purple-400"
                              : "text-white hover:bg-purple-500/10 hover:text-purple-400"
                          }`}
                        >
                          <Share size={16} />
                          <span>Compartilhados</span>
                          {activeFilter === "shared" && <CheckCircle2 size={14} className="ml-auto" />}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sort dropdown */}
                <div className="relative" ref={sortMenuRef}>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2 bg-[#1A1A2E] text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-sm"
                  >
                    <SlidersHorizontal size={16} />
                    <span className="hidden sm:inline">Ordenar</span>
                    <ChevronDown size={14} />
                  </motion.button>

                  <AnimatePresence>
                    {showSortMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-1 z-10 w-48 bg-[#151525] rounded-lg shadow-xl border border-purple-900/20 py-1 overflow-hidden"
                      >
                        <div className="px-4 py-2 text-xs text-white/50 border-b border-white/5">Ordenar por</div>
                        <button
                          onClick={() => {
                            setSortBy("name")
                            setShowSortMenu(false)
                          }}
                          className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${
                            sortBy === "name"
                              ? "bg-purple-500/10 text-purple-400"
                              : "text-white hover:bg-purple-500/10 hover:text-purple-400"
                          }`}
                        >
                          <span>Nome</span>
                          {sortBy === "name" && (
                            <ArrowUpDown size={14} className={`ml-auto ${sortOrder === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSortBy("date")
                            setShowSortMenu(false)
                          }}
                          className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${
                            sortBy === "date"
                              ? "bg-purple-500/10 text-purple-400"
                              : "text-white hover:bg-purple-500/10 hover:text-purple-400"
                          }`}
                        >
                          <span>Data</span>
                          {sortBy === "date" && (
                            <ArrowUpDown size={14} className={`ml-auto ${sortOrder === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSortBy("size")
                            setShowSortMenu(false)
                          }}
                          className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${
                            sortBy === "size"
                              ? "bg-purple-500/10 text-purple-400"
                              : "text-white hover:bg-purple-500/10 hover:text-purple-400"
                          }`}
                        >
                          <span>Tamanho</span>
                          {sortBy === "size" && (
                            <ArrowUpDown size={14} className={`ml-auto ${sortOrder === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </button>
                        <div className="border-t border-white/5 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                              setShowSortMenu(false)
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-white hover:bg-purple-500/10 hover:text-purple-400"
                          >
                            <ArrowUpDown size={16} className={sortOrder === "asc" ? "rotate-180" : ""} />
                            <span>{sortOrder === "asc" ? "Crescente" : "Decrescente"}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  onClick={handleUploadClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg shadow-purple-500/20"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Novo arquivo</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Files content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#151525]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6 shadow-xl shadow-purple-900/5"
            >
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === "all"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-[#1A1A2E] text-white/70 hover:text-white"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveFilter("recent")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === "recent"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-[#1A1A2E] text-white/70 hover:text-white"
                  }`}
                >
                  Recentes
                </button>
                <button
                  onClick={() => setActiveFilter("starred")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === "starred"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-[#1A1A2E] text-white/70 hover:text-white"
                  }`}
                >
                  Favoritos
                </button>
                <button
                  onClick={() => setActiveFilter("shared")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === "shared"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-[#1A1A2E] text-white/70 hover:text-white"
                  }`}
                >
                  Compartilhados
                </button>
              </div>

              {/* Files list */}
              <AnimatePresence mode="wait">
                {filteredPdfs.length === 0 ? (
                  renderEmptyState()
                ) : (
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {viewMode === "grid" ? renderGridView() : renderListView()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert */}
      <AnimatePresence>
        {showAlert && (
          <AnimatedAlert
            title="Tem certeza?"
            message="Essa ação não pode ser desfeita. Deseja realmente excluir este arquivo?"
            confirmText="Sim, excluir"
            cancelText="Cancelar"
            onConfirm={handleDeletePDF}
            onCancel={() => setShowAlert(false)}
            isLoading={isDeleting}
          />
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

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#151525] border-t border-purple-900/20 z-40">
        <div className="flex justify-around py-3">
          {["dashboard", "files", "analytics", "activity", "settings"].map((item, index) => (
            <button
              key={item}
              onClick={() => {
                if (item === "search") {
                  const searchButton = document.querySelector('[aria-label="Files"]') as HTMLButtonElement
                  if (searchButton) searchButton.click()

                } else {
                  setActiveItem(item)
                  
                  if (item === "dashboard") router.push("/dashboard")
                  if (item === "files") router.push("/dashboard/files")
                  if (item === 'analytics') router.push('/dashboard/analytics')
                  if (item === "activity") router.push("/dashboard/activity")
                  if (item === "settings") router.push("/dashboard/settings")
                }
              }}
              className={`relative p-2 ${activeItem === item ? "text-purple-400" : "text-white/70"}`}
            >
              {item === "dashboard" && <Grid size={22} />}
              {item === "files" && <FileText size={22} />}
              {/* {item === "search" && <Search size={22} />} */}
              {item === "analytics" && <BarChart2 size={22} />}
              {item === "activity" && <Clock size={22} />}
             .0.... {item === "settings" && <Settings size={22} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
