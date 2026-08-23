import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { contact } from '../data/content'

export default function Navbar() {
  const location = useLocation(); const [scrolled,setScrolled]=useState(false)
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>100);onScroll();window.addEventListener('scroll',onScroll);return()=>window.removeEventListener('scroll',onScroll)},[])
  const solid=location.pathname!=='/'||scrolled
  const contactUrl=`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Ustad, Saya Ingin Beratanya Tentang Pesantren Nurul Huda')}`
  return <nav className={`navbar navbar-expand-lg py-3 fixed-top shadow ${solid?'bg-white scroll-nav-active':''}`}><div className="container"><Link className="navbar-brand" to="/"><img src="/icons/nurul-huda.png" height="55" width="55" alt="PonPes Nurul Huda" /></Link><button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon">☰</span></button><div className="collapse navbar-collapse" id="navbarSupportedContent"><ul className="navbar-nav me-auto mb-2 mb-lg-0"><li className="nav-item"><Link className="nav-link active" to="/">Home</Link></li><li className="nav-item"><Link className="nav-link active" to="/profil">Profil</Link></li><li className="nav-item"><Link className="nav-link active" to="/berita">Berita</Link></li><li className="nav-item"><Link className="nav-link active" to="/foto">Galeri</Link></li><li className="nav-item"><a className="nav-link active" href={contactUrl} target="_blank" rel="noreferrer">Kontak</a></li></ul><div className="d-flex"><a href={contactUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">Daftar</a></div></div></div></nav>
}
