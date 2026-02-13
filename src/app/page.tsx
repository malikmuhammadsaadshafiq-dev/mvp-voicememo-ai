'use client'

import { useState } from 'react'
import { VoiceMemoCard } from '@/components/VoiceMemoCard'
import { EmptyState } from '@/components/EmptyState'
import { Toast } from '@/components/Toast'
import { askAI } from '@/lib/ai'
import { Mic, Search, Plus, RefreshCw, X, Send, Loader2 } from 'lucide-react'

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

export default function Home() {
  const [items, setItems] = useState<VoiceMemo[]>([
    {
      id: '1',
      sender: 'Sarah Chen',
      title: 'Quarterly budget review discussion',
      date: '2024-03-15',
      duration: '4:32',
      language: 'English',
      sentiment: 'urgent',
      summary: 'Need to cut marketing spend by 20% before Friday. Finance team requires immediate action on Q2 allocations and vendor negotiations.',
      transcript: 'Hi team, I have reviewed the quarterly numbers and we need to make some urgent adjustments to our marketing budget...'
    },
    {
      id: '2',
      sender: 'Marcus Johnson',
      title: 'Client feedback from Acme Corp',
      date: '2024-03-14',
      duration: '2:15',
      language: 'English',
      sentiment: 'positive',
      summary: 'Client loved the new design proposal and is ready to sign the contract next week. They particularly praised the user interface improvements.',
      transcript: 'Just got off the call with Sarah from Acme and she was thrilled with the presentation we gave yesterday...'
    },
    {
      id: '3',
      sender: 'Elena Rodriguez',
      title: 'Solicitud de vacaciones',
      date: '2024-03-14',
      duration: '1:45',
      language: 'Spanish',
      sentiment: 'neutral',
      summary: 'Requesting time off from April 10-15 for family event. Will hand over current projects to Juan before leaving and ensure all deadlines are met.',
      transcript: 'Hola, quería solicitar mis vacaciones para la semana del 10 de abril debido a un evento familiar importante...'
    },
    {
      id: '4',
      sender: 'David Kim',
      title: 'Product roadmap priorities',
      date: '2024-03-13',
      duration: '6:20',
      language: 'English',
      sentiment: 'urgent',
      summary: 'Critical bug in payment gateway needs immediate fix before launch tomorrow. Engineering team working overnight to resolve transaction failures.',
      transcript: 'We have a serious issue in production that needs everyone attention right now. The payment gateway is failing...'
    },
    {
      id: '5',
      sender: 'Sophie Martin',
      title: 'Réunion équipe marketing',
      date: '2024-03-12',
      duration: '3:10',
      language: 'French',
      sentiment: 'neutral',
      summary: 'Campaign launch scheduled for next Tuesday. All assets are ready for review. Social media strategy finalized with content calendar approved.',
      transcript: 'Bonjour à tous, je voulais confirmer que nous sommes prêts pour le lancement de la campagne la semaine prochaine...'
    },
    {
      id: '6',
      sender: 'James Wilson',
      title: 'Contract negotiation points',
      date: '2024-03-12',
      duration: '5:45',
      language: 'English',
      sentiment: 'urgent',
      summary: 'Legal team flagged three clauses requiring revision. Need response by EOD. Liability terms and indemnification sections need immediate attention.',
      transcript: 'The legal review came back and we have some serious concerns about section 4 regarding liability limitations...'
    },
    {
      id: '7',
      sender: 'Anna Schmidt',
      title: 'Design system updates',
      date: '2024-03-11',
      duration: '2:30',
      language: 'English',
      sentiment: 'positive',
      summary: 'New component library approved for production. Team celebration on Friday. Accessibility audit passed with 98% compliance score.',
      transcript: 'Great news everyone, the design system overhaul has been approved by the steering committee...'
    },
    {
      id: '8',
      sender: 'Carlos Mendez',
      title: 'Actualización de proyecto',
      date: '2024-03-10',
      duration: '4:15',
      language: 'Spanish',
      sentiment: 'neutral',
      summary: 'Development phase completed successfully. Moving to QA testing on Monday. All unit tests passing with 94% coverage.',
      transcript: 'Hola equipo, quería informarles que hemos terminado la fase de desarrollo y estamos listos para pasar a QA...'
    }
  ])

  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newMemoTitle, setNewMemoTitle] = useState('')
  const [newMemoSender, setNewMemoSender] = useState('')
  const [newMemoTranscript, setNewMemoTranscript] = useState('')
  const [formError, setFormError] = useState('')

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id))
    setToastMessage('Voice memo deleted successfully')
    setToastType('success')
    setShowToast(true)
  }

  const handleAnalyzeSentiment = async (id: string) => {
    setLoading(true)
    try {
      const memo = items.find(i => i.id === id)
      if (!memo) return
      
      const result = await askAI(
        `Analyze the sentiment of this voice message transcript and classify as urgent, positive, or neutral. Only respond with one word: "${memo.transcript}"`,
        'You are a sentiment analysis expert. Respond with only one word: urgent, positive, or neutral.'
      )
      
      const newSentiment = result.toLowerCase().includes('urgent') ? 'urgent' : 
                          result.toLowerCase().includes('positive') ? 'positive' : 'neutral'
      
      setItems(items.map(i => i.id === id ? { ...i, sentiment: newSentiment } : i))
      setToastMessage(`Sentiment analyzed: ${newSentiment}`)
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Failed to analyze sentiment')
      setToastType('error')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMemo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemoTitle.trim() || !newMemoSender.trim()) {
      setFormError('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    try {
      const summaryResult = await askAI(
        `Summarize this voice message transcript into 2-3 bullet points: "${newMemoTranscript || 'General discussion about project updates'}"`,
        'You are a helpful assistant that summarizes voice messages concisely.'
      )
      
      const newMemo: VoiceMemo = {
        id: Date.now().toString(),
        sender: newMemoSender,
        title: newMemoTitle,
        date: new Date().toISOString().split('T')[0],
        duration: '3:45',
        language: 'English',
        sentiment: 'neutral',
        summary: summaryResult || 'New voice message received and processed.',
        transcript: newMemoTranscript || 'Audio transcript pending...'
      }
      
      setItems([newMemo, ...items])
      setNewMemoTitle('')
      setNewMemoSender('')
      setNewMemoTranscript('')
      setFormError('')
      setIsModalOpen(false)
      setToastMessage('Voice memo added and summarized successfully')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Failed to process voice memo')
      setToastType('error')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setToastMessage('Archive refreshed with latest messages')
      setToastType('info')
      setShowToast(true)
    }, 1500)
  }

  const openModal = () => {
    setIsModalOpen(true)
    setFormError('')
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormError('')
    setNewMemoTitle('')
    setNewMemoSender('')
    setNewMemoTranscript('')
  }

  return (
    <div className="min-h-screen relative">
      <div className="aurora-bg">
        <div className="aurora-blob"></div>
        <div className="aurora-blob"></div>
        <div className="aurora-blob"></div>
      </div>

      <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">VoiceMemo AI</h1>
              <p className="text-xs text-white/60">WhatsApp Voice Transcription</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-lg font-medium transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/25 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Memo</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Your Voice Archive</h2>
              <p className="text-white/60">Search and manage your transcribed WhatsApp voice messages</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search memos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState onAdd={openModal} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((memo, index) => (
              <div key={memo.id} style={{ animationDelay: `${index * 0.1}s` }} className="fade-in-up">
                <VoiceMemoCard
                  memo={memo}
                  onDelete={handleDelete}
                  onAnalyze={handleAnalyzeSentiment}
                  isAnalyzing={loading}
                />
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && items.length > 0 && (
          <div className="text-center py-12 fade-in-up">
            <p className="text-white/60">No memos found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-violet-400 hover:text-violet-300 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
          <div className="bg-slate-900/90 border border-white/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Add New Voice Memo</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            
            <form onSubmit={handleAddMemo} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {formError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Sender Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newMemoSender}
                  onChange={(e) => setNewMemoSender(e.target.value)}
                  placeholder="e.g., Sarah Chen"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newMemoTitle}
                  onChange={(e) => setNewMemoTitle(e.target.value)}
                  placeholder="e.g., Project Update Discussion"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Transcript (Optional)
                </label>
                <textarea
                  value={newMemoTranscript}
                  onChange={(e) => setNewMemoTranscript(e.target.value)}
                  placeholder="Paste voice transcript here for AI summarization..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all duration-200 active:scale-95 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 shadow-lg shadow-violet-500/25"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Add Memo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}