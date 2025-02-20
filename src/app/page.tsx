"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

import {
  FileText,
  Search,
  Share2,
  Zap,
  Check,
  ChevronDown,
  Globe,
  Cloud,
  Lock,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react"
import { useState } from "react"
import NavbarComponent from "@/components/navbar/navbar"
import PricingComponent from "@/components/home/pricing"
import FooterComponent from "@/components/footer/footer"
import { faqs, features, testimonials } from "@/utils/faqs"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  

  

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Navigation */}
     <NavbarComponent />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative pb-16 pt-16 sm:pb-24">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <motion.div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left" {...fadeIn}>
                <h1>
                  <span className="block text-base font-semibold text-purple-400">Introducing NeoPDF</span>
                  <span className="mt-1 block text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl">
                    A New Era of PDF Experience
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Transform how you interact with PDFs. Advanced features, intuitive interface, and lightning-fast
                  performance make document management a breeze.
                </p>
                <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
                  <div className="grid grid-cols-2 gap-4 radius-2xl">
                  
                    <Link
                      href="/login"
                      className="flex items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-base font-medium text-white hover:bg-purple-500"
                    >
                      NEO Reader
                    </Link>
          

                  </div>
                  <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400 lg:justify-start">
                    <div className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-400" />
                      Free Trial
                    </div>
                    <div className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-400" />
                      No Credit Card
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <div className="relative block w-full overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm">
                    <Image src="/placeholder.svg" alt="NeoPDF Interface" width={500} height={300} className="w-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gradient-to-b from-black to-purple-900/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need in a PDF reader
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Powerful features wrapped in a beautiful, intuitive interface.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="relative rounded-2xl bg-white/5 p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="rounded-lg bg-purple-600/20 p-3 w-fit">
                  <feature.icon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Platform Section */}
      <div className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="lg:grid lg:grid-cols-2 lg:gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Available on all your devices
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                Access your documents anywhere, anytime. NeoPDF syncs seamlessly across all platforms.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 rounded-lg bg-white/5 p-4">
                  <Monitor className="h-6 w-6 text-purple-400" />
                  <span className="text-white">Desktop</span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg bg-white/5 p-4">
                  <Smartphone className="h-6 w-6 text-purple-400" />
                  <span className="text-white">Mobile</span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg bg-white/5 p-4">
                  <Tablet className="h-6 w-6 text-purple-400" />
                  <span className="text-white">Tablet</span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg bg-white/5 p-4">
                  <Globe className="h-6 w-6 text-purple-400" />
                  <span className="text-white">Web</span>
                </div>
              </div>
            </div>

            <div className="mt-12 lg:mt-0">
              <div className="relative rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
                <Image
                  src="/placeholder.svg"
                  alt="Cross-platform demonstration"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Section */}
     <PricingComponent />

      {/* Testimonials Section */}
      <div className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Loved by professionals worldwide
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">See what our users have to say about NeoPDF</p>
          </motion.div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <p className="text-lg font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-gray-300">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Frequently asked questions</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Can't find what you're looking for? Contact our support team.
            </p>
          </motion.div>

          <div className="mt-16 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border-b border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  className="flex w-full items-center justify-between py-6 text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-lg font-medium text-white">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pb-6 text-gray-400"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
     
     <FooterComponent />

    </div>
  )
}

