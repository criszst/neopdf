"use client"

import React, { useState, useEffect } from "react"
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
import { motion } from "framer-motion"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

const periods = ["Semanal", "Mensal", "Anual"]

interface ChartData {
  month: string
  count: number
}

const AnalyticsChart = () => {
  const [activePeriod, setActivePeriod] = useState("Mensal")
  const [chartData, setChartData] = useState<ChartData[]>([])
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
        setChartData(data.activityData || [])
      } catch (error: any) {
        console.error('Erro ao buscar estatísticas:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  const formattedChartData = {
    labels: chartData.map(item => item.month),
    datasets: [
      {
        label: "PDFs Enviados",
        data: chartData.map(item => item.count),
        fill: true,
        backgroundColor: "rgba(147, 51, 234, 0.2)",
        borderColor: "rgba(147, 51, 234, 0.8)",
        tension: 0.4,
        pointBackgroundColor: "rgba(147, 51, 234, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        borderColor: "rgba(147, 51, 234, 0.3)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: 11,
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Análise de PDFs</h2>
            <p className="text-sm text-zinc-400">Tendências de upload e processamento</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0 bg-[#0e0525]/50 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  activePeriod === period
                    ? "bg-purple-500 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[350px] w-full flex items-center justify-center">
          <div className="h-32 w-32 animate-pulse rounded-full bg-purple-600/20" />
        </div>
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Análise de PDFs</h2>
            <p className="text-sm text-zinc-400">Tendências de upload e processamento</p>
          </div>
        </div>
        <div className="h-[350px] w-full flex items-center justify-center">
          <div className="text-red-400 text-center">
            Erro ao carregar estatísticas: {error}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Análise de PDFs</h2>
          <p className="text-sm text-zinc-400">Tendências de upload e processamento</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0 bg-[#0e0525]/50 rounded-lg p-1">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                activePeriod === period
                  ? "bg-purple-500 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[350px] w-full">
        <Line data={formattedChartData} options={chartOptions} />
      </div>
    </motion.div>
  )
}

export default AnalyticsChart
