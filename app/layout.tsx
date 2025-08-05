import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ApexMarketer-AI',
  description: 'Senior multidisciplinary marketing strategist and operator AI agent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}