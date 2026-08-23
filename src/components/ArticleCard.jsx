import { Link } from 'react-router-dom'
export default function ArticleCard({ article }) {
  return (
    <div className="card border-0 h-100">
      <img src={article.image} className="img-fluid mb-3 article-card-image" alt="" />
      <div className="konten-berita">
        <p className="mb-3 text-secondary">{article.date}</p>
        <h4 className="fw-bold mb-3">{article.title}</h4>
        <p className="text-secondary">#pesantrenmodern</p>
        <Link to={`/detail/${article.slug}`} className="text-decoration-none text-danger">Selengkapnya</Link>
      </div>
    </div>
  )
}
