import React from 'react';
import { Link } from 'react-router-dom';
import useOutages from '../hooks/useOutages.js';
export default function OutageAlert() {
 const { data: outages = [], loading } = useOutages();
 if (loading) return null;
 const now = new Date();
 const upcoming = outages.filter(item => new Date(`${item.date}T${item.start}:00`) >= now && new Date(`${item.date}T${item.start}:00`) <= new Date(now.getTime()+3*86400000)).sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start)).slice(0,3);
 if (!upcoming.length) return null;
 return <section className="alert-band"><div className="container alert-inner"><span className="alert-mark"><i className="fa-solid fa-bolt"/></span><div><b>Lucrări planificate în zilele următoare</b><p>{upcoming.map(x => `${x.district} · ${new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short' }).format(new Date(`${x.date}T00:00:00`))}, ${x.start}–${x.end} · ${x.locality}`).join('  |  ')}</p></div><Link to="/intreruperi" className="alert-link">Toate întreruperile <i className="fa-solid fa-arrow-right"/></Link></div></section>;
}
