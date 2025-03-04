import React from "react"
import { Upload, MenuIcon, Star, Settings } from 'lucide-react'
import { motion } from "framer-motion"

const QuickActions = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 h-full"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Quick Actions</h2>
          <button className="p-1.5 rounded-lg hover:bg-purple-500/10 text-zinc-400 hover:text-purple-400 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-transparent border border-purple-500/20 hover:bg-purple-500/30 transition-all duration-200 group">
            <Upload className="h-5 w-5 text-purple-400" />
            <span className="text-white group-hover:text-purple-400 transition-colors">Upload PDF</span>
          </button>
          {[
            { icon: MenuIcon, label: "Merge PDFs" },
            { icon: Star, label: "View Favorites" },
            { icon: Settings, label: "Settings" },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-purple-900/20 hover:bg-purple-500/10 transition-all duration-200 group"
            >
              <action.icon className="h-5 w-5 text-zinc-400 group-hover:text-purple-400 transition-colors" />
              <span className="text-white group-hover:text-purple-400 transition-colors">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default QuickActions
