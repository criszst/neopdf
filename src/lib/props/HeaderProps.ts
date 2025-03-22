import type { User } from "next-auth"
interface HeaderProps {
  user: User | null
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onUpload: () => void
}

export default HeaderProps