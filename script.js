let map;
let marker;
let geocoder;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: 33.027968, lng: 73.6010478 },
        mapTypeControl: false,
    });

    geocoder = new google.maps.Geocoder();

    // Create UI elements
    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "Enter a location";

    const submitButton = document.createElement("input");
    submitButton.type = "button";
    submitButton.value = "Geocode";
    submitButton.classList.add("button", "button-primary");

    const locationButton = document.createElement("button");

    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    
    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    marker.setPosition(pos);
                    marker.setMap(map);
                    map.setCenter(pos);
                },
                () => {
                    handleLocationError(true, map.getCenter());
                },
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, map.getCenter());
        }
    });

    // Add UI elements to map
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    // Initialize the marker
    marker = new google.maps.Marker({ map });

    // Add event listeners
    map.addListener("click", async (e) => {
        await geocode({ location: e.latLng });
    });

    submitButton.addEventListener("click", async () => {
        if (inputText.value) {
            await geocode({ address: inputText.value });
        } else {
            alert("Please enter a location.");
        }
    });
}

function myFunction(loc, lat, lng, boundsMessage) {
    let text = "Do want to proceed";
    if (confirm(text) == true) {

        window.location.href = `display.html?data1=${encodeURIComponent(loc)}&data2=${encodeURIComponent(lat)}&data3=${encodeURIComponent(lng)}&data4=${encodeURIComponent(boundsMessage)}`;
    } else {

        console.log("You canceled!")
    }
}
// Geocoding function with async/await
async function geocode(request) {
    try {
        const result = await geocoder.geocode(request);
        const { results } = result;

        if (results.length > 0) {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            marker.setMap(map);

            // Display response
            const loc = "Location: " + results[0].formatted_address
            const lat = "Latitude: " + results[0].geometry.location.lat()
            const lng = "longitude: " + results[0].geometry.location.lng()
            let boundsMessage = "Bounds: Not available";
            if (results[0].geometry.bounds) {
                const bounds = results[0].geometry.bounds;
                const north = bounds.getNorthEast().lat();
                const east = bounds.getNorthEast().lng();
                const south = bounds.getSouthWest().lat();
                const west = bounds.getSouthWest().lng();

                boundsMessage = `North: ${north}\nEast: ${east}\nSouth: ${south}\nWest: ${west}`;
            }
            myFunction(loc, lat, lng, boundsMessage);
        } else {
            alert("No results found.");
        }
    } catch (error) {
        alert("Geocode was not successful for the following reason: " + error.messsage);
    }
}

window.initMap = initMap;