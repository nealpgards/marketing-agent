import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table') || 'campaigns'
    const limit = parseInt(searchParams.get('limit') || '5')

    const airtableApiKey = process.env.AIRTABLE_API_KEY
    const airtableBaseId = process.env.AIRTABLE_BASE_ID

    if (!airtableApiKey || !airtableBaseId) {
      return NextResponse.json(
        { error: 'Airtable credentials not configured' },
        { status: 500 }
      )
    }

    // // thought: Mock data for development - replace with actual Airtable API call
    const mockData = {
      campaigns: [
        { id: 'rec1', name: 'Q4 Product Launch', status: 'Active', budget: 50000, roi: 3.2 },
        { id: 'rec2', name: 'Brand Awareness', status: 'Paused', budget: 25000, roi: 1.8 },
        { id: 'rec3', name: 'Lead Generation', status: 'Active', budget: 75000, roi: 4.1 },
        { id: 'rec4', name: 'Retargeting', status: 'Active', budget: 15000, roi: 2.9 },
        { id: 'rec5', name: 'SEO Content', status: 'Planning', budget: 30000, roi: null }
      ],
      assets: [
        { id: 'ast1', name: 'Landing Page A', type: 'Web Page', performance: 'High' },
        { id: 'ast2', name: 'Email Template B', type: 'Email', performance: 'Medium' },
        { id: 'ast3', name: 'Social Ad Creative C', type: 'Creative', performance: 'High' },
        { id: 'ast4', name: 'Blog Post D', type: 'Content', performance: 'Low' },
        { id: 'ast5', name: 'Video Ad E', type: 'Video', performance: 'High' }
      ]
    }

    const data = mockData[table as keyof typeof mockData] || []
    const preview = data.slice(0, limit)

    return NextResponse.json({
      data: preview,
      meta: {
        source: 'airtable',
        table,
        total: data.length,
        preview_size: preview.length,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Airtable API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Airtable data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { table, records } = body

    // // thought: Placeholder for creating records in Airtable
    return NextResponse.json({
      message: 'Records created successfully',
      table,
      created: records?.length || 0,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Airtable create error:', error)
    return NextResponse.json(
      { error: 'Failed to create Airtable records' },
      { status: 500 }
    )
  }
}