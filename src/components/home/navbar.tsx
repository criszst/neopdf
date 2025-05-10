"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import { theme } from "@/lib/colors/theme-config"

const NavbarComponent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav style={{ willChange: "transform" }} className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/90">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
          <span className="text-xl font-bold text-white drop-shadow-sm">Neo
            <span style={{ color: `${theme.colors.text.purple}` }}>PDF</span>
          </span>

          </div>

          {/* Menu desktop */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard/settings" className="text-sm text-gray-300 hover:text-white">
                Account
              </Link>
              <Link href="#features" className="text-sm text-gray-300 hover:text-white">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-gray-300 hover:text-white">
                Pricing
              </Link>
              <Link href="#faq" className="text-sm text-gray-300 hover:text-white">
                FAQ
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Botão do menu mobile */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
         
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden bg-black/90 px-4 pb-4 pt-2 backdrop-blur-md"
        >
          <div className="flex flex-col space-y-3">
            <Link href="/dashboard/settings" className="text-sm text-gray-300 hover:text-white">
              Account
            </Link>
            <Link href="#features" className="text-sm text-gray-300 hover:text-white">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-gray-300 hover:text-white">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm text-gray-300 hover:text-white">
              FAQ
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 text-center"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default NavbarComponent
