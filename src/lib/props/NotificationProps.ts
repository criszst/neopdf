interface NotificationProps {
  title: string
  message: string
  type?: "success" | "warning" | "info"
  isOpen: boolean
  onClose: () => void
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export default NotificationProps;