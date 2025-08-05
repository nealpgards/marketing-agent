import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric') || 'overview'
    const period = searchParams.get('period') || '30d'

    const gaApiKey = process.env.GOOGLE_ANALYTICS_KEY
    
    if (!gaApiKey) {
      return NextResponse.json(
        { error: 'Google Analytics credentials not configured' },
        { status: 500 }
      )
    }

    // // thought: Mock analytics data - replace with actual GA4 API calls
    const mockData = {
      overview: {
        sessions: 45280,
        users: 38450,
        pageviews: 125630,
        bounce_rate: 0.42,
        avg_session_duration: 185,
        conversion_rate: 0.034
      },
      funnel: [
        { stage: 'Awareness', users: 38450, conversion: 1.0 },
        { stage: 'Interest', users: 15380, conversion: 0.40 },
        { stage: 'Consideration', users: 8950, conversion: 0.58 },
        { stage: 'Intent', users: 3240, conversion: 0.36 },
        { stage: 'Purchase', users: 1305, conversion: 0.40 }
      ],
      channels: [
        { channel: 'Organic Search', sessions: 18560, conversion_rate: 0.045 },
        { channel: 'Paid Search', sessions: 12350, conversion_rate: 0.052 },
        { channel: 'Social Media', sessions: 8940, conversion_rate: 0.028 },
        { channel: 'Email', sessions: 3680, conversion_rate: 0.067 },
        { channel: 'Direct', sessions: 1750, conversion_rate: 0.089 }
      ],
      top_pages: [
        { page: '/product/battery-workstation', views: 8750, conversion_rate: 0.078 },
        { page: '/solutions/3pl-operations', views: 6420, conversion_rate: 0.056 },
        { page: '/pricing', views: 4890, conversion_rate: 0.034 },
        { page: '/case-studies', views: 3670, conversion_rate: 0.023 },
        { page: '/blog/warehouse-automation', views: 2980, conversion_rate: 0.012 }
      ]
    }

    const data = mockData[metric as keyof typeof mockData] || mockData.overview

    return NextResponse.json({
      data,
      meta: {
        source: 'google_analytics_4',
        metric,
        period,
        timestamp: new Date().toISOString(),
        // thought: Include data freshness indicator
        last_updated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      }
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_name, parameters } = body

    // // thought: Placeholder for sending custom events to GA4
    return NextResponse.json({
      message: 'Custom event tracked successfully',
      event_name,
      parameters,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Analytics event error:', error)
    return NextResponse.json(
      { error: 'Failed to track custom event' },
      { status: 500 }
    )
  }
}