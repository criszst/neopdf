"use client"

import React, { useEffect, useState } from "react"
import { FileText, Users, Clock, HardDrive } from 'lucide-react'
import { motion } from "framer-motion"
import MetricCard from "./metric"

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
        const response = await fetch('/api/user/stats')
        
        if (!response.ok) {
          throw new Error('Falha ao buscar estatísticas')
        }
        
        const data = await response.json()
        setStats(data)
      } catch (error: any) {
        console.error('Erro ao buscar estatísticas:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  // Função para formatar bytes em unidades legíveis
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const metrics = [
    {
      title: "Total PDFs",
      value: stats ? stats.totalPdfs.toString() : "...",
      change: "+12.5%",
      icon: FileText,
      color: "purple",
    },
    {
      title: "PDFs Favoritos",
      value: stats ? stats.starredPdfs.toString() : "...",
      change: "+8.2%",
      icon: Users,
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
      value: stats ? formatBytes(stats.storage.used) : "...",
      change: stats ? `${stats.storage.percentage.toFixed(1)}%` : "...",
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
        >
          <MetricCard />
        </motion.div>
      ))}
    </div>
  )
}

export default MetricCards
