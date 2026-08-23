import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { configured, mediaUrl, supabase } from './supabase'

const contact = {
  whatsapp: '62816401942',
  email: 'ypspp.nurulhuda@gmail.com',
  phone: '0856-3655-915',
  facebook: 'https://www.facebook.com/pondoknurulhuda',
  youtube: 'https://www.youtube.com/@nurulhudaburno',
  address: 'Jalan Ranupani RT.006/RW.001, Krajan Satu, Burno, Kec. Senduro, Kabupaten Lumajang, Jawa Timur 67361',
}
const programs = ['Madin Awaliyah', 'TPQ', 'Madin Wustho', 'PonPes Salafiyah']
const placeholder = (label='NH') => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420"><rect width="640" height="420" fill="#e7f2ec"/><circle cx="320" cy="185" r="86" fill="#176b45" opacity=".12"/><text x="320" y="205" text-anchor="middle" font-family="Arial" font-size="42" font-weight="700" fill="#176b45">${label}</text></svg>`)}`

async function list(table, {published=true, limit=null}={}) {
  if (!supabase) return []
  let q = supabase.from(table).select('*').order('created_at', {ascending:false})
  if (published) q = q.eq('published', true)
  if (limit) q = q.limit(limit)
  const {data,error}=await q
  if(error) throw error
  return data ?? []
}
async function saveRow(table, payload, id) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi')
  const query = id ? supabase.from(table).update(payload).eq('id', id) : supabase.from(table).insert(payload)
  const {error}=await query
  if(error) throw error
}
async function removeRow(table,id){ const {error}=await supabase.from(table).delete().eq('id',id); if(error) throw error }
async function uploadImage(file,folder){
  const ext=(file.name.split('.').pop()||'jpg').toLowerCase(); const path=`${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`
  const {error}=await supabase.storage.from('cms-media').upload(path,file,{upsert:false}); if(error) throw error; return path
}
const slugify=(value)=>value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-')

