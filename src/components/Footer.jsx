import { Link } from 'react-router-dom'
import { contact } from '../data/content'

export default function Footer() {
  return (
    <>
      <section id="footer" className="bg-white"><div className="container py-4"><footer><div className="row">
        <div className="col-12 col-md-3 mb-3"><h5 className="fw-bold mb-3">Navigasi</h5><div className="d-flex"><ul className="nav flex-column me-5"><li className="nav-item mb-2"><Link to="/berita" className="nav-link p-0 text-muted">Berita Sekolah</Link></li><li className="nav-item mb-2"><Link to="/foto" className="nav-link p-0 text-muted">Galeri Sekolah</Link></li><li className="nav-item mb-2"><Link to="/profil" className="nav-link p-0 text-muted">Profil Sekolah</Link></li><li className="nav-item mb-2"><a href={contact.youtube} className="nav-link p-0 text-muted" target="_blank" rel="noreferrer">Video Sekolah</a></li></ul><ul className="nav flex-column"><li className="nav-item mb-2"><Link to="/login" className="nav-link p-0 text-muted">Admin</Link></li></ul></div></div>
        <div className="col-12 col-md-3 mb-3"><h5 className="fw-bold mb-3">Ikuti Kami</h5><div className="d-flex mb-3"><a href={contact.instagram || '#'} target="_blank" rel="noreferrer" className="text-decoration-none text-dark"><i className="bi bi-instagram me-4 social-icon" /></a><a href={contact.facebook} target="_blank" rel="noreferrer" className="text-decoration-none text-dark"><i className="bi bi-facebook me-4 social-icon" /></a><a href={contact.youtube} target="_blank" rel="noreferrer" className="text-decoration-none text-dark"><i className="bi bi-youtube me-4 social-icon" /></a></div></div>
        <div className="col-12 col-md-3 mb-3"><h5 className="fw-bold mb-3">Kontak Kami</h5><ul className="nav flex-column"><li className="nav-item mb-2"><a href={`mailto:${contact.email}`} className="nav-link text-muted">{contact.email}</a></li><li className="nav-item mb-2"><a href={`tel:${contact.phone}`} className="nav-link text-muted">{contact.phone}</a></li></ul></div>
        <div className="col-12 col-md-3 mb-3"><h5 className="fw-bold mb-3">Alamat Pesantren</h5><p>{contact.address}</p><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.1329977673813!2d113.0707000865195!3d-8.087916650418379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd641132cb3e2d3%3A0xb9d7e46e3d6a77f0!2sPon%20Pes%20Nurul%20Huda%20Burno!5e0!3m2!1sen!2sid!4v1714636547143!5m2!1sen!2sid" width="300" height="150" className="map-frame" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Lokasi Pesantren" /></div>
      </div></footer></div></section>
      <section className="bg-light border-top"><div className="container py-4"><div className="d-flex justify-content-between flex-wrap gap-2"><div>Design by JV</div><div className="d-flex"><p className="me-4 mb-0">Syarat & Ketentuan</p><p className="mb-0 text-muted">Kebijakan Privasi</p></div></div></div></section>
    </>
  )
}
