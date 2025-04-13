"use client"

import { useEffect, useState } from "react"
import { FileText, MoreHorizontal, Download, Eye, Trash2, Star, Share, ArrowRight } from 'lucide-react'
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Activity {
  id: string
  type: "UPLOAD" | "VIEW" | "DOWNLOAD" | "DELETE" | "STAR" | "UNSTAR" | "SHARE"
  details?: string
  createdAt: string
  pdf?: {
    id: string
    name: string
    fileType: string
  }
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true)
        const response = await fetch("/api/activity/recent")

        if (!response.ok) {
          throw new Error("Falha ao buscar atividades recentes")
        }

        const data = await response.json()
        setActivities(data)
      } catch (error: any) {
        console.error("Erro ao buscar atividades:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "UPLOAD":
        return <FileText className="h-5 w-5 text-purple-400" />
      case "VIEW":
        return <Eye className="h-5 w-5 text-blue-400" />
      case "DOWNLOAD":
        return <Download className="h-5 w-5 text-green-400" />
      case "DELETE":
        return <Trash2 className="h-5 w-5 text-red-400" />
      case "STAR":
        return <Star className="h-5 w-5 text-yellow-400" />
      case "UNSTAR":
        return <Star className="h-5 w-5 text-yellow-400" />
      case "SHARE":
        return <Share className="h-5 w-5 text-pink-400" />
      default:
        return <FileText className="h-5 w-5 text-purple-400" />
    }
  }

  const getActivityText = (activity: Activity) => {
    const pdfName = activity.pdf?.name || "um documento"

    switch (activity.type) {
      case "UPLOAD":
        return `Você enviou ${pdfName}`
      case "VIEW":
        return `Você visualizou ${pdfName}`
      case "DOWNLOAD":
        return `Você baixou ${pdfName}`
      case "DELETE":
        return `Você excluiu ${pdfName}`
      case "STAR":
        return `Você favoritou ${pdfName}`
      case "UNSTAR":
        return `Você removeu ${pdfName} dos favoritos`
      case "SHARE":
        return `Você compartilhou ${pdfName}`
      default:
        return `Atividade com ${pdfName}`
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-[#151525] backdrop-blur-sm rounded-xl border border-purple-900/20 h-full shadow-lg"
      >
        <div className="p-6 h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Atividades Recentes</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-3 rounded-lg border border-transparent animate-pulse"
              >
                <div className="rounded-lg bg-purple-500/10 p-2.5 border border-purple-500/20">
                  <div className="h-5 w-5 bg-purple-400/30 rounded" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-[#151525] backdrop-blur-sm rounded-xl border border-purple-900/20 h-full shadow-lg"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Atividades Recentes</h2>
          </div>
          <div className="text-red-400 text-center p-4">Erro ao carregar atividades: {error}</div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-[#151525] backdrop-blur-sm rounded-xl border border-purple-900/20 h-full shadow-lg"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Atividades Recentes</h2>
          <div className="flex items-center gap-2">
            <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Ver todas</button>
            <ArrowRight size={14} className="text-purple-400" />
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">Nenhuma atividade recente</div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-500/5 transition-colors group border border-transparent hover:border-purple-500/20"
              >
                <div className="rounded-lg bg-[#1A1A2E] p-2.5 border border-purple-500/20">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                    {getActivityText(activity)}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>

                {activity.pdf && (
                  <a
                    href={`/pdf/${activity.pdf.id}`}
                    className="p-2 rounded-full text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </motion.div>
  )
}

export default RecentActivity
