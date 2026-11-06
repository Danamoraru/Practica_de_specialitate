import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useOutages from '../hooks/useOutages.js';
import { getDistricts } from '../services/api.js';

const PAGE_SIZE = 10;
function localDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getStatus(item, now = new Date()) {
  const start = new Date(`${item.date}T${item.start}:00`);
  const end = new Date(`${item.date}T${item.end}:00`);
  if (now < start) return { key: 'planned', label: 'Planificat' };
  if (now < end) return { key: 'active', label: 'În desfășurare' };
  return { key: 'done', label: 'Finalizat' };
}

function displayDate(value) {
  return new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long' }).format(localDate(value));
}

export default function OutagesPage() {
  const { data = [], loading, error } = useOutages();
  const [districts, setDistricts] = useState([]);
  const [params, setParams] = useSearchParams();
  const [page, setPage] = useState(1);
  useEffect(() => { getDistricts().then(setDistricts).catch(() => setDistricts([])); }, []);
  const selectedDistrict = params.get('raion') || '';
  const selectedMonth = params.get('data') || '';
  const selectedYear = selectedMonth.slice(0, 4);
  const selectedMonthNumber = selectedMonth.length >= 7 ? selectedMonth.slice(5, 7) : '';
  const selectedDay = selectedMonth.length === 10 ? selectedMonth.slice(8, 10) : '';
  const daysInMonth = selectedYear && selectedMonthNumber ? new Date(Number(selectedYear), Number(selectedMonthNumber), 0).getDate() : 0;
  const availableDistricts = districts.map(item => [item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/gi, ''), item.name]);

  const results = useMemo(() => data
    .filter(item => !selectedDistrict || item.districtKey === selectedDistrict)
    .filter(item => !selectedMonth || item.date.startsWith(selectedMonth))
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start)),
  [data, selectedDistrict, selectedMonth]);
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
    setPage(1);
  }

  function updatePeriod(year, month, day = '') {
    updateFilter('data', year ? `${year}${month ? `-${month}${day ? `-${day}` : ''}` : ''}` : '');
  }

  function resetFilters() { setParams({}); setPage(1); }

  return <main className="page-main"><div className="container">
    <div className="outage-page-hero"><div className="page-heading"><span className="eyebrow blue">Planifică-ți ziua</span><h1>Întreruperi programate</h1><p>Vezi din timp unde și când sunt planificate lucrări în rețea. Filtrează lista după raion și perioadă.</p></div><span className="outage-hero-art" aria-hidden="true"><i className="fa-solid fa-calendar-days"/></span></div>
    <div className="outage-overview" aria-label="Rezumatul programului"><span><i className="fa-solid fa-calendar-check"/><b>{data.length}</b> lucrări în program</span><span><i className="fa-solid fa-location-dot"/><b>{availableDistricts.length}</b> raioane în filtru</span><span><i className="fa-solid fa-filter"/><b>{results.length}</b> rezultate pentru filtre</span></div>

    <section className="filter-panel outage-filters" aria-label="Filtrează întreruperile">
      <label>Raion<select value={selectedDistrict} onChange={event => updateFilter('raion', event.target.value)}><option value="">Toate raioanele disponibile</option>{availableDistricts.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label>Data întreruperii<span className="month-filter-controls"><select aria-label="Anul întreruperii" value={selectedYear} onChange={event => updatePeriod(event.target.value, selectedMonthNumber)}><option value="">An</option>{[2025, 2026, 2027].map(year => <option key={year} value={year}>{year}</option>)}</select><select aria-label="Luna întreruperii" value={selectedMonthNumber} disabled={!selectedYear} onChange={event => updatePeriod(selectedYear, event.target.value)}><option value="">Lună</option>{['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'].map((month, index) => <option key={month} value={String(index + 1).padStart(2, '0')}>{month}</option>)}</select><select aria-label="Ziua întreruperii" value={selectedDay} disabled={!selectedYear || !selectedMonthNumber} onChange={event => updatePeriod(selectedYear, selectedMonthNumber, event.target.value)}><option value="">Zi</option>{Array.from({ length: daysInMonth }, (_, index) => String(index + 1).padStart(2, '0')).map(day => <option key={day} value={day}>{day}</option>)}</select></span></label>
      {(selectedDistrict || selectedMonth) && <button className="button button-secondary" type="button" onClick={resetFilters}>Șterge filtrele</button>}
    </section>

    {loading ? <div className="outage-list" aria-label="Se încarcă întreruperile"><div className="skeleton"/><div className="skeleton"/><div className="skeleton"/></div>
      : error ? <div className="inline-error" role="alert">{error}</div>
      : <>
        <p className="results-count">{results.length ? `Afișăm ${Math.min(PAGE_SIZE, results.length - (currentPage - 1) * PAGE_SIZE)} din ${results.length} lucrări · sortate după dată și oră` : 'Nu există lucrări pentru filtrele selectate.'}</p>
        {visible.length ? <div className="outage-list">{visible.map(item => { const status = getStatus(item); return <article className="outage-card" key={item.id}>
          <div className="outage-date"><b>{localDate(item.date).getDate()}</b><span>{new Intl.DateTimeFormat('ro-RO', { month: 'short' }).format(localDate(item.date))}</span></div>
          <div className="outage-info"><h2>{item.locality}</h2><p><i className="fa-solid fa-location-dot"/> {item.district}</p><p><i className="fa-regular fa-clock"/> {item.start}–{item.end}</p><p><i className="fa-solid fa-screwdriver-wrench"/> {item.work}</p></div>
          <span className={`status status-${status.key}`}>{status.label}</span>
        </article>; })}</div> : <div className="empty-state"><i className="fa-solid fa-calendar-check"/><p>Nu am găsit lucrări în programul încărcat pentru această selecție.</p><button className="button button-secondary" type="button" onClick={resetFilters}>Vezi toate lucrările</button></div>}
        {pageCount > 1 && <nav className="pagination" aria-label="Paginarea lucrărilor"><button type="button" aria-label="Pagina anterioară" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><i className="fa-solid fa-chevron-left"/></button><span>Pagina {currentPage} din {pageCount}</span><button type="button" aria-label="Pagina următoare" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><i className="fa-solid fa-chevron-right"/></button></nav>}
      </>}

    <div className="outage-help-grid"><article><span className="service-icon"><i className="fa-solid fa-envelope"/></span><h2>Vrei notificări înainte de lucrări?</h2><p>RED-Nord oferă notificări prin e-mail pentru întreruperile planificate.</p><Link to="/contact" className="text-link">Contactează grupul de deservire <i className="fa-solid fa-arrow-right"/></Link></article><article><span className="service-icon orange"><i className="fa-solid fa-phone"/></span><h2>Lipsa energiei sau avarie?</h2><p>Grupul de deservire a consumatorilor răspunde non-stop.</p><a className="phone-link" href="tel:+37323124201">(+373) 231 2-42-01</a><Link to="/contact" className="text-link">Vezi toate contactele <i className="fa-solid fa-arrow-right"/></Link></article></div>
  </div></main>;
}
