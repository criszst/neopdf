"use client"

import { useEffect, useState } from "react"
import { PieChart } from "lucide-react"
import { motion } from "framer-motion"

interface PDFTypeData {
  type: string
  count: number
}

const PdfTypes = () => {
  const [pdfTypes, setPdfTypes] = useState<PDFTypeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const response = await fetch("/api/user/stats")

        if (!response.ok) {
          throw new Error("Falha ao buscar estatísticas")
        }

        const data = await response.json()

        // Transformar os dados para o formato esperado pelo componente
        const formattedTypes = data.pdfTypes.map((item: any) => ({
          type: formatPDFType(item.type),
          count: item.count,
        }))

        setPdfTypes(formattedTypes)
      } catch (error: any) {
        console.error("Erro ao buscar estatísticas:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatPDFType = (type: string): string => {
    const typeMap: Record<string, string> = {
      DOCUMENT: "Documentos",
      FORM: "Formulários",
      PRESENTATION: "Apresentações",
      BOOK: "Livros",
      REPORT: "Relatórios",
      OTHER: "Outros",
    }

    return typeMap[type] || type
  }

  const getTypeColor = (type: string, index: number): string => {
    const colorMap: Record<string, string> = {
      Documentos: "purple",
      Formulários: "blue",
      Apresentações: "pink",
      Livros: "green",
      Relatórios: "orange",
      Outros: "gray",
    }

    return colorMap[type] || ["purple", "blue", "pink", "green", "orange", "gray"][index % 6]
  }

  // Calcular percentagens
  const total = pdfTypes.reduce((sum, item) => sum + item.count, 0)
  const typesWithPercentage = pdfTypes.map((item) => ({
    ...item,
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
  }))

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 h-full"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Tipos de PDF</h2>
          </div>
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-white/10 rounded w-24" />
                  <div className="h-4 bg-white/10 rounded w-12" />
                </div>
                <div className="h-2.5 bg-[#1C1F2E] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-white/5" style={{ width: `${30 * i}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 h-full"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Tipos de PDF</h2>
          </div>
          <div className="text-red-400 text-center p-4">Erro ao carregar estatísticas: {error}</div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 h-full"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Tipos de PDF</h2>
          <button className="p-1.5 rounded-lg hover:bg-purple-500/10 text-zinc-400 hover:text-purple-400 transition-colors">
            <PieChart className="h-5 w-5" />
          </button>
        </div>

        {typesWithPercentage.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">Nenhum PDF encontrado</div>
        ) : (
          <div className="space-y-5">
            {typesWithPercentage.map((item, index) => (
              <div key={item.type} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">{item.type}</span>
                  <span className="text-white font-medium">{item.percentage}%</span>
                </div>
                <div className="h-2.5 bg-[#1C1F2E] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${
                      getTypeColor(item.type, index) === "purple"
                        ? "bg-gradient-to-r from-purple-400 to-purple-600"
                        : getTypeColor(item.type, index) === "blue"
                          ? "bg-gradient-to-r from-blue-400 to-blue-600"
                          : getTypeColor(item.type, index) === "pink"
                            ? "bg-gradient-to-r from-pink-400 to-pink-600"
                            : getTypeColor(item.type, index) === "green"
                              ? "bg-gradient-to-r from-green-400 to-green-600"
                              : getTypeColor(item.type, index) === "orange"
                                ? "bg-gradient-to-r from-orange-400 to-orange-600"
                                : "bg-gradient-to-r from-gray-400 to-gray-600"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PdfTypes

