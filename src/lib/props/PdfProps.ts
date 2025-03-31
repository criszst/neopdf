export default interface Pdf {
  id: string
  name: string
  createdAt: string
  updatedAt?: string
  isStarred: boolean
  s3Key?: string
  s3Url?: string
  fileHash?: string
  fileSize?: number
  pageCount?: number | null
  fileType?: string
  viewCount?: number
  lastViewed?: string
  userId?: string
  user?: {
    name: string
  }
  url?: string;
}