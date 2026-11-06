import React from 'react';
import { Link } from 'react-router-dom';
export default function NotFoundPage(){return <main className="not-found"><div className="container"><span>404</span><h1>Pagina nu a fost găsită</h1><p>Adresa accesată nu există sau a fost mutată.</p><Link to="/" className="button button-primary">Înapoi la pagina principală</Link></div></main>;}
