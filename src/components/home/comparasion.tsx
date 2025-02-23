import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

const FeatureComparison = () => {
  const features = [
    { name: "PDF Viewing", neopdf: true, competitor1: true, competitor2: true },
    { name: "PDF Editing", neopdf: true, competitor1: true, competitor2: false },
    { name: "OCR Technology", neopdf: true, competitor1: false, competitor2: true },
    // { name: "Real-time Collaboration", neopdf: true, competitor1: false, competitor2: false },
    { name: "Cloud Sync", neopdf: true, competitor1: true, competitor2: true },
    { name: "AI-Powered Search", neopdf: true, competitor1: false, competitor2: false },
    { name: "Form Filling", neopdf: true, competitor1: false, competitor2: false },
    { name: "Image Insertion", neopdf: true, competitor1: false, competitor2: false },
    { name: "Page Management", neopdf: true, competitor1: false, competitor2: false },
  ]

  return (
    <div className="bg-black py-24" id="features"> 
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
            


    <div className="overflow-x-auto" >
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-4 text-white">Feature</th>
            <th className="py-4 px-4 text-purple-400">NeoPDF</th>
            <th className="py-4 px-2 text-gray-400">Others PDF Readers</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className="border-b border-white/10">
              <td className="py-4 px-4 text-white">{feature.name}</td>
              <td className="py-4 px-6">
                {feature.neopdf ? <Check className="text-green-500" /> : <X className="text-red-500" />}
              </td>
              <td className="py-4 px-6">
                {feature.competitor1 ? <Check className="text-green-500" /> : <X className="text-red-500" />}
              </td>
  
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
        </div>
      </div>
  )
}

export default FeatureComparison

