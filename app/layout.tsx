import './globals.css'

export const metadata = {
  title: 'Samburu Wellness Resilience — Coming Soon',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MaintenancePage />
      </body>
    </html>
  )
}
