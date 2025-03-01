"use client"

import { useEffect, useState } from "react"
import type { User } from "next-auth"
import { FileText, Plus, Settings, Star, Clock, Upload, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-pulse rounded-full bg-purple-600/20" />
      </div>
    )
  }

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
          console.log("PDF uploaded successfully! File ID:", data.fileId)
          router.push(`/read/pdf/${data.fileId}`)
        } else {
          console.error("File upload failed:", data.error)
        }
      } catch (error) {
        console.error("Error uploading file:", error)
      }
    }
  }
  
  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <div className="w-16 bg-zinc-900/50 p-4">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-2xl font-bold text-purple-500">N</div>
          <nav className="flex flex-col items-center space-y-6">
            <button className="text-white hover:bg-white/10 p-2 rounded-lg">
              <FileText className="h-5 w-5" />
            </button>
            <button className="text-white hover:bg-white/10 p-2 rounded-lg">
              <Star className="h-5 w-5" />
            </button>
            <button className="text-white hover:bg-white/10 p-2 rounded-lg">
              <Clock className="h-5 w-5" />
            </button>
            <button className="text-white hover:bg-white/10 p-2 rounded-lg">
              <Settings className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Welcome back, {user?.name}</h1>
            <p className="text-zinc-400">Manage and analyze your PDF documents</p>
          </div>

          <form>
            <input type="file" accept=".pdf" className="hidden" id="file-input" onChange={(e) => handleFileUpload(e)} />
            <label htmlFor="file-input" className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Upload PDF
            </label>

          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Usage Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
              <CardDescription>82% of your storage used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-32 w-32 mx-auto">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle className="stroke-zinc-800" cx="50" cy="50" r="40" strokeWidth="10" fill="none" />
                  <circle
                    className="stroke-purple-600"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset="45.216"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">82%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Last 3 modified PDFs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="rounded-lg bg-purple-600/20 p-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Document {i}.pdf</p>
                      <p className="text-xs text-zinc-400">Modified 2h ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center border border-zinc-800 text-white hover:bg-white/10 px-4 py-2 rounded-lg">
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </button>
                <button className="flex items-center justify-center border border-zinc-800 text-white hover:bg-white/10 px-4 py-2 rounded-lg">
                  <Menu className="mr-2 h-4 w-4" /> Merge
                </button>
                <button className="flex items-center justify-center border border-zinc-800 text-white hover:bg-white/10 px-4 py-2 rounded-lg">
                  <Star className="mr-2 h-4 w-4" /> Favorites
                </button>
                <button className="flex items-center justify-center border border-zinc-800 text-white hover:bg-white/10 px-4 py-2 rounded-lg">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

