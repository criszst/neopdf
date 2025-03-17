"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
}

export default function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: {
      outer: "h-16 w-16",
      inner: "h-10 w-10",
      text: "text-sm",
    },
    md: {
      outer: "h-24 w-24",
      inner: "h-16 w-16",
      text: "text-base",
    },
    lg: {
      outer: "h-32 w-32",
      inner: "h-20 w-20",
      text: "text-lg",
    },
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <motion.div
          className={`${sizeMap[size].outer} rounded-full border-t-4 border-b-4 border-purple-500/30`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={`${sizeMap[size].inner} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-t-4 border-b-4 border-purple-600`}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500"
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          style={{ width: "30%", height: "30%" }}
        />
      </div>
      {text && (
        <motion.p
          className={`mt-4 font-medium text-white ${sizeMap[size].text}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}
