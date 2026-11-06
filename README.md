# RED-Nord — prototip educațional

Prototip educațional pentru o experiență RED-Nord redesenată. Formularul „Aviz de racordare” este împărțit în patru pași: datele solicitantului, locul și tipul racordării, documente și verificare. Datele rămân în browser până la configurarea endpointului de transmitere; fără endpoint formularul nu expediază nimic. Informațiile despre acte sunt orientative și trebuie verificate înainte de depunerea unei solicitări reale.

Pagina de întreruperi folosește un extras local selectat din programele oficiale pentru Bălți și Sîngerei, săptămâna 2–8 noiembrie 2026. Acest extras nu se actualizează automat și nu acoperă toate filialele; pagina indică această limitare.

## Pornire

Instalează dependențele o singură dată:

```bash
npm install
```

Pornește API-ul JSON Server într-un terminal:

```bash
npm run api
```

Pornește aplicația Vite într-un al doilea terminal:

```bash
npm run dev
```

Deschide adresa locală afișată de Vite. Datele demonstrative se citesc din `db.json`; API-ul JSON Server este configurat doar pentru citire și ascultă pe `127.0.0.1`. Harta folosește Leaflet și plăcile OpenStreetMap; necesită conexiune la internet.

Pentru integrarea transmiterii, setează `VITE_APPLICATION_ENDPOINT` într-un fișier `.env.local` către un backend securizat care acceptă `multipart/form-data`. Endpointul trebuie să valideze câmpurile și fișierul din nou pe server, să limiteze dimensiunea și tipul fișierului, să prevină CSRF/spam și să gestioneze în siguranță datele cu caracter personal. Cheile secrete nu se pun în variabile `VITE_*`; acestea sunt vizibile în browser.
