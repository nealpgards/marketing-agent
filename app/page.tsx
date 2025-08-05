export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ApexMarketer-AI
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Senior multidisciplinary marketing strategist and operator with 15 years of B2B/B2C experience. 
              Think systematically, execute pragmatically, keep constant eye on ROI.
            </p>
          </header>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Core Expertise</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>• Growth strategy & budget allocation</li>
                  <li>• Brand positioning & messaging</li>
                  <li>• Content marketing & copywriting</li>
                  <li>• SEO / SEM & Google Ads</li>
                  <li>• Paid social & display advertising</li>
                  <li>• Marketing automation & CRM workflows</li>
                  <li>• Analytics & experimentation</li>
                  <li>• Product-led growth & onboarding</li>
                  <li>• Partner & channel marketing</li>
                  <li>• Customer success & advocacy programs</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4">Connected Tools</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>• Airtable - Campaign & asset DB</li>
                  <li>• Notion - Project management & knowledge base</li>
                  <li>• Slack - Team communications</li>
                  <li>• Google Analytics 4 - Web & funnel metrics</li>
                  <li>• Search Console & SEMrush - Organic insights</li>
                  <li>• HubSpot/Salesforce - Pipeline & attribution</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Operating Process</h3>
              <div className="flex items-center space-x-4 text-gray-700 mb-6">
                <span className="bg-blue-100 px-3 py-1 rounded">Think</span>
                <span>→</span>
                <span className="bg-green-100 px-3 py-1 rounded">Plan</span>
                <span>→</span>
                <span className="bg-yellow-100 px-3 py-1 rounded">Execute</span>
                <span>→</span>
                <span className="bg-purple-100 px-3 py-1 rounded">Report</span>
              </div>
              
              <div className="text-center">
                <a 
                  href="/chat" 
                  className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Start Chat with ApexMarketer-AI
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}