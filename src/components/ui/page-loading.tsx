"use client"

import { motion } from "framer-motion"
import LoadingSpinner from "../animations/LoadingSpinner"

export default function PageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#0e0525] to-[#1a0f24]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <LoadingSpinner size="lg" text="Carregando..." />
        </div>

        <motion.div
          className="flex space-x-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-purple-500 rounded-full"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>

        <motion.div
          className="mt-8 text-white/70 text-sm max-w-xs text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Preparando sua experiência personalizada...</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

