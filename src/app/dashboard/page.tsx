"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { User } from "next-auth"
import {
  FileText,
  Settings,
  Star,
  Clock,
  Upload,
  MenuIcon,
  Search,
  Bell,
  ChevronDown,
  LayoutGrid,
  Folder,
  Users,
  Activity,
  Download,
  BarChart3,
  PieChart,
  Calendar,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Dados simulados para o gráfico
const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "PDFs Uploaded",
      data: [30, 45, 35, 50, 40, 60],
      fill: true,
      backgroundColor: "rgba(147, 51, 234, 0.1)",
      borderColor: "rgba(147, 51, 234, 0.8)",
      tension: 0.4,
    },
    {
      label: "PDFs Processed",
      data: [25, 35, 40, 45, 35, 55],
      fill: true,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgba(59, 130, 246, 0.8)",
      tension: 0.4,
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
  },
  scales: {
    y: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    x: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
  },
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if (data.success) {
          router.push(`/read/pdf/${data.fileId}`)
        }
      } catch (error) {
        console.error("Error uploading file:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-32 w-32 animate-pulse rounded-full bg-purple-600/20" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F19]">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#151823] border-r border-purple-900/20 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                Neo
              </div>
              <div className="text-2xl font-bold text-white">PDF</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
              <input
                type="text"
                placeholder="Search PDFs..."
                className="w-full bg-[#1C1F2E] border border-purple-500/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {[
              { icon: LayoutGrid, label: "Dashboard", active: true },
              { icon: Folder, label: "My Files" },
              { icon: Star, label: "Starred" },
              { icon: Clock, label: "Recent" },
              { icon: BarChart3, label: "Analytics" },
              { icon: Calendar, label: "Calendar" },
              { icon: Settings, label: "Settings" },
            ].map((item) => (
              <button
                key={item.label}
                className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                  item.active
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Storage */}
          <div className="p-4 mt-auto">
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20">
              <h4 className="text-sm font-medium text-white mb-2">Storage</h4>
              <div className="w-full h-2 bg-[#1C1F2E] rounded-full overflow-hidden">
                <div className="h-full w-[82%] bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" />
              </div>
              <p className="text-xs text-purple-300/70 mt-2">82% of 10GB used</p>
            </div>
          </div>

          {/* User */}
          <div className="p-4 border-t border-purple-900/20">
            <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-white/5 group">
              {user?.image ? (
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-medium">
                  {user?.name?.[0]}
                </div>
              )}
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                  {user?.name}
                </div>
                <div className="text-xs text-zinc-400">{user?.email}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-purple-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-purple-900/20 bg-[#151823] sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(true)} className="mr-4 text-white lg:hidden">
                <MenuIcon className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-white">Analytics Overview</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-zinc-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all duration-200">
                <Bell className="h-5 w-5" />
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-purple-500/20">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload PDF</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {[
              {
                title: "Total PDFs",
                value: "1,234",
                change: "+12.5%",
                icon: FileText,
                color: "purple",
              },
              {
                title: "Active Users",
                value: "2,543",
                change: "+8.2%",
                icon: Users,
                color: "blue",
              },
              {
                title: "Processing Time",
                value: "1.2s",
                change: "-15.3%",
                icon: Activity,
                color: "green",
              },
              {
                title: "Downloads",
                value: "8,234",
                change: "+22.4%",
                icon: Download,
                color: "pink",
              },
            ].map((metric, i) => (
              <Card key={i} className="bg-[#151823] border-purple-900/20 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-lg bg-${metric.color}-500/10 flex items-center justify-center`}>
                      <metric.icon className={`h-6 w-6 text-${metric.color}-400`} />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        metric.change.startsWith("+") ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                  <p className="text-sm text-zinc-400">{metric.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico Principal */}
          <Card className="mb-8 bg-[#151823] border-purple-900/20">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <CardTitle>PDF Analytics</CardTitle>
                  <CardDescription>Upload and processing trends</CardDescription>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <button className="px-3 py-1 text-sm text-purple-400 bg-purple-500/10 rounded-lg hover:bg-purple-500/20">
                    Weekly
                  </button>
                  <button className="px-3 py-1 text-sm text-zinc-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10">
                    Monthly
                  </button>
                  <button className="px-3 py-1 text-sm text-zinc-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10">
                    Yearly
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Cards Inferiores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-[#151823] border-purple-900/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <button className="p-1 hover:bg-purple-500/10 rounded">
                    <MenuIcon className="h-4 w-4 text-zinc-400" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-500/5 transition-colors group"
                    >
                      <div className="rounded-lg bg-purple-500/10 p-2 border border-purple-500/20">
                        <FileText className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                          Document_{i}.pdf
                        </p>
                        <p className="text-xs text-zinc-400">Processed • 2h ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#151823] border-purple-900/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>PDF Types</CardTitle>
                  <button className="p-1 hover:bg-purple-500/10 rounded">
                    <PieChart className="h-4 w-4 text-zinc-400" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Documents", percentage: 45, color: "purple" },
                    { type: "Forms", percentage: 30, color: "blue" },
                    { type: "Presentations", percentage: 25, color: "pink" },
                  ].map((item) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">{item.type}</span>
                        <span className="text-white font-medium">{item.percentage}%</span>
                      </div>
                      <div className="h-2 bg-[#1C1F2E] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${item.color}-500 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#151823] border-purple-900/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quick Actions</CardTitle>
                  <button className="p-1 hover:bg-purple-500/10 rounded">
                    <Settings className="h-4 w-4 text-zinc-400" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 hover:bg-purple-500/20 transition-all duration-200 group">
                    <Upload className="h-5 w-5 text-purple-400" />
                    <span className="text-white group-hover:text-purple-400 transition-colors">Upload PDF</span>
                  </button>
                  {[
                    { icon: MenuIcon, label: "Merge PDFs" },
                    { icon: Star, label: "View Favorites" },
                    { icon: Settings, label: "Settings" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg border border-purple-900/20 hover:bg-purple-500/10 transition-all duration-200 group"
                    >
                      <action.icon className="h-5 w-5 text-zinc-400 group-hover:text-purple-400 transition-colors" />
                      <span className="text-white group-hover:text-purple-400 transition-colors">{action.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}