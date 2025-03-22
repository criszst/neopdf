"use client"

import { useState, useEffect } from "react"
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

const periods = ["Semanal", "Mensal", "Anual"]

interface ChartData {
  month: string
  count: number
}

const PeriodSelector = () => {
  const [activePeriod, setActivePeriod] = useState("Mensal")

  return (
    <div>
      {periods.map((period) => (
        <button
          key={period}
          className={`px-4 py-2 rounded-md text-sm ${
            activePeriod === period ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"
          }`}
          onClick={() => setActivePeriod(period)}
        >
          {period}
        </button>
      ))}
    </div>
  )
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
        const response = await fetch("/api/user/stats")

        if (!response.ok) {
          throw new Error("Falha ao buscar estatísticas")
        }

        const data = await response.json()
        setChartData(data.activityData || [])
      } catch (error: any) {
        console.error("Erro ao buscar estatísticas:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formattedChartData = {
    labels: chartData.map((item) => item.month),
    datasets: [
      {
        label: "PDFs Enviados",
        data: chartData.map((item) => item.count),
        fill: true,
        backgroundColor: "rgba(147, 51, 234, 0.2)",
        borderColor: "rgba(147, 51, 234, 0.8)",
        tension: 0.4,
        pointBackgroundColor: "rgba(147, 51, 234, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hoverRadius: 6,
      },
    },
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#151823] rounded-xl border border-purple-900/20 p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Análise de PDFs</h2>
            <p className="text-sm text-zinc-400">Tendências de upload e processamento</p>
          </div>
          <PeriodSelector />
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
        className="bg-[#151823] rounded-xl border border-purple-900/20 p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Análise de PDFs</h2>
            <p className="text-sm text-zinc-400">Tendências de upload e processamento</p>
          </div>
          <PeriodSelector />
        </div>
        <div className="h-[350px] w-full flex items-center justify-center">
          <div className="text-red-400 text-center">Erro ao carregar estatísticas: {error}</div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-[#151823] rounded-xl border border-purple-900/20 p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Análise de PDFs</h2>
          <p className="text-sm text-zinc-400">Tendências de upload e processamento</p>
        </div>
        <PeriodSelector />
      </div>
      <div className="h-[350px] w-full">
        <Line data={formattedChartData} options={chartOptions} />
      </div>
    </motion.div>
  )
}

export default AnalyticsChart

