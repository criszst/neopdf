"use client"

import { useEffect, useState } from "react"
import { FileText, Star, Clock, HardDrive } from 'lucide-react'
import { motion } from "framer-motion"
import UserStats from "@/lib/interfaces/UserStats"

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

  // Função para formatar bytes em unidades legíveis
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
      icon: Star,
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 p-4 sm:p-6 flex items-center justify-center h-24 sm:h-32 animate-pulse"
          >
            <div className="h-8 sm:h-10 w-8 sm:w-10 bg-purple-600/20 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6 mb-8"
      >
        <div className="h-[100px] w-full flex items-center justify-center">
          <div className="text-red-400 text-center">Erro ao carregar estatísticas: {error}</div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-gradient-to-br from-[#151823]/90 to-[#1a0f24]/90 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6 shadow-lg shadow-purple-900/5 overflow-hidden relative group"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Icon with animation */}
          <div className="relative z-10 mb-4">
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <motion.div
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <metric.icon className="h-6 w-6 text-purple-400" />
              </motion.div>
            </div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <p className="text-sm text-white/70 mb-1">{metric.title}</p>
            <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
            <p className={`text-xs ${metric.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
              {metric.change}
            </p>
          </div>
          
          {/* Decorative element */}
          <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-purple-500/5 blur-xl" />
        </motion.div>
      ))}
    </div>
  )
}

export default MetricCards
