import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ColdReach - Automated Cold Email Outreach',
  description: 'Automated cold email outreach for F-1 students and tech internship seekers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
