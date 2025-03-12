"use client"

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AlertDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const AnimatedAlert: React.FC<AlertDialogProps> = ({
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#151823] text-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative"
        >
          <button onClick={onCancel} className="absolute top-3 right-3 text-white/50 hover:text-white">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-3">{title}</h2>
          <p className="text-white/70 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedAlert;
