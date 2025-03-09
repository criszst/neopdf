"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { User } from "next-auth"
import { Document, Page, pdfjs } from "react-pdf"
import { Download, Share, Star, ChevronLeft, ChevronRight, Plus, Minus, Maximize, ArrowLeft } from "lucide-react"
import Image from "next/image"

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDF {
  id: string
  name: string
  s3Url: string
  createdAt: string
  isStarred: boolean
}

export default function PDFViewer() {
  const params = useParams()
  const id = params.id as string
  const [pdf, setPdf] = useState<PDF | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState("#1e1e2e")
  const [user, setUser] = useState<User | null>(null)
  const [isStarred, setIsStarred] = useState(false)

  const router = useRouter()

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session")
        if (!res.ok) throw new Error("Failed to fetch session")
        const data = await res.json()
        setUser(data?.user || null)

        if (!data?.user) {
          router.push("/login")
          return
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchSession()
  }, [router])

  useEffect(() => {
    async function fetchPDF() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/pdfs/${id}`)

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("PDF não encontrado")
          } else if (res.status === 401 || res.status === 403) {
            throw new Error("Você não tem permissão para visualizar este PDF")
          } else {
            throw new Error("Falha ao buscar o PDF")
          }
        }

        const data = await res.json()
        setPdf(data)
        setIsStarred(data.isStarred)

        // Registrar atividade de visualização
        await fetch("/api/activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "VIEW",
            pdfId: id,
          }),
        })
      } catch (error: any) {
        console.error("Error fetching PDF:", error)
        setError(error.message || "Falha ao carregar o PDF")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPDF()
    }
  }, [id])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error)
    setError("Não foi possível carregar o documento.")
    setLoading(false)
  }

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
  }

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number.parseInt(e.target.value)
    if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page)
    }
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleDownload = async () => {
    if (pdf?.s3Url) {
      window.open(pdf.s3Url, "_blank")

      // Registrar atividade de download
      await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "DOWNLOAD",
          pdfId: id,
        }),
      })
    }
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  const handleToggleStar = async () => {
    try {
      const newStarredState = !isStarred
      setIsStarred(newStarredState)

      // Registrar atividade
      await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: newStarredState ? "STAR" : "UNSTAR",
          pdfId: id,
        }),
      })

      // Atualizar no banco de dados
      await fetch(`/api/pdfs/${id}/star`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isStarred: newStarredState,
        }),
      })
    } catch (error) {
      console.error("Error toggling star:", error)
      setIsStarred(!isStarred) // Reverter em caso de erro
    }
  }

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/pdf/${id}`

      if (navigator.share) {
        await navigator.share({
          title: pdf?.name || "PDF Compartilhado",
          text: "Confira este PDF no NeoPDF",
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        alert("Link copiado para a área de transferência!")
      }

      // Registrar atividade de compartilhamento
      await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "SHARE",
          pdfId: id,
        }),
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  // Function to change background color
  const changeBackground = (color: string) => {
    setBgColor(color)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0e0525]">
        <div className="h-32 w-32 animate-pulse rounded-full bg-purple-600/20" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0e0525] text-white">
        <div className="mb-4 text-red-400">{error}</div>
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          <ArrowLeft size={16} />
          Voltar ao Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#1e1e2e] text-white">
      {/* Sidebar */}
      <div className="w-48 min-w-48 flex flex-col border-r border-zinc-800 bg-[#111827]">
        <div className="border-b border-zinc-800 p-4">
          <button
            onClick={handleBackToDashboard}
            className="mb-4 flex w-full items-center gap-2 rounded-md bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
          <div className="mb-3 flex justify-center">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-zinc-800">
              {user?.image && (
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt="User"
                  className="h-full w-full object-cover"
                  width={100}
                  height={100}
                />
              )}
            </div>
          </div>
          <h2 className="text-center text-sm font-medium">{user?.name}</h2>
          <p className="text-center text-xs text-zinc-400">{user?.email}</p>
        </div>

        <div className="border-b border-zinc-800 p-4">
          <h3 className="mb-2 text-xs font-medium">Informações do Documento</h3>
          {pdf && (
            <div className="space-y-1 text-xs text-zinc-400">
              <p className="truncate font-medium text-white">{pdf.name}</p>
              <p>Enviado em: {new Date(pdf.createdAt).toLocaleDateString()}</p>
              <p>Páginas: {numPages || "..."}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between border-b border-zinc-800 p-4">
          <button
            className={`rounded-full p-2 hover:bg-zinc-800 ${isStarred ? "text-yellow-400" : "text-zinc-400 hover:text-yellow-400"}`}
            onClick={handleToggleStar}
            title={isStarred ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Star size={18} fill={isStarred ? "currentColor" : "none"} />
          </button>
          <button
            className="rounded-full p-2 hover:bg-zinc-800 text-zinc-400 hover:text-pink-400"
            onClick={handleShare}
            title="Compartilhar"
          >
            <Share size={18} />
          </button>
          <button
            className="rounded-full p-2 hover:bg-zinc-800 text-zinc-400 hover:text-green-400"
            onClick={handleDownload}
            title="Download"
          >
            <Download size={18} />
          </button>
        </div>

        {/* Customization Options */}
        <div className="border-b border-zinc-800 p-4">
          <h3 className="mb-2 text-xs font-medium">Personalização</h3>
          <div className="space-y-2">
            <div>
              <p className="mb-1 text-xs">Cor de Fundo</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => changeBackground("#1e1e2e")}
                  className="h-6 w-6 rounded-full border border-zinc-700 bg-[#1e1e2e]"
                ></button>
                <button
                  onClick={() => changeBackground("#1f2937")}
                  className="h-6 w-6 rounded-full border border-zinc-700 bg-zinc-800"
                ></button>
                <button
                  onClick={() => changeBackground("#111827")}
                  className="h-6 w-6 rounded-full border border-zinc-700 bg-[#111827]"
                ></button>
                <button
                  onClick={() => changeBackground("#374151")}
                  className="h-6 w-6 rounded-full border border-zinc-600 bg-zinc-700"
                ></button>
                <button
                  onClick={() => changeBackground("#4f46e5")}
                  className="h-6 w-6 rounded-full border border-indigo-500 bg-indigo-600"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-zinc-800 p-4">
          <div className="text-xs text-zinc-400">
            <p>NeoPDF - Seu leitor de PDF completo</p>
            <p>Versão 1.0</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* PDF Viewer */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-auto"
          style={{ backgroundColor: bgColor }}
        >
          {loading && <div className="text-white">Carregando documento...</div>}

          {error && <div className="text-red-500">{error}</div>}

          {/* Custom container for PDF */}
          {pdf && (
            <div className="pdf-container">
              <Document
                file={pdf.s3Url}
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
          )}

          {/* Custom style for PDF via CSS-in-JS */}
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
          `}</style>
        </div>

        {/* Controls */}
        <div className="flex h-12 items-center justify-center border-t border-zinc-800 bg-[#111827] px-4 text-white">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-zinc-400">Página</span>
            <div className="flex items-center">
              <input
                type="text"
                value={pageNumber}
                onChange={handlePageChange}
                className="w-8 rounded border border-zinc-700 bg-zinc-800 text-center text-white"
              />
              <span className="mx-1 text-zinc-400">/</span>
              <span className="text-zinc-400">{numPages || "-"}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={handlePreviousPage} className="rounded p-1 hover:bg-zinc-700" disabled={pageNumber <= 1}>
                <ChevronLeft size={16} className={pageNumber <= 1 ? "text-zinc-600" : "text-zinc-300"} />
              </button>

              <button
                onClick={handleNextPage}
                className="rounded p-1 hover:bg-zinc-700"
                disabled={pageNumber >= (numPages || 1)}
              >
                <ChevronRight size={16} className={pageNumber >= (numPages || 1) ? "text-zinc-600" : "text-zinc-300"} />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={handleZoomOut} className="rounded p-1 hover:bg-zinc-700">
                <Minus size={16} className="text-zinc-300" />
              </button>

              <button onClick={handleZoomIn} className="rounded p-1 hover:bg-zinc-700">
                <Plus size={16} className="text-zinc-300" />
              </button>

              <button className="rounded p-1 hover:bg-zinc-700">
                <Maximize size={16} className="text-zinc-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}