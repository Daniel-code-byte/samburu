import { getPostBySlug } from '@/lib/supabase'

export const revalidate = 0

function fmt(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function PostPage({ params }) {
  const { slug } = params
  const post = await getPostBySlug(slug)

  if (!post) {
    return (
      <main>
        <div className="page-hero">
          <div className="page-hero-inner">
            <p className="section-eyebrow">404</p>
            <h1>Story <em>Not Found</em></h1>
            <p>This story may have been moved or removed.</p>
            <a href="/news" className="btn-amber" style={{display:'inline-block',marginTop:'24px'}}>← Back to News</a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      {(post.image_url || post.cover_image) ? (
        <div style={{position:'relative',height:'clamp(320px,50vh,580px)',overflow:'hidden'}}>
          <img src={post.image_url || post.cover_image} alt={post.title} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.5) saturate(0.85)'}} />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(4,16,31,0.3) 0%,rgba(4,16,31,0.85) 100%)'}} />
          <div style={{position:'absolute',bottom:'clamp(28px,5vh,60px)',left:'clamp(18px,7vw,120px)',right:'clamp(18px,7vw,120px)'}}>
            <div className="section-eyebrow" style={{marginBottom:'12px'}}>{post.category || 'Community'} · {fmt(post.created_at)}</div>
            <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(24px,4vw,54px)',color:'var(--text-bright)',lineHeight:1.12,maxWidth:'780px',fontWeight:500}}>{post.title}</h1>
          </div>
        </div>
      ) : (
        <div className="page-hero">
          <div className="page-hero-inner">
            <p className="section-eyebrow">{post.category || 'Community'} · {fmt(post.created_at)}</p>
            <h1>{post.title}</h1>
          </div>
        </div>
      )}

      <section className="section" style={{background:'var(--navy)'}}>
        <div style={{maxWidth:'740px',margin:'0 auto'}}>
          <a href="/news" style={{color:'var(--gold)',fontWeight:600,fontSize:'13px',display:'inline-flex',alignItems:'center',gap:'6px',marginBottom:'clamp(22px,3vw,38px)',letterSpacing:'0.04em'}}>← Back to News</a>

          {post.excerpt && (
            <p style={{fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',fontSize:'clamp(17px,2vw,22px)',color:'var(--text-bright)',borderLeft:'3px solid var(--gold)',paddingLeft:'22px',marginBottom:'clamp(22px,3vw,34px)',lineHeight:1.6,fontWeight:300}}>
              {post.excerpt}
            </p>
          )}

          <div style={{fontSize:'clamp(14px,1.4vw,17px)',lineHeight:1.85,color:'var(--text-mid)'}}>
            {(post.content || '').split('\n\n').map((para, i) => (
              para.trim() ? <p key={i} style={{marginBottom:'1.4em'}}>{para}</p> : null
            ))}
          </div>

          <div style={{marginTop:'clamp(36px,5vw,56px)',paddingTop:'clamp(22px,3vw,30px)',borderTop:'1px solid var(--navy-border)',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'14px'}}>
            <a href="/news" className="btn-outline">← More Stories</a>
            <a href="/donate" className="btn-amber">Support Our Work</a>
          </div>
        </div>
      </section>
    </main>
  )
}
