import { NextRequest, NextResponse } from 'next/server'
import { APEX_MARKETER_PERSONA, APEX_MARKETER_EXPERTISE } from '@/lib/agent/persona'
import { detectTaskType, getResponseFormat, formatResponseWithTemplate } from '@/lib/agent/formatters'
import { validateContent, sanitizeResponse, checkForConfirmationRequired } from '@/lib/agent/safety'

// Build system prompt from persona and expertise modules
function buildSystemPrompt(taskType?: string): string {
  const persona = APEX_MARKETER_PERSONA
  const expertise = APEX_MARKETER_EXPERTISE.map(e => `${e.name}: ${e.description}`).join('\n')
  
  let prompt = `You are ${persona.name}, a ${persona.role} with ${persona.experience}.

MINDSET: ${persona.mindset.join(', ')}

CORE EXPERTISE:
${expertise}

OPERATING PRINCIPLES:
${persona.operatingPrinciples.map(p => `- ${p}`).join('\n')}

COMMUNICATION STYLE:
- Tone: ${persona.communicationStyle.tone.join(', ')}
- Approach: ${persona.communicationStyle.approach.join(', ')}

SAFETY CONSTRAINTS:
${persona.communicationStyle.constraints.map(c => `- ${c}`).join('\n')}`

  if (taskType) {
    const format = getResponseFormat(taskType as any)
    prompt += `\n\nTASK-SPECIFIC FORMAT: ${format.format}`
  }

  return prompt
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context, taskType } = body

    // Basic validation
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    // // thought: Validate environment and API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // // thought: Check for actions requiring confirmation
    const confirmationRequired = checkForConfirmationRequired(message)
    if (confirmationRequired?.requiresExplicitConsent) {
      return NextResponse.json({
        requiresConfirmation: true,
        action: confirmationRequired.action,
        description: confirmationRequired.description,
        risks: confirmationRequired.risks,
        message: 'This action requires explicit confirmation before proceeding.'
      })
    }

    // // thought: Auto-detect task type if not provided
    const detectedTaskType = taskType || detectTaskType(message)
    
    // // thought: Build context-aware system prompt
    const systemPrompt = buildSystemPrompt(detectedTaskType)

    // // thought: Call OpenAI API with edge runtime optimization
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...(context ? [{ role: 'user', content: `Context: ${context}` }] : []),
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: response.status }
      )
    }

    const data = await response.json()
    let aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      )
    }

    // // thought: Apply safety validation and sanitization
    const validation = validateContent(aiResponse)
    if (!validation.isValid) {
      return NextResponse.json({
        error: 'Response failed safety validation',
        violations: validation.violations.map(v => v.rule.name),
        details: 'Generated content contains potentially unsafe elements'
      }, { status: 400 })
    }

    // Sanitize response for safety
    aiResponse = sanitizeResponse(aiResponse)

    // // thought: Format response according to task type
    const formattedResponse = formatResponseWithTemplate(aiResponse, detectedTaskType, {
      taskType: detectedTaskType,
      model: 'gpt-4-turbo-preview',
      tokens: data.usage?.total_tokens || 0
    })

    // // thought: Return structured response with comprehensive metadata
    return NextResponse.json({
      response: formattedResponse,
      metadata: {
        taskType: detectedTaskType,
        detectedAutomatically: !taskType,
        timestamp: new Date().toISOString(),
        model: 'gpt-4-turbo-preview',
        tokens: data.usage?.total_tokens || 0,
        safetyValidation: {
          passed: validation.isValid,
          warnings: validation.warnings
        },
        confirmationRequired: confirmationRequired ? {
          action: confirmationRequired.action,
          requiresConsent: confirmationRequired.requiresExplicitConsent
        } : null
      }
    })

  } catch (error) {
    console.error('Agent API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // // thought: Health check endpoint
  return NextResponse.json({
    status: 'active',
    agent: 'ApexMarketer-AI',
    version: '1.0.0',
    capabilities: [
      'Growth strategy & budget allocation',
      'Brand positioning & messaging',
      'Content marketing & copywriting',
      'SEO / SEM optimization',
      'Paid social & display advertising',
      'Marketing automation & CRM workflows',
      'Analytics & experimentation',
      'Product-led growth & onboarding',
      'Partner & channel marketing',
      'Customer success & advocacy programs'
    ]
  })
}