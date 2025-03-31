"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "next-auth"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Filter, Grid, List, ChevronDown } from "lucide-react"

import SideBar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import MetricCards from "@/components/dashboard/metric"
import AnalyticsChart from "@/components/dashboard/chart"
import RecentActivity from "@/components/dashboard/ractivity"
import PdfTypes from "@/components/dashboard/types"
import QuickActions from "@/components/dashboard/qactions"
import FileUpload from "@/components/animations/FileUpload"
import PageLoading from "@/components/ui/page-loading"
import ToastComponent from "@/components/ui/toast"
import AnimatedAlert from "@/components/ui/alert"
import type ToastProps from "@/lib/props/ToastProps"
import type Pdf from "@/lib/props/PdfProps"
import DashboardAdapter from "@/components/dashboard/dashboard-adapter"

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
    <div className="flex min-h-screen bg-gradient-to-br from-[#0e0525] to-[#1a0f24]">
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onUpload={handleUploadClick} />

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          {/* Title and actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">Dashboard</h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#1a0f24] rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-purple-500/20 text-purple-400" : "text-white/70 hover:text-white"}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-purple-500/20 text-purple-400" : "text-white/70 hover:text-white"}`}
                >
                  <List size={18} />
                </button>
              </div>

              <button className="flex items-center gap-2 bg-[#1a0f24] text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-sm">
                <Filter size={16} />
                <span>Filter</span>
                <ChevronDown size={14} />
              </button>

              <button
                onClick={handleUploadClick}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium"
              >
                <Plus size={16} />
                <span>New PDF</span>
              </button>
            </div>
          </div>

          <div className="p-2 lg:p-2 ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mb-8"
            >
              <div className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6">
                <h2 className="text-lg font-bold text-white mb-4">PDFs</h2>
                <div className="flex items-center justify-between mb-6">
                  <FileUpload onUploadComplete={handleUploadComplete} className=" lg:block w-[100%]" showLabel={true} />
                </div>

                {showAlert && (
                  <AnimatedAlert
                    title="Tem certeza?"
                    message="Essa ação não pode ser desfeita. Deseja realmente excluir este PDF?"
                    confirmText="Sim, excluir"
                    cancelText="Cancelar"
                    onConfirm={handleDeletePDF}
                    onCancel={() => setShowAlert(false)}
                  />
                )}

                <DashboardAdapter pdfs={pdfs} onDelete={handleDeleteRequest} viewMode={viewMode} />
              </div>
            </motion.div>
          </div>

          {/* Metrics Cards */}
          <MetricCards />

          {/* PDFs Section */}
          {/* Content */}

          {/* Analytics Chart */}
          <div className="mb-8">
            <AnalyticsChart />
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecentActivity />
            <PdfTypes />
            <QuickActions />
          </div>
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#151823] rounded-xl border border-purple-900/20 p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-bold text-white mb-4">Upload PDF</h2>
              <FileUpload onUploadComplete={handleUploadComplete} />
              <button
                onClick={() => setShowUploadModal(false)}
                className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                Cancelar
              </button>
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
    </div>
  )
}

