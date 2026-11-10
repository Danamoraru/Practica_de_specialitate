import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../services/api.js';

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AnnouncementsPage() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { getNews().then(setNews).catch(() => setError('Anunțurile nu pot fi încărcate acum.')); }, []);

  return <main className="page-main"><div className="container announcements-page">
    <nav className="breadcrumbs" aria-label="Navigare"><Link to="/">Acasă</Link><i className="fa-solid fa-angle-right"/><span>Anunțuri</span></nav>
    <header className="page-heading"><span className="eyebrow blue">Noutăți și informări</span><h1>Anunțuri</h1><p>Informări utile pentru consumatori și comunitățile din nordul țării.</p></header>
    {error && <p className="inline-error">{error}</p>}
    <div className="announcements-list">{[...news].sort((a, b) => b.date.localeCompare(a.date)).map(item => <Link className="announcement-card" to={`/anunturi/${item.id}`} key={item.id} aria-label={`Deschide anunțul: ${item.title}`}>
      {item.image && <div className="announcement-image-frame"><img className="announcement-image" src={item.image} alt="" loading="lazy"/></div>}
      <div className="announcement-meta"><span className="news-category">{item.category}</span><time>{formatDate(item.date)}</time></div>
      <h2>{item.title}</h2><p className="announcement-intro">{item.description}</p>
      <span className="announcement-open">Citește anunțul <i className="fa-solid fa-arrow-right"/></span>
    </Link>)}</div>
    {!news.length && !error && <p className="empty-state">Se încarcă anunțurile…</p>}
  </div></main>;
}
