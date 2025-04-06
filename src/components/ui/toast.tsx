"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, AlertCircle, Info } from "lucide-react"

interface ToastProps {
  title: string
  message: string
  type?: "success" | "error" | "info"
  onClose: () => void
  duration?: number
}

export default function ToastComponent({ title, message, type = "success", onClose, duration = 5000 }: ToastProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100)
        return newProgress < 0 ? 0 : newProgress
      })
    }, 100)

    // Auto-close after duration
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-400" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-purple-400" />
    }
  }

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          progress: "bg-gradient-to-r from-green-400 to-green-600",
        }
      case "error":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          progress: "bg-gradient-to-r from-red-400 to-red-600",
        }
      case "info":
      default:
        return {
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
          progress: "bg-gradient-to-r from-purple-400 to-purple-600",
        }
    }
  }

  const colors = getColors()

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 50 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20, x: 20 }}
      transition={{ duration: 0.3, type: "spring", damping: 20 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <div
        className={`flex overflow-hidden rounded-lg border ${colors.border} bg-[#151823] shadow-lg shadow-purple-900/10`}
      >
        <div className={`flex w-12 flex-shrink-0 items-center justify-center ${colors.bg}`}>{getIcon()}</div>
        <div className="w-full p-4 pr-8">
          <div className="mb-1 font-medium text-white">{title}</div>
          <div className="text-sm text-gray-300">{message}</div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-[#0e0525]">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
              className={`h-full ${colors.progress}`}
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

