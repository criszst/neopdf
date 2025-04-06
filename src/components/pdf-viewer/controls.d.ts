import type React from "react"
import type { ChangeEvent } from "react"

export interface ControlsProps {
  pageNumber: number
  numPages: number | null
  scale: number
  onPreviousPage: () => void
  onNextPage: () => void
  onPageChange: (e: ChangeEvent<HTMLInputElement>) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onRotate: () => void
  onPrint: () => void
}

declare const Controls: React.FC<ControlsProps>
export default Controls

