import React, { JSX } from "react"

import { motion } from "framer-motion"
import Image from "next/image"

import { testimonials } from "@/utils/faqs"


const TestimonialsComponent = (): JSX.Element => {
  return (
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
  )
}

export default TestimonialsComponent