"use client"

import { motion } from "framer-motion"

export default function PageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#0A0118] to-[#1A0F24]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        <div className="mb-8 relative">
          {/* Logo animation */}
          <div className="relative">
            <motion.div
              className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-700/20 flex items-center justify-center mx-auto"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-700/30 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <motion.div
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl"
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  N
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Orbiting elements */}
            <motion.div
              className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ transformOrigin: "center center" }}
            >
              <motion.div className="absolute h-3 w-3 rounded-full bg-purple-500" style={{ top: "10%", left: "50%" }} />
            </motion.div>

            <motion.div
              className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
              animate={{ rotate: -360 }}
              transition={{
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ transformOrigin: "center center" }}
            >
              <motion.div
                className="absolute h-2 w-2 rounded-full bg-blue-500"
                style={{ bottom: "15%", right: "30%" }}
              />
            </motion.div>
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-white mb-2"
        >
          NeoPDF
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-purple-300 mb-8"
        >
          Carregando sua experiência personalizada...
        </motion.p>

        <motion.div
          className="flex space-x-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-purple-500 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
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
      </motion.div>
    </div>
  )
}

