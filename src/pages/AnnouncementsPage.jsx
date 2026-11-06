import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../services/api.js';

export default function AnnouncementsPage() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { getNews().then(setNews).catch(() => setError('Anunțurile nu pot fi încărcate acum.')); }, []);

  return <main className="page-main"><div className="container announcements-page">
    <nav className="breadcrumbs" aria-label="Navigare"><Link to="/">Acasă</Link><i className="fa-solid fa-angle-right"/><span>Anunțuri</span></nav>
    <header className="page-heading"><span className="eyebrow blue">Noutăți și informări</span><h1>Anunțuri</h1><p>Informări utile pentru consumatori și comunitățile din nordul țării.</p></header>
    {error && <p className="inline-error">{error}</p>}
    <div className="announcements-list">{[...news].sort((a, b) => b.date.localeCompare(a.date)).map(item => <article className="announcement-card" key={item.id}>
      <div className="announcement-meta"><span className="news-category">{item.category}</span><time>{new Date(item.date + 'T12:00:00').toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}</time></div>
      <h2>{item.title}</h2><p className="announcement-intro">{item.description}</p>
      {item.image && <img className="announcement-image" src={item.image} alt={item.title} loading="lazy"/>}
      <details className="announcement-body"><summary>Citește anunțul</summary>
      {item.safetyRules ? <><p>Vacanța de toamnă le oferă celor mici mai mult timp pentru joacă și activități în aer liber, inclusiv în zilele ploioase. Reamintiți-le să respecte următoarele reguli:</p>
        <ul className="news-rules">{item.safetyRules.map(rule => <li key={rule}>{rule}</li>)}</ul>
        <p className="news-warning"><strong>Atenție!</strong> {item.warning}</p>
        <p>Dacă observați un pericol, anunțați imediat un adult. Pentru raportarea unui deranjament, accesați pagina locală de <Link to="/contact">contact și telefoane utile</Link>.</p>
        <p className="news-closing"><strong>{item.closing}</strong></p>
      </> : <p>{item.content}</p>}
      </details>
    </article>)}</div>
  </div></main>;
}
