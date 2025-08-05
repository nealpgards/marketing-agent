export interface Conversation {
  id: string
  title: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    metadata?: any
  }>
  createdAt: string
  updatedAt: string
}

export class ConversationStorage {
  private static readonly STORAGE_KEY = 'apexmarketer-conversations'
  private static readonly CURRENT_CONVERSATION_KEY = 'apexmarketer-current-conversation'

  static getAllConversations(): Conversation[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading conversations:', error)
      return []
    }
  }

  static saveConversation(conversation: Conversation): void {
    if (typeof window === 'undefined') return

    try {
      const conversations = this.getAllConversations()
      const existingIndex = conversations.findIndex(c => c.id === conversation.id)
      
      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation
      } else {
        conversations.unshift(conversation) // Add to beginning
      }
      
      // Keep only last 50 conversations
      const trimmedConversations = conversations.slice(0, 50)
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedConversations))
    } catch (error) {
      console.error('Error saving conversation:', error)
    }
  }

  static getConversation(id: string): Conversation | null {
    const conversations = this.getAllConversations()
    return conversations.find(c => c.id === id) || null
  }

  static deleteConversation(id: string): void {
    if (typeof window === 'undefined') return

    try {
      const conversations = this.getAllConversations()
      const filtered = conversations.filter(c => c.id !== id)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
      
      // If we're deleting the current conversation, clear it
      if (this.getCurrentConversationId() === id) {
        this.setCurrentConversationId(null)
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  static getCurrentConversationId(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.CURRENT_CONVERSATION_KEY)
  }

  static setCurrentConversationId(id: string | null): void {
    if (typeof window === 'undefined') return
    
    if (id) {
      localStorage.setItem(this.CURRENT_CONVERSATION_KEY, id)
    } else {
      localStorage.removeItem(this.CURRENT_CONVERSATION_KEY)
    }
  }

  static createNewConversation(): Conversation {
    const now = new Date().toISOString()
    return {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Conversation',
      messages: [],
      createdAt: now,
      updatedAt: now
    }
  }

  static generateTitle(messages: Array<{ role: string, content: string }>): string {
    // Generate title from first user message
    const firstUserMessage = messages.find(m => m.role === 'user')
    if (!firstUserMessage) return 'New Conversation'
    
    const content = firstUserMessage.content.trim()
    if (content.length <= 40) return content
    
    // Truncate and add ellipsis
    return content.substring(0, 37) + '...'
  }

  static updateConversationTitle(id: string, title: string): void {
    if (typeof window === 'undefined') return

    try {
      const conversations = this.getAllConversations()
      const conversation = conversations.find(c => c.id === id)
      if (conversation) {
        conversation.title = title
        conversation.updatedAt = new Date().toISOString()
        this.saveConversation(conversation)
      }
    } catch (error) {
      console.error('Error updating conversation title:', error)
    }
  }
}