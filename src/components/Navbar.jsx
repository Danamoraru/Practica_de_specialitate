import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const shortcuts = [
  ['/intreruperi', 'Întreruperi programate'],
  ['/aviz-racordare', 'Aviz de racordare'],
  ['/contact', 'Contactează-ne']
];
const links = [['/', 'Acasă'], ['/anunturi', 'Anunțuri'], ['/despre', 'Despre RED-Nord'], ['/contact', 'Contacte']];
const consumerLinks = [
  ['/servicii', 'Toate serviciile'],
  ['/intreruperi-manevra', 'Întreruperi de manevră'],
  ['/intreruperi', 'Întreruperi programate'],
  ['/distributie', 'Distribuția energiei electrice'],
  ['/aviz-racordare', 'Racordarea la rețea'],
  ['/notificari', 'Notificări despre lucrări'],
  ['/tarife', 'Tarife și servicii'],
  ['/contact', 'Comunică un deranjament']
];

export default function Navbar({ dark, onTheme }) {
  const [open, setOpen] = useState(false);
  const [consumerOpen, setConsumerOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const consumerMenuRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!consumerOpen) return undefined;
    const closeOnOutsideClick = event => {
      if (!consumerMenuRef.current?.contains(event.target)) setConsumerOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [consumerOpen]);
  function submit(event) {
    event.preventDefault();
    navigate(`/?q=${encodeURIComponent(query)}`);
    setSearch(false);
    setOpen(false);
  }
  return <header className="site-header">
    <div className="utility-bar"><div className="header-inner utility-inner">
      <span>Operator de distribuție a energiei electrice în nordul țării</span>
      <div>{shortcuts.map(([to, label], i) => <NavLink className={i === 2 ? 'utility-report' : ''} key={to} to={to}>{label}<i className="fa-solid fa-arrow-right"/></NavLink>)}</div>
    </div></div>
    <div className="header-inner main-header">
      <NavLink to="/" className="brand" onClick={() => setOpen(false)}><img src="/images/logo.png" alt="RED-Nord"/><span><b>RED-NORD</b><small>ENERGIA REȚELEI INTELIGENTE</small></span></NavLink>
      <button className={`mobile-toggle icon-button ${open ? 'is-open' : ''}`} aria-label={open ? 'Închide meniul' : 'Deschide meniul'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}><i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`}/></button>
      <nav id="primary-navigation" className={`main-nav ${open ? 'is-open' : ''}`}>{links.slice(0, 2).map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}
        <div ref={consumerMenuRef} className={`nav-dropdown ${consumerOpen ? 'is-open' : ''}`} onMouseEnter={() => setConsumerOpen(true)} onMouseLeave={() => setConsumerOpen(false)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setConsumerOpen(false); }}>
          <button className="nav-link nav-dropdown-trigger" type="button" aria-expanded={consumerOpen} aria-haspopup="true" aria-controls="consumer-menu" onClick={() => { if (window.matchMedia('(hover: hover)').matches) setConsumerOpen(true); else setConsumerOpen(value => !value); }} onKeyDown={event => { if (event.key === 'Escape') setConsumerOpen(false); }}>Pentru consumatori <i className="fa-solid fa-chevron-down" aria-hidden="true"/></button>
          {consumerOpen && <div className="nav-dropdown-menu" id="consumer-menu" role="menu">{consumerLinks.map(([to, label]) => <NavLink key={to} to={to} role="menuitem" onClick={() => { setConsumerOpen(false); setOpen(false); }} className={({isActive}) => isActive ? 'nav-dropdown-link active' : 'nav-dropdown-link'}>{label}</NavLink>)}</div>}
        </div>
        {links.slice(2).map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}
        <button className="icon-button" aria-label="Căutare" onClick={() => setSearch(!search)}><i className="fa-solid fa-magnifying-glass"/></button>
        <button className="icon-button" aria-label={dark ? 'Activează tema luminoasă' : 'Activează tema întunecată'} onClick={onTheme}><i className={`fa-solid ${dark ? 'fa-sun' : 'fa-moon'}`}/></button>
      </nav>
      {search && <form className="search-popover" onSubmit={submit}><label htmlFor="site-search">Caută servicii și informații</label><div><input id="site-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ex. racordare, contoare" autoFocus/><button className="button button-primary">Caută</button></div></form>}
    </div>
  </header>;
}
Navbar.propTypes = { dark: PropTypes.bool.isRequired, onTheme: PropTypes.func.isRequired };
