import { useEffect, useRef, useState } from 'react';
import { getOutages } from '../services/api.js';

export default function useOutages() {
  const cache = useRef(null);
  const [data, setData] = useState(cache.current || []);
  const [loading, setLoading] = useState(!cache.current);
  const [error, setError] = useState('');
  useEffect(() => {
    if (cache.current) return;
    let active = true;
    getOutages().then(value => { cache.current = value; if (active) setData(value); })
      .catch(() => { if (active) setError('Nu am putut încărca întreruperile. Reîncearcă mai târziu.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return { data, loading, error };
}
