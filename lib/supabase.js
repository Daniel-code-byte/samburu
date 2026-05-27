import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ovykholwoiqdaelgkvez.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92eWtob2x3b2lxZGFlbGdrdmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0ODg3NTMsImV4cCI6MjA5MTA2NDc1M30.xwY9Rg7xqKalU-a4wvWSTikT8Xmm3ME7n-5K5KQpNRM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getPhotos(category = null) {
  let query = supabase.from('photos').select('*').order('created_at', { ascending: false })
  if (category) query = query.eq('category', category)
  const { data, error } = await query
  if (error) { console.error('Error fetching photos:', error); return [] }
  return data || []
}

export async function getPosts(limit = null) {
  let query = supabase.from('posts').select('*').eq('published', true).order('created_at', { ascending: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) { console.error('Error fetching posts:', error); return [] }
  return data || []
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single()
  if (error) { console.error('Error fetching post:', error); return null }
  return data
}

export async function getAllPosts() {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
  if (error) { console.error('Error fetching all posts:', error); return [] }
  return data || []
}

export async function getAllMessages() {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  if (error) { console.error('Error fetching messages:', error); return [] }
  return data || []
}

export async function getAllJoinRequests() {
  const { data, error } = await supabase.from('join_requests').select('*').order('created_at', { ascending: false })
  if (error) { console.error('Error fetching join requests:', error); return [] }
  return data || []
}

export async function getAllPartnerships() {
  const { data, error } = await supabase.from('partnerships').select('*').order('created_at', { ascending: false })
  if (error) { console.error('Error fetching partnerships:', error); return [] }
  return data || []
}

export async function submitMessage(data) {
  const { error } = await supabase.from('messages').insert([data])
  return { error }
}

export async function submitJoinRequest(data) {
  const { error } = await supabase.from('join_requests').insert([data])
  return { error }
}

export async function submitPartnership(data) {
  const { error } = await supabase.from('partnerships').insert([data])
  return { error }
}

export async function updatePartnershipStatus(id, status) {
  const { error } = await supabase.from('partnerships').update({ status }).eq('id', id)
  return { error }
}

export async function uploadPhoto(file, bucket = 'photos') {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)
  if (error) return { url: null, error }
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return { url: urlData.publicUrl, error: null }
}

export async function savePhoto(photoData) {
  const { error } = await supabase.from('photos').insert([photoData])
  return { error }
}

export async function savePost(postData) {
  const { error } = await supabase.from('posts').insert([postData])
  return { error }
}

export async function updatePost(id, postData) {
  const { error } = await supabase.from('posts').update(postData).eq('id', id)
  return { error }
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  return { error }
}

export async function deletePhoto(id) {
  const { error } = await supabase.from('photos').delete().eq('id', id)
  return { error }
}
