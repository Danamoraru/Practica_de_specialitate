const API = 'http://127.0.0.1:3001';

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API}/${path}`, options);
    if (!response.ok) throw new Error(`API ${response.status}`);
    return await response.json();
  } catch (error) {
    if (options.method && options.method !== 'GET') throw error;
    const response = await fetch('/db.json');
    if (!response.ok) throw error;
    const db = await response.json();
    return path.split('?')[0].split('/')[0] === 'outages' ? db.outages
      : path.split('?')[0].split('/')[0] === 'services' ? db.services
      : path.split('?')[0].split('/')[0] === 'news' ? db.news
      : path.split('?')[0].split('/')[0] === 'stats' ? db.stats
      : db.districts;
  }
}

export const getOutages = () => request('outages');
export const getServices = () => request('services');
export const getNews = () => request('news');
export const getStats = () => request('stats');
export const getDistricts = () => request('districts');
