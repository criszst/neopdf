"use client"

import React, { useEffect, useState } from "react"
import { FileText, Clock, HardDrive } from "lucide-react"
import { motion } from "framer-motion"

interface UserStats {
  totalPdfs: number
  starredPdfs: number
  storage: {
    used: number
    limit: number
    percentage: number
  }
}

const MetricCards = () => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const response = await fetch("/api/user/stats")

        if (!response.ok) {
          throw new Error("Falha ao buscar estatísticas")
        }

        const data = await response.json()
        setStats(data)
      } catch (error: any) {
        console.error("Erro ao buscar estatísticas:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  if (error) {
    return <p className="text-red-500">Erro: {error}</p>
  }

  const metrics = [
    {
      title: "Total PDFs",
      value: stats ? stats.totalPdfs.toString() : "0",
      change: "+12.5%",
      icon: FileText,
      color: "purple",
    },
    {
      title: "PDFs Favoritos",
      value: stats ? stats.starredPdfs.toString() : "0",
      change: "+8.2%",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Tempo Médio",
      value: "1.2s",
      change: "-15.3%",
      icon: Clock,
      color: "green",
    },
    {
      title: "Armazenamento",
      value: stats ? formatBytes(stats.storage.used) : "0 Bytes",
      change: stats ? `${stats.storage.percentage.toFixed(1)}%` : "0%",
      icon: HardDrive,
      color: "pink",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`p-4 rounded-lg shadow-md bg-${metric.color}-100`}
        >
          <div className="flex items-center space-x-4">
            <metric.icon className={`text-${metric.color}-500 w-6 h-6`} />
            <div>
              <p className="text-lg font-semibold">{metric.title}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.change}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default MetricCards
