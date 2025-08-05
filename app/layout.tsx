import type { Metadata } from 'next'
import './globals.css'
import { GeistSans } from 'geist/font/sans'

export const metadata: Metadata = {
  title: 'nealy.ai',
  description: 'Neal\'s AI marketing assistant - Your personal marketing strategist and operator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}