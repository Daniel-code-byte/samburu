import { getPosts } from '@/lib/supabase'

export const revalidate = 0

function fmt(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function NewsPage() {
  const posts = await getPosts() || []
  const [featured, ...rest] = posts

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="section-eyebrow">News & Stories</p>
          <h1>Stories from<br /><em>the Ground</em></h1>
          <p>Updates, impact reports, and human stories from across our programmes in Samburu County.</p>
        </div>
      </div>

      <section className="section" style={{background:'var(--navy)'}}>
        <div className="section-inner">
          {posts.length === 0 ? (
            <div style={{textAlign:'center',padding:'80px 0',color:'var(--text-dim)'}}>
              <p style={{fontSize:'48px',marginBottom:'16px'}}>📰</p>
              <p style={{fontSize:'clamp(18px,2.5vw,24px)',fontFamily:'Cormorant Garamond,serif',color:'var(--text-bright)',marginBottom:'10px',fontWeight:500}}>Stories coming soon</p>
              <p style={{fontSize:'14px'}}>News and updates published via the admin dashboard will appear here.</p>
            </div>
          ) : (
            <>
              {featured && (
                <a href={`/news/${featured.slug || featured.id}`} className="featured-post" style={{display:'grid',textDecoration:'none'}}>
                  {(featured.image_url || featured.cover_image) && (
                    <div className="featured-post-img">
                      <img src={featured.image_url || featured.cover_image} alt={featured.title} />
                    </div>
                  )}
                  <div className="featured-post-body">
                    <div className="news-tag" style={{marginBottom:'12px'}}>{featured.category || 'Community'} · Featured Story</div>
                    <h2>{featured.title}</h2>
                    <p>{featured.excerpt || (featured.content ? featured.content.slice(0, 200) + '...' : '')}</p>
                    <div style={{display:'flex',alignItems:'center',gap:'18px',flexWrap:'wrap'}}>
                      <span className="btn-amber">Read Story →</span>
                      <span style={{fontSize:'12px',color:'var(--text-dim)'}}>{fmt(featured.created_at)}</span>
                    </div>
                  </div>
                </a>
              )}

              {rest.length > 0 && (
                <>
                  <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(20px,2.5vw,28px)',color:'var(--text-bright)',marginBottom:'6px',marginTop:'clamp(40px,5vw,60px)',fontWeight:500}}>More <em style={{color:'var(--gold)'}}>Stories</em></h3>
                  <div className="news-grid">
                    {rest.map(post => (
                      <a key={post.id} href={`/news/${post.slug || post.id}`} className="news-card" style={{display:'block'}}>
                        {(post.image_url || post.cover_image) && (
                          <div className="news-card-img">
                            <img src={post.image_url || post.cover_image} alt={post.title} />
                          </div>
                        )}
                        <div className="news-card-body">
                          <div className="news-tag">{post.category || 'Community'}</div>
                          <h3>{post.title}</h3>
                          <p>{post.excerpt || (post.content ? post.content.slice(0, 110) + '...' : '')}</p>
                          <div className="news-card-date">{fmt(post.created_at)}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