const AuthContext=createContext(null)
function AuthProvider({children}){
  const [user,setUser]=useState(null); const [loading,setLoading]=useState(true); const [admin,setAdmin]=useState(false)
  useEffect(()=>{
    if(!supabase){setLoading(false);return}
    supabase.auth.getSession().then(({data})=>setUser(data.session?.user??null)).finally(()=>setLoading(false))
    const {data}=supabase.auth.onAuthStateChange((_e,session)=>setUser(session?.user??null)); return()=>data.subscription.unsubscribe()
  },[])
  useEffect(()=>{
    if(!user||!supabase){setAdmin(false);return}
    supabase.from('admin_profiles').select('user_id').eq('user_id',user.id).maybeSingle().then(({data})=>setAdmin(Boolean(data)))
  },[user])
  const value=useMemo(()=>({user,admin,loading,login:async(email,password)=>{const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error},logout:()=>supabase?.auth.signOut()}),[user,admin,loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
const useAuth=()=>useContext(AuthContext)

function Brand(){return <Link className="brand" to="/"><span className="brand-mark">NH</span><span><b>PonPes Nurul Huda</b><small>Burno · Senduro · Lumajang</small></span></Link>}
function PublicLayout(){return <><header className="site-header"><div className="container nav-wrap"><Brand/><nav><NavLink to="/">Home</NavLink><NavLink to="/profil">Profil</NavLink><NavLink to="/berita">Berita</NavLink><NavLink to="/foto">Foto</NavLink><NavLink to="/login">Admin</NavLink></nav></div></header><Outlet/><Footer/></>}
function Footer(){return <footer><div className="container footer-grid"><div><Brand/><p>Menggapai Ridlo Ilahi Robby dengan Ta&apos;lim wa Ta&apos;allum.</p></div><div><h4>Kontak</h4><p>{contact.address}</p><p>{contact.phone}<br/>{contact.email}</p></div><div><h4>Media</h4><a href={contact.facebook}>Facebook</a><a href={contact.youtube}>YouTube</a></div></div><div className="copyright">© 2026 Pondok Pesantren Nurul Huda</div></footer>}

function Home(){
  const [blogs,setBlogs]=useState([]),[photos,setPhotos]=useState([]),[videos,setVideos]=useState([])
  useEffect(()=>{if(!supabase)return;Promise.all([list('blogs',{limit:3}),list('photos',{limit:4}),list('videos',{limit:3})]).then(([b,p,v])=>{setBlogs(b);setPhotos(p);setVideos(v)}).catch(console.error)},[])
  const wa=`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Ustad, Saya Ingin Belajar Di Pesantren Nurul Huda')}`
  return <main><section className="hero"><div className="container hero-inner"><p className="eyebrow">PONDOK PESANTREN NURUL HUDA</p><h1>Selamat Datang<br/>Di PonPes Nurul Huda</h1><p>Menggapai Ridlo Ilahi Robby dengan Ta&apos;lim wa Ta&apos;allum</p><div className="actions"><a className="btn primary" href={wa}>Daftar Santri</a><Link className="btn ghost" to="/profil">Lihat Profil</Link></div></div></section>
  <section className="section program-section"><div className="container"><div className="program-grid">{programs.map((p,i)=><div className="program-card" key={p}><span>{String(i+1).padStart(2,'0')}</span><h3>{p}</h3></div>)}</div></div></section>
  <section className="section"><div className="container"><SectionTitle overline="Informasi" title="Berita Kegiatan PonPes"/><div className="cards">{blogs.length?blogs.map(b=><ArticleCard key={b.id} item={b}/>):<Empty text="Belum ada artikel yang dipublikasikan."/>}</div><div className="center"><Link className="btn outline" to="/berita">Berita Lainnya</Link></div></div></section>
  <section className="join"><div className="container split"><div><p className="eyebrow">DAFTAR SANTRI</p><h2>Gabung Bersama Kami, Wujudkan Generasi Rabbani</h2><p>Pendidikan pesantren memadukan pembelajaran agama, pembentukan akhlak, kemandirian, serta pengetahuan umum untuk membentuk generasi yang berilmu dan beradab.</p><a className="btn primary" href={wa}>Hubungi Kami</a></div><div className="big-mark">NH</div></div></section>
  <section className="section video-section"><div className="container"><SectionTitle overline="Media" title="Video Kegiatan PonPes"/><div className="video-grid">{(videos.length?videos:[{id:'f',judul:'Video Kegiatan',youtube_code:'RE60uNdUFps'}]).map(v=><iframe key={v.id} src={`https://www.youtube.com/embed/${v.youtube_code}`} title={v.judul} allowFullScreen/>)}</div></div></section>
  <section className="section gallery-dark"><div className="container"><SectionTitle overline="Dokumentasi" title="Foto Kegiatan" light/><div className="gallery-grid">{(photos.length?photos:Array.from({length:4},(_,i)=>({id:i,judul:`Foto Kegiatan ${i+1}`}))).map((p,i)=><img key={p.id} src={p.image_path?mediaUrl(p.image_path):placeholder(`NH ${i+1}`)} alt={p.judul}/>)}</div><div className="center"><Link className="btn light" to="/foto">Foto Lainnya</Link></div></div></section></main>
}
function SectionTitle({overline,title,light=false}){return <div className={`section-title ${light?'light':''}`}><p>{overline}</p><h2>{title}</h2></div>}
function Empty({text}){return <div className="empty">{text}</div>}
function ArticleCard({item}){return <article className="article-card"><img src={item.image_path?mediaUrl(item.image_path):placeholder('BERITA')} alt=""/><div><small>{new Date(item.created_at).toLocaleDateString('id-ID')}</small><h3>{item.judul}</h3><Link to={`/detail/${item.slug}`}>Baca Selengkapnya →</Link></div></article>}

function News(){const [items,setItems]=useState([]);useEffect(()=>{list('blogs').then(setItems).catch(console.error)},[]);return <Page title="Berita"><div className="cards">{items.length?items.map(x=><ArticleCard key={x.id} item={x}/>):<Empty text="Belum ada berita."/>}</div></Page>}
function NewsDetail(){const {slug}=useParams();const [item,setItem]=useState(undefined);useEffect(()=>{if(!supabase){setItem(null);return}supabase.from('blogs').select('*').eq('slug',slug).eq('published',true).maybeSingle().then(({data})=>setItem(data))},[slug]);if(item===undefined)return <Page title="Memuat..."/>;if(!item)return <Page title="Artikel tidak ditemukan"><Empty text="Artikel tidak tersedia."/></Page>;return <Page title={item.judul}><article className="prose">{item.image_path&&<img src={mediaUrl(item.image_path)} alt=""/>}<div dangerouslySetInnerHTML={{__html:item.desc}}/></article></Page>}
function Gallery(){const [items,setItems]=useState([]);useEffect(()=>{list('photos').then(setItems).catch(console.error)},[]);return <Page title="Foto Kegiatan"><div className="gallery-grid public-gallery">{(items.length?items:Array.from({length:6},(_,i)=>({id:i,judul:`Foto Kegiatan ${i+1}`}))).map((p,i)=><figure key={p.id}><img src={p.image_path?mediaUrl(p.image_path):placeholder(`NH ${i+1}`)} alt={p.judul}/><figcaption>{p.judul}</figcaption></figure>)}</div></Page>}
function Profile(){return <Page title="Profil Pesantren"><article className="prose"><p>Pondok Pesantren Nurul Huda berlokasi di Burno, Kecamatan Senduro, Kabupaten Lumajang. Pesantren berfokus pada pendidikan agama, pembentukan akhlak, pembiasaan ibadah, dan pengembangan kemampuan santri.</p><h2>Visi</h2><blockquote>Unggul dalam ilmu, terampil dalam amal, dan mulia dalam akhlak.</blockquote><h2>Misi</h2><ol><li>Membina peserta didik berdasarkan keimanan dan ketakwaan.</li><li>Mengamalkan Al-Qur&apos;an dan Sunnah.</li><li>Membudayakan akhlak, kesopanan, kepedulian, dan kemandirian.</li><li>Mengembangkan kecakapan hidup, bahasa, teknologi, dan komunikasi.</li><li>Mempersiapkan generasi yang siap mengabdi kepada masyarakat.</li></ol></article></Page>}
function Page({title,children}){return <main className="page"><div className="container"><p className="breadcrumb"><Link to="/">Home</Link> / {title}</p><h1>{title}</h1>{children}</div></main>}

function Login(){const {user,admin,login}=useAuth();const nav=useNavigate();const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);useEffect(()=>{if(user&&admin)nav('/admin')},[user,admin,nav]);async function submit(e){e.preventDefault();setBusy(true);setError('');try{await login(email,password);nav('/admin')}catch(err){setError(err.message)}finally{setBusy(false)}}return <main className="login-page"><form className="login-card" onSubmit={submit}><div className="brand-mark large">NH</div><h1>Admin Login</h1>{!configured&&<div className="notice">Isi environment Supabase terlebih dahulu.</div>}{error&&<div className="error">{error}</div>}<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="btn primary" disabled={busy||!configured}>{busy?'Memproses...':'Masuk'}</button><Link to="/">← Kembali ke website</Link></form></main>}
function Guard(){const {user,admin,loading}=useAuth();if(loading)return <div className="loading">Memuat...</div>;if(!user)return <Navigate to="/login" replace/>;if(!admin)return <main className="login-page"><div className="login-card"><h2>Akses ditolak</h2><p>Akun ini belum terdaftar di admin_profiles.</p></div></main>;return <Outlet/>}
function AdminLayout(){const {user,logout}=useAuth();const nav=useNavigate();return <div className="admin-shell"><aside><Brand/><nav><NavLink end to="/admin">Dashboard</NavLink><NavLink to="/admin/artikel">Artikel</NavLink><NavLink to="/admin/foto">Foto</NavLink><NavLink to="/admin/video">Video</NavLink><Link to="/">Website</Link></nav><button onClick={async()=>{await logout();nav('/login')}}>Keluar</button></aside><main className="admin-main"><div className="admin-top"><div><small>CMS / NURUL HUDA</small><b>{user?.email}</b></div></div><Outlet/></main></div>}
function AdminDashboard(){const [counts,setCounts]=useState({blogs:0,photos:0,videos:0});useEffect(()=>{if(!supabase)return;Promise.all(['blogs','photos','videos'].map(t=>supabase.from(t).select('*',{count:'exact',head:true}))).then(([a,b,c])=>setCounts({blogs:a.count||0,photos:b.count||0,videos:c.count||0}))},[]);return <AdminPage title="Dashboard"><div className="stats"><Stat n={counts.blogs} label="Artikel"/><Stat n={counts.photos} label="Foto"/><Stat n={counts.videos} label="Video"/></div></AdminPage>}
const Stat=({n,label})=><div className="stat"><strong>{n}</strong><span>{label}</span></div>
function AdminPage({title,action,children}){return <section><div className="admin-heading"><div><small>CONTENT MANAGEMENT</small><h1>{title}</h1></div>{action}</div>{children}</section>}

function AdminArticles(){const empty={judul:'',slug:'',desc:'',published:true,image_path:null};const [items,setItems]=useState([]),[form,setForm]=useState(empty),[id,setId]=useState(null),[file,setFile]=useState(null),[busy,setBusy]=useState(false);const load=()=>list('blogs',{published:false}).then(setItems);useEffect(()=>{load()},[]);async function submit(e){e.preventDefault();setBusy(true);try{let image_path=form.image_path;if(file)image_path=await uploadImage(file,'articles');await saveRow('blogs',{...form,slug:form.slug||slugify(form.judul),image_path},id);setForm(empty);setId(null);setFile(null);await load()}finally{setBusy(false)}}return <AdminPage title="Artikel"><form className="cms-form" onSubmit={submit}><input placeholder="Judul" value={form.judul} onChange={e=>setForm({...form,judul:e.target.value})} required/><input placeholder="Slug (opsional)" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})}/><textarea rows="8" placeholder="Isi artikel (HTML diperbolehkan)" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} required/><input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)}/><label className="check"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Published</label><div><button className="btn primary" disabled={busy}>{id?'Update':'Simpan'}</button>{id&&<button type="button" className="btn outline" onClick={()=>{setId(null);setForm(empty)}}>Batal</button>}</div></form><DataTable items={items} columns={['judul','slug','published']} onEdit={x=>{setId(x.id);setForm({judul:x.judul,slug:x.slug,desc:x.desc,published:x.published,image_path:x.image_path})}} onDelete={async x=>{if(confirm('Hapus artikel?')){await removeRow('blogs',x.id);load()}}}/></AdminPage>}
function AdminPhotos(){const [items,setItems]=useState([]),[judul,setJudul]=useState(''),[file,setFile]=useState(null),[busy,setBusy]=useState(false);const load=()=>list('photos',{published:false}).then(setItems);useEffect(()=>{load()},[]);async function submit(e){e.preventDefault();if(!file)return;setBusy(true);try{const image_path=await uploadImage(file,'photos');await saveRow('photos',{judul,image_path,published:true});setJudul('');setFile(null);await load()}finally{setBusy(false)}}return <AdminPage title="Foto"><form className="cms-form compact" onSubmit={submit}><input placeholder="Judul foto" value={judul} onChange={e=>setJudul(e.target.value)} required/><input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} required/><button className="btn primary" disabled={busy}>Upload</button></form><div className="admin-gallery">{items.map(x=><div key={x.id}><img src={mediaUrl(x.image_path)} alt=""/><b>{x.judul}</b><button onClick={async()=>{if(confirm('Hapus foto?')){await removeRow('photos',x.id);load()}}}>Hapus</button></div>)}</div></AdminPage>}
function AdminVideos(){const empty={judul:'',youtube_code:'',published:true};const [items,setItems]=useState([]),[form,setForm]=useState(empty),[id,setId]=useState(null);const load=()=>list('videos',{published:false}).then(setItems);useEffect(()=>{load()},[]);async function submit(e){e.preventDefault();await saveRow('videos',form,id);setForm(empty);setId(null);load()}return <AdminPage title="Video"><form className="cms-form compact" onSubmit={submit}><input placeholder="Judul" value={form.judul} onChange={e=>setForm({...form,judul:e.target.value})} required/><input placeholder="YouTube video ID" value={form.youtube_code} onChange={e=>setForm({...form,youtube_code:e.target.value})} required/><label className="check"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Published</label><button className="btn primary">{id?'Update':'Simpan'}</button></form><DataTable items={items} columns={['judul','youtube_code','published']} onEdit={x=>{setId(x.id);setForm({judul:x.judul,youtube_code:x.youtube_code,published:x.published})}} onDelete={async x=>{if(confirm('Hapus video?')){await removeRow('videos',x.id);load()}}}/></AdminPage>}
function DataTable({items,columns,onEdit,onDelete}){return <div className="table-wrap"><table><thead><tr>{columns.map(c=><th key={c}>{c}</th>)}<th>Aksi</th></tr></thead><tbody>{items.map(x=><tr key={x.id}>{columns.map(c=><td key={c}>{typeof x[c]==='boolean'?(x[c]?'Ya':'Tidak'):x[c]}</td>)}<td><button onClick={()=>onEdit(x)}>Edit</button> <button className="danger" onClick={()=>onDelete(x)}>Hapus</button></td></tr>)}</tbody></table>{!items.length&&<Empty text="Belum ada data."/>}</div>}

export default function App(){return <AuthProvider><Routes><Route element={<PublicLayout/>}><Route index element={<Home/>}/><Route path="profil" element={<Profile/>}/><Route path="berita" element={<News/>}/><Route path="detail/:slug" element={<NewsDetail/>}/><Route path="foto" element={<Gallery/>}/><Route path="login" element={<Login/>}/></Route><Route element={<Guard/>}><Route path="admin" element={<AdminLayout/>}><Route index element={<AdminDashboard/>}/><Route path="artikel" element={<AdminArticles/>}/><Route path="foto" element={<AdminPhotos/>}/><Route path="video" element={<AdminVideos/>}/></Route></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes></AuthProvider>}
