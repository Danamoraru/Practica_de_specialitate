import React from 'react';
import { Link, useParams } from 'react-router-dom';

const content = {
  notificari: {
    eyebrow: 'Întreruperi planificate', icon: 'fa-envelope-open-text', title: 'Cum primești notificările despre lucrări',
    intro: 'RED-Nord anunță din timp lucrările planificate, ca să-ți poți organiza activitățile. Termenul și metoda de informare depind de categoria consumatorului.',
    sections: [
      { title: 'Loc de consum sub 100 kW', text: 'Poți consulta lista săptămânală a lucrărilor sau te poți abona la notificări prin e-mail. Notificarea prin e-mail este expediată cu cel puțin 3 zile înainte.', bullets: ['Data întreruperii', 'Intervalul orar', 'Localitatea sau zona afectată', 'Tipul lucrărilor planificate'] },
      { title: 'Putere contractată de cel puțin 100 kW', text: 'Consumatorii cu putere contractată de cel puțin 100 kW și producătorii de energie electrică sunt informați direct, prin e-mail, SMS sau scrisoare, cu cel puțin 7 zile înainte.' },
      { title: 'Situații speciale', text: 'Pentru întreruperile legate de racordarea sau reconectarea instalațiilor, informarea poate avea loc cu o zi înainte.' }
    ], action: { to: '/intreruperi', label: 'Vezi programul local' }
  },
  distributie: {
    eyebrow: 'Despre serviciu', icon: 'fa-tower-broadcast', title: 'Ce înseamnă distribuția energiei',
    intro: 'Operatorul de distribuție gestionează rețeaua care transportă energia până la locurile de consum: linii, posturi de transformare și echipamente de distribuție.',
    sections: [
      { title: 'Ce ține de operatorul rețelei', text: 'Lucrările de mentenanță, reparație și modernizare ajută la păstrarea rețelei în condiții de siguranță și continuitate. Pentru unele intervenții, alimentarea trebuie întreruptă temporar.' },
      { title: 'Zona de deservire', text: 'Serviciul acoperă municipiul Bălți și raioanele Briceni, Drochia, Dondușeni, Edineț, Fălești, Florești, Ocnița, Rezina, Rîșcani, Sîngerei, Soroca și Ungheni.' },
      { title: 'Ai o problemă cu alimentarea?', text: 'Pentru avarii sau lipsa energiei, contactează grupul de deservire 24/24 și comunică localitatea și adresa afectată.' }
    ], action: { to: '/contact', label: 'Găsește telefonul oficiului tău' }
  },
  'intreruperi-manevra': {
    eyebrow: 'Lucrări operative', icon: 'fa-bolt', title: 'Întreruperi de manevră',
    intro: 'Manevrele operative schimbă temporar schema de funcționare a rețelei, de exemplu pentru pregătirea unor lucrări planificate sau pentru restabilirea schemei normale.',
    sections: [
      { title: 'Cât poate dura?', text: 'Întreruperile de manevră se pot efectua între orele 01:00 și 05:00 și pot dura până la 30 de minute.' },
      { title: 'De ce sunt necesare?', text: 'Manevrele permit echipelor să pregătească în siguranță lucrările sau să restabilească schema normală de exploatare a rețelei.' },
      { title: 'Ai rămas fără energie?', text: 'Dacă întreruperea persistă sau nu găsești informația de care ai nevoie, contactează grupul de deservire a consumatorilor, disponibil 24/24.' }
    ], action: { to: '/contact', label: 'Contactează grupul de deservire' }
  },
  tarife: {
    eyebrow: 'Costuri și servicii', icon: 'fa-coins', title: 'Tarife pentru distribuție și servicii',
    intro: 'Tariful pentru distribuția energiei și prețul energiei consumate sunt componente diferite. Tarifele reglementate de distribuție sunt aprobate de ANRE.',
    sections: [
      { title: 'Serviciul de distribuție', text: 'Acest tarif se referă la utilizarea rețelei de distribuție. Valoarea aplicabilă depinde de tariful reglementat în vigoare.' },
      { title: 'Servicii auxiliare', text: 'Lista include servicii auxiliare reglementate, precum și alte servicii electrice. Costul depinde de serviciul solicitat și de nomenclatorul aplicabil.' },
      { title: 'Înainte să soliciți un serviciu', text: 'Verifică tariful și condițiile aferente operațiunii concrete înainte de depunerea unei cereri. Valorile se pot modifica odată cu aprobarea unor tarife noi.' }
    ], action: { to: '/contact', label: 'Cere informații la oficiu' }
  }
};

export default function LocalInfoPage() {
  const { slug } = useParams();
  const page = content[slug];
  if (!page) return <main className="page-main"><div className="container"><p className="empty-state">Nu am găsit această informație.</p><Link to="/servicii" className="button button-primary">Vezi serviciile</Link></div></main>;
  return <main className="page-main"><div className="container local-info-page"><nav className="breadcrumbs" aria-label="Navigare"><Link to="/">Acasă</Link><i className="fa-solid fa-angle-right"/><Link to="/servicii">Servicii</Link><i className="fa-solid fa-angle-right"/><span>{page.title}</span></nav><header className="local-info-hero"><span className="service-icon"><i className={`fa-solid ${page.icon}`}/></span><span className="eyebrow blue">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p></header><div className="local-info-grid">{page.sections.map((section, index) => <article className="local-info-card" key={section.title}><span className="local-info-number">0{index + 1}</span><h2>{section.title}</h2><p>{section.text}</p>{section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}</article>)}</div><div className="local-info-action"><div><span className="eyebrow">Continuă pe site</span><h2>Ai nevoie de ajutor?</h2></div><Link className="button button-light" to={page.action.to}>{page.action.label} <i className="fa-solid fa-arrow-right"/></Link></div><p className="data-note">Informațiile de pe această pagină sunt rezumate pentru prototipul RED-Nord și se pot modifica odată cu actualizarea regulilor sau tarifelor.</p></div></main>;
}
