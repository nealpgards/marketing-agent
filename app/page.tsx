'use client'

import { useState } from 'react'
import MessageRenderer from '@/components/MessageRenderer'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  metadata?: any
}

interface ConfirmationDialog {
  action: string
  description: string
  risks: string[]
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState<ConfirmationDialog | null>(null)
  const [pendingMessage, setPendingMessage] = useState('')

  const handleSend = async (messageToSend?: string, confirmed = false) => {
    const currentMessage = messageToSend || input
    if (!currentMessage.trim() || loading) return

    setLoading(true)
    
    const userMessage: Message = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    }
    
    if (!messageToSend) {
      setMessages(prev => [...prev, userMessage])
      setInput('')
    }

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          confirmed
        })
      })

      const data = await response.json()

      if (data.requiresConfirmation) {
        setShowConfirmation({
          action: data.action,
          description: data.description,
          risks: data.risks
        })
        setPendingMessage(currentMessage)
        setLoading(false)
        return
      }

      if (response.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
          metadata: data.metadata
        }
        setMessages(prev => messageToSend ? [...prev, userMessage, assistantMessage] : [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: `Error: ${data.error || 'Something went wrong'}`,
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Error: Failed to communicate with ApexMarketer-AI',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setLoading(false)
  }

  const handleConfirm = () => {
    setShowConfirmation(null)
    handleSend(pendingMessage, true)
    setPendingMessage('')
  }

  const handleCancel = () => {
    setShowConfirmation(null)
    setPendingMessage('')
    setLoading(false)
  }

  const quickActions = [
    "Audit my website's SEO and find quick wins",
    "Draft LinkedIn ads for B2B lead generation",
    "Analyze funnel metrics and suggest improvements", 
    "Create email campaign for product launch",
    "More"
  ]

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-gray-50 border-r border-gray-200 flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AM</span>
            </div>
            <span className="font-semibold text-gray-900">ApexMarketer-AI</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mb-3">Marketing Tools</div>
            <a href="#" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Strategy & Planning</a>
            <a href="#" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Content & Copy</a>
            <a href="#" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">SEO & SEM</a>
            <a href="#" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Paid Advertising</a>
            <a href="#" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Analytics</a>
            <a href="#" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Automation</a>
            <a href="#" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Growth Hacking</a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="md:hidden w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AM</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">ApexMarketer-AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-4 md:px-6">
              <div className="text-center max-w-2xl w-full">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">AM</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">What can I help with?</h2>
                  <p className="text-gray-600 mb-8">Senior marketing strategist with 15 years of B2B/B2C experience</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {quickActions.slice(0, 4).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(action)}
                      className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                    >
                      <div className="text-gray-700">{action}</div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50">
                    More
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex space-x-3 w-full max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-gray-700' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600'
                      }`}>
                        <span className="text-white text-sm font-medium">
                          {message.role === 'user' ? 'U' : 'AM'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <MessageRenderer content={message.content} role={message.role} />
                        {message.metadata && (
                          <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 mr-2">
                              {message.metadata.taskType}
                            </span>
                            <span className="text-gray-400">
                              {message.metadata.tokens} tokens
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex space-x-3 max-w-3xl">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">AM</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <div className="animate-pulse">ApexMarketer-AI is thinking...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 px-4 md:px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Message ApexMarketer-AI..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  rows={1}
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-3">Confirmation Required</h3>
            <p className="text-gray-700 mb-4">{showConfirmation.description}</p>
            
            <div className="mb-4">
              <h4 className="font-medium text-red-600 mb-2">Potential Risks:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {showConfirmation.risks.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}