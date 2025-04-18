interface Activity {
  id: string
  type: "UPLOAD" | "VIEW" | "DOWNLOAD" | "DELETE" | "STAR" | "UNSTAR" | "SHARE"
  details?: string
  createdAt: string
  pdf?: {
    id: string
    name: string
    fileType: string
  }
}

export default Activity;