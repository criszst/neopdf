"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, Check, AlertCircle, X, Loader2, Info } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import ToastComponent from "../ui/toast"

interface FileUploadProps {
  onUploadComplete?: (data: any) => void
  className?: string
  showLabel?: boolean
}

export default function FileUpload({ onUploadComplete, className = "", showLabel = true }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error" | "duplicate">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [fileName, setFileName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    await processFile(file)
  }

  const processFile = async (file: File) => {

    if (file.type !== "application/pdf") {
      setUploadStatus("error")
      setErrorMessage("Apenas arquivos PDF são permitidos")
      return
    }

    // max 10mb
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus("error")
      setErrorMessage("O arquivo não pode ser maior que 10MB")
      return
    }

    setFileName(file.name)
    setIsUploading(true)
    setUploadStatus("uploading")
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 5
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro ao fazer upload")
      }

      setUploadProgress(100)
      
      // Verificar se é um arquivo duplicado
      if (data.isDuplicate) {
        setUploadStatus("duplicate")
      } else {
        setUploadStatus("success")
        setTimeout(() => {
          router.push(data.url)
        }, 1500)
      }

      if (onUploadComplete) {
        onUploadComplete(data)
      }

      // Registrar atividade
      await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "UPLOAD",
          pdfId: data.id,
          details: `Uploaded ${file.name}`,
        }),
      })

 
    } catch (error: any) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      setErrorMessage(error.message || "Erro ao fazer upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const resetUpload = () => {
    setUploadStatus("idle")
    setUploadProgress(0)
    setErrorMessage("")
    setFileName("")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      await processFile(files[0])
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence>
        {uploadStatus === "idle" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`${
              isDragging
                ? "bg-purple-500/20 border-purple-500"
                : "hover:bg-purple-500/10 border-purple-500/20"
            } border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer`}
          >
            <button
              onClick={handleUploadClick}
              className="w-full flex flex-col items-center justify-center py-6 px-4"
              disabled={isUploading}
            >
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-purple-400" />
              </div>
              {showLabel && (
                <>
                  <p className="text-white font-medium mb-1">Arraste e solte seu PDF aqui</p>
                  <p className="text-zinc-400 text-sm">ou clique para selecionar</p>
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium truncate max-w-[180px]" title={fileName}>
                {fileName}
              </p>
              {uploadStatus !== "uploading" && (
                <button onClick={resetUpload} className="text-white/70 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
                className={`h-full rounded-full transition-all duration-300 ${
                  uploadStatus === "error"
                    ? "bg-red-500"
                    : uploadStatus === "duplicate"
                    ? "bg-blue-500"
                    : "bg-purple-500"
                }`}
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              {uploadStatus === "uploading" && (
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Enviando... {uploadProgress}%</span>
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="flex items-center gap-1 text-green-400 text-xs">
                  <Check size={14} />
                  <span>Upload completo</span>
                </div>
              )}

              {uploadStatus === "duplicate" && (
                <div className="flex items-center gap-1 text-blue-400 text-xs">
                  <Info size={14} />
                  <span>Arquivo já existe</span>
                </div>
              )}

              {uploadStatus === "error" && (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <AlertCircle size={14} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}