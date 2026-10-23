function checkOutage() {
    const input = document.getElementById("locationInput");
    const result = document.getElementById("outageResult");

    const location = input.value.trim();

    result.classList.remove("hidden");

    if (!location) {
        result.textContent = "Introdu localitatea pentru a verifica întreruperile.";
        return;
    }

    result.textContent =
        `Se verifică întreruperile programate pentru ${location}...`;
}