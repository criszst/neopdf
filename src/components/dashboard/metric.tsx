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
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6 flex items-center justify-center h-32 animate-pulse"
          >
            <div className="h-10 w-10 bg-purple-600/20 rounded-full" />
          </div>
        ))}
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6"
      >
        <div className="h-[100px] w-full flex items-center justify-center">
          <div className="text-red-400 text-center">Erro ao carregar estatísticas: {error}</div>
        </div>
      </motion.div>
    )
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6 flex flex-col items-center text-white"
        >
          <metric.icon className="w-10 h-10 mb-4 text-purple-500" />
          <p className="text-lg font-semibold">{metric.title}</p>
          <p className="text-2xl font-bold">{metric.value}</p>
          <p className="text-sm text-zinc-400">{metric.change}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default MetricCards
