var map = L.map('map').setView([38, -95], 4);
var basemapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(basemapUrl, {attribution: '&copy; <a href="http://' + 'www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);

//add earthquake data from USGS (https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)
var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';        

$.getJSON(earthquakeUrl, function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            var mag = feature.properties.mag;
            var color = magnitude > 5 ? 'red' :
                        magnitude > 3 ? 'orange' :
                        magnitude > 1 ? 'yellow' : 'green'; 
            var radius = magnitude * 4;

            return L.circleMarker(latlng, {
                radius: radius,
                fillColor: color,   
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            var time = new Date(feature.properties.time).toLocaleString();
            layer.bindPopup(
                "<b>Magnitude:</b> ">  + feature.properties.place + '<br><strong>Magnitude:</strong> ' + feature.properties.mag + "<br>" +
                "<b>Location:</b> " + feature.properties.place + "<br>" +
                "<b>Time:</b> " + time + "<br>" +
            );
        }
    }).addTo(map);