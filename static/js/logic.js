var myMap = L.map('map', {
    center: [38.5, -97],
    zoom: 5
});

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

// Getting our GeoJSON data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    
    // console.log(data.features.geometry.coordinates[0], data.features.geometry.coordinates[1]);
    // let latlng = L.latLng(data.features.geometry.coordinates[0], data.features.geometry.coordinates[1]);

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, 
                {radius: feature.properties.mag * 2, 
                 color: 'green',
                 fillColor: getColor(feature.geometry.coordinates[2]),
                 fillOpacity: 1,
                 weight: 1
            }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);;
        }
    }).addTo(myMap);
});

function getColor(depth) {
    if (depth < 10) {
        return '#f5ff00';
    }
    else if (depth>=10 && depth<30) {
        return '#f5cc00';
    }
    else if (depth>=30 && depth<50) {
        return '#f59900';
    }
    else if (depth>=50 && depth<70) {
        return '#f56600';
    }
    else if (depth>=70 && depth<90) {
        return '#f53300';
    }
    else {
        return '#f50000';
    }
}

// Create a legend to display information about our map.
let legend = L.control({position: 'bottomright'});

// When the layer control is added, insert a div with the class of "legend".
legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our magnitude intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
// Add the info legend to the map.
legend.addTo(myMap);

