import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getNews, getServices, getStats } from '../services/api.js';
import ServiceCard from '../components/ServiceCard.jsx';
import Highlighted from '../components/Highlighted.jsx';
import StatCard from '../components/StatCard.jsx';

export default function HomePage() {
  const [services, setServices] = useState([]), [news, setNews] = useState([]), [stats, setStats] = useState([]), [error, setError] = useState('');
  const [params] = useSearchParams();
  const query = (params.get('q') || '').trim().toLocaleLowerCase('ro');
  useEffect(() => { Promise.all([getServices(), getNews()]).then(([serviceData, newsData]) => { setServices(serviceData); setNews(newsData); }).catch(() => setError('Unele informații nu pot fi încărcate acum.')); }, []);
  useEffect(() => { getStats().then(setStats).catch(() => setStats([])); }, []);
  const filteredServices = useMemo(() => query ? services.filter(x => `${x.title} ${x.description}`.toLocaleLowerCase('ro').includes(query)) : services, [services, query]);
  const orderedNews = useMemo(() => [...news].sort((a, b) => b.date.localeCompare(a.date)), [news]);
  const filteredNews = useMemo(() => query ? orderedNews.filter(x => `${x.title} ${x.description}`.toLocaleLowerCase('ro').includes(query)) : orderedNews, [orderedNews, query]);
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { nodes.forEach(node => node.classList.add('visible')); return undefined; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.12});
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [query, services, news, stats]);
  return <>
    <section className="hero home-hero"><div className="hero-bg"/><div className="container hero-content"><div className="hero-copy"><h1 className="hero-slogan">ENERGIA REȚELEI INTELIGENTE</h1><p>Găsește rapid informațiile și serviciile de care ai nevoie.</p><div className="hero-actions"><Link to="/intreruperi" className="button button-primary">Vezi întreruperile programate <i className="fa-solid fa-arrow-right"/></Link><Link to="/contact" className="button button-ghost"><i className="fa-solid fa-phone"/> Contact de urgență</Link></div></div><div className="hero-note"><i className="fa-solid fa-location-dot"/> Municipiul Bălți și raioanele din nordul țării</div></div></section>
    <section className="stats-section" aria-label="Date despre serviciile RED-Nord"><div className="container"><div className="stats-heading reveal"><span className="eyebrow blue">RED-Nord pe scurt</span><h2>Servicii și suport, la îndemână</h2></div><div className="stats-grid">{stats.map(stat=><StatCard key={stat.id} stat={stat}/>)}</div></div></section>
    <section className="safety-notice"><div className="container safety-inner"><span className="safety-icon"><i className="fa-solid fa-shield-halved"/></span><div><b>Ai primit un apel despre schimbarea contorului?</b><p>Nu dicta date din buletin sau coduri de confirmare și nu trimite fotografii ale actelor unor persoane necunoscute.</p></div><Link to="/contact" className="text-link">Verifică numărul de contact <i className="fa-solid fa-arrow-right"/></Link></div></section>
    <section className="section service-section"><div className="container"><div className="section-heading heading-row"><div><span className="eyebrow blue">Pentru consumatori</span><h2>Ce dorești să faci?</h2><p>Alege serviciul sau informația de care ai nevoie.</p></div><Link to="/servicii" className="text-link">Toate serviciile <i className="fa-solid fa-arrow-right"/></Link></div>{query && <p className="search-status">Rezultate pentru „{query}”</p>}{error && <p className="inline-error">{error}</p>}{query && !filteredServices.length && !filteredNews.length && <p className="empty-state">Nu am găsit rezultate. Încearcă un alt cuvânt.</p>}<div className="service-grid">{filteredServices.map(service=><ServiceCard key={service.id} service={service} query={query}/>)}</div></div></section>
    <section className="section news-section"><div className="container"><div className="section-heading"><span className="eyebrow blue">Anunțuri și ghiduri</span><h2>Informații pentru comunitate</h2><p>Anunțuri și recomandări utile pentru siguranța ta.</p></div>{query && !filteredServices.length && !filteredNews.length && <p className="empty-state">Nu am găsit rezultate. Încearcă un alt cuvânt.</p>}<div className="news-grid">{filteredNews.map(item=><article className="news-card reveal" key={item.id}><span className="news-category">{item.category}</span><time>{new Date(item.date+'T12:00:00').toLocaleDateString('ro-RO',{day:'numeric',month:'long',year:'numeric'})}</time><h3><Highlighted text={item.title} query={query}/></h3><p><Highlighted text={item.description} query={query}/></p><details className="news-details"><summary>Vezi anunțul complet</summary>{item.image && <img className="news-image" src={item.image} alt="Ilustrație pentru regulile de siguranță electrică" loading="lazy"/>}{item.safetyRules ? <><p>Vacanța de toamnă le oferă celor mici mai mult timp pentru joacă și activități în aer liber. Reamintiți-le să respecte aceste reguli:</p><ul className="news-rules">{item.safetyRules.map(rule=><li key={rule}>{rule}</li>)}</ul><p className="news-warning"><strong>Atenție!</strong> {item.warning}</p><p>În cazul unui pericol, anunțați imediat un adult și folosiți pagina de <Link to="/contact">contact local</Link> pentru a găsi numărul grupului de deservire.</p><p className="news-closing"><strong>{item.closing}</strong></p></> : <p><Highlighted text={item.content} query={query}/></p>}</details></article>)}</div></div></section>
    <section className="contact-strip"><div className="container contact-strip-inner"><div><span className="eyebrow">Suntem disponibili 24/24</span><h2>Ai nevoie să ne contactezi?</h2><p>Găsești aici telefoanele și datele oficiilor RED-Nord.</p></div><Link className="button button-light" to="/contact">Vezi contactele <i className="fa-solid fa-arrow-right"/></Link></div></section>
  </>;
}
