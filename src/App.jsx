import React from 'react';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import AnnouncementsPage from './pages/AnnouncementsPage.jsx';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import OutagesPage from './pages/OutagesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ConnectionPermitPage from './pages/ConnectionPermitPage.jsx';
import LocalInfoPage from './pages/LocalInfoPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('rednord-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const location = useLocation();
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('rednord-theme', dark ? 'dark' : 'light');
  }, [dark]);
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return <>
    <Navbar dark={dark} onTheme={() => setDark(!dark)} />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/anunturi" element={<AnnouncementsPage />} />
      <Route path="/anunturi/:id" element={<AnnouncementDetailPage />} />
      <Route path="/intreruperi" element={<OutagesPage />} />
      <Route path="/servicii" element={<ServicesPage />} />
      <Route path="/aviz-racordare" element={<ConnectionPermitPage />} />
      <Route path="/aviz-racordare/:scenario" element={<ConnectionPermitPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/despre" element={<AboutPage />} />
      <Route path="/notificari" element={<LocalInfoPage />} />
      <Route path="/distributie" element={<LocalInfoPage />} />
      <Route path="/intreruperi-manevra" element={<LocalInfoPage />} />
      <Route path="/tarife" element={<LocalInfoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    <Footer />
  </>;
}
