var socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        socket.emit('location', { latitude, longitude });
    },
    (error) => {
        console.log(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0
    });
}

var map = L.map('map').setView([0, 0], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markers = {};

socket.on('receive-loc', (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on('user-disconnect', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
