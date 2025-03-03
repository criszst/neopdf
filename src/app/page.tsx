"use client"

import { useEffect, useRef, useState } from "react"

import Image from "next/image"
import Link from "next/link"

import { User } from "next-auth"
import { useRouter } from "next/navigation"

import { DefaultSeo } from 'next-seo';

import { ChevronDown } from "lucide-react"

import { motion, useScroll, useTransform } from "framer-motion"

import { faqs } from "@/lib/utils/faqs"
import { features } from "@/lib/utils/feats"


import NavbarComponent from "@/components/navbar/navbar"
import PricingComponent from "@/components/home/pricing"
import FooterComponent from "@/components/footer/footer"

import FeatureComparison from "@/components/home/comparasion"
import AnimatedBackground from "@/components/animations/AnimatedBackground"


export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])


  return (

    <div className="min-h-screen">

      <DefaultSeo
        title="NeoPDF"
        description="Neo Era of PDF, increase your productivity with NeoPDF."
        openGraph={{
          type: 'website',
          locale: 'en_IE',
          url: 'https://www.neopdf.com.br/',
          siteName: 'NeoPDF',
        }}
      />
      {/* Navigation */}
      <NavbarComponent />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-black to-purple-900/20 py-10">
        <AnimatedBackground />

        <motion.div className="relative pt-32" style={{ opacity, scale }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <h1 className="text-sm font-medium uppercase tracking-wider text-blue-400">
                  PDF Management Reimagined
                </h1>
                <p className="mt-3 text-4xl font-light tracking-tight text-white sm:text-6xl">
                  <span className="font-medium text-purple-500">Neo</span> Era of PDF Experience
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
                  Transform how you interact with PDFs. Advanced features, intuitive interface, and lightning-fast
                  performance make document management a breeze.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10"
              >
                <div className="flex justify-center gap-4">
                  <Link href="/login">
                    <button className="group relative overflow-hidden rounded-lg bg-purple-800 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                      Get Started
                    </button>
                  </Link>
                  <button className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10">
                    Learn More
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative mt-20"
              >
                <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl bg-gradient-to-b from-white/5 to-white/0 p-1 shadow-2xl">
                  <div className="relative rounded-lg bg-[#010614]/50 p-8 backdrop-blur-sm">
                    <Image
                      src="/placeholder.svg"
                      alt="NeoPDF Interface"
                      width={1200}
                      height={800}
                      className="rounded-lg shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-[#010614] via-transparent to-transparent" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>


      {/* Features Grid */}
      <div className="bg-gradient-to-b from-black/40 to-purple-900/40 py-24">
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

      {/* Feature Comparison */}
      <FeatureComparison />

      {/* Pricing Section */}
      <PricingComponent />

      {/* FAQ Section */}
      <div className="bg-black py-24" id="faq">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Frequently asked questions</h2>
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

    </div >
  )
}

