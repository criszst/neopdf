"use client"
import type Pdf from "@/lib/props/PdfProps"
import PDFList from "@/components/dashboard/pdfs"

interface DashboardAdapterProps {
  pdfs: Pdf[]
  onDelete: (id: string) => void
  viewMode: "grid" | "list"
}

// This is a wrapper component that adapts the Pdf type to the PDF type expected by PDFList
export default function DashboardAdapter({ pdfs, onDelete, viewMode }: DashboardAdapterProps) {
  // Map the pdfs to include the url property
  const adaptedPdfs = pdfs.map((pdf) => ({
    ...pdf,
    url: pdf.s3Url || `#pdf-${pdf.id}`, // Use s3Url as url or fallback to a placeholder
  }))

  return <PDFList pdfs={adaptedPdfs} onDelete={onDelete} viewMode={viewMode} />
}

