"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import type { User } from "next-auth"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Filter, Grid, List, ChevronDown, FileText, Clock, Settings, Search, BarChart2 } from "lucide-react"

import SideBar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import MetricCards from "@/components/dashboard/metric"
import RecentActivity from "@/components/dashboard/ractivity"
import QuickActions from "@/components/dashboard/qactions"
import FileUpload from "@/components/animations/FileUpload"
import PageLoading from "@/components/ui/page-loading"
import ToastComponent from "@/components/ui/toast"
import AnimatedAlert from "@/components/ui/alert"
import PDFList from "@/components/dashboard/pdfs"
import type ToastProps from "@/lib/props/ToastProps"
import type Pdf from "@/lib/props/PdfProps"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pdfs, setPdfs] = useState<Pdf[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [toast, setToast] = useState<ToastProps>({
    show: false,
    type: "success",
    title: "",
    message: "",
  })
  const [activeItem, setActiveItem] = useState("dashboard")

  const containerRef = useRef(null)
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

  const handleUploadClick = () => {
    setShowUploadModal(true)
  }

  const handleUploadComplete = (data: any) => {
    setShowUploadModal(false)

    if (pdfs.find((pdf) => pdf.name === data.name))
      setToast({
        show: true,
        type: "info",
        title: "Esse PDF já foi enviado",
        message: `${data.name} já existe`,
      })
    else {
      setPdfs((prev: Pdf[]) => {
        return [...prev, data]
      })

      setToast({
        show: true,
        type: "success",
        title: "Upload Concluído",
        message: `${data.name} foi enviado com sucesso!`,
      })
    }
  }

  const handleDeleteRequest = (id: string) => {
    setSelectedPdf(id)
    setShowAlert(true)
  }

  const handleDeletePDF = async () => {
    if (!selectedPdf) return

    setIsDeleting(true)

    try {
      const res = await fetch(`/api/pdf/${selectedPdf}`, {
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

      setPdfs((prev: any) => prev.filter((pdf: any) => pdf.id !== selectedPdf))

      setToast({
        show: true,
        type: "success",
        title: "PDF Excluído",
        message: "O PDF foi excluído com sucesso!",
      })
    } catch (error) {
      console.error("Error deleting PDF:", error)

      setToast({
        show: true,
        type: "error",
        title: "Erro ao Excluir",
        message: "Não foi possível excluir o PDF. Tente novamente.",
      })
    } finally {
      setShowAlert(false)
      setSelectedPdf(null)
      setIsDeleting(false)
    }
  }

  if (loading) {
    return <PageLoading />
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#0A0118]">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/5" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-10" />
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
          className="absolute bottom-20 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"
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
      </div>

      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} onLogout={handleDeletePDF} />

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
        <div ref={containerRef} className="flex-1 p-4 lg:p-6 overflow-auto">
          {/* Main content container with max width to prevent excessive scrolling */}
          <div className="max-w-7xl mx-auto">
            {/* Title and actions */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between mb-6"
            >
              <div className="flex items-center gap-2 mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              </div>

              <div className="flex items-center gap-3">
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

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="flex items-center gap-2 bg-[#1A1A2E] text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-sm"
                >
                  <Filter size={16} />
                  <span className="hidden sm:inline">Filtrar</span>
                  <ChevronDown size={14} />
                </motion.button>


              </div>
            </motion.div>

            {/* Two column layout for better space utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* PDFs Section - Takes 2/3 of the space */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="bg-[#151525] backdrop-blur-sm rounded-xl border border-purple-900/20 p-6 shadow-xl shadow-purple-900/5 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">Biblioteca de PDFs</h2>
                    <span className="text-sm text-white/50">{pdfs.length} arquivos</span>
                  </div>

                  {pdfs.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <Plus size={24} className="text-purple-400" />
                        </motion.div>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Nenhum PDF ainda</h3>
                      <p className="text-white/70 mb-6 max-w-md">
                        Faça upload do seu primeiro PDF para começar a usar os recursos poderosos do NeoPDF.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUploadClick}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all duration-200"
                      >
                        <Plus size={18} />
                        <span>Adicionar PDF</span>
                      </motion.button>
                    </motion.div>
                  ) : (
                    <div className="relative">
                      <PDFList pdfs={pdfs} onDelete={handleDeleteRequest} viewMode={viewMode} />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Quick Actions - Takes 1/3 of the space */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <QuickActions onUpload={handleUploadClick} />
              </motion.div>
            </div>

            {/* Metrics Cards */}
            <MetricCards />

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8"
            >
              <RecentActivity />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#151525] border-t border-purple-900/20 z-40">
        <div className="flex justify-around py-3">
          {["dashboard", "files", "analytics", "activity", "settings"].map((item, index) => (
            <button
              key={item}
              onClick={() => {
                if (item === "search") {
                  const searchButton = document.querySelector('[aria-label="Pesquisar"]') as HTMLButtonElement
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
              {item === "settings" && <Settings size={22} />}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#151525] rounded-xl border border-purple-900/20 p-6 max-w-md w-full shadow-2xl shadow-purple-900/20"
            >
              <h2 className="text-xl font-bold text-white mb-4">Upload PDF</h2>
              <FileUpload onUploadComplete={handleUploadComplete} />
              <motion.button
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUploadModal(false)}
                className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                Cancelar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Alert */}
      <AnimatePresence>
        {showAlert && (
          <AnimatedAlert
            title="Tem certeza?"
            message="Essa ação não pode ser desfeita. Deseja realmente excluir este PDF?"
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

      {/* Estilo para esconder a barra de rolagem */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
