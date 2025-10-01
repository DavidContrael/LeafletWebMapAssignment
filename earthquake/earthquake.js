
var map = L.map('map').setView([38, -95], 4);

// Base map
var basemapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(basemapUrl, {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Layer groups

var earthquakeLayer = L.layerGroup();
var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
$.getJSON(earthquakeUrl, function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            var mag = feature.properties.mag;
            var color = mag > 5 ? 'red' :
                        mag > 3 ? 'orange' :
                        mag > 1 ? 'yellow' : 'green';
            var radius = mag * 4;
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
                "<b>Magnitude:</b> " + feature.properties.mag + "<br>" +
                "<b>Location:</b> " + feature.properties.place + "<br>" +
                "<b>Time:</b> " + time
            );
        }
    }).addTo(earthquakeLayer);

    earthquakeLayer.addTo(map);

    // Add legend for earthquakes
    var eqLegend = L.control({ position: 'bottomright' });
    eqLegend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'legend');
        var grades = [0, 1, 3, 5];
        var colors = ['green', 'yellow', 'orange', 'red'];
        var labels = [];
        for (var i = 0; i < grades.length; i++) {
            var from = grades[i];
            var to = grades[i + 1];
            labels.push(
                '<i style="background:' + colors[i] + '"></i> ' +
                from + (to ? '&ndash;' + to : '+')
            );
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    eqLegend.addTo(map);
});
