import { Check, X } from "lucide-react"

const FeatureComparison = () => {
  const features = [
    { name: "PDF Viewing", neopdf: true, competitor1: true, competitor2: true },
    { name: "PDF Editing", neopdf: true, competitor1: true, competitor2: false },
    { name: "OCR Technology", neopdf: true, competitor1: false, competitor2: true },
    { name: "Real-time Collaboration", neopdf: true, competitor1: false, competitor2: false },
    { name: "Cloud Sync", neopdf: true, competitor1: true, competitor2: true },
    { name: "Advanced Security", neopdf: true, competitor1: false, competitor2: true },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-6 text-white">Feature</th>
            <th className="py-4 px-6 text-purple-400">NeoPDF</th>
            <th className="py-4 px-6 text-gray-400">Competitor 1</th>
            <th className="py-4 px-6 text-gray-400">Competitor 2</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className="border-b border-white/10">
              <td className="py-4 px-6 text-white">{feature.name}</td>
              <td className="py-4 px-6">
                {feature.neopdf ? <Check className="text-green-500" /> : <X className="text-red-500" />}
              </td>
              <td className="py-4 px-6">
                {feature.competitor1 ? <Check className="text-green-500" /> : <X className="text-red-500" />}
              </td>
              <td className="py-4 px-6">
                {feature.competitor2 ? <Check className="text-green-500" /> : <X className="text-red-500" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FeatureComparison

