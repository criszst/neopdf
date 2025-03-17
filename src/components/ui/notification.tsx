"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react"

interface NotificationProps {
  title: string
  message: string
  type?: "success" | "warning" | "info"
  isOpen: boolean
  onClose: () => void
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export default function Notification({
  title,
  message,
  type = "info",
  isOpen,
  onClose,
  duration = 5000,
  action,
}: NotificationProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!isOpen) return

    // Reset progress when notification opens
    setProgress(100)

    // Auto-close after duration
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100)
        return newProgress < 0 ? 0 : newProgress
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [isOpen, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-400" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-purple-400" />
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-l-4 border-l-green-500"
      case "warning":
        return "border-l-4 border-l-amber-500"
      case "info":
      default:
        return "border-l-4 border-l-purple-500"
    }
  }

  const getProgressColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-amber-500"
      case "info":
      default:
        return "bg-purple-500"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed top-20 right-4 z-50 max-w-sm w-full shadow-2xl"
        >
          <div className={`bg-[#151823] ${getBorderColor()} rounded-lg overflow-hidden shadow-lg shadow-purple-900/20`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">{getIcon()}</div>
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="text-white font-medium text-base">{title}</h3>
                  <p className="text-zinc-300 text-sm mt-1">{message}</p>

                  {action && (
                    <button
                      onClick={action.onClick}
                      className="mt-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {action.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 text-zinc-400 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full bg-[#0e0525]">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                className={`h-full ${getProgressColor()}`}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

