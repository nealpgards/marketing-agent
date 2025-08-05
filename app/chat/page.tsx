'use client'

import { useState } from 'react'

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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [taskType, setTaskType] = useState('')
  const [showConfirmation, setShowConfirmation] = useState<ConfirmationDialog | null>(null)
  const [pendingMessage, setPendingMessage] = useState('')

  const handleSend = async (messageToSend?: string, confirmed = false) => {
    const currentMessage = messageToSend || input
    if (!currentMessage.trim() || loading) return

    setLoading(true)
    
    // Add user message
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
          taskType: taskType || undefined,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ApexMarketer-AI Chat</h1>
          <p className="text-gray-600">Senior marketing strategist and operator at your service</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Task Type Selector */}
          <div className="border-b p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Type (auto-detected if not specified):
            </label>
            <select 
              value={taskType} 
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Auto-detect</option>
              <option value="strategy">Strategy & Planning</option>
              <option value="copy">Copy & Creative</option>
              <option value="data-insight">Data Analysis & Insights</option>
              <option value="roadmap">Roadmap & Checklist</option>
              <option value="api-query">Data Query</option>
              <option value="audit">Audit & Review</option>
              <option value="campaign">Campaign Planning</option>
              <option value="general">General Marketing</option>
            </select>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-4">Ready to help with your marketing needs!</p>
                <div className="text-sm space-y-1">
                  <p>Try asking:</p>
                  <p>"Audit my website's SEO and find quick wins"</p>
                  <p>"Draft LinkedIn ads for 3PL operations managers"</p>
                  <p>"Analyze our funnel metrics and suggest improvements"</p>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white ml-12'
                      : 'bg-gray-100 text-gray-900 mr-12'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.metadata && (
                    <div className="text-xs opacity-70 mt-2">
                      Task: {message.metadata.taskType} | 
                      Tokens: {message.metadata.tokens} |
                      {message.metadata.safetyValidation?.warnings?.length > 0 && 
                        ` Warnings: ${message.metadata.safetyValidation.warnings.length}`
                      }
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  ApexMarketer-AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask ApexMarketer-AI for marketing strategy, copy, analysis, or insights..."
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
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
    </div>
  )
}