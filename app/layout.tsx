import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Samburu Wellness Resilience — Coming Soon',
  description: 'We are currently under maintenance. We will be back shortly.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
