"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Check, AlertCircle } from "lucide-react"

export default function FileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [fileName, setFileName] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus("uploading")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadStatus("success")
        setFileName(file.name)
        console.log("Upload bem-sucedido:", result.url)
      } else {
        setUploadStatus("error")
        setErrorMessage(result.error || "Erro ao enviar arquivo")
        console.error("Erro ao enviar:", result.error)
      }
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage("Erro na conexão com o servidor")
      console.error("Erro no upload:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className={`flex items-center gap-2 px-4 py-2 ${isUploading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"} rounded-md text-white font-medium transition-colors cursor-pointer`}
      >
        <Upload size={18} />
        <span>{isUploading ? "Enviando..." : "Upload PDF"}</span>
      </label>

      {uploadStatus === "error" && (
        <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
          <AlertCircle size={14} />
          {errorMessage}
        </div>
      )}

      {uploadStatus === "success" && (
        <div className="mt-2 text-green-500 text-sm flex items-center gap-1">
          <Check size={14} />
          Upload completo: {fileName}
        </div>
      )}
    </div>
  )
}

