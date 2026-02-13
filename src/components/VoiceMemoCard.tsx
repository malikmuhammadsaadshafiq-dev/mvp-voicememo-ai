'use client'

import { Mic, Clock, Globe, AlertCircle, CheckCircle, Trash2, Brain } from 'lucide-react'

interface VoiceMemo {
  id: string
  sender: string
  title: string
  date: string
  duration: string
  language: string
  sentiment: 'urgent' | 'neutral' | 'positive'
  summary: string
  transcript: string
}

interface VoiceMemoCardProps {
  memo: VoiceMemo
  onDelete: (id: string) => void
  onAnalyze: (id: string) => void
  isAnalyzing: boolean
}

export function VoiceMemoCard({ memo, onDelete, onAnalyze, isAnalyzing }: VoiceMemoCardProps) {
  const sentimentColors = {
    urgent: 'text-red-400 bg-red-400/10 border-red-400/20',
    positive: 'text-green-400 bg-green-400/10 border-green-400/20',
    neutral: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
  }

  const sentimentIcons = {
    urgent: AlertCircle,
    positive: CheckCircle,
    neutral: CheckCircle
  }

  const Icon = sentimentIcons[memo.sentiment]

  return (
    <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:-translate-y-1 fade-in-up">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold">
            {memo.sender.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{memo.sender}</h3>
            <p className="text-sm text-white/60">{memo.date}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${sentimentColors[memo.sentiment]}`}>
          <Icon className="w-4 h-4" />
          <span className="text-xs font-medium capitalize">{memo.sentiment}</span>
        </div>
      </div>

      <h4 className="font-medium text-white mb-2 text-base">{memo.title}</h4>
      
      <div className="flex items-center gap-4 mb-3 text-sm text-white/60">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{memo.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Globe className="w-4 h-4" />
          <span>{memo.language}</span>
        </div>
        <div className="flex items-center gap-1">
          <Mic className="w-4 h-4" />
          <span>Voice</span>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
        <p className="text-sm text-white/80 leading-relaxed">{memo.summary}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onAnalyze(memo.id)}
          disabled={isAnalyzing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
        >
          <Brain className="w-4 h-4" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </button>
        <button
          onClick={() => onDelete(memo.id)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}