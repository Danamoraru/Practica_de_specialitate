Descrierea proiectului
Site-ul RED-Nord este o aplicație web realizată cu React și Vite, destinată prezentării serviciilor și informațiilor utile pentru consumatori. Interfața este adaptabilă pentru desktop și dispozitive mobile și include navigare între pagini, căutare, temă întunecată și componente reutilizabile.
Aplicația conține pagini dedicate serviciilor, anunțurilor, întreruperilor programate, contactelor și avizului de racordare. Lista întreruperilor poate fi filtrată după raion și dată, iar rezultatele sunt ordonate și afișate cu paginare. Datele demonstrative sunt păstrate în db.json și pot fi citite prin JSON Server. Harta este realizată cu Leaflet.
Acest proiect este o variantă nouă a site-ului RED-Nord. 
datele demonstrative într-un terminal:
   npm run api
al doilea terminal și pornirea site-ul:
   npm run dev
Datele de exemplu sunt în `db.json`. Întreruperile afișate sunt doar un extras pentru Bălți și Sîngerei din perioada 2–8 noiembrie 2026 și nu se actualizează singure.
Formularul de aviz verifică informațiile și fișierul ales, dar nu trimite cererea până nu este legat de un serviciu de trimitere. 
