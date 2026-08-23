/* =========================
   JQUERY INITIALIZATION
========================= */
$(document).ready(function() {
    // Hide loading screen
    setTimeout(function() {
        $("#loader").fadeOut();
    }, 600);

    // Toggle logo paragraph on click
    $(".logo").click(function() {
        $(".logo p").toggle();
    });
});


/* =========================
   SIDE MENU CONTROLS
========================= */
function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    if (menu) menu.classList.toggle("open");
    if (overlay) overlay.classList.toggle("show");
}

function closeMenu() {
    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    if (menu) menu.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
}


/* =========================
   LOCATION CHECKER
========================= */
const locationButton = document.getElementById("locationButton");

if (locationButton) {
    locationButton.addEventListener("click", function () {
        const userLocation = document.getElementById("userLocation");
        const distanceText = document.getElementById("distance");

        userLocation.innerHTML = "<strong>📍 Your Location:</strong><br>Finding your location...";
        distanceText.innerHTML = "<strong>📏 Distance from School:</strong><br>Calculating...";

        if (!navigator.geolocation) {
            userLocation.innerHTML = "<strong>📍 Your Location:</strong><br>Geolocation is not supported by your browser.";
            distanceText.innerHTML = "<strong>📏 Distance from School:</strong><br>Unable to calculate distance.";
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                // ASKI Skills and Knowledge Institute (Sampaloc, Talavera, Nueva Ecija)
                const schoolLat = 15.58;
                const schoolLon = 120.92;

                // Reverse Geocoding with User-Agent header (required by Nominatim terms)
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLon}&format=json`, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'ASKI-School-Events-App' 
                    }
                })
                .then(response => {
                    if (!response.ok) throw new Error("Network response failed");
                    return response.json();
                })
                .then(data => {
                    const address = data.address || {};
                    const locationName =
                        address.city ||
                        address.town ||
                        address.municipality ||
                        address.village ||
                        address.county ||
                        "Location found";

                    const province = address.state ? `, ${address.state}` : "";
                    const country = address.country ? `, ${address.country}` : "";

                    userLocation.innerHTML = `<strong>📍 Your Location:</strong><br>${locationName}${province}${country}`;
                })
                .catch(() => {
                    userLocation.innerHTML = "<strong>📍 Your Location:</strong><br>Location found, but name unavailable.";
                });

                // Haversine Formula for Distance Calculation
                const R = 6371; // Earth's radius in km
                const toRad = degree => degree * Math.PI / 180;

                const dLat = toRad(schoolLat - userLat);
                const dLon = toRad(schoolLon - userLon);

                const a =
                    Math.sin(dLat / 2) ** 2 +
                    Math.cos(toRad(userLat)) *
                    Math.cos(toRad(schoolLat)) *
                    Math.sin(dLon / 2) ** 2;

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
                const distance = R * c;

                distanceText.innerHTML = `<strong>📏 Distance from School:</strong><br>${distance.toFixed(2)} km`;
            },
            function (error) {
                userLocation.innerHTML = "<strong>📍 Your Location:</strong><br>Unable to access your location.";
                distanceText.innerHTML = "<strong>📏 Distance from School:</strong><br>Unable to calculate distance.";
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}