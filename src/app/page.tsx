"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

import {
  Check,
  ChevronDown,
} from "lucide-react"
import { useRef, useState } from "react"
import NavbarComponent from "@/components/navbar/navbar"
import PricingComponent from "@/components/home/pricing"
import FooterComponent from "@/components/footer/footer"
import { faqs, features } from "@/utils/faqs"
import FeatureComparison from "@/components/home/comparasion"
import AnimatedBackground from "@/components/animations/AnimatedBackground"


const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

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
      {/* Navigation */}
      <NavbarComponent />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-black to-purple-900/20 py-10">
        <AnimatedBackground />
       
        <motion.div className="relative pt-16" style={{ opacity, scale }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative pb-16 pt-16 sm:pb-24">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <motion.div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left" {...fadeIn}>
                  <h1>

                    <span className="mt-1 block text-center text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl">
                      A <span className="text-purple-400">Neo</span> Era of PDF
                    </span>
                  </h1>
                  <p className="mt-3 text-center text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Transform how you interact with PDFs. Advanced features, intuitive interface, and lightning-fast
                    performance make document management a breeze.
                  </p>
                  <div className= " mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
                    <div className="grid grid-cols-1 gap-4">
                      <Link
                        href="#"
                        className="flex items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-base font-medium text-white hover:bg-purple-500"
                      >
                        NeoReader
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
                      <Image
                        src="/placeholder.svg"
                        alt="NeoPDF Interface"
                        width={500}
                        height={300}
                        className="w-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>


      {/* Features Grid */ }
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

      <div className="bg-black py-24"> 
      {/* <div className="bg-black py-24"> */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">How NeoPDF Compares</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              See how NeoPDF stacks up against the competition.
            </p>
          </motion.div>
          <div className="mt-16">
            <FeatureComparison />
          </div>
        </div>
      </div>



  {/* Pricing Section */ }
  <PricingComponent />

  {/* FAQ Section */ }
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
          Cant find what youre looking for? Contact our support team.
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

  {/* Footer */ }

  <FooterComponent />

    </div >
  )
}

