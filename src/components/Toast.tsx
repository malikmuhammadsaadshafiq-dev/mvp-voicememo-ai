'use client'

import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  isVisible: boolean
  type?: 'success' | 'error' | 'info'
  onClose?: () => void
}

export function Toast({ message, isVisible, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible && onClose) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: AlertCircle
  }

  const colors = {
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
  }

  const Icon = icons[type]

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border backdrop-blur-xl ${colors[type]} shadow-lg`}>
        <Icon className="w-5 h-5" />
        <span className="font-medium text-white">{message}</span>
      </div>
    </div>
  )
}