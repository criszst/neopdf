"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Document, Page, pdfjs } from "react-pdf"
import { Download, Share, Github, ChevronLeft, ChevronRight, Plus, Minus, Maximize } from "lucide-react"
import { Session, User } from "next-auth"

// Configuração do worker PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function AdvancedPDFViewer() {
  const params = useParams()
  const id = params.id
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>()
  const [bgColor, setBgColor] = useState("#1e1e2e") // Cor de fundo padrão roxa-900
  const [user, setUser] = useState<User | null>(null)

  const router = useRouter()

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session")
        if (!res.ok) throw new Error("Failed to fetch session")
        const data = await res.json()
        setUser(data?.user || null)

        if (!user && !data?.user) {
          router.push("/login")
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  // Caminho para o arquivo PDF
  const filePath = `/uploads/${id}`

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setLoading(false)
  }

  function onDocumentLoadError(error) {
    console.error("Erro ao carregar PDF:", error)
    setError("Não foi possível carregar o documento.")
    setLoading(false)
  }

  const handlePreviousPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1))
  }

  const handlePageChange = (e) => {
    const page = parseInt(e.target.value)
    if (!isNaN(page) && page >= 1 && page <= numPages!) {
      setPageNumber(page)
    }
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleDownload = () => {
    window.open(filePath, '_blank')
  }

  // Função para mudar a cor de fundo
  const changeBackground = (color) => {
    setBgColor(color)
  }

  return (
    <div className="flex h-screen bg-[#1e1e2e] text-white">
      {/* Sidebar */}
      <div className="w-48 min-w-48 bg-[#111827] border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden">
              {user?.image && (
                <img src={user.image} alt="User" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
          <h2 className="text-center text-sm font-medium">{user?.name}</h2>
          <p className="text-center text-xs text-zinc-400">{user?.email}</p>
        </div>

        <div className="flex justify-between p-4 border-b border-zinc-800">
          <button className="p-2 hover:bg-zinc-800 rounded-full">
            <Github size={18} />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-full">
            <Share size={18} />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-full" onClick={handleDownload}>
            <Download size={18} />
          </button>
        </div>

        {/* Opções de Personalização */}
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-xs font-medium mb-2">Personalização</h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs mb-1">Cor de Fundo</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => changeBackground("#1e1e2e")} 
                  className="w-6 h-6 bg-[#1e1e2e] rounded-full border border-zinc-700"
                ></button>
                <button 
                  onClick={() => changeBackground("#1f2937")} 
                  className="w-6 h-6 bg-zinc-800 rounded-full border border-zinc-700"
                ></button>
                <button 
                  onClick={() => changeBackground("#111827")} 
                  className="w-6 h-6 bg-[#111827] rounded-full border border-zinc-700"
                ></button>
                <button 
                  onClick={() => changeBackground("#374151")} 
                  className="w-6 h-6 bg-zinc-700 rounded-full border border-zinc-600"
                ></button>
                <button 
                  onClick={() => changeBackground("#4f46e5")} 
                  className="w-6 h-6 bg-indigo-600 rounded-full border border-indigo-500"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 mt-auto border-t border-zinc-800">
          <div className="text-xs text-zinc-400">
            <p>Your All-in-One PDF Reader & Builder</p>
            <p>Version 1.0</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* PDF Viewer */}
        <div 
          className="flex-1 flex items-center justify-center overflow-auto relative"
          style={{ backgroundColor: bgColor }}
        >
          {loading && (
            <div className="text-white">Carregando documento...</div>
          )}

          {error && (
            <div className="text-red-500">{error}</div>
          )}

          {/* Contêiner personalizado para o PDF */}
          <div className="pdf-container">
            <Document
              file={filePath}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="text-white">Carregando documento...</div>}
              className="pdf-document"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-2xl"
                
              />
            </Document>
          </div>

          {/* Estilo customizado para aplicar ao PDF via CSS-in-JS */}
          <style jsx global>{`
            .pdf-container {
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            
            .pdf-document {
              display: flex;
              justify-content: center;
            }
            
            .react-pdf__Page {
              margin: 0 auto;
              border-radius: 4px;
              overflow: hidden;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
            }
            
            .react-pdf__Page__canvas {
              border-radius: 4px;
              display: block !important;
            }
            
            .custom-text {
              color: inherit;
            }
          `}</style>
        </div>

        {/* Controls */}
        <div className="h-12 bg-white border-t border-zinc-200 flex items-center justify-center px-4 text-black">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Página</span>
            <div className="flex items-center">
              <input
                type="text"
                value={pageNumber}
                onChange={handlePageChange}
                className="w-8 text-center border border-zinc-300 rounded"
              />
              <span className="mx-1 text-gray-600">/</span>
              <span className="text-gray-600">{numPages || '-'}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                className="p-1 hover:bg-zinc-100
                            onClick={handlePreviousPage}"
    
            disabled={pageNumber <= 1}
          >
            <ChevronLeft size={16} className={pageNumber <= 1 ? "text-zinc-300" : "text-zinc-700"} />
          </button>
          

          <button
            onClick={handleNextPage}
            className="p-1 hover:bg-zinc-100 rounded"
            disabled={pageNumber >= numPages!}
          >
            <ChevronRight size={16} className={pageNumber >= numPages! ? "text-zinc-300" : "text-zinc-700"} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-zinc-100 rounded"
          >
            <Minus size={16} className="text-zinc-700" />
          </button>

          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-zinc-100 rounded"
          >
            <Plus size={16} className="text-zinc-700" />
          </button>

          <button className="p-1 hover:bg-zinc-100 rounded">
            <Maximize size={16} className="text-zinc-700" />
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
  )
}
