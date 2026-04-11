import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export type Photo = {
  id: string; title: string; description: string | null
  url: string; category: string; taken_at: string | null; created_at: string
}
export type Post = {
  id: string; title: string; slug: string; excerpt: string
  content: string; cover_url: string | null; category: string
  published_at: string; created_at: string
}
export type Program = {
  id: string; title: string; description: string; icon: string; order: number
}
export type Message = { name: string; email: string; subject: string; body: string }
export type JoinRequest = {
  name: string; email: string; phone: string | null; interest: string; message: string | null
}

export async function getPhotos(category?: string): Promise<Photo[]> {
  try {
    let q = supabase.from('photos').select('*').order('created_at', { ascending: false })
    if (category && category !== 'All') q = q.eq('category', category)
    const { data, error } = await q
    if (error) { console.error('getPhotos error:', error); return [] }
    return data ?? []
  } catch (e) { console.error('getPhotos catch:', e); return [] }
}

export async function getHeroPhotos(): Promise<Photo[]> {
  try {
    const { data, error } = await supabase
      .from('photos').select('*')
      .order('created_at', { ascending: false }).limit(8)
    if (error) { console.error('getHeroPhotos error:', error); return [] }
    return data ?? []
  } catch (e) { console.error('getHeroPhotos catch:', e); return [] }
}

export async function getCommunityPhotos(): Promise<Photo[]> {
  try {
    const { data: community } = await supabase
      .from('photos').select('*')
      .eq('category', 'community')
      .order('created_at', { ascending: false }).limit(6)
    if (community && community.length > 0) return community
    const { data: anyPhotos } = await supabase
      .from('photos').select('*')
      .order('created_at', { ascending: false }).limit(6)
    return anyPhotos ?? []
  } catch (e) { console.error('getCommunityPhotos catch:', e); return [] }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from('posts').select('*')
      .order('published_at', { ascending: false })
    if (error) { console.error('getPosts error:', error); return [] }
    return data ?? []
  } catch (e) { console.error('getPosts catch:', e); return [] }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { data } = await supabase
      .from('posts').select('*').eq('slug', slug).single()
    return data ?? null
  } catch { return null }
}

export async function getPrograms(): Promise<Program[]> {
  try {
    const { data } = await supabase
      .from('programs').select('*').order('order', { ascending: true })
    return data ?? []
  } catch { return [] }
}

export async function sendMessage(msg: Message): Promise<void> {
  const { error } = await supabase.from('messages').insert([msg])
  if (error) throw error
}

export async function submitJoinRequest(req: JoinRequest): Promise<void> {
  const { error } = await supabase.from('join_requests').insert([req])
  if (error) throw error
}

export async function adminGetMessages() {
  const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function adminGetJoinRequests() {
  const { data } = await supabase.from('join_requests').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function adminDeletePhoto(id: string) {
  const { error } = await supabase.from('photos').delete().eq('id', id)
  if (error) throw error
}

export async function adminDeletePost(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}

export async function adminInsertPhoto(photo: Omit<Photo, 'id' | 'created_at'>) {
  const { error } = await supabase.from('photos').insert([photo])
  if (error) throw error
}

export async function adminInsertPost(post: Omit<Post, 'id' | 'created_at'>) {
  const { error } = await supabase.from('posts').insert([post])
  if (error) throw error
}

export async function adminInsertProgram(program: Omit<Program, 'id'>) {
  const { error } = await supabase.from('programs').insert([program])
  if (error) throw error
}

export async function adminDeleteProgram(id: string) {
  const { error } = await supabase.from('programs').delete().eq('id', id)
  if (error) throw error
}
