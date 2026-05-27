import './globals.css'

export const metadata = {
  title: 'Samburu Wellness & Resilience',
  description: 'A community organisation in Samburu County, Kenya.',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
        <MobileMenu />
      </body>
    </html>
  )
}

function Navbar() {
  return (
    <>
      <nav className="navbar transparent" id="main-navbar">
        {/* LEFT: LOGO */}
        <a href="/" className="nav-logo">
          <img
            src="/icon.jpeg"
            alt="Samburu Wellness & Resilience"
            className="nav-logo-img"
            id="nav-logo-img"
          />
          <div className="nav-logo-fallback" id="nav-logo-fallback" style={{ display: 'none' }}>
            <div className="nav-logo-mark"><span>SW</span></div>
            <div className="nav-logo-text">
              Samburu Wellness
              <span>& Resilience</span>
            </div>
          </div>
        </a>

        {/* CENTER/RIGHT: LINKS */}
        <ul className="nav-links">
          <li><a href="/who-we-are" className="nav-link">Who We Are</a></li>
          <li><a href="/our-work" className="nav-link">Our Work</a></li>
          <li><a href="/gallery" className="nav-link">Gallery</a></li>
          <li><a href="/news" className="nav-link">News</a></li>
          <li><a href="/contact" className="nav-link">Contact</a></li>
          <li>
            <a href="/donate" className="btn-amber" style={{
              background: 'linear-gradient(135deg,#34C270,#1E9E52)',
              boxShadow: '0 4px 16px rgba(52,194,112,0.25)'
            }}>Donate</a>
          </li>
          <li><a href="/partner" className="btn-amber">Get Involved</a></li>
        </ul>

        <button className="hamburger" id="hamburger-btn" aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      <script dangerouslySetInnerHTML={{__html: `
        (function() {
          var navbar = document.getElementById('main-navbar');
          var img = document.getElementById('nav-logo-img');
          var fallback = document.getElementById('nav-logo-fallback');
          if (img) {
            img.onerror = function() {
              img.style.display = 'none';
              if (fallback) fallback.style.display = 'flex';
            };
          }
          function updateNavbar() {
            if (window.scrollY > 50) {
              navbar.classList.remove('transparent');
              navbar.classList.add('solid');
            } else {
              navbar.classList.remove('solid');
              navbar.classList.add('transparent');
            }
          }
          window.addEventListener('scroll', updateNavbar, { passive: true });
          updateNavbar();
          var hamburger = document.getElementById('hamburger-btn');
          var mobileMenu = document.getElementById('mobile-menu');
          if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', function() {
              mobileMenu.classList.add('open');
              document.body.style.overflow = 'hidden';
            });
          }
        })();
      `}} />
    </>
  )
}

function MobileMenu() {
  return (
    <div className="mobile-menu" id="mobile-menu">
      <button className="mobile-menu-close" id="mobile-menu-close">✕</button>
      <a href="/">Home</a>
      <a href="/who-we-are">Who We Are</a>
      <a href="/our-work">Our Work</a>
      <a href="/gallery">Gallery</a>
      <a href="/news">News</a>
      <a href="/contact">Contact</a>
      <a href="/join">Join Us</a>
      <a href="/donate" style={{ color: '#34C270', fontWeight: 700 }}>Donate →</a>
      <a href="/partner" style={{ color: 'var(--gold)' }}>Get Involved →</a>
      <script dangerouslySetInnerHTML={{__html: `
        var closeBtn = document.getElementById('mobile-menu-close');
        var menu = document.getElementById('mobile-menu');
        if (closeBtn) closeBtn.addEventListener('click', function() {
          menu.classList.remove('open'); document.body.style.overflow = '';
        });
        menu.querySelectorAll('a').forEach(function(a) {
          a.addEventListener('click', function() {
            menu.classList.remove('open'); document.body.style.overflow = '';
          });
        });
      `}} />
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
            <img src="/icon.jpeg" alt="Samburu Wellness & Resilience"
              style={{ height: '52px', width: 'auto', borderRadius: '8px' }} />
          </a>
          <p>Rooted in community. Driven by compassion. Building resilience across Samburu County, Kenya — one life, one family, one village at a time.</p>
        </div>
        <div>
          <h4>Navigate</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/who-we-are">Who We Are</a></li>
            <li><a href="/our-work">Our Work</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/news">News</a></li>
          </ul>
        </div>
        <div>
          <h4>Get Involved</h4>
          <ul className="footer-links">
            <li><a href="/partner">Partner With Us</a></li>
            <li><a href="/join">Join Our Team</a></li>
            <li><a href="/donate">Donate</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>📍 Samburu County, Kenya</p>
          <p>📞 <a href="tel:+254704579936">+254 708 588479</a></p>
          <p>✉️ <a href="mailto:info@samburuwellness.org">info@samburuwellness.org</a></p>
          <p>💬 <a href="https://wa.me/254704579936" target="_blank" rel="noopener noreferrer">WhatsApp Us</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Samburu Wellness & Resilience. All rights reserved.</p>
        <p>Built by <a href="mailto:lepatidan5@gmail.com">Daniel Lepati</a></p>
      </div>
    </footer>
  )
}

function WhatsAppButton() {
  return (
    <a href="https://wa.me/254708588479" target="_blank" rel="noopener noreferrer"
      className="whatsapp-btn" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}
