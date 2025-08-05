export interface SafetyRule {
  id: string
  name: string
  description: string
  pattern?: RegExp
  validator: (input: string) => boolean
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export const SAFETY_RULES: SafetyRule[] = [
  {
    id: 'api-key-exposure',
    name: 'API Key Exposure Prevention',
    description: 'Prevents exposure of API keys and secret tokens',
    pattern: /(?:api[_-]?key|secret|token|password)["\s]*[:=]["\s]*[a-zA-Z0-9_-]{10,}/gi,
    validator: (input: string) => !input.match(/(?:api[_-]?key|secret|token|password)["\s]*[:=]["\s]*[a-zA-Z0-9_-]{10,}/gi),
    severity: 'critical'
  },
  
  {
    id: 'pii-exposure',
    name: 'PII Exposure Prevention', 
    description: 'Prevents exposure of personally identifiable information',
    pattern: /\b\d{3}-\d{2}-\d{4}\b|\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
    validator: (input: string) => {
      // Check for SSN, credit card patterns, emails with full names
      const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g
      const ccPattern = /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g
      return !input.match(ssnPattern) && !input.match(ccPattern)
    },
    severity: 'critical'
  },

  {
    id: 'bulk-action-confirmation',
    name: 'Bulk Action Confirmation Required',
    description: 'Requires confirmation before bulk email sends or live publishing',
    validator: (input: string) => {
      const bulkActions = [
        'send email to all',
        'publish to production',
        'send to entire list',
        'broadcast message',
        'mass email'
      ]
      return !bulkActions.some(action => input.toLowerCase().includes(action))
    },
    severity: 'high'
  },

  {
    id: 'data-source-citation',
    name: 'Data Source Citation',
    description: 'Ensures third-party data sources are properly cited',
    validator: (input: string) => {
      // If mentioning data, should include source
      const hasDataMention = /data|metrics|analytics|report|study/i.test(input)
      const hasSourceCitation = /source:|according to|data from/i.test(input)
      return !hasDataMention || hasSourceCitation
    },
    severity: 'medium'
  },

  {
    id: 'harmful-content',
    name: 'Harmful Content Prevention',
    description: 'Prevents generation of harmful or malicious content',
    validator: (input: string) => {
      const harmfulPatterns = [
        /hack|exploit|malware|virus/gi,
        /fake|fraud|scam|phishing/gi,
        /manipulate|deceive|mislead/gi
      ]
      return !harmfulPatterns.some(pattern => pattern.test(input))
    },
    severity: 'critical'
  }
]

export interface ValidationResult {
  isValid: boolean
  violations: {
    rule: SafetyRule
    details: string
  }[]
  warnings: string[]
}

export function validateContent(content: string): ValidationResult {
  const violations: ValidationResult['violations'] = []
  const warnings: string[] = []

  for (const rule of SAFETY_RULES) {
    if (!rule.validator(content)) {
      violations.push({
        rule,
        details: `Content violates rule: ${rule.name}`
      })
    }
  }

  // Add contextual warnings
  if (content.toLowerCase().includes('send email') && !content.includes('confirm')) {
    warnings.push('Consider adding confirmation step before sending emails')
  }

  if (content.includes('$') && content.includes('budget') && !content.includes('approximate')) {
    warnings.push('Budget figures should be marked as approximate unless confirmed')
  }

  return {
    isValid: violations.filter(v => v.rule.severity === 'critical').length === 0,
    violations,
    warnings
  }
}

export function sanitizeResponse(response: string): string {
  let sanitized = response

  // Remove potential API key patterns
  sanitized = sanitized.replace(
    /(?:api[_-]?key|secret|token)["\s]*[:=]["\s]*[a-zA-Z0-9_-]{10,}/gi,
    '[API_KEY_REDACTED]'
  )

  // Remove potential credit card numbers
  sanitized = sanitized.replace(
    /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
    '[CARD_NUMBER_REDACTED]'
  )

  // Remove potential SSNs
  sanitized = sanitized.replace(
    /\b\d{3}-\d{2}-\d{4}\b/g,
    '[SSN_REDACTED]'
  )

  return sanitized
}

export interface ConfirmationRequired {
  action: string
  description: string
  risks: string[]
  requiresExplicitConsent: boolean
}

export function checkForConfirmationRequired(userMessage: string): ConfirmationRequired | null {
  const message = userMessage.toLowerCase()

  // Bulk email actions
  if (message.includes('send email') && (message.includes('all') || message.includes('entire') || message.includes('everyone'))) {
    return {
      action: 'bulk_email_send',
      description: 'Send email to large recipient list',
      risks: [
        'May trigger spam filters',
        'Could result in unsubscribes',
        'Potential compliance issues',
        'Hard to recall once sent'
      ],
      requiresExplicitConsent: true
    }
  }

  // Live publishing actions
  if (message.includes('publish') && (message.includes('live') || message.includes('production'))) {
    return {
      action: 'live_publish',
      description: 'Publish content to live/production environment',
      risks: [
        'Content will be immediately visible to public',
        'Difficult to quickly modify or remove',
        'May impact brand reputation if incorrect',
        'SEO implications for website changes'
      ],
      requiresExplicitConsent: true
    }
  }

  // Budget/financial actions
  if (message.includes('spend') || message.includes('allocate budget')) {
    return {
      action: 'budget_allocation',
      description: 'Allocate or spend marketing budget',
      risks: [
        'Financial commitment',
        'May affect other campaign budgets', 
        'ROI implications',
        'Approval may be required'
      ],
      requiresExplicitConsent: false
    }
  }

  return null
}