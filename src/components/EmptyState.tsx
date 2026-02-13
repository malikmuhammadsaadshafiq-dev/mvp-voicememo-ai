'use client'

import { Mic, Plus } from 'lucide-react'

interface EmptyStateProps {
  onAdd: () => void
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center fade-in-up">
      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <Mic className="w-10 h-10 text-violet-400" />
      </div>
      <h3 className="text-2xl font-semibold text-white mb-2">No voice memos yet</h3>
      <p className="text-white/60 mb-8 max-w-md">
        Your WhatsApp voice messages will appear here once transcribed and summarized by AI.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/25"
      >
        <Plus className="w-5 h-5" />
        Add your first voice memo
      </button>
    </div>
  )
}