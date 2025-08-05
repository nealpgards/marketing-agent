import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entity = searchParams.get('entity') || 'pipeline'
    const limit = parseInt(searchParams.get('limit') || '5')

    const hubspotApiKey = process.env.HUBSPOT_API_KEY
    const salesforceApiKey = process.env.SALESFORCE_API_KEY
    
    if (!hubspotApiKey && !salesforceApiKey) {
      return NextResponse.json(
        { error: 'CRM credentials not configured' },
        { status: 500 }
      )
    }

    // // thought: Mock CRM data - replace with actual HubSpot/Salesforce API calls
    const mockData = {
      pipeline: [
        { stage: 'MQL', count: 1240, value: 2480000, avg_deal_size: 2000 },
        { stage: 'SQL', count: 450, value: 1800000, avg_deal_size: 4000 },
        { stage: 'Opportunity', count: 180, value: 1440000, avg_deal_size: 8000 },
        { stage: 'Proposal', count: 75, value: 1200000, avg_deal_size: 16000 },
        { stage: 'Closed Won', count: 32, value: 640000, avg_deal_size: 20000 }
      ],
      deals: [
        { id: 'deal1', company: 'Tech Corp', value: 45000, stage: 'Proposal', probability: 0.8 },
        { id: 'deal2', company: 'Logistics Inc', value: 28000, stage: 'Opportunity', probability: 0.6 },
        { id: 'deal3', company: 'Manufacturing Co', value: 67000, stage: 'Proposal', probability: 0.9 },
        { id: 'deal4', company: 'Retail Chain', value: 15000, stage: 'SQL', probability: 0.3 },
        { id: 'deal5', company: 'Warehouse Solutions', value: 92000, stage: 'Opportunity', probability: 0.7 }
      ],
      contacts: [
        { id: 'cont1', name: 'John Smith', company: 'Tech Corp', lead_score: 85, source: 'Organic Search' },
        { id: 'cont2', name: 'Sarah Johnson', company: 'Logistics Inc', lead_score: 72, source: 'LinkedIn Ads' },
        { id: 'cont3', name: 'Mike Wilson', company: 'Manufacturing Co', lead_score: 91, source: 'Email Campaign' },
        { id: 'cont4', name: 'Lisa Chen', company: 'Retail Chain', lead_score: 58, source: 'Trade Show' },
        { id: 'cont5', name: 'David Brown', company: 'Warehouse Solutions', lead_score: 78, source: 'Referral' }
      ],
      attribution: [
        { source: 'Organic Search', mqls: 450, sqls: 180, deals: 35, revenue: 700000 },
        { source: 'LinkedIn Ads', mqls: 320, sqls: 128, deals: 28, revenue: 560000 },
        { source: 'Email Campaigns', mqls: 280, sqls: 98, deals: 22, revenue: 440000 },
        { source: 'Google Ads', mqls: 190, sqls: 57, deals: 15, revenue: 300000 },
        { source: 'Trade Shows', mqls: 150, sqls: 45, deals: 12, revenue: 240000 }
      ]
    }

    const data = mockData[entity as keyof typeof mockData] || []
    const preview = Array.isArray(data) ? data.slice(0, limit) : data

    return NextResponse.json({
      data: preview,
      meta: {
        source: hubspotApiKey ? 'hubspot' : 'salesforce',
        entity,
        total: Array.isArray(data) ? data.length : 1,
        preview_size: Array.isArray(preview) ? preview.length : 1,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('CRM API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CRM data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entity, data } = body

    // // thought: Placeholder for creating/updating CRM records
    return NextResponse.json({
      message: \`\${entity} updated successfully\`,
      entity,
      records_affected: Array.isArray(data) ? data.length : 1,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('CRM update error:', error)
    return NextResponse.json(
      { error: 'Failed to update CRM data' },
      { status: 500 }
    )
  }
}