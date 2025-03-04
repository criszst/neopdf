"use client"

import React, { useState } from "react"
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

const periods = ["Weekly", "Monthly", "Yearly"]

const AnalyticsChart = () => {
  const [activePeriod, setActivePeriod] = useState("Weekly")

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "PDFs Uploaded",
        data: [30, 45, 35, 50, 40, 60],
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
      {
        label: "PDFs Processed",
        data: [25, 35, 40, 45, 35, 55],
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 0.8)",
        tension: 0.4,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">PDF Analytics</h2>
          <p className="text-sm text-zinc-400">Upload and processing trends</p>
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
        <Line data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  )
}

export default AnalyticsChart
