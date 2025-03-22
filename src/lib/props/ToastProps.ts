interface ToastProps {
    show: boolean
    type: "success" | "error" | "info"
    title: string
    message: string   
}

export default ToastProps;