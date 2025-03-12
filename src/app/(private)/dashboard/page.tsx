"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "next-auth"
import { motion } from "framer-motion"

import SideBar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import MetricCards from "@/components/dashboard/metric"
import AnalyticsChart from "@/components/dashboard/chart"
import RecentActivity from "@/components/dashboard/ractivity"
import PdfTypes from "@/components/dashboard/types"
import QuickActions from "@/components/dashboard/qactions"
import FileUpload from "@/components/animations/FileUpload"
import PDFList from "@/components/dashboard/pdfs"
import { Upload } from "lucide-react"
import AnimatedAlert from "@/components/ui/alert"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pdf, setPdf] = useState([])
  const [showUploadModal, setShowUploadModal] = useState(false)

  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

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
        setPdf(data)
        console.log(pdf)
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

  const handleUploadComplete = () => {
    setShowUploadModal(false)
  }

  const handleDeleteRequest = (id: string) => {
    setSelectedPdf(id);
    setShowAlert(true);
  };

  const handleDeletePDF = async () => {
    if (!selectedPdf) return;

    try {
      const res = await fetch(`/api/pdf/${selectedPdf}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete PDF");

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
      });

      // Atualizar lista de PDFs
      setPdf((prev) => prev.filter((pdf: any) => pdf.id !== selectedPdf))
 
    } catch (error) {
      console.error("Error deleting PDF:", error);
    } finally {
      setShowAlert(false);
      setSelectedPdf(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0e0525]">
        <div className="h-32 w-32 animate-pulse rounded-full bg-purple-600/20" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0e0525] to-[#1a0f24]">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onUpload={handleUploadClick} />

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-8"
          >
            <div className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6">
              <h2 className="text-lg font-bold text-white mb-4">PDFs</h2>
              <div className="flex items-center justify-between mb-6">

                <FileUpload
                  onUploadComplete={handleUploadComplete}
                  className=" lg:block w-[100%]"
                  showLabel={true}
                />
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

              <PDFList pdfs={pdf} onDelete={handleDeleteRequest} />
            </div>
          </motion.div>


          <MetricCards />

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
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#151823] rounded-xl border border-purple-900/20 p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-white mb-4">Enviar PDF</h2>
            <FileUpload onUploadComplete={handleUploadComplete} />
            <button
              onClick={() => setShowUploadModal(false)}
              className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              Cancelar
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

