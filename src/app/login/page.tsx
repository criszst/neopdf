"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log("Email:", email)
    console.log("Password:", password)
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Section */}
      <div className="flex w-full flex-col justify-between p-8 lg:w-[45%] lg:p-12">
        <div className="text-2xl font-bold text-white">NeoPDF</div>

        <div className="my-auto w-full max-w-md">
          <h1 className="mb-2 text-4xl text-white text-center" style={{ fontFamily: "Times New Roman" }}>
            Welcome Back!
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white px-4 py-3 text-black placeholder-gray-400"
                placeholder="Johndoe@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-white px-4 py-3 text-black placeholder-gray-400"
                placeholder="••••••••"
              />
              <Link href="/forgot-password" className="block text-right text-sm text-gray-400 hover:text-white">
                Forgot Password
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-500 py-3 text-center font-medium text-white hover:bg-emerald-600"
            >
              Sign in
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-black px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white hover:bg-gray-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#4285F4"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white hover:bg-gray-100">
                <svg className="h-5 w-5" fill="black" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white hover:bg-gray-100">
                <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <Link href="/signup" className="text-center text-sm text-gray-400 hover:text-white">
          Create an account
        </Link>
      </div>

      {/* Right Section */}
      <div className="hidden lg:block lg:w-[55%]">
        <div className="relative h-full w-full bg-emerald-500 p-12" style={{ backgroundColor: "#1c133c" }}>
          <div className="absolute right-12 top-12">
            <div className="flex space-x-2">
              <button className="rounded-full bg-emerald-600/50 p-3 text-white hover:bg-emerald-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="rounded-full bg-emerald-600/50 p-3 text-white hover:bg-emerald-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-20 space-y-6 text-white">
            <h2 className="text-4xl font-bold">
              Read PDF instantly
            </h2>
            <blockquote className="text-lg">
              Are you embarrased about the time it takes to read a PDF?
            </blockquote>
          </div>

          <div className="mt-12 rounded-2xl bg-white/90 p-6">
            

           
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

