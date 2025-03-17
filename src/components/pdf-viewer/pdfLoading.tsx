"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function PDFLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-6">
          <div className="h-20 w-16 rounded-md bg-gradient-to-br from-purple-500/20 to-purple-700/20 shadow-lg" />
          <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-purple-600 p-1">
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          </div>
        </div>
        <p className="text-lg font-medium text-white">Carregando PDF</p>
        <p className="mt-1 text-sm text-zinc-400">Preparando seu documento...</p>
      </motion.div>
    </div>
  )
}

