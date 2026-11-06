import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() { return <footer className="footer"><div className="container footer-inner"><div><b>RED-NORD</b><p>Rețele Electrice de Distribuție Nord</p></div><div className="footer-links"><Link to="/despre">Despre RED-Nord</Link><Link to="/servicii">Servicii</Link><Link to="/contact">Contacte</Link><Link to="/aviz-racordare">Aviz de racordare</Link></div><small>© {new Date().getFullYear()} S.A. „RED-Nord”</small></div></footer>; }
