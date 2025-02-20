"use client"
import React, { JSX } from "react"

import { motion } from "framer-motion"
import {
  Check,
} from "lucide-react"
import { useState } from "react"

const PricingComponent = ():JSX.Element => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="bg-black py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Simple, transparent pricing</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">Choose the plan thats right for you</p>

        <div className="mt-8 flex justify-center">
          <div className="relative rounded-full bg-white/5 p-1">
            <button
              className={`relative rounded-full px-4 py-2 text-sm font-medium ${
                selectedPlan === "monthly" ? "bg-purple-600 text-white" : "text-gray-400"
              }`}
              onClick={() => setSelectedPlan("monthly")}
            >
              Monthly
            </button>
            <button
              className={`relative rounded-full px-4 py-2 text-sm font-medium ${
                selectedPlan === "yearly" ? "bg-purple-600 text-white" : "text-gray-400"
              }`}
              onClick={() => setSelectedPlan("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {/* Free Plan */}
        <motion.div
          className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-medium text-white">Basic</h3>
          <p className="mt-4 text-sm text-gray-400">Perfect for individual users</p>
          <p className="mt-8">
            <span className="text-4xl font-bold text-white">$0</span>
            <span className="text-gray-400">/month</span>
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-center text-sm text-gray-400">
              <Check className="mr-3 h-4 w-4 text-purple-400" />
              Basic PDF viewing
            </li>
            <li className="flex items-center text-sm text-gray-400">
              <Check className="mr-3 h-4 w-4 text-purple-400" />
              Simple annotations
            </li>
            <li className="flex items-center text-sm text-gray-400">
              <Check className="mr-3 h-4 w-4 text-purple-400" />
              Up to 3 documents
            </li>
          </ul>
          <button className="mt-8 w-full rounded-lg border border-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-600">
            Get Started
          </button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          className="rounded-2xl bg-purple-600 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-medium text-white">Pro</h3>
          <p className="mt-4 text-sm text-purple-100">For professional users</p>
          <p className="mt-8">
            <span className="text-4xl font-bold text-white">${selectedPlan === "monthly" ? "9.99" : "99.99"}</span>
            <span className="text-purple-100">/{selectedPlan === "monthly" ? "month" : "year"}</span>
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-center text-sm text-purple-100">
              <Check className="mr-3 h-4 w-4 text-white" />
              Everything in Basic
            </li>
            <li className="flex items-center text-sm text-purple-100">
              <Check className="mr-3 h-4 w-4 text-white" />
              Advanced search
            </li>
            <li className="flex items-center text-sm text-purple-100">
              <Check className="mr-3 h-4 w-4 text-white" />
              OCR technology
            </li>
            <li className="flex items-center text-sm text-purple-100">
              <Check className="mr-3 h-4 w-4 text-white" />
              Unlimited documents
            </li>
          </ul>
          <button className="mt-8 w-full rounded-lg bg-white py-2 text-sm font-medium text-purple-600 hover:bg-gray-50">
            Get Started
          </button>
        </motion.div>

        {/* Enterprise Plan */}
        <motion.div
          className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium text-white">Enterprise</h3>
          <p className="mt-4 text-sm text-gray-400">For large organizations</p>
          <p className="mt-8">
            <span className="text-4xl font-bold text-white">Custom</span>
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-center text-sm text-gray-400">
              <Check className="mr-3 h-4 w-4 text-purple-400" />
              Everything in Pro
            </li>
            <li className="flex items-center text-sm text-gray-400">
              <Check className="mr-3 h-4 w-4 text-purple-400" />
              Custom integration
            </li>
            <li className="flex items-center text-sm text-gray-400">
              <Check className="mr-3 h-4 w-4 text-purple-400" />
              24/7 support
            </li>
            <li className="flex items-center text-sm text-gray-400">
              <Check className="mr-3 h-4 w-4 text-purple-400" />
              SLA guarantee
            </li>
          </ul>
          <button className="mt-8 w-full rounded-lg border border-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-600">
            Contact Sales
          </button>
        </motion.div>
      </div>
    </div>
  </div>
  )
}

export default PricingComponent;