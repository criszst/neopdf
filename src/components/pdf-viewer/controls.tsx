"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus, Minus, Maximize, RotateCw, Printer, SlidersHorizontal } from "lucide-react"

interface ControlsProps {
  pageNumber: number
  numPages: number | null
  scale: number
  onPreviousPage: () => void
  onNextPage: () => void
  onPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onRotate?: () => void
  onPrint?: () => void
}

export default function Controls({
  pageNumber,
  numPages,
  scale,
  onPreviousPage,
  onNextPage,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onRotate,
  onPrint,
}: ControlsProps) {
  const [showMoreControls, setShowMoreControls] = useState(false)

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  }

  return (
    <div className="border-t border-purple-900/20 bg-[#151823]/90 backdrop-blur-md px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Page navigation controls */}
          <div className="flex items-center rounded-lg bg-[#0e0525]/80 p-1">
            <motion.button
              onClick={onPreviousPage}
              disabled={pageNumber <= 1}
              className="rounded-md p-1.5 text-purple-300/70 transition-colors hover:bg-purple-500/10 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Página anterior"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <ChevronLeft size={18} />
            </motion.button>

            <div className="flex items-center px-1">
              <input
                type="text"
                value={pageNumber}
                onChange={onPageChange}
                className="w-10 rounded border border-purple-900/30 bg-[#0e0525]/80 px-1.5 py-0.5 text-center text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                aria-label="Número da página atual"
              />
              <span className="mx-1 text-sm text-purple-300/70">de</span>
              <span className="text-sm text-white">{numPages || "-"}</span>
            </div>

            <motion.button
              onClick={onNextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="rounded-md p-1.5 text-purple-300/70 transition-colors hover:bg-purple-500/10 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Próxima página"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center rounded-lg bg-[#0e0525]/80 p-1">
            <motion.button
              onClick={onZoomOut}
              className="rounded-md p-1.5 text-purple-300/70 transition-colors hover:bg-purple-500/10 hover:text-purple-400"
              aria-label="Diminuir zoom"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Minus size={18} />
            </motion.button>

            <span className="px-2 text-sm font-medium text-white">{Math.round(scale * 100)}%</span>

            <motion.button
              onClick={onZoomIn}
              className="rounded-md p-1.5 text-purple-300/70 transition-colors hover:bg-purple-500/10 hover:text-purple-400"
              aria-label="Aumentar zoom"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Plus size={18} />
            </motion.button>
          </div>
        </div>

        {/* Desktop action buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 z-10">
            {onRotate && (
              <motion.button
                onClick={onRotate}
                className="rounded-md bg-[#0e0525]/80 p-2 text-purple-300/70 transition-colors hover:bg-purple-500/10 hover:text-purple-400"
                aria-label="Rotacionar"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <RotateCw size={18} />
              </motion.button>
            )}

            <motion.button
              className="rounded-md bg-[#0e0525]/80 p-2 text-purple-300/70 transition-colors hover:bg-purple-500/10 hover:text-purple-400"
              aria-label="Tela cheia"
              onClick={() => {
                const elem = document.documentElement
                if (!document.fullscreenElement) {
                  elem.requestFullscreen().catch((err) => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message}`)
                  })
                } else {
                  document.exitFullscreen()
                }
              }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Maximize size={18} />
            </motion.button>

            {onPrint && (
              <motion.button
                onClick={onPrint}
                className="rounded-md bg-[#0e0525]/80 p-2 text-purple-300/70 transition-colors hover:bg-purple-500/10 hover:text-purple-400"
                aria-label="Imprimir"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Printer size={18} />
              </motion.button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <motion.button
            onClick={() => setShowMoreControls(!showMoreControls)}
            className="md:hidden rounded-md bg-purple-600 p-2 text-white transition-colors hover:bg-purple-700"
            aria-label="Mais opções"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            animate={{
              boxShadow: showMoreControls
                ? "0 0 0 rgba(139, 92, 246, 0)"
                : ["0 0 0 rgba(139, 92, 246, 0)", "0 0 10px rgba(139, 92, 246, 0.5)", "0 0 0 rgba(139, 92, 246, 0)"],
            }}
            transition={{
              duration: 2,
              repeat: showMoreControls ? 0 : Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <SlidersHorizontal size={18} />
          </motion.button>
        </div>
      </div>

      {/* Mobile expanded controls */}
      <AnimatePresence>
        {showMoreControls && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-3 grid grid-cols-3 gap-2 overflow-hidden border-t border-purple-900/20 pt-3"
          >
            <motion.button
              onClick={onZoomOut}
              className="flex flex-col items-center justify-center rounded-md bg-[#0e0525]/80 p-2 text-purple-300 transition-colors hover:bg-purple-500/10"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Minus size={18} />
              <span className="mt-1 text-xs">Diminuir</span>
            </motion.button>

            <motion.button
              onClick={onZoomIn}
              className="flex flex-col items-center justify-center rounded-md bg-[#0e0525]/80 p-2 text-purple-300 transition-colors hover:bg-purple-500/10"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Plus size={18} />
              <span className="mt-1 text-xs">Aumentar</span>
            </motion.button>

            {onRotate && (
              <motion.button
                onClick={onRotate}
                className="flex flex-col items-center justify-center rounded-md bg-[#0e0525]/80 p-2 text-purple-300 transition-colors hover:bg-purple-500/10"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <RotateCw size={18} />
                <span className="mt-1 text-xs">Girar</span>
              </motion.button>
            )}

            <motion.button
              className="flex flex-col items-center justify-center rounded-md bg-[#0e0525]/80 p-2 text-purple-300 transition-colors hover:bg-purple-500/10"
              onClick={() => {
                const elem = document.documentElement
                if (!document.fullscreenElement) {
                  elem.requestFullscreen().catch((err) => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message}`)
                  })
                } else {
                  document.exitFullscreen()
                }
              }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Maximize size={18} />
              <span className="mt-1 text-xs">Tela cheia</span>
            </motion.button>

            {onPrint && (
              <motion.button
                onClick={onPrint}
                className="flex flex-col items-center justify-center rounded-md bg-[#0e0525]/80 p-2 text-purple-300 transition-colors hover:bg-purple-500/10"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Printer size={18} />
                <span className="mt-1 text-xs">Imprimir</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

