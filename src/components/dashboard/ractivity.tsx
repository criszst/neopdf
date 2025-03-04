import React from "react"
import { FileText, MoreHorizontal } from 'lucide-react'
import { motion } from "framer-motion"

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      name: "Document_1.pdf",
      time: "2h ago",
      status: "Processed",
    },
    {
      id: 2,
      name: "Document_2.pdf",
      time: "2h ago",
      status: "Processed",
    },
    {
      id: 3,
      name: "Document_3.pdf",
      time: "2h ago",
      status: "Processed",
    },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 h-full"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          <button className="p-1.5 rounded-lg hover:bg-purple-500/10 text-zinc-400 hover:text-purple-400 transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-500/5 transition-colors group border border-transparent hover:border-purple-500/20"
            >
              <div className="rounded-lg bg-purple-500/10 p-2.5 border border-purple-500/20">
                <FileText className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                  {activity.name}
                </p>
                <p className="text-xs text-zinc-400">
                  {activity.status} • {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default RecentActivity
