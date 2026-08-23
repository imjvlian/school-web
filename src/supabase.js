import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const configured = Boolean(url && key && !url.includes('PROJECT_REF'))
export const supabase = configured ? createClient(url, key) : null
export const mediaUrl = (path) => path && supabase ? supabase.storage.from('cms-media').getPublicUrl(path).data.publicUrl : ''
