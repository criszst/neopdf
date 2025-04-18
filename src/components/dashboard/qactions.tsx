"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, FilePlus, FileSearch, FileCheck, Zap } from "lucide-react"
import ToastComponent from "@/components/ui/toast"
import type ToastProps from "@/lib/props/ToastProps"
import fetchPDFs from "@/lib/api/pdfs"
import Pdf from "@/lib/props/PdfProps"
import Activity from "@/lib/interfaces/UserActivity"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

interface QuickActionsProps {
  onUpload: () => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ onUpload }) => {
  const [toast, setToast] = useState<ToastProps>({
    show: false,
    type: "success",
    title: "",
    message: "",
  })

  const [activity, setActivities] = useState<Activity[]>([])

  const showToast = (title: string, message: string, type: "success" | "info" | "error" = "success") => {
    setToast({
      show: true,
      type,
      title,
      message,
    })
  }

  const actions = [
    {
      icon: FilePlus,
      label: "Novo PDF",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      onClick: onUpload,
    },
    {
      icon: FileSearch,
      label: "Analisar PDF",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      onClick: () => showToast("Em breve", "Esta funcionalidade estará disponível em breve!", "info"),
    },
    {
      icon: FileCheck,
      label: "Assinar PDF",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      onClick: () => showToast("Em breve", "Esta funcionalidade estará disponível em breve!", "info"),
    },
    {
      icon: Zap,
      label: "Extrair texto",
      color: "bg-gradient-to-r from-amber-500 to-amber-600",
      onClick: () => showToast("Em breve", "Esta funcionalidade estará disponível em breve!", "info"),
    },
  ] 

  useEffect(() => {
    async function fetchActivities() {
      try {

        const response = await fetch("/api/activity/recent")

        if (!response.ok) {
          throw new Error("Falha ao buscar atividades recentes")
        }

        const data = await response.json()
        setActivities(data)
      } catch (error: any) {
        console.error("Erro ao buscar atividades:", error)

      }
    }

    fetchActivities()
  }, [])

  return (
    <div className="bg-[#151525] backdrop-blur-sm rounded-xl border border-purple-900/20 h-full shadow-lg shadow-purple-900/5">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Ações Rápidas</h2>
        </div>

        <div className="space-y-4">


          {/* Quick action buttons */}
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={`${action.color} rounded-lg p-4 text-white shadow-lg flex flex-col items-center justify-center text-center h-24`}
              >
                <action.icon className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>



          <div className="mt-4">
            <h3 className="text-sm font-medium text-white/70 mb-3">Arquivos recentes</h3>
            <div className="space-y-2">
              {activity
                .filter((file, index, self) => 
                  file.pdf?.name && index === self.findIndex(f => f.pdf?.id === file.pdf?.id)
                )
                .slice(0, 3)
                .map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center p-2 rounded-lg bg-[#1A1A2E] hover:bg-[#251539] transition-colors"
                >
                  <div className="h-8 w-8 rounded-md bg-[#0A0118] flex items-center justify-center mr-3">
                    <FileText size={16} className="text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/pdf/${file.pdf?.id}`} className="text-sm font-medium text-white truncate">
                    <p className="text-sm text-white truncate">{file.pdf?.name || `Arquivo ${index + 1}`}</p>
                    <p className="text-xs text-white/50">
                        Acessado {formatDistanceToNow(file.createdAt,
                       { addSuffix: true, locale: ptBR })}</p>
                       </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast.show && (
          <ToastComponent
            title={toast.title}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuickActions
