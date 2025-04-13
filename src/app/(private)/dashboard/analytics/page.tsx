"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "next-auth"
import { motion } from "framer-motion"
import { BarChart2, PieChart, TrendingUp, Calendar, Clock, FileText, Settings } from "lucide-react"

import SideBar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import PageLoading from "@/components/ui/page-loading"
import AnalyticsChart from "@/components/dashboard/chart"
import PdfTypes from "@/components/dashboard/types"
import MetricCards from "@/components/dashboard/metric"

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("analytics")
  const [pdfs, setPdfs] = useState([])

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

  if (loading) {
    return <PageLoading />
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#0A0118]">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/5" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-10" />
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
          onUpload={() => router.push("/dashboard")}
          pdfs={pdfs}
        />

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
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
                <h1 className="text-2xl font-bold text-white">Análise de Dados</h1>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="flex items-center gap-2 bg-[#1A1A2E] text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-sm"
                >
                  <Calendar size={16} />
                  <span>Este mês</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Metrics Cards */}
            <MetricCards />

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-[#151525] backdrop-blur-sm rounded-xl border border-purple-900/20 p-6 shadow-xl shadow-purple-900/5 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-purple-400" />
                      <span>Atividade Mensal</span>
                    </h2>
                  </div>
                  <AnalyticsChart />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-[#151525] backdrop-blur-sm rounded-xl border border-purple-900/20 p-6 shadow-xl shadow-purple-900/5 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-400" />
                      <span>Distribuição de PDFs</span>
                    </h2>
                  </div>
                  <PdfTypes />
                </div>
              </motion.div>
            </div>

            {/* Usage Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8"
            >
              <div className="bg-[#151525] backdrop-blur-sm rounded-xl border border-purple-900/20 p-6 shadow-xl shadow-purple-900/5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    <span>Estatísticas de Uso</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Tempo médio de visualização",
                      value: "3m 42s",
                      icon: Clock,
                      color: "bg-purple-500/10 text-purple-400",
                    },
                    {
                      label: "PDFs mais acessados",
                      value: "Relatório.pdf",
                      icon: FileText,
                      color: "bg-blue-500/10 text-blue-400",
                    },
                    {
                      label: "Horário de pico",
                      value: "14:00 - 16:00",
                      icon: Calendar,
                      color: "bg-green-500/10 text-green-400",
                    },
                  ].map((stat, index) => (
                    <div key={index} className="bg-[#1A1A2E] rounded-lg p-4 border border-purple-900/10">
                      <div className={`h-10 w-10 rounded-full ${stat.color} flex items-center justify-center mb-3`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-white font-medium">{stat.value}</h3>
                      <p className="text-white/50 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - only visible on small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#151525] border-t border-purple-900/20 z-40">
        <div className="flex justify-around py-3">
          {["dashboard", "files", "analytics", "activity", "settings"].map((item, index) => (
            <button
              key={item}
              onClick={() => {
                if (item === "dashboard") {
                  router.push("/dashboard")
                } else if (item === "analytics") {
                  router.push("/analytics")
                } else {
                  setActiveItem(item)
                }
              }}
              className={`relative p-2 ${activeItem === item ? "text-purple-400" : "text-white/70"}`}
            >
              {item === "dashboard" && <BarChart2 size={22} />}
              {item === "files" && <FileText size={22} />}
              {item === "analytics" && <BarChart2 size={22} />}
              {item === "activity" && <Clock size={22} />}
              {item === "settings" && <Settings size={22} />}
            </button>
          ))}
        </div>
      </div>

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
