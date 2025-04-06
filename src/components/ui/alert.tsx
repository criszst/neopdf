"use client"

import { motion } from "framer-motion"
import { AlertCircle, Loader2 } from 'lucide-react'

interface AnimatedAlertProps {
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function AnimatedAlert({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isLoading = false,
}: AnimatedAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-[#151823] rounded-xl border border-purple-900/20 p-6 max-w-md w-full shadow-2xl shadow-purple-900/20"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-red-900/20 rounded-full p-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-zinc-300 text-sm">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors disabled:opacity-50"
          >
            {cancelText}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-red-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              confirmText
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
