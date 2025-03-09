"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Check, AlertCircle, X, Loader2 } from "lucide-react"

interface FileUploadProps {
  onUploadComplete?: (data: any) => void
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [fileName, setFileName] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== "application/pdf") {
      setUploadStatus("error")
      setErrorMessage("Apenas arquivos PDF são permitidos")
      return
    }

    // Validate file size (max 10MB)
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
        return prev + 10
      })
    }, 300)

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
      setUploadStatus("success")

      if (onUploadComplete) {
        onUploadComplete(data)
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStatus("idle")
        setUploadProgress(0)
        setFileName("")
      }, 3000)
    } catch (error: any) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      setErrorMessage(error.message || "Erro ao fazer upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf"
    input.onchange = (e: Event) => handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
    input.click()
  }

  const resetUpload = () => {
    setUploadStatus("idle")
    setUploadProgress(0)
    setErrorMessage("")
    setFileName("")
  }

  return (
    <div className="relative">
      {uploadStatus === "idle" ? (
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors"
        >
          <Upload size={18} />
          <span>Upload PDF</span>
        </button>
      ) : (
        <div className="w-64 bg-white/10 backdrop-blur-sm rounded-md p-3">
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
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                uploadStatus === "error" ? "bg-red-500" : "bg-purple-500"
              }`}
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between mt-2">
            {uploadStatus === "uploading" && (
              <div className="flex items-center gap-1 text-white/70 text-xs">
                <Loader2 size={14} className="animate-spin" />
                <span>Uploading... {uploadProgress}%</span>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <Check size={14} />
                <span>Upload completo</span>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="flex items-center gap-1 text-red-400 text-xs">
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

