import React from "react"
import { PieChart } from 'lucide-react'
import { motion } from "framer-motion"

const PdfTypes = () => {
  const types = [
    { type: "Documents", percentage: 45, color: "purple" },
    { type: "Forms", percentage: 30, color: "blue" },
    { type: "Presentations", percentage: 25, color: "pink" },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 h-full"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">PDF Types</h2>
          <button className="p-1.5 rounded-lg hover:bg-purple-500/10 text-zinc-400 hover:text-purple-400 transition-colors">
            <PieChart className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-5">
          {types.map((item) => (
            <div key={item.type} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-300">{item.type}</span>
                <span className="text-white font-medium">{item.percentage}%</span>
              </div>
              <div className="h-2.5 bg-[#1C1F2E] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full rounded-full ${
                    item.color === "purple"
                      ? "bg-gradient-to-r from-purple-400 to-purple-600"
                      : item.color === "blue"
                      ? "bg-gradient-to-r from-blue-400 to-blue-600"
                      : "bg-gradient-to-r from-pink-400 to-pink-600"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default PdfTypes
