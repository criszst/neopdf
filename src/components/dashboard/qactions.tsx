"use client"

import React, { useState } from "react"
import { Upload, MenuIcon, Star, Settings, Plus } from 'lucide-react'
import { AnimatePresence, motion } from "framer-motion"
import FileUpload from "@/components/animations/FileUpload"
import ToastProps from "@/lib/props/ToastProps"
import ToastComponent from "../ui/toast"

interface QuickActionsProps {
  onUpload: () => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ onUpload }) => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [toast, setToast] = useState<ToastProps>()

  const handleUpload = (data: any) => {
    setShowUploadModal(false)

    setToast({
      show: true,
      type: "success",
      title: "Upload Concluído",
      message: `${data.name} foi enviado com sucesso!`,
    })
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 h-full shadow-lg shadow-purple-900/5"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Ações Rápidas</h2>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(147, 51, 234, 0.1)" }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg hover:bg-purple-500/10 text-zinc-400 hover:text-purple-400 transition-colors"
          >
            <Settings className="h-5 w-5" />
          </motion.button>
        </div>
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl p-6 border border-purple-500/20 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 border border-purple-500/30"
            >
              <Upload className="h-6 w-6 text-purple-400" />
            </motion.div>
            <p className="text-white mb-1">Arraste e solte seu PDF aqui</p>
            <p className="text-zinc-400 text-sm mb-4">ou clique para selecionar</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onUpload} 
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg text-white text-sm transition-colors shadow-md shadow-purple-500/20"
            >
              Upload PDF
            </motion.button>
          </motion.div>

          <div className="space-y-2">
            {[
              { icon: MenuIcon, label: "Mesclar PDFs" },
              { icon: Star, label: "Ver Favoritos" },
              { icon: Settings, label: "Configurações" },
            ].map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                whileHover={{ 
                  x: 5, 
                  backgroundColor: "rgba(147, 51, 234, 0.1)",
                  borderColor: "rgba(147, 51, 234, 0.3)",
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg border border-purple-900/20 hover:bg-purple-500/10 transition-all duration-200 group"
              >
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <action.icon className="h-4 w-4 text-zinc-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <span className="text-white group-hover:text-purple-400 transition-colors">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast?.show && (
          <ToastComponent
            title={toast.title}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default QuickActions
