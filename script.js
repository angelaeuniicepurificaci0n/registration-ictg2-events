/* =========================
   LOADING ANIMATION
========================= */

$(document).ready(function() {

    setTimeout(function() {

        $("#loader").fadeOut();

    }, 600);

});


/* =========================
   JQUERY HIDE / SHOW
========================= */

$(document).ready(function() {

    $(".logo").click(function() {

        $(".logo p").toggle();

    });

});


function toggleMenu() {

    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    menu.classList.toggle("open");
    overlay.classList.toggle("show");
}

function closeMenu() {

    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    menu.classList.remove("open");
    overlay.classList.remove("show");
}

// LOCATION CHECKER
const locationButton = document.getElementById("locationButton");

if (locationButton) {

    locationButton.addEventListener("click", function () {

        const userLocation = document.getElementById("userLocation");
        const distanceText = document.getElementById("distance");

        userLocation.innerHTML =
            "<strong>📍 Your Location:</strong><br>Finding your location...";

        distanceText.innerHTML =
            "<strong>📏 Distance from School:</strong><br>Calculating...";

        navigator.geolocation.getCurrentPosition(
            function (position) {

                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                // ASKI Skills and Knowledge Institute
                // Sampaloc, Talavera, Nueva Ecija
                const schoolLat = 15.58;
                const schoolLon = 120.92;

                // Get the user's location name
                fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLon}&format=json`
                )
                .then(response => response.json())
                .then(data => {

                    const address = data.address;

                    const locationName =
                        address.city ||
                        address.town ||
                        address.municipality ||
                        address.village ||
                        address.county ||
                        "Location found";

                    const province =
                        address.state || "";

                    const country =
                        address.country || "";

                    userLocation.innerHTML =
                        "<strong>📍 Your Location:</strong><br>" +
                        locationName + ", " +
                        province + ", " +
                        country;

                })
                .catch(() => {

                    userLocation.innerHTML =
                        "<strong>📍 Your Location:</strong><br>" +
                        "Location found, but name unavailable.";

                });

                // Calculate distance
                const R = 6371;

                const toRad = degree => degree * Math.PI / 180;

                const dLat = toRad(schoolLat - userLat);
                const dLon = toRad(schoolLon - userLon);

                const a =
                    Math.sin(dLat / 2) ** 2 +
                    Math.cos(toRad(userLat)) *
                    Math.cos(toRad(schoolLat)) *
                    Math.sin(dLon / 2) ** 2;

                const c =
                    2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                    );

                const distance = R * c;

                distanceText.innerHTML =
                    "<strong>📏 Distance from School:</strong><br>" +
                    distance.toFixed(2) + " km";

            },

            function () {

                userLocation.innerHTML =
                    "<strong>📍 Your Location:</strong><br>" +
                    "Unable to access your location.";

                distanceText.innerHTML =
                    "<strong>📏 Distance from School:</strong><br>" +
                    "Unable to calculate distance.";

            }
        );

    });

}