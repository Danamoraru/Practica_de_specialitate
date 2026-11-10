import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getNews } from '../services/api.js';
import NotFoundPage from './NotFoundPage.jsx';

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    getNews().then(items => { if (active) setItem(items.find(newsItem => String(newsItem.id) === id) || null); }).catch(() => { if (active) setItem(null); }).finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, [id]);

  if (!loaded) return <main className="page-main"><div className="container"><p className="empty-state">Se încarcă anunțul…</p></div></main>;
  if (!item) return <NotFoundPage />;

  return <main className="page-main"><article className="container announcement-detail">
    <nav className="breadcrumbs" aria-label="Navigare"><Link to="/">Acasă</Link><i className="fa-solid fa-angle-right"/><Link to="/anunturi">Anunțuri</Link><i className="fa-solid fa-angle-right"/><span>{item.category}</span></nav>
    <Link className="announcement-back" to="/anunturi"><i className="fa-solid fa-arrow-left"/> Înapoi la anunțuri</Link>
    <header className="announcement-detail-heading"><span className="news-category">{item.category}</span><time>{formatDate(item.date)}</time><h1>{item.title}</h1><p>{item.description}</p></header>
    {item.image && <figure className="announcement-detail-figure"><img src={item.image} alt={item.title}/></figure>}
    <div className="announcement-detail-copy">
      {item.safetyRules ? <><p>Vacanța de toamnă le oferă celor mici mai mult timp pentru joacă și activități în aer liber, inclusiv în zilele ploioase. Reamintiți-le să respecte următoarele reguli:</p><ul className="news-rules">{item.safetyRules.map(rule => <li key={rule}>{rule}</li>)}</ul><p className="news-warning"><strong>Atenție!</strong> {item.warning}</p><p>Dacă observați un pericol, anunțați imediat un adult. Pentru raportarea unui deranjament, accesați pagina locală de <Link to="/contact">contact și telefoane utile</Link>.</p><p className="news-closing"><strong>{item.closing}</strong></p></> : <p>{item.content}</p>}
    </div>
    <Link className="announcement-back announcement-back-bottom" to="/anunturi"><i className="fa-solid fa-arrow-left"/> Înapoi la toate anunțurile</Link>
  </article></main>;
}
