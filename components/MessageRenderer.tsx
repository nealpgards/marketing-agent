interface MessageRendererProps {
  content: string
  role: 'user' | 'assistant'
}

export default function MessageRenderer({ content, role }: MessageRendererProps) {
  // Simple markdown-like parsing for better readability
  const formatContent = (text: string) => {
    // Split by double newlines for paragraphs
    const paragraphs = text.split('\n\n')
    
    return paragraphs.map((paragraph, index) => {
      // Handle headers
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-900">
            {paragraph.replace('## ', '')}
          </h2>
        )
      }
      
      if (paragraph.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-gray-900">
            {paragraph.replace('# ', '')}
          </h1>
        )
      }
      
      // Handle lists
      if (paragraph.includes('\n- ') || paragraph.includes('\n• ')) {
        const items = paragraph.split('\n').filter(line => line.trim().startsWith('- ') || line.trim().startsWith('• '))
        if (items.length > 0) {
          return (
            <ul key={index} className="list-disc list-inside space-y-1 my-3 text-gray-700">
              {items.map((item, itemIndex) => (
                <li key={itemIndex} className="ml-2">
                  {item.replace(/^[•\-]\s*/, '')}
                </li>
              ))}
            </ul>
          )
        }
      }
      
      // Handle numbered lists
      if (/^\d+\.\s/.test(paragraph.trim()) || paragraph.includes('\n1. ')) {
        const items = paragraph.split('\n').filter(line => /^\s*\d+\.\s/.test(line))
        if (items.length > 0) {
          return (
            <ol key={index} className="list-decimal list-inside space-y-1 my-3 text-gray-700">
              {items.map((item, itemIndex) => (
                <li key={itemIndex} className="ml-2">
                  {item.replace(/^\s*\d+\.\s*/, '')}
                </li>
              ))}
            </ol>
          )
        }
      }
      
      // Handle code blocks
      if (paragraph.includes('```')) {
        const parts = paragraph.split('```')
        return (
          <div key={index} className="my-3">
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                return (
                  <pre key={partIndex} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-2">
                    <code className="text-sm text-gray-800">{part.trim()}</code>
                  </pre>
                )
              }
              return part && (
                <p key={partIndex} className="text-gray-700 leading-relaxed">
                  {formatInlineElements(part)}
                </p>
              )
            })}
          </div>
        )
      }
      
      // Handle tables
      if (paragraph.includes('|') && paragraph.includes('\n')) {
        const lines = paragraph.split('\n').filter(line => line.includes('|'))
        if (lines.length >= 2) {
          const headers = lines[0].split('|').map(h => h.trim()).filter(h => h)
          const rows = lines.slice(2).map(line => 
            line.split('|').map(cell => cell.trim()).filter(cell => cell)
          )
          
          return (
            <div key={index} className="my-4 overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((header, headerIndex) => (
                      <th key={headerIndex} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-sm text-gray-700 border-b">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      }
      
      // Regular paragraphs
      if (paragraph.trim()) {
        return (
          <p key={index} className="text-gray-700 leading-relaxed my-3">
            {formatInlineElements(paragraph)}
          </p>
        )
      }
      
      return null
    }).filter(Boolean)
  }
  
  const formatInlineElements = (text: string) => {
    // Handle bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    
    // Handle italic text
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Handle inline code
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }
  
  return (
    <div className={`${role === 'assistant' ? 'prose prose-sm max-w-none' : ''}`}>
      <div className="space-y-2">
        {formatContent(content)}
      </div>
    </div>
  )
}