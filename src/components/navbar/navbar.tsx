"use client"

import Link from "next/link"

const NavbarComponent = () => {
  // const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  // const navLinks = [
  //   { name: "Templates", href: "/templates" },
  //   { name: "Marketplace", href: "/marketplace" },
  //   { name: "Discover", href: "/discover" },
  //   { name: "Pricing", href: "/pricing" },
  //   { name: "Learn", href: "/learn" },
  // ]

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
    <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-4">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-bold text-white">NeoPDF</span>
        </div>
        <div className="hidden md:block">
          <div className="flex items-center space-x-8">
          <Link href="/dashboard/account" className="text-sm text-gray-300 hover:text-white">
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
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
  )
}

export default NavbarComponent

