import React, { useEffect } from "react"
import { Upload, MenuIcon, Star, Settings } from 'lucide-react'
import { AnimatePresence, motion } from "framer-motion"
import FileUpload from "@/components/animations/FileUpload"
import ToastProps from "@/lib/props/ToastProps"
import ToastComponent from "../ui/toast"

const QuickActions = () => {
  const [showUploadModal, setShowUploadModal] = React.useState(false)
  const [toast, setToast] = React.useState<ToastProps>()

  const handleUpload = (data: any) => {
    setShowUploadModal(false)

    setToast({
      show: true,
      type: "success",
      title: "Upload Concluído",
      message: `${data.name} foi enviado com sucesso!`,
    })
  }
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-[#151823]/80 backdrop-blur-sm rounded-xl border border-purple-900/20 h-full"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Quick Actions</h2>
          <button className="p-1.5 rounded-lg hover:bg-purple-500/10 text-zinc-400 hover:text-purple-400 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-transparent border border-purple-500/20 hover:bg-purple-500/30 transition-all duration-200 group">
                    <FileUpload
                  onUploadComplete={(data) =>handleUpload(data)}
                  className=" lg:block w-[100%]"
                  showLabel={true}
                />
          </button>
          {[
            { icon: MenuIcon, label: "Merge PDFs" },
            { icon: Star, label: "View Favorites" },
            { icon: Settings, label: "Settings" },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-purple-900/20 hover:bg-purple-500/10 transition-all duration-200 group"
            >
              <action.icon className="h-5 w-5 text-zinc-400 group-hover:text-purple-400 transition-colors" />
              <span className="text-white group-hover:text-purple-400 transition-colors">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {toast?.show && (
          <ToastComponent
            title={toast.title}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </AnimatePresence>
      
    </motion.div>
  )
}

export default QuickActions
