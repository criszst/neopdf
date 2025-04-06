"use client"

import { motion } from "framer-motion"
import { Loader2, FileText } from "lucide-react"

export default function PDFLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        <div className="relative mb-6">
          <div className="h-24 w-20 rounded-lg bg-gray-100 flex items-center justify-center dark:bg-gray-700">
            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-purple-600 p-1.5 shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        </div>
        <p className="text-xl font-medium text-gray-800 dark:text-white">Carregando PDF</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Preparando seu documento...</p>

        <motion.div
          className="w-48 h-1.5 bg-gray-200 rounded-full mt-4 overflow-hidden dark:bg-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="h-full bg-purple-600"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

