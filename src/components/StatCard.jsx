import React from 'react';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
export default function StatCard({ stat }) {
 const ref = useRef(null); const [value, setValue] = useState(0);
 useEffect(() => { const node = ref.current; if (!node) return; if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setValue(stat.value); return; } let frame; const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) return; const start = performance.now(), duration = 1300; function tick(now) { const p = Math.min((now - start) / duration, 1); setValue(Math.floor(stat.value * (1 - (1-p) ** 3))); if (p < 1) frame = requestAnimationFrame(tick); } frame = requestAnimationFrame(tick); observer.disconnect(); }, { threshold: .4 }); observer.observe(node); return () => { observer.disconnect(); if (frame) cancelAnimationFrame(frame); }; }, [stat.value]);
 return <article ref={ref} className="stat-card reveal"><i className={`fa-solid ${stat.icon}`}/><strong aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>{value}{stat.suffix}</strong><span>{stat.label}</span></article>;
}
StatCard.propTypes = { stat: PropTypes.shape({ value: PropTypes.number, suffix: PropTypes.string, label: PropTypes.string, icon: PropTypes.string }).isRequired };
