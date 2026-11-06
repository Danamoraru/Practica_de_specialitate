import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PermitIllustration from '../components/PermitIllustration.jsx';

const steps = [
  ['Datele solicitantului', 'Cine depune cererea'],
  ['Locul și racordarea', 'Unde și pentru ce'],
  ['Documente', 'Încarcă dosarul'],
  ['Verificare', 'Confirmă și trimite']
];
const districts = ['Bălți', 'Briceni', 'Dondușeni', 'Drochia', 'Edineț', 'Fălești', 'Florești', 'Glodeni', 'Ocnița', 'Rezina', 'Rîșcani', 'Sîngerei', 'Soroca', 'Șoldănești', 'Ungheni'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ConnectionPermitPage() {
  const [step, setStep] = useState(0);
  const [applicant, setApplicant] = useState('persoana');
  const [requestKind, setRequestKind] = useState('consum');
  const [includedDocs, setIncludedDocs] = useState({});
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitState, setSubmitState] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const formRef = useRef(null);
  const endpoint = import.meta.env.VITE_APPLICATION_ENDPOINT;
  const documents = applicant === 'persoana'
    ? [
      { id: 'identity', title: 'Copia actului de identitate', detail: 'Obligatoriu pentru persoane fizice.' },
      { id: 'property', title: 'Dovada dreptului asupra imobilului sau terenului', detail: 'Actul care confirmă dreptul de proprietate sau un alt drept de folosință asupra locului de racordare.' },
      { id: 'authorization', title: 'Procura pe numele reprezentantului', detail: 'Se anexează dacă altă persoană depune cererea în numele solicitantului.', optional: true }
    ]
    : [
      { id: 'registry', title: 'Extrasul din Registrul de Stat al Unităților de Drept', detail: 'Extrasul trebuie să fie eliberat cu cel mult 3 luni înainte de prezentare.' },
      { id: 'property', title: 'Dovada dreptului asupra imobilului', detail: 'Actul care confirmă dreptul de proprietate sau un alt drept de folosință asupra locului de racordare.' },
      { id: 'site-plan', title: 'Schița grafică de amplasare', detail: `Planul amplasării ${requestKind === 'consum' ? 'instalației de utilizare' : 'centralei electrice sau instalației de stocare'} în cadrul bunului imobil.` },
      { id: 'authorization', title: 'Procura pe numele reprezentantului', detail: 'Se anexează dacă altă persoană depune cererea în numele solicitantului.', optional: true }
    ];

  function chooseFile(event) {
    const selected = event.target.files?.[0] || null;
    setFileError('');
    if (!selected) { setFile(null); return; }
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setFile(null); setFileError('Alege un fișier PDF.'); event.target.value = ''; return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFile(null); setFileError('Fișierul trebuie să aibă cel mult 5 MB.'); event.target.value = ''; return;
    }
    setFile(selected);
  }

  function goToStep(nextStep) {
    if (nextStep > step) {
      for (let index = step; index < nextStep; index += 1) {
        const section = formRef.current?.querySelector(`[data-step="${index}"]`);
        const fields = [...(section?.querySelectorAll('input, select, textarea') || [])].filter(field => field.type !== 'file' && field.willValidate);
        const invalid = fields.find(field => !field.checkValidity());
        if (invalid) { setStep(index); requestAnimationFrame(() => invalid.reportValidity()); return; }
        if (index === 2 && !file) { setStep(2); setFileError('Atașează cererea completată și semnată în format PDF.'); return; }
        if (index === 2 && documents.some(document => !document.optional && !includedDocs[`${applicant}-${document.id}`])) {
          setStep(2); setFileError('Confirmă că ai inclus în PDF fiecare act obligatoriu din lista de mai jos.'); return;
        }
      }
    }
    setStep(nextStep);
    setSubmitError('');
    window.scrollTo({ top: document.querySelector('.permit-form-shell')?.offsetTop - 110 || 0, behavior: 'smooth' });
  }

  async function submit(event) {
    event.preventDefault();
    const finalSection = formRef.current?.querySelector('[data-step="3"]');
    const invalid = [...(finalSection?.querySelectorAll('input, select, textarea') || [])].find(field => field.willValidate && !field.checkValidity());
    if (invalid) { invalid.reportValidity(); return; }
    if (!endpoint) {
      setSubmitError('Trimiterea online nu este configurată încă. Formularul și actele tale nu au fost expediate.');
      return;
    }
    let target;
    try { target = new URL(endpoint, window.location.origin); } catch { setSubmitError('Adresa serviciului de transmitere nu este validă. Datele nu au fost expediate.'); return; }
    const localTarget = ['localhost', '127.0.0.1', '[::1]'].includes(target.hostname);
    if (target.protocol !== 'https:' && !localTarget) {
      setSubmitError('Transmiterea datelor este permisă doar printr-o conexiune HTTPS securizată. Datele nu au fost expediate.');
      return;
    }
    setSubmitState('sending'); setSubmitError('');
    const formData = new FormData(event.currentTarget);
    if (file) formData.set('applicationPdf', file);
    try {
      const response = await fetch(endpoint, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Cererea nu a putut fi transmisă. Verifică datele și încearcă din nou.');
      setSubmitState('sent');
    } catch (error) {
      setSubmitState('idle');
      setSubmitError(error.message || 'A apărut o problemă de conexiune. Datele nu au fost expediate.');
    }
  }

  if (submitState === 'sent') return <main className="page-main permit-page"><div className="container"><section className="permit-success"><span><i className="fa-solid fa-check"/></span><p className="eyebrow blue">Transmitere confirmată</p><h1>Formularul a fost expediat.</h1><p>Verifică e-mailul pentru confirmarea de recepționare. Confirmarea primirii spre examinare nu înseamnă că solicitarea a fost înregistrată; RED-Nord comunică ulterior rezultatul verificării documentelor.</p><Link className="button button-primary" to="/">Înapoi la pagina principală</Link></section></div></main>;

  return <main className="page-main permit-page">
    <div className="container">
      <nav className="breadcrumbs" aria-label="Navigare"><Link to="/">Acasă</Link><i className="fa-solid fa-angle-right"/><Link to="/servicii">Servicii</Link><i className="fa-solid fa-angle-right"/><span>Aviz de racordare</span></nav>
      <section className="permit-hero">
        <div className="permit-hero-copy"><span className="eyebrow blue">Racordare la rețea</span><h1>Solicită avizul<br/><span>de racordare.</span></h1><p>Completează formularul în câțiva pași. Îți vom cere doar informațiile necesare pentru solicitare și documentele aferente.</p><a className="button button-primary" href="#acte-necesare">Vezi actele necesare <i className="fa-solid fa-arrow-down"/></a></div>
        <div className="permit-hero-art" aria-hidden="true"><div className="permit-art-grid"/><div className="permit-art-card"><span><i className="fa-solid fa-plug-circle-check"/></span><b>Cerere de racordare</b><small>Patru pași simpli</small><div className="permit-art-line"/><div className="permit-art-line short"/><div className="permit-art-check"><i className="fa-solid fa-check"/> Gata pentru verificare</div></div><div className="permit-art-orbit orbit-one"/><div className="permit-art-orbit orbit-two"/></div>
      </section>

      <section className="permit-annex-guide" id="acte-necesare" aria-labelledby="permit-annex-title">
        <div className="permit-annex-heading"><span className="eyebrow blue">Înainte să începi</span><h2 id="permit-annex-title">Alege situația ta</h2><p>Verifică actele necesare în blocul potrivit și descarcă modelul de cerere.</p></div>
        <div className="permit-scenario-list">
          <details className="permit-scenario"><summary><PermitIllustration variant="home"/><span className="permit-scenario-number">01</span><span className="permit-scenario-title"><small>LOC DE CONSUM</small><b>Persoană fizică</b><em>Casă, apartament sau alt spațiu personal</em></span><span className="permit-scenario-open">Deschide ghidul <i className="fa-solid fa-arrow-down"/></span></summary><div className="permit-scenario-details"><div className="permit-scenario-columns"><section><h3><i className="fa-solid fa-file-lines"/> Actele necesare</h3><ul><li>Copia buletinului de identitate.</li><li>Dovada dreptului de proprietate sau a altui drept de folosință asupra construcției ori bunului imobil unde va fi amplasată instalația.</li><li>Procura pe numele mandatarului, dacă altă persoană depune cererea.</li></ul></section><section><h3><i className="fa-solid fa-list-check"/> Pașii pentru solicitare</h3><ol><li>Completează și semnează modelul de cerere pentru loc de consum.</li><li>Alătură actele de mai sus și pregătește-le într-un singur PDF.</li><li>Depune cererea prin canalul disponibil RED-Nord.</li><li>Confirmarea prin e-mail înseamnă recepționare pentru examinare; după acceptare primești numărul de înregistrare.</li></ol></section></div><div className="permit-scenario-note"><b>Putere și situații speciale</b><p>În formular indici tensiunea și puterea activă solicitată. Dacă puterea solicitată depășește 10 kW, formularul actual cere completarea rubricii 12 privind puterea racordată și cea suplimentară. Pentru majorarea puterii unui loc de consum este necesară solicitarea unui aviz de racordare.</p></div><div className="permit-scenario-footer"><p><b>Termen orientativ:</b> avizul se eliberează în 10 zile lucrătoare după acceptarea și înregistrarea dosarului. <b>Cadrul legal:</b> Legea nr. 164/2025 și Regulamentul privind racordarea, aprobat prin Hotărârea ANRE nr. 311/2026.</p><a className="permit-annex-download" href="https://www.rednord.md/files/supply/CERERE_racordarea1.pdf" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-file-pdf"/><span><b>Descarcă modelul cererii pentru loc de consum</b><small>PDF · Formular RED-Nord</small></span><i className="fa-solid fa-arrow-up-right-from-square"/></a></div></div></details>
          <details className="permit-scenario"><summary><PermitIllustration variant="business"/><span className="permit-scenario-number">02</span><span className="permit-scenario-title"><small>LOC DE CONSUM</small><b>Persoană juridică</b><em>Companie, instituție sau organizație</em></span><span className="permit-scenario-open">Deschide ghidul <i className="fa-solid fa-arrow-down"/></span></summary><div className="permit-scenario-details"><div className="permit-scenario-columns"><section><h3><i className="fa-solid fa-file-lines"/> Actele necesare</h3><ul><li>Extrasul din Registrul de Stat al Unităților de Drept, eliberat cu cel mult 3 luni înainte de prezentare.</li><li>Dovada dreptului de proprietate sau de folosință asupra imobilului și/sau părților componente.</li><li>Schița grafică a amplasării instalației electrice în bunul imobil.</li><li>Procura, dacă solicitarea este depusă de un reprezentant.</li></ul></section><section><h3><i className="fa-solid fa-list-check"/> Pașii pentru solicitare</h3><ol><li>Completează datele companiei și ale locului de consum în modelul de cerere.</li><li>Semnează cererea electronic și atașează extrasul, actele imobilului și schița.</li><li>Pregătește dosarul într-un singur PDF și depune-l prin canalul disponibil RED-Nord.</li><li>Urmărește răspunsul: confirmarea e-mailului este recepționare pentru examinare, iar înregistrarea vine după acceptare.</li></ol></section></div><div className="permit-scenario-note"><b>Putere și majorare</b><p>Formularul solicită puterea activă și tensiunea necesare. Pentru o putere solicitată mai mare de 10 kW, se completează și rubrica 12 cu puterea existentă și cea suplimentară. Majorarea puterii unui loc de consum necesită solicitarea unui aviz de racordare.</p></div><div className="permit-scenario-footer"><p><b>Termen orientativ:</b> 10 zile lucrătoare după acceptarea și înregistrarea dosarului. <b>Cadrul legal:</b> Legea nr. 164/2025 și Regulamentul ANRE nr. 311/2026. Pentru depunerea online, modelul curent indică semnătură electronică pentru persoana juridică.</p><a className="permit-annex-download" href="https://www.rednord.md/files/supply/CERERE_racordarea1.pdf" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-file-pdf"/><span><b>Descarcă modelul cererii pentru loc de consum</b><small>PDF · Formular RED-Nord</small></span><i className="fa-solid fa-arrow-up-right-from-square"/></a></div></div></details>
          <details className="permit-scenario"><summary><PermitIllustration variant="home-solar"/><span className="permit-scenario-number">03</span><span className="permit-scenario-title"><small>PRODUCERE / STOCARE</small><b>Persoană fizică</b><em>Centrală electrică sau baterie pentru proprietate personală</em></span><span className="permit-scenario-open">Deschide ghidul <i className="fa-solid fa-arrow-down"/></span></summary><div className="permit-scenario-details"><div className="permit-scenario-columns"><section><h3><i className="fa-solid fa-file-lines"/> Actele necesare</h3><ul><li>Copia buletinului de identitate.</li><li>Dovada dreptului de proprietate sau de folosință asupra imobilului unde va fi amplasată centrala electrică ori instalația de stocare.</li><li>Procura, dacă o altă persoană reprezintă solicitantul.</li></ul></section><section><h3><i className="fa-solid fa-list-check"/> Pașii pentru solicitare</h3><ol><li>Completează cererea pentru centrală electrică și/sau instalație de stocare.</li><li>Indică tipul sursei, puterea și, dacă este cazul, capacitatea bateriei.</li><li>Semnează cererea, anexează actele și pregătește dosarul PDF.</li><li>După examinare, cererea acceptată primește număr de înregistrare; apoi urmează proiectarea și admiterea în exploatare.</li></ol></section></div><div className="permit-scenario-note"><b>Ce puteri se indică</b><p>Formularul separă puterea contractată, puterea maximă de producere, puterea pentru servicii proprii și capacitatea bateriei (kWh). Pentru centrală, modelul curent indică o putere instalată de până la 200 kW și nu mai mare decât puterea contractată pentru locul de consum. Pentru stocare, completează capacitatea nominală solicitată.</p></div><div className="permit-scenario-footer"><p><b>Termen orientativ:</b> 30 de zile lucrătoare pentru eliberarea avizului după acceptarea și înregistrarea dosarului. <b>Cadrul legal:</b> Legea nr. 164/2025 și Regulamentul ANRE nr. 311/2026; admiterea în exploatare este necesară înainte de punerea finală sub tensiune.</p><a className="permit-annex-download" href="https://www.rednord.md/files/supply/CERERE_Producere1.pdf" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-file-pdf"/><span><b>Descarcă modelul pentru producere / stocare</b><small>PDF · Formular RED-Nord</small></span><i className="fa-solid fa-arrow-up-right-from-square"/></a></div></div></details>
          <details className="permit-scenario"><summary><PermitIllustration variant="business-solar"/><span className="permit-scenario-number">04</span><span className="permit-scenario-title"><small>PRODUCERE / STOCARE</small><b>Persoană juridică</b><em>Centrală electrică sau sistem de stocare pentru organizație</em></span><span className="permit-scenario-open">Deschide ghidul <i className="fa-solid fa-arrow-down"/></span></summary><div className="permit-scenario-details"><div className="permit-scenario-columns"><section><h3><i className="fa-solid fa-file-lines"/> Actele necesare</h3><ul><li>Extrasul din Registrul de Stat al Unităților de Drept, emis cu cel mult 3 luni înainte.</li><li>Dovada dreptului de proprietate sau de folosință asupra imobilului și/sau părților componente.</li><li>Schița grafică a amplasării centralei și/sau a instalației de stocare.</li><li>Procura, dacă depune cererea un mandatar.</li></ul></section><section><h3><i className="fa-solid fa-list-check"/> Pașii pentru solicitare</h3><ol><li>Completează formularul pentru centrală electrică și/sau stocare cu datele organizației și ale locului.</li><li>Descrie sursa, puterea contractată, puterea de producere și capacitatea de stocare.</li><li>Semnează electronic, alătură actele și schița, apoi pregătește un singur PDF.</li><li>După acceptarea dosarului primești numărul de înregistrare și continui cu proiectarea și admiterea instalației.</li></ol></section></div><div className="permit-scenario-note"><b>Scenarii pe putere</b><p>Formularul solicită separat puterea contractată, puterea maximă de producere, puterea pentru servicii proprii și capacitatea BESS. Pentru centrale, modelul curent indică limita de până la 200 kW și condiția să nu depășească puterea contractată a locului de consum.</p></div><div className="permit-scenario-footer"><p><b>Termen orientativ:</b> 30 de zile lucrătoare după acceptarea și înregistrarea dosarului. <b>Cadrul legal:</b> Legea nr. 164/2025 și Regulamentul ANRE nr. 311/2026; etapa de admitere în exploatare precedă punerea finală sub tensiune.</p><a className="permit-annex-download" href="https://www.rednord.md/files/supply/CERERE_Producere1.pdf" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-file-pdf"/><span><b>Descarcă modelul pentru producere / stocare</b><small>PDF · Formular RED-Nord</small></span><i className="fa-solid fa-arrow-up-right-from-square"/></a></div></div></details>
        </div>
        <p className="permit-annex-note"><i className="fa-solid fa-circle-info"/> Cererea trebuie completată și semnată, iar copiile actelor trebuie incluse în dosarul PDF. Lista urmează informațiile publicate de RED-Nord; pentru proiecte sau situații speciale, actele pot depinde de cazul concret.</p>
        <a className="button button-primary permit-annex-form-link" href="#formular">Am pregătit actele · continuă la formular <i className="fa-solid fa-arrow-down"/></a>
      </section>

      <section className="permit-form-shell" id="formular">
        <div className="permit-progress-head"><div><span className="eyebrow blue">Formular online</span><h2>Aviz de racordare</h2></div><span className="permit-step-count">Pasul {step + 1} din {steps.length}</span></div>
        <div className="permit-stepper" aria-label="Etapele formularului">{steps.map(([title], index) => <button type="button" key={title} className={`permit-step ${index === step ? 'current' : ''} ${index < step ? 'completed' : ''}`} aria-current={index === step ? 'step' : undefined} onClick={() => index < step && goToStep(index)}><span>{index < step ? <i className="fa-solid fa-check"/> : `0${index + 1}`}</span><b>{title}</b></button>)}</div>

        <form ref={formRef} onSubmit={submit} noValidate>
          <section className="permit-form-step" data-step="0" hidden={step !== 0}>
            <div className="permit-form-heading"><span>01</span><div><h3>Datele solicitantului</h3><p>Completează datele persoanei sau companiei care solicită racordarea.</p></div></div>
            <fieldset className="permit-applicant-types"><legend>Solicitantul este</legend><label className={applicant === 'persoana' ? 'selected' : ''}><input type="radio" name="applicantType" value="persoana fizică" checked={applicant === 'persoana'} onChange={() => setApplicant('persoana')}/><i className="fa-regular fa-user"/><span><b>Persoană fizică</b><small>Cerere în nume propriu</small></span></label><label className={applicant === 'companie' ? 'selected' : ''}><input type="radio" name="applicantType" value="persoană juridică" checked={applicant === 'companie'} onChange={() => setApplicant('companie')}/><i className="fa-solid fa-building"/><span><b>Persoană juridică</b><small>Cerere pentru companie</small></span></label></fieldset>
            <div className="permit-fields-grid">
              <label className="permit-field full"><span>{applicant === 'persoana' ? 'Nume și prenume' : 'Denumirea companiei'} <b>*</b></span><input name="applicantName" autoComplete="name" required maxLength="160" placeholder={applicant === 'persoana' ? 'Ex. Maria Popescu' : 'Ex. SRL Exemplu'}/></label>
              {applicant === 'companie' && <label className="permit-field"><span>IDNO <b>*</b></span><input name="idno" inputMode="numeric" required pattern="[0-9]{13}" title="IDNO trebuie să conțină 13 cifre." placeholder="13 cifre"/></label>}
              <label className="permit-field full"><span>Adresa juridică / domiciliul <b>*</b></span><input name="legalAddress" autoComplete="street-address" required maxLength="240" placeholder="Localitate, stradă, număr"/></label>
              <label className="permit-field full"><span>Denumirea locului de consum / producere <b>*</b></span><input name="siteName" required maxLength="160" placeholder="Ex. locuință, spațiu comercial, centrală electrică"/></label>
              <label className="permit-field"><span>E-mail <b>*</b></span><input type="email" name="email" autoComplete="email" required maxLength="254" placeholder="nume@exemplu.md"/></label>
              <label className="permit-field"><span>Telefon de contact <b>*</b></span><input type="tel" name="phone" autoComplete="tel" required maxLength="24" pattern="[+0-9() .-]{7,24}" title="Introdu un număr de telefon valid." placeholder="+373 6xx xx xxx"/></label>
            </div>
          </section>

          <section className="permit-form-step" data-step="1" hidden={step !== 1}>
            <div className="permit-form-heading"><span>02</span><div><h3>Locul și tipul racordării</h3><p>Indică adresa unde va fi racordată instalația.</p></div></div>
            <div className="permit-fields-grid">
              <label className="permit-field"><span>Raion / municipiu <b>*</b></span><select name="district" required defaultValue=""><option value="" disabled>Alege raionul</option>{districts.map(district => <option key={district}>{district}</option>)}</select></label>
              <label className="permit-field"><span>Cod cadastral</span><input name="cadastralCode" maxLength="40" placeholder="Dacă îl cunoști"/></label>
              <label className="permit-field full"><span>Adresa locului de consum / producere <b>*</b></span><input name="siteAddress" required maxLength="240" placeholder="Localitate, stradă, număr" autoComplete="street-address"/></label>
              <label className="permit-field"><span>Tipul solicitării <b>*</b></span><select name="requestType" required value={requestKind} onChange={event => setRequestKind(event.target.value)}><option value="consum">Instalație de utilizare (consum)</option><option value="producere">Centrală electrică (producere)</option><option value="stocare">Instalație de stocare</option></select></label>
              <label className="permit-field"><span>Puterea solicitată (kW)</span><input name="requestedPower" type="number" min="0.1" max="100000" step="0.1" placeholder="Ex. 10"/></label>
              <label className="permit-field full"><span>Detalii utile</span><textarea name="details" rows="3" maxLength="1500" placeholder="Adaugă detalii care pot ajuta la examinarea solicitării."/></label>
            </div>
          </section>

          <section className="permit-form-step" data-step="2" hidden={step !== 2}>
            <div className="permit-form-heading"><span>03</span><div><h3>Documente pentru solicitare</h3><p>Unește cererea completată, semnată și anexele într-un singur fișier PDF.</p></div></div>
            <div className="permit-documents-list"><div className="permit-documents-title"><span className="eyebrow blue">Lista actelor necesare</span><p>Solicitant: <b>{applicant === 'persoana' ? 'persoană fizică' : 'persoană juridică'}</b> · Racordare: <b>{requestKind === 'consum' ? 'loc de consum' : requestKind === 'producere' ? 'loc de producere' : 'instalație de stocare'}</b></p></div>{documents.map(document => <label key={document.id} className={`permit-required-doc ${includedDocs[`${applicant}-${document.id}`] ? 'included' : ''}`}><input type="checkbox" name="includedDocuments" value={document.title} checked={Boolean(includedDocs[`${applicant}-${document.id}`])} onChange={() => setIncludedDocs(current => ({ ...current, [`${applicant}-${document.id}`]: !current[`${applicant}-${document.id}`] }))}/><span className="permit-required-icon"><i className={`fa-solid ${includedDocs[`${applicant}-${document.id}`] ? 'fa-check' : 'fa-file-lines'}`}/></span><span className="permit-required-copy"><b>{document.title}{document.optional && <small className="optional-tag">Dacă este cazul</small>}</b><small>{document.detail}</small></span></label>)}</div>
            <div className="permit-upload-card"><div className="permit-upload-icon"><i className="fa-solid fa-file-arrow-up"/></div><div><b>Atașează dosarul în format PDF <span>*</span></b><p>Un singur fișier PDF, maximum 5 MB. Include formularul cererii completat și semnat, împreună cu actele necesare bifate mai sus.</p><label className="button button-secondary permit-browse">Alege fișier PDF<input type="file" name="applicationPdf" accept="application/pdf,.pdf" onChange={chooseFile}/></label></div></div>
            {file && <div className="permit-file-selected"><i className="fa-solid fa-file-pdf"/><span><b>{file.name}</b><small>{(file.size / (1024 * 1024)).toFixed(2)} MB</small></span><button type="button" aria-label="Elimină fișierul" onClick={() => { setFile(null); const input = formRef.current?.querySelector('input[type="file"]'); if (input) input.value = ''; }}>×</button></div>}
            {fileError && <p className="permit-validation-error" role="alert">{fileError}</p>}
            <div className="permit-doc-note"><i className="fa-solid fa-circle-info"/><p><b>Verifică dosarul înainte de expediere.</b><br/>Cererea nesemnată sau fără setul complet de acte necesare nu va fi procesată. Bifele de mai sus sunt doar o listă de control; actele trebuie să fie incluse efectiv în PDF.</p></div>
          </section>

          <section className="permit-form-step" data-step="3" hidden={step !== 3}>
            <div className="permit-form-heading"><span>04</span><div><h3>Verifică și trimite</h3><p>Confirmă că datele sunt corecte și că ai dreptul să le transmiți.</p></div></div>
            <div className="permit-review-card"><span><i className="fa-solid fa-user"/> Solicitant</span><p>{applicant === 'persoana' ? 'Persoană fizică' : 'Persoană juridică'} · {formRef.current?.elements.applicantName?.value || 'Completează la pasul 1'}</p><span><i className="fa-solid fa-location-dot"/> Locul racordării</span><p>{formRef.current?.elements.siteAddress?.value || 'Completează la pasul 2'} · {formRef.current?.elements.district?.value || 'Alege raionul'}</p><span><i className="fa-solid fa-file-pdf"/> Document atașat</span><p>{file?.name || 'Nu a fost ales niciun fișier'}</p><button type="button" className="permit-edit-link" onClick={() => goToStep(0)}>Revizuiește datele</button></div>
            <label className="permit-consent"><input type="checkbox" name="dataAccuracy" required/><span>Confirm că datele indicate îmi aparțin, sunt veridice și exacte. <b>*</b></span></label>
            <label className="permit-consent"><input type="checkbox" name="completeDocuments" required/><span>Confirm că PDF-ul conține cererea completată și semnată și toate actele necesare pentru tipul solicitării mele. <b>*</b></span></label>
            <label className="permit-consent"><input type="checkbox" name="privacyConsent" required/><span>Sunt de acord cu prelucrarea datelor transmise pentru examinarea solicitării, conform notei de informare privind protecția datelor. <b>*</b></span></label>
          </section>

          <div className="permit-form-actions">{step > 0 && <button type="button" className="button button-secondary" onClick={() => goToStep(step - 1)}><i className="fa-solid fa-arrow-left"/> Înapoi</button>}<span className="permit-form-security"><i className="fa-solid fa-lock"/> Datele se transmit numai la configurarea serviciului securizat.</span>{step < 3 ? <button type="button" className="button button-primary" onClick={() => goToStep(step + 1)}>Continuă <i className="fa-solid fa-arrow-right"/></button> : <button type="submit" className="button button-primary" disabled={submitState === 'sending'}>{submitState === 'sending' ? 'Se transmite…' : 'Trimite cererea'} <i className="fa-solid fa-paper-plane"/></button>}</div>
          {submitError && <p className="permit-validation-error" role="alert">{submitError}</p>}
          {!endpoint && step === 3 && <p className="permit-endpoint-note">Formularul este pregătit, dar expedierea online va fi activată după conectarea endpointului securizat RED-Nord. Nicio informație introdusă nu părăsește această pagină.</p>}
        </form>
      </section>

      <section className="permit-processing"><div className="section-heading"><span className="eyebrow blue">După expedierea unei cereri</span><h2>Ce urmează?</h2><p>Pașii și termenele de mai jos descriu procesarea cererii de către RED-Nord după ce aceasta este transmisă printr-un canal funcțional.</p></div><div className="permit-processing-grid"><article><span>01</span><h3>Confirmare de recepționare</h3><p>Primești un e-mail că solicitarea a ajuns pentru examinare. Confirmarea nu înseamnă că cererea a fost deja înregistrată.</p></article><article><span>02</span><h3>Verificarea dosarului</h3><p>RED-Nord verifică semnătura și setul de acte. Dacă lipsesc documente, primești motivul respingerii și poți retransmite dosarul completat.</p></article><article><span>03</span><h3>Înregistrarea cererii</h3><p>Dacă dosarul este acceptat, primești numărul de înregistrare al solicitării.</p></article><article><span>04</span><h3>Eliberarea avizului</h3><p>Termenul publicat este de 10 zile lucrătoare pentru un loc de consum și 30 de zile lucrătoare pentru un loc de producere.</p></article></div><p className="permit-endpoint-note">Trimiterea din acest prototip nu este conectată încă la sistemul RED-Nord; formularul nu expediază date sau acte.</p></section>

      <p className="permit-source-note"><i className="fa-solid fa-circle-info"/> Lista documentelor este orientativă și se bazează pe informațiile publice RED-Nord. Verifică actele necesare pentru situația ta înainte de expediere.</p>
    </div>
  </main>;
}
