let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
d3.json(url).then(function(data) {
    console.log(data.features);
    earthquakeFeatures(data.features);
  
  function markersize(magnitude) {
    return magnitude* 3.5;
  }

  function markerbold(depth) {
    if (depth < 2) return "#ffff00";
    else if (depth >=2 && depth < 6 ) return "#ccff33";
    else if (depth >=6 && depth < 10) return "#99ff33";
    else if (depth >=10 && depth < 14) return "#33cc33";
    else if (depth >= 14 && depth <60) return "#339933";
    else if (depth >= 60) return "#003300";
  }
function earthquakeFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Alert Category:${feature.properties.alert}, Magnitude:${feature.properties.mag}</p>`);
    }
  
    let earthquakes = L.geoJSON(earthquakeData,
      {onEachFeature: onEachFeature, pointToLayer (feature, earthquakeData){
        return L.circleMarker(earthquakeData, 
          {radius: markersize(feature.properties.mag),
            color: markerbold(feature.geometry.coordinates[2]),
            weight: 2,
            opacity: 1
        })},
      })

    createMap(earthquakes);
  }

  function createMap(earthquakes) {

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
;
    let baseMaps = {
      "Street Map": street
    };

    let overlayMaps = {
      Earthquakes: earthquakes,
  
    };

    let myMap = L.map("map", {
      center: [
        30.4280, 9.5925
      ],
      zoom: 2,
      layers: [street, earthquakes]
    });
    var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          depthval = [0,2,6,10,14,60,],
          labels = [];
      for (var i = 0; i < depthval.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerbold(depthval[i] + 1) + '"></i> ' +
              depthval[i] + (depthval[i + 1] ? '&ndash;' + depthval[i + 1] + '<br>' : '+');
      }
      return div;
  };
  legend.addTo(myMap);
  }
  });
  
  
