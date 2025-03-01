"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Github, Mail } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCallbackUrl(params.get("callbackUrl") || "/dashboard");
    setError(params.get("error"));
  }, []);

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    setLoading(provider)
    try {
      const result = await signIn(provider, { callbackUrl })
      if (result?.error) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("OAuth sign in error:", error)
    } finally {
      setLoading(null)
    }
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("credentials")

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)
      setLoading(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden">
        <div
          className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-[100px] transform -translate-y-1/2"
          style={{ background: "linear-gradient(to right, rgba(138, 43, 226, 0.2), transparent)" }}
        />
        <div
          className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-[100px] transform translate-y-1/2"
          style={{ background: "linear-gradient(to left, rgba(138, 43, 226, 0.2), transparent)" }}
        />
      </div>

      {/* Left Section */}
      <div className="relative flex w-full flex-col justify-between p-8 lg:w-[45%] lg:p-12 mb-22">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-0"
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Neo
          </span>
          <span className="text-2xl font-bold text-white">PDF</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="my-auto w-full max-w-md mx-auto"
        >
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-light text-white">
              Welcome <span className="text-purple-400">Back</span>
            </h1>
            <p className="text-gray-400">Sign in to continue to NeoPDF</p>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">
                {error === "CredentialsSignin" ? "Invalid email or password" : "An error occurred during sign in"}
              </p>
            </div>
          )}

          <div className="mt-10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOAuthSignIn("github")}
                disabled={!!loading}
                className={`flex items-center justify-center gap-2 rounded-lg border border-purple-500/20 bg-white/5 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Github className="h-4 w-4" />
                GitHub
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOAuthSignIn("google")}
                disabled={!!loading}
                className={`flex items-center justify-center gap-2 rounded-lg border border-purple-500/20 bg-white/5 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Mail className="h-4 w-4" />
                Google
              </motion.button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-black px-2 text-gray-400">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg bg-white/5 border border-purple-500/20 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-lg bg-white/5 border border-purple-500/20 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="cursor-pointer accent-purple-500" />
                  <span className="text-sm text-gray-400">Remember me</span>
                </div>
                <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!!loading}
                className={`group relative w-full overflow-hidden rounded-lg bg-purple-600 px-4 py-3 text-center font-medium text-white shadow-lg transition-all hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                {loading === "credentials" ? "Signing in..." : "Sign in"}
              </motion.button>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <Link href="/signup" className="block text-center text-sm text-gray-400 hover:text-white transition-colors">
            Don&apos;t have an account? <span className="text-purple-400">Create one</span>
          </Link>
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:block lg:w-[55%] ">
        <div className="relative h-full w-full bg-black/50 p-1">
          <div className="absolute right-12 top-12">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-white/5 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-white/5 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 mr-30 space-y-6"
          >
            <h2 className="text-4xl font-light text-white">
              A New <span className="text-purple-400">Era</span> of PDF Experience
            </h2>
            <p className="text-lg text-gray-400">
              Transform how you interact with PDFs. Advanced features, intuitive interface, and lightning-fast
              performance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-5"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent p-[1px]">
              <div className="relative rounded-xl bg-black/50 p-6">
                <Image
                  src="/placeholder.svg"
                  alt="NeoPDF Interface"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

