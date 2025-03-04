import React from "react"
import { type LucideIcon } from 'lucide-react'
import { motion } from "framer-motion"

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  color: "purple" | "blue" | "green" | "pink"
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change.startsWith("+")
  
  const colorMap = {
    purple: {
      bg: "from-purple-500/10 to-purple-600/5",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      changeColor: isPositive ? "text-green-400" : "text-red-400"
    },
    blue: {
      bg: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      changeColor: isPositive ? "text-green-400" : "text-red-400"
    },
    green: {
      bg: "from-green-500/10 to-green-600/5",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      changeColor: isPositive ? "text-green-400" : "text-red-400"
    },
    pink: {
      bg: "from-pink-500/10 to-pink-600/5",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-400",
      changeColor: isPositive ? "text-green-400" : "text-red-400"
    }
  }

  const colors = colorMap[color]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 overflow-hidden relative group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`h-12 w-12 rounded-lg ${colors.iconBg} flex items-center justify-center border border-purple-500/20`}>
            <Icon className={`h-6 w-6 ${colors.iconColor}`} />
          </div>
          <span className={`text-sm font-medium ${colors.changeColor}`}>
            {change}
          </span>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-zinc-400">{title}</p>
      </div>
    </motion.div>
  )
}

export default MetricCard
