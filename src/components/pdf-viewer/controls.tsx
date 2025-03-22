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

  return (
    <div className="border-t relative border-zinc-800 bg-gradient-to-r from-[#111827] to-[#0f172a] px-3 py-3 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg bg-zinc-800/70 p-1">
            <button
              onClick={onPreviousPage}
              disabled={pageNumber <= 1}
              className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-50"
              aria-label="Página anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center px-1">
              <input
                type="text"
                value={pageNumber}
                onChange={onPageChange}
                className="w-10 rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 text-center text-sm text-white"
                aria-label="Número da página atual"
              />
              <span className="mx-1 text-sm text-zinc-400">de</span>
              <span className="text-sm text-zinc-300">{numPages || "-"}</span>
            </div>

            <button
              onClick={onNextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-50"
              aria-label="Próxima página"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="hidden sm:flex items-center rounded-lg bg-zinc-800/70 p-1">
            <button
              onClick={onZoomOut}
              className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
              aria-label="Diminuir zoom"
            >
              <Minus size={18} />
            </button>

            <span className="px-2 text-sm text-zinc-300">{Math.round(scale * 100)}%</span>

            <button
              onClick={onZoomIn}
              className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
              aria-label="Aumentar zoom"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

       
        <div className="flex items-center gap-2">
         
          <div className="hidden md:flex items-center gap-2 z-50">
            {onRotate && (
              <button
                onClick={onRotate}
                className="z-60 rounded-md bg-zinc-800/70 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
                aria-label="Rotacionar"
              >
                <RotateCw size={18} />
              </button>
            )}

            <button
              className="rounded-md bg-zinc-800/70 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
              aria-label="Tela cheia"
            >
              <Maximize size={18} />
            </button>

            {onPrint && (
              <button
                onClick={onPrint}
                className="rounded-md bg-zinc-800/70 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
                aria-label="Imprimir"
              >
                <Printer size={18} />
              </button>
            )}
          </div>

        
          <button
            onClick={() => setShowMoreControls(!showMoreControls)}
            className="right-5 md:mr-0 absolute flex md:hidden rounded-md bg-purple-600/70 p-2 text-white transition-colors hover:bg-purple-700"
            aria-label="Mais opções"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Mobile controls */}
      <AnimatePresence>
        {showMoreControls && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 grid grid-cols-3 gap-2 overflow-hidden border-t border-zinc-800/50 pt-3"
          >
            <button
              onClick={onZoomOut}
              className="flex flex-col items-center justify-center rounded-md bg-zinc-800/70 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <Minus size={18} />
              <span className="mt-1 text-xs">Diminuir</span>
            </button>

            <button
              onClick={onZoomIn}
              className="flex flex-col items-center justify-center rounded-md bg-zinc-800/70 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <Plus size={18} />
              <span className="mt-1 text-xs">Aumentar</span>
            </button>

            {onRotate && (
              <button
                onClick={onRotate}
                className="flex flex-col items-center justify-center rounded-md bg-zinc-800/70 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
              >
                <RotateCw size={18} />
                <span className="mt-1 text-xs">Girar</span>
              </button>
            )}

            <button 
              className="flex flex-col items-center justify-center rounded-md bg-zinc-800/70 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <Maximize size={18} />
              <span className="mt-1 text-xs">Tela cheia</span>
            </button>

            {onPrint && (
              <button
                onClick={onPrint}
                className="flex flex-col items-center justify-center rounded-md bg-zinc-800/70 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
              >
                <Printer size={18} />
                <span className="mt-1 text-xs">Imprimir</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}