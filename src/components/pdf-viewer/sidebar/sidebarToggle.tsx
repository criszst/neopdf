"use client"

import { motion } from "framer-motion"
import { ChevronLeft, Layers } from "lucide-react"

interface SidebarToggleProps {
  onToggle: () => void
  isOpen: boolean
  isDarkTheme?: boolean
}

export default function SidebarToggle({ onToggle, isOpen, isDarkTheme = true }: SidebarToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="absolute left-0 top-1/2 z-10 flex h-12 w-6 -translate-y-1/2 items-center justify-center rounded-r-md shadow-md"
      style={{
        backgroundColor: isDarkTheme ? "#151525" : "#ffffff",
        color: isDarkTheme ? "#ffffff" : "#4b5563",
      }}
      whileHover={{ width: 28 }}
      transition={{ duration: 0.2 }}
    >
      {isOpen ? <ChevronLeft size={16} /> : <Layers size={16} />}
    </motion.button>
  )
}
