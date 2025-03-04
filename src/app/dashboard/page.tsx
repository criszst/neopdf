"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "next-auth"
import { FileText, Users, Activity, Download } from "lucide-react"
import { motion } from "framer-motion"

import SideBar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import MetricCard from "@/components/dashboard/metric"
import AnalyticsChart from "@/components/dashboard/chart"
import RecentActivity from "@/components/dashboard/ractivity"
import PdfTypes from "@/components/dashboard/types"
import QuickActions from "@/components/dashboard/qactions"

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

  const handleUploadClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf"
    input.onchange = (e: Event) => handleFileUpload(e as unknown as React.ChangeEvent<HTMLInputElement>)
    input.click()
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0e0525]">
        <div className="h-32 w-32 animate-pulse rounded-full bg-purple-600/20" />
      </div>
    )
  }

  const metrics = [
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
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0e0525] to-[#1a0f24]">
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onUpload={handleUploadClick} />

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <MetricCard {...metric} color="purple" />
              </motion.div>
            ))}
          </div>

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
    </div>
  )
}

