export type TaskType = 
  | 'strategy'
  | 'copy'
  | 'data-insight'
  | 'roadmap'
  | 'api-query'
  | 'audit'
  | 'campaign'
  | 'general'

export interface ResponseFormat {
  taskType: TaskType
  format: string
  structure: string[]
  examples: string[]
}

export const RESPONSE_FORMATS: Record<TaskType, ResponseFormat> = {
  strategy: {
    taskType: 'strategy',
    format: 'Markdown outline → optional PPT link',
    structure: [
      '# Strategy Overview',
      '## Situation Analysis',
      '## Strategic Objectives', 
      '## Recommended Actions',
      '## Success Metrics',
      '## Implementation Timeline'
    ],
    examples: [
      'Growth strategy for SaaS platform',
      'Market expansion plan',
      'Competitive positioning strategy'
    ]
  },
  
  copy: {
    taskType: 'copy',
    format: 'Table: Version · Hook · CTA',
    structure: [
      '| Version | Hook | Body | CTA |',
      '|---------|------|------|-----|',
      '| A | [Hook A] | [Body A] | [CTA A] |'
    ],
    examples: [
      'LinkedIn ad variations',
      'Email subject line tests',
      'Landing page headline options'
    ]
  },

  'data-insight': {
    taskType: 'data-insight',
    format: 'Bulleted takeaway + inline chart link',
    structure: [
      '## Key Insights',
      '• Primary finding with data point',
      '• Secondary finding with trend',
      '• Actionable recommendation',
      '## Data Visualization',
      '[Chart/Dashboard Link]'
    ],
    examples: [
      'Funnel performance analysis',
      'Campaign ROI breakdown',
      'Customer segment insights'
    ]
  },

  roadmap: {
    taskType: 'roadmap',
    format: 'Nested Markdown list',
    structure: [
      '## Q1 Initiatives',
      '- [ ] Major Initiative 1',
      '  - [ ] Sub-task A (Impact: High, Effort: Medium)',
      '  - [ ] Sub-task B (Impact: Medium, Effort: Low)',
      '- [ ] Major Initiative 2'
    ],
    examples: [
      'Marketing campaign roadmap',
      'SEO optimization checklist',
      'Growth experiment pipeline'
    ]
  },

  'api-query': {
    taskType: 'api-query', 
    format: '5-row preview table, then JSON link',
    structure: [
      '## Data Preview',
      '| Column 1 | Column 2 | Column 3 |',
      '|----------|----------|----------|',
      '| Row 1 data...',
      '## Full Dataset',
      '[JSON Export Link]'
    ],
    examples: [
      'CRM pipeline data',
      'Analytics performance metrics',
      'Campaign asset inventory'
    ]
  },

  audit: {
    taskType: 'audit',
    format: 'Prioritized findings with impact estimates',
    structure: [
      '## Executive Summary',
      '## High Impact Issues (Fix First)',
      '• Issue 1 - Estimated traffic lift: +X%',
      '## Medium Impact Issues',  
      '## Low Impact Issues',
      '## Implementation Priority'
    ],
    examples: [
      'SEO technical audit',
      'Conversion rate optimization audit',
      'Marketing automation review'
    ]
  },

  campaign: {
    taskType: 'campaign',
    format: 'Campaign brief with creative specs',
    structure: [
      '## Campaign Overview',
      '## Target Audience',
      '## Creative Requirements',
      '## Budget Allocation',
      '## Success Metrics',
      '## Timeline & Deliverables'
    ],
    examples: [
      'Product launch campaign',
      'Lead generation campaign',
      'Brand awareness initiative'
    ]
  },

  general: {
    taskType: 'general',
    format: 'Structured analysis with recommendations',
    structure: [
      '## Analysis',
      '## Recommendations',
      '## Next Steps',
      '## Resources Required'
    ],
    examples: [
      'Marketing stack evaluation',
      'Team structure optimization',
      'Budget reallocation analysis'
    ]
  }
}

export function getResponseFormat(taskType: TaskType): ResponseFormat {
  return RESPONSE_FORMATS[taskType] || RESPONSE_FORMATS.general
}

export function detectTaskType(userMessage: string): TaskType {
  const message = userMessage.toLowerCase()
  
  // Strategy keywords
  if (message.includes('strategy') || message.includes('plan') || message.includes('roadmap')) {
    if (message.includes('roadmap') || message.includes('checklist') || message.includes('timeline')) {
      return 'roadmap'
    }
    return 'strategy'
  }
  
  // Copy/Creative keywords
  if (message.includes('copy') || message.includes('write') || message.includes('ad') || 
      message.includes('email') || message.includes('variation')) {
    return 'copy'
  }
  
  // Data/Analytics keywords
  if (message.includes('data') || message.includes('analytics') || message.includes('metrics') ||
      message.includes('pull') || message.includes('funnel') || message.includes('performance')) {
    if (message.includes('pull') || message.includes('export') || message.includes('api')) {
      return 'api-query'
    }
    return 'data-insight'
  }
  
  // Audit keywords
  if (message.includes('audit') || message.includes('review') || message.includes('analyze') ||
      message.includes('quick wins') || message.includes('issues')) {
    return 'audit'
  }
  
  // Campaign keywords
  if (message.includes('campaign') || message.includes('launch') || message.includes('creative') ||
      message.includes('budget split')) {
    return 'campaign'
  }
  
  return 'general'
}

export function formatResponseWithTemplate(
  response: string, 
  taskType: TaskType,
  metadata?: Record<string, any>
): string {
  const format = getResponseFormat(taskType)
  
  // Add task-specific formatting hints
  let formattedResponse = `// thought: Formatting response as ${format.format}\n\n${response}`
  
  // Add metadata if available
  if (metadata) {
    formattedResponse += '\n\n---\n'
    formattedResponse += `*Generated: ${new Date().toISOString()}*\n`
    if (metadata.source) formattedResponse += `*Source: ${metadata.source}*\n`
    if (metadata.model) formattedResponse += `*Model: ${metadata.model}*\n`
  }
  
  return formattedResponse
}