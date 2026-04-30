import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Samburu Wellness Resilience',
  description: 'Promoting mental wellbeing in Samburu County through awareness, community engagement, stigma reduction and linkage to appropriate mental health support services.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <style>{`
          /* ── Navbar visibility fix ── */
          /*
            The Navbar component likely uses a transparent/teal background
            with white text, which disappears on some backgrounds on mobile.
            We override it here to always be visible.
          */
          nav,
          header nav,
          .navbar,
          #navbar {
            /* Force a solid background so links are never invisible */
            background: var(--teal-deep, #1a4a4a) !important;
            box-shadow: 0 2px 12px rgba(0,0,0,0.18);
          }

          /* Nav links: always white and readable */
          nav a,
          .navbar a,
          header nav a {
            color: #fff !important;
            opacity: 0.85;
            transition: opacity 0.2s;
          }
          nav a:hover,
          .navbar a:hover,
          header nav a:hover {
            opacity: 1;
          }

          /* Active / current link */
          nav a[aria-current="page"],
          .navbar a.active {
            opacity: 1;
            border-bottom: 2px solid var(--rust, #c05333);
          }

          /* Hamburger icon on mobile — always white */
          nav button svg,
          .navbar button svg,
          nav .menu-toggle svg {
            stroke: #fff !important;
            color: #fff !important;
          }

          /* Mobile menu drawer — solid so it's never transparent */
          nav .mobile-menu,
          .navbar .mobile-menu,
          nav [role="menu"],
          nav .nav-mobile {
            background: var(--teal-deep, #1a4a4a) !important;
          }

          /* ── Global mobile-safe box model ── */
          *, *::before, *::after {
            box-sizing: border-box;
          }

          /* Prevent horizontal overflow on all screens */
          html, body {
            overflow-x: hidden;
            max-width: 100%;
          }

          /* Images never overflow their containers */
          img {
            max-width: 100%;
            height: auto;
          }

          /* Section padding shrinks on small screens */
          .section-pad {
            padding: clamp(2.5rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem);
          }
        `}</style>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
