import ClientLayout from './client-layout'
import './globals.css'

export const metadata = {
  title: 'Samburu Wellness & Resilience',
  description: 'A community organisation in Samburu County, Kenya.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
