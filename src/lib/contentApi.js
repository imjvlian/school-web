import { getPublicMediaUrl, supabase } from './supabase'
function requireSupabase(){if(!supabase)throw new Error('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.');return supabase}
function mapBlog(row){return {...row,title:row.judul,image:getPublicMediaUrl(row.image_path),description:row.desc,date:new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(row.created_at))}}
function mapPhoto(row){return {...row,title:row.judul,image:getPublicMediaUrl(row.image_path)}}
function mapVideo(row){return {...row,title:row.judul,youtubeCode:row.youtube_code}}
export async function getPublishedBlogs({limit}={}){const client=requireSupabase();let query=client.from('blogs').select('*').eq('published',true).order('created_at',{ascending:false});if(limit)query=query.limit(limit);const {data,error}=await query;if(error)throw error;return(data??[]).map(mapBlog)}
export async function getPublishedBlogBySlug(slug){const client=requireSupabase();const {data,error}=await client.from('blogs').select('*').eq('slug',slug).eq('published',true).maybeSingle();if(error)throw error;return data?mapBlog(data):null}
export async function getPublishedPhotos({limit}={}){const client=requireSupabase();let query=client.from('photos').select('*').eq('published',true).order('created_at',{ascending:false});if(limit)query=query.limit(limit);const {data,error}=await query;if(error)throw error;return(data??[]).map(mapPhoto)}
export async function getPublishedVideos({limit}={}){const client=requireSupabase();let query=client.from('videos').select('*').eq('published',true).order('created_at',{ascending:false});if(limit)query=query.limit(limit);const {data,error}=await query;if(error)throw error;return(data??[]).map(mapVideo)}
