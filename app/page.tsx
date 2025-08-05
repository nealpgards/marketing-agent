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
    "Create email campaign for product launch"
  ]

  const sidebarStyle = {
    width: '256px',
    backgroundColor: '#f9fafb',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column' as const,
  }

  const headerStyle = {
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    padding: '16px 24px',
  }

  const mainContainerStyle = {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  }

  const chatAreaStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    maxWidth: '1024px',
    margin: '0 auto',
    width: '100%',
  }

  const messagesContainerStyle = {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px 24px',
  }

  const inputAreaStyle = {
    borderTop: '1px solid #e5e7eb',
    padding: '16px 24px',
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 48px 12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    resize: 'none' as const,
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
  }

  const buttonStyle = {
    position: 'absolute' as const,
    right: '12px',
    top: '12px',
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
  }

  const quickActionStyle = {
    padding: '16px',
    textAlign: 'left' as const,
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    margin: '6px',
    transition: 'background-color 0.2s',
  }

  return (
    <div style={mainContainerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              AM
            </div>
            <span style={{ fontWeight: '600', color: '#111827' }}>ApexMarketer-AI</span>
          </div>
        </div>
        
        <nav style={{ flex: 1, padding: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
            Marketing Tools
          </div>
          {[
            'Strategy & Planning',
            'Content & Copy', 
            'SEO & SEM',
            'Paid Advertising',
            'Analytics',
            'Automation',
            'Growth Hacking'
          ].map((item, index) => (
            <a 
              key={index}
              href="#" 
              style={{
                display: 'block',
                padding: '8px 12px',
                fontSize: '14px',
                color: '#6b7280',
                textDecoration: 'none',
                borderRadius: '6px',
                marginBottom: '4px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              ApexMarketer-AI
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div style={chatAreaStyle}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
              <div style={{ textAlign: 'center', maxWidth: '512px', width: '100%' }}>
                <div style={{ marginBottom: '32px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '20px'
                  }}>
                    AM
                  </div>
                  <h2 style={{ fontSize: '30px', fontWeight: '600', color: '#111827', marginBottom: '16px', margin: '0 0 16px 0' }}>
                    What can I help with?
                  </h2>
                  <p style={{ color: '#6b7280', marginBottom: '32px', margin: '0 0 32px 0' }}>
                    Senior marketing strategist with 15 years of B2B/B2C experience
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(action)}
                      style={quickActionStyle}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      {action}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                  }}>
                    More
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={messagesContainerStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {messages.map((message, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      width: '100%', 
                      maxWidth: '1024px',
                      flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: message.role === 'user' ? '#374151' : 'transparent',
                        background: message.role === 'user' ? '#374151' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {message.role === 'user' ? 'U' : 'AM'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <MessageRenderer content={message.content} role={message.role} />
                        {message.metadata && (
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#6b7280', 
                            marginTop: '12px', 
                            paddingTop: '8px', 
                            borderTop: '1px solid #f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              backgroundColor: '#f3f4f6',
                              color: '#6b7280'
                            }}>
                              {message.metadata.taskType}
                            </span>
                            <span style={{ color: '#9ca3af' }}>
                              {message.metadata.tokens} tokens
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '12px', maxWidth: '768px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        AM
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                          <div>ApexMarketer-AI is thinking...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div style={inputAreaStyle}>
            <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
              <div style={{ position: 'relative' }}>
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
                  style={inputStyle}
                  rows={1}
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  style={buttonStyle}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '448px',
            width: '100%',
            margin: '16px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', margin: '0 0 12px 0' }}>
              Confirmation Required
            </h3>
            <p style={{ color: '#374151', marginBottom: '16px', margin: '0 0 16px 0' }}>
              {showConfirmation.description}
            </p>
            
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontWeight: '500', color: '#dc2626', marginBottom: '8px', margin: '0 0 8px 0' }}>
                Potential Risks:
              </h4>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '14px', color: '#6b7280' }}>
                {showConfirmation.risks.map((risk, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>{risk}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
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