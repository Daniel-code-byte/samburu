import ClientLayout from './client-layout'
import './globals.css'

export const metadata = {
  title: 'Samburu Wellness & Resilience',
  description: 'A community organisation in Samburu County, Kenya.',
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
