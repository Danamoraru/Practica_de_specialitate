const statistics = [
    {
        icon: "fa-users",
        value: "336 000+",
        label: "Consumatori deserviți"
    },
    {
        icon: "fa-road",
        value: "24 000 km",
        label: "Rețele electrice"
    },
    {
        icon: "fa-bolt",
        value: "870",
        label: "Posturi de transformare"
    },
    {
        icon: "fa-building",
        value: "1 200+",
        label: "Angajați"
    }
];

const services = [
    {
        icon: "fa-plug",
        title: "Racordare la rețea"
    },
    {
        icon: "fa-file-invoice",
        title: "Facturare și plăți"
    },
    {
        icon: "fa-bolt",
        title: "Întreruperi programate"
    },
    {
        icon: "fa-triangle-exclamation",
        title: "Sesizări și reclamații"
    },
    {
        icon: "fa-gauge-high",
        title: "Verificarea contoarelor"
    },
    {
        icon: "fa-circle-info",
        title: "Informații pentru consumatori"
    }
];

const news = [
    {
        image: "images/announcement1.jpg",
        date: "21 OCTOMBRIE 2026",
        title: "Anunț privind lucrările planificate în rețeaua electrică"
    },
    {
        image: "images/announcement2.jpg",
        date: "18 OCTOMBRIE 2026",
        title: "RED-Nord continuă modernizarea rețelelor electrice"
    },
    {
        image: "images/announcement3.jpg",
        date: "15 OCTOMBRIE 2026",
        title: "Oportunități de angajare în cadrul RED-Nord"
    }
];

const statisticsContainer = document.getElementById("statistics");

statistics.forEach(statistic => {
    const card = document.createElement("div");

    card.className = "stat-card";

    card.innerHTML = `
        <div class="stat-icon">
            <i class="fa-solid ${statistic.icon}"></i>
        </div>
        <h3>${statistic.value}</h3>
        <p>${statistic.label}</p>
    `;

    statisticsContainer.appendChild(card);
});

const servicesContainer = document.getElementById("services");

services.forEach(service => {
    const card = document.createElement("div");

    card.className = "service-card";

    card.innerHTML = `
        <div class="service-icon">
            <i class="fa-solid ${service.icon}"></i>
        </div>

        <h3>${service.title}</h3>

        <i class="fa-solid fa-arrow-right"></i>
    `;

    servicesContainer.appendChild(card);
});

const newsContainer = document.getElementById("news");

news.forEach(article => {
    const card = document.createElement("article");

    card.className = "news-card";

    card.innerHTML = `
        <div
            class="news-image"
            style="background-image: url('${article.image}')"
        ></div>

        <div class="news-content">
            <span class="news-date">${article.date}</span>

            <h3>${article.title}</h3>

            <a href="#">
                Citește mai mult
                <i class="fa-solid fa-arrow-right"></i>
            </a>
        </div>
    `;

    newsContainer.appendChild(card);
});

const locationInput = document.getElementById("locationInput");
const searchOutage = document.getElementById("searchOutage");
const outageResult = document.getElementById("outageResult");

const outageLocations = [
    "Bălți",
    "Sîngerei",
    "Rîșcani",
    "Fălești",
    "Glodeni",
    "Drochia",
    "Edineț",
    "Soroca",
    "Florești",
    "Dondușeni"
];

searchOutage.addEventListener("click", () => {
    const location = locationInput.value.trim();

    if (location === "") {
        outageResult.textContent = "Introdu localitatea pentru căutare.";
        return;
    }

    const found = outageLocations.some(
        item => item.toLowerCase() === location.toLowerCase()
    );

    if (found) {
        outageResult.textContent =
            `Au fost găsite informații pentru localitatea ${location}.`;
    } else {
        outageResult.textContent =
            "Localitatea nu a fost găsită. Verifică denumirea introdusă.";
    }
});

locationInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchOutage.click();
    }
});