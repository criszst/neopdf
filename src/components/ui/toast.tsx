"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, AlertCircle, Info } from 'lucide-react'

interface ToastProps {
  title: string
  message: string
  type?: "success" | "error" | "info"
  duration?: number
  onClose?: () => void
}

const ToastComponent = ({ 
  title, 
  message, 
  type = "success", 
  duration = 5000,
  onClose 
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) setTimeout(onClose, 300) // Allow animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) setTimeout(onClose, 300)
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5" />
      case "error":
        return <AlertCircle className="h-5 w-5" />
      case "info":
        return <Info className="h-5 w-5" />
      default:
        return <Check className="h-5 w-5" />
    }
  }

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-100 dark:bg-green-800/20",
          text: "text-green-500 dark:text-green-400",
          border: "border-green-500/20",
          progress: "bg-green-500"
        }
      case "error":
        return {
          bg: "bg-red-100 dark:bg-red-800/20",
          text: "text-red-500 dark:text-red-400",
          border: "border-red-500/20",
          progress: "bg-red-500"
        }
      case "info":
        return {
          bg: "bg-blue-100 dark:bg-blue-800/20",
          text: "text-blue-500 dark:text-blue-400",
          border: "border-blue-500/20",
          progress: "bg-blue-500"
        }
      default:
        return {
          bg: "bg-green-100 dark:bg-green-800/20",
          text: "text-green-500 dark:text-green-400",
          border: "border-green-500/20",
          progress: "bg-green-500"
        }
    }
  }

  const colors = getColors()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="flex overflow-hidden rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className={`flex w-12 flex-shrink-0 items-center justify-center ${colors.bg}`}>
              <div className={colors.text}>
                {getIcon()}
              </div>
            </div>
            <div className="w-full p-4 pr-8">
              <div className="mb-1 font-medium">{title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{message}</div>
              
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: duration / 1000, ease: "linear" }}
                  className={`h-full ${colors.progress}`}
                />
              </div>
            </div>
            <button
              onClick={handleClose}
              className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ToastComponent
