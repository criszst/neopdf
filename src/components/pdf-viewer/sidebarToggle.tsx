"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft, Layers } from 'lucide-react'

interface SidebarToggleProps {
  onToggle: () => void
  isOpen: boolean
}

export default function SidebarToggle({ onToggle, isOpen }: SidebarToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="absolute left-0 top-1/2 z-10 flex h-10 w-6 -translate-y-1/2 items-center justify-center rounded-r-md bg-[#2a2a2a] text-white hover:bg-gray-700"
      whileHover={{ width: 28 }}
      transition={{ duration: 0.2 }}
    >
      {isOpen ? <ChevronLeft size={16} /> : <Layers size={16} />}
    </motion.button>
  )
}
