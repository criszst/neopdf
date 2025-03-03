"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { User } from "next-auth"
import {
  FileText,
  Settings,
  Star,
  Clock,
  Upload,
  Menu,
  Search,
  Bell,
  ChevronDown,
  LayoutGrid,
  Folder,
  ArrowUpRight,
  Users,
  Shield,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session")
        if (!res.ok) throw new Error("Failed to fetch session")
        const data = await res.json()
        setUser(data?.user || null)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if (data.success) {
          router.push(`/read/pdf/${data.fileId}`)
        }
      } catch (error) {
        console.error("Error uploading file:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-32 w-32 animate-pulse rounded-full bg-purple-600/20" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900/50 border-r border-zinc-800">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Neo
              </div>
              <div className="text-2xl font-bold text-white">PDF</div>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search PDFs..."
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            <button className="flex items-center space-x-3 w-full px-3 py-2 text-white rounded-lg bg-purple-500/10 border border-purple-500/20">
              <LayoutGrid className="h-5 w-5 text-purple-400" />
              <span>Dashboard</span>
            </button>
            <button className="flex items-center space-x-3 w-full px-3 py-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5">
              <Folder className="h-5 w-5" />
              <span>My Files</span>
            </button>
            <button className="flex items-center space-x-3 w-full px-3 py-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5">
              <Star className="h-5 w-5" />
              <span>Starred</span>
            </button>
            <button className="flex items-center space-x-3 w-full px-3 py-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5">
              <Clock className="h-5 w-5" />
              <span>Recent</span>
            </button>
          </nav>

          {/* User */}
          <div className="p-4 border-t border-zinc-800">
            <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-white/5">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                  {user?.name?.[0]}
                </div>
              )}
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-white">{user?.name}</div>
                <div className="text-xs text-zinc-400">{user?.email}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5">
                <Bell className="h-5 w-5" />
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload PDF</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Storage Used</p>
                    <h3 className="text-2xl font-semibold text-white mt-1">82%</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <ArrowUpRight className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-[82%] bg-purple-500 rounded-full" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Active Users</p>
                    <h3 className="text-2xl font-semibold text-white mt-1">2,543</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-black"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Security Score</p>
                    <h3 className="text-2xl font-semibold text-white mt-1">A+</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-zinc-400">All systems protected</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent and Actions */}
          <div className="grid grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Your recently modified PDFs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="rounded-lg bg-purple-500/10 p-2 border border-purple-500/20">
                        <FileText className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Document {i}.pdf</p>
                        <p className="text-xs text-zinc-400">Modified 2h ago • 2.4 MB</p>
                      </div>
                      <button className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5">
                        <Menu className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors">
                    <Upload className="h-5 w-5 text-purple-400" />
                    <span className="text-white">Upload PDF</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-zinc-800 hover:bg-white/5 transition-colors">
                    <Menu className="h-5 w-5 text-zinc-400" />
                    <span className="text-white">Merge PDFs</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-zinc-800 hover:bg-white/5 transition-colors">
                    <Star className="h-5 w-5 text-zinc-400" />
                    <span className="text-white">View Favorites</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-zinc-800 hover:bg-white/5 transition-colors">
                    <Settings className="h-5 w-5 text-zinc-400" />
                    <span className="text-white">Settings</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

