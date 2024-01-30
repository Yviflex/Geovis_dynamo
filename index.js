var mymap = L.map('map').setView([46.8, 8.3], 8);

// Limiter la carte au campus de l'UNIL:
mymap.setMaxBounds([[44.78, 1.04], [48.71, 15.63]]);
mymap.setMinZoom(6);

// Définir les différentes couches de base:
var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
});
var esriWorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
});
// var esriImagery = L.tileLayer(
//   'http://map.geo.admin.ch/?layers=ch.swisstopo.geologie-gesteinsdichte', {
//     attribution: '&copy; <a href="http://www.esri.com">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//   }
// );

// Ajouter la couche de base par défaut à la carte.
osmLayer.addTo(mymap);

//ajouter les géométrie d'origine des roches
// L.geoJSON(geo500).addTo(mymap);

// Styliser

var grpRocStyles = {
  "1": { "color": "#f5f7d6", "fillOpacity": 0.8, "weight": 0 },
  "2": { "color": "#c6dce1", "fillOpacity": 0.8, "weight": 0 },
  "3": { "color": "#edc6b2", "fillOpacity": 0.8, "weight": 0 },
  "4": { "color": "#e9f8f6", "fillOpacity": 0.8, "weight": 0 },
  "5": { "color": "#ffffff", "fillOpacity": 0.8, "weight": 0 },
};

var geo500Styles = {
  "1": { "color": "#f6f684", "fillOpacity": 0.6, "weight": 0 },
  "2": { "color": "#9f7a54", "fillOpacity": 0.6, "weight": 0 },
  "3": { "color": "#8ab1fe", "fillOpacity": 0.6, "weight": 0 },
  "4": { "color": "#3eb13f", "fillOpacity": 0.6, "weight": 0 },
  "5": { "color": "#eda256", "fillOpacity": 0.6, "weight": 0 },
  "6": { "color": "#eac658", "fillOpacity": 0.6, "weight": 0 },
  "7": { "color": "#f6a9a9", "fillOpacity": 0.6, "weight": 0 },
  "9": { "color": "#ffffff", "fillOpacity": 0.6, "weight": 0 },
  "8": { "color": "#e9f8f6", "fillOpacity": 0.6, "weight": 0 }
};

//couche age de la roche

var ageRocStyles = {
  "Quaternaire": { "color": "#8dd3c7", "fillOpacity": 0.7, "weight": 0 },
  "Tertiaire": { "color": "#ffffb3", "fillOpacity": 0.7, "weight": 0 },
  "Permo - Cretace": { "color": "#bebada", "fillOpacity": 0.7, "weight": 0 },
  "Cretace": { "color": "#fb8072", "fillOpacity": 0.7, "weight": 0 },
  "Jurassique": { "color": "#80b1d3", "fillOpacity": 0.7, "weight": 0 },
  "Trias": { "color": "#fdb462", "fillOpacity": 0.7, "weight": 0 },
  "Permien": { "color": "#b3de69", "fillOpacity": 0.7, "weight": 0 },
  "Carbonifere": { "color": "#fccde5", "fillOpacity": 0.7, "weight": 0 },
  "Devonien": { "color": "#bc80bd", "fillOpacity": 0.7, "weight": 0 },
  "Paleozoique inferieur": { "color": "#ccebc5", "fillOpacity": 0.7, "weight": 0 },
  "null": { "color": "#d9d9d9", "fillOpacity": 0.7, "weight": 0 },

};
// Créer une couche groupée pour stocker les géométries
var geoLayerGroup = L.layerGroup();
var grpRocLayer = L.layerGroup();
var ageRocLayer = L.layerGroup();

// Chaque géométrie
geo500.features.forEach(function (feature) {
  var nrGenese = feature.properties.NR_GENESE;
  var geoStyle = geo500Styles[nrGenese] || { "color": "#000000", "fillOpacity": 0.7, "weight": 0 };

  // Ajouter la géométrie à la couche groupée
  var geoJSONLayer = L.geoJSON(feature, geoStyle);
  geoJSONLayer.addTo(geoLayerGroup);
});
// grpRoc
grpRoc.features.forEach(function (feature) {
  var nrKlass = feature.properties.NR_KLASS;
  var rocStyle = grpRocStyles[nrKlass] || { "color": "#000000", "fillOpacity": 0.7, "weight": 0 };

  // Ajouter la géométrie à la couche groupée
  var geoJSONLayer = L.geoJSON(feature, rocStyle);
  geoJSONLayer.addTo(grpRocLayer);
});

// pour ageRoc
ageRoc.features.forEach(function (feature) {
  var nrTime = feature.properties.PERIODE;
  var ageStyle = ageRocStyles[nrTime] || { "color": "#000000", "fillOpacity": 0.7, "weight": 0 };

  // Ajouter la géométrie à la couche groupée
  var geoJSONLayer = L.geoJSON(feature, ageStyle);
  geoJSONLayer.addTo(ageRocLayer);
});

// Créer les boutons pour changer la couche de base
var baseLayers = {
    "ESRI WorldGrayCanvas": esriWorldGrayCanvas,
    "OpenStreetMap": osmLayer,
    
  };
  var overlays = {
      "Origine des roches 500": geoLayerGroup,
      "Groupes des roches 500": grpRocLayer,
      "Periode géologique": ageRocLayer,
  };
  L.control.layers(baseLayers, overlays).addTo(mymap);

// Créer les icônes pour nos marqueurs
var icones = {};

icones['Sauropode'] = L.icon({
  iconUrl: 'icons_map/sauropod_silhouette.svg',
  iconSize: [120, 176], // Augmentation de la taille proportionnellement
  iconAnchor: [50, 75],  // Ajustement du point d'ancrage pour maintenir la position
  popupAnchor: [0, 0]
});
icones['Empreintes de Sauropodes'] = L.icon({
  iconUrl: 'icons_map/sauropode_footprint.svg',
  iconSize: [120, 180],
  iconAnchor:   [58, 65],
  popupAnchor:  [0, 0]
});
icones['Plateosaurus'] = L.icon({
  iconUrl: 'icons_map/plateosaurus_silhouette.svg',
  iconSize: [60, 90],
  iconAnchor:   [21, 30],
  popupAnchor:  [0, 0]
});
icones['Empreintes de Prosauropodes'] = L.icon({
  iconUrl: 'icons_map/prosauropode_footprint.svg',
  iconSize: [42, 62],
  iconAnchor:   [30, 45],
  popupAnchor:  [0, 0]
});
icones['Stegosaurus'] = L.icon({
  iconUrl: 'icons_map/stegosaurus_silhouette.svg',
  iconSize: [42, 62],
  iconAnchor:   [21, 30],
  popupAnchor:  [0, 0]
});
icones['Theropode'] = L.icon({
  iconUrl: 'icons_map/theropod_silhouette.svg',
  iconSize: [87, 123],
  iconAnchor:   [21, 60],
  popupAnchor:  [0, 0]
});
icones['Empreintes de Theropodes'] = L.icon({
  iconUrl: 'icons_map/theropod_footprint.svg',
  iconSize: [54, 76],
  iconAnchor:   [30, 30],
  popupAnchor:  [0, 0]
});
icones["Empreintes d'Iguanodon"] = L.icon({
  iconUrl: 'icons_map/iguanodon_footprint.svg',
  iconSize: [54, 76],
  iconAnchor:   [30, 30],
  popupAnchor:  [0, 0]
});

// Créer les icônes en état désactivé
// pour nos marqueurs
var icones_desactivees = {};

icones_desactivees['Sauropode'] = L.icon({
  iconUrl: 'icons_map/sauropod_silhouette_noselect.svg',
  iconSize: [84, 123],
  iconAnchor:   [33, 50],
  popupAnchor:  [0, 0]
});
icones_desactivees['Empreintes de Sauropodes'] = L.icon({
  iconUrl: 'icons_map/sauropode_footprint_noselect.svg',
  iconSize: [70, 103],
  iconAnchor:   [30, 40],
  popupAnchor:  [0, 0]
});
icones_desactivees['Plateosaurus'] = L.icon({
  iconUrl: 'icons_map/plateosaurus_silhouette_noselect.svg',
  iconSize: [42, 61],
  iconAnchor:   [14, 20],
  popupAnchor:  [0, 0]
});
icones_desactivees['Empreintes de Prosauropodes'] = L.icon({
  iconUrl: 'icons_map/prosauropode_footprint_noselect.svg',
  iconSize: [28, 41],
  iconAnchor:   [20, 30],
  popupAnchor:  [0, 0]
});
icones_desactivees['Stegosaurus'] = L.icon({
  iconUrl: 'icons_map/stegosaurus_silhouette_noselect.svg',
  iconSize: [84, 126],
  iconAnchor:   [42, 60],
  popupAnchor:  [0, 0]
});
icones_desactivees['Theropode'] = L.icon({
  iconUrl: 'icons_map/theropod_silhouette_noselect.svg',
  iconSize: [56, 82],
  iconAnchor:   [14, 40],
  popupAnchor:  [0, 0]
});
icones_desactivees['Empreintes de Theropodes'] = L.icon({
  iconUrl: 'icons_map/theropod_footprint_noselect.svg',
  iconSize: [35, 51],
  iconAnchor:   [20, 20],
  popupAnchor:  [0, 0]
});
icones_desactivees["Empreintes d'Iguanodon"] = L.icon({
  iconUrl: 'icons_map/iguanodon_footprint_noselect.svg',
  iconSize: [35, 51],
  iconAnchor:   [20, 20],
  popupAnchor:  [0, 0]
});

// Créer les icônes en état activé
// pour nos marqueurs
var icones_sel = {};

icones_sel['Sauropode'] = L.icon({
  iconUrl: 'icons_map/sauropod_silhouette.svg',
  iconSize: [126, 185],
  iconAnchor:   [49, 75],
  popupAnchor:  [0, 0]
});
icones_sel['Empreintes de Sauropodes'] = L.icon({
  iconUrl: 'icons_map/sauropode_footprint.svg',
  iconSize: [105, 153],
  iconAnchor:   [45, 60],
  popupAnchor:  [0, 0]
});
icones_sel['Plateosaurus'] = L.icon({
  iconUrl: 'icons_map/plateosaurus_silhouette.svg',
  iconSize: [63, 92],
  iconAnchor:   [21, 30],
  popupAnchor:  [0, 0]
});
icones_sel['Empreintes de Prosauropodes'] = L.icon({
  iconUrl: 'icons_map/prosauropode_footprint.svg',
  iconSize: [42, 62],
  iconAnchor:   [30, 45],
  popupAnchor:  [0, 0]
});
icones_sel['Stegosaurus'] = L.icon({
  iconUrl: 'icons_map/stegosaurus_silhouette.svg',
  iconSize: [126, 190],
  iconAnchor:   [63, 90],
  popupAnchor:  [0, 0]
});
icones_sel['Theropode'] = L.icon({
  iconUrl: 'icons_map/theropod_silhouette.svg',
  iconSize: [84, 123],
  iconAnchor:   [21, 60],
  popupAnchor:  [0, 0]
});
icones_sel['Empreintes de Theropodes'] = L.icon({
  iconUrl: 'icons_map/theropod_footprint.svg',
  iconSize: [51, 75],
  iconAnchor:   [30, 30],
  popupAnchor:  [0, 0]
});
icones_sel["Empreintes d'Iguanodon"] = L.icon({
  iconUrl: 'icons_map/iguanodon_footprint.svg',
  iconSize: [51, 75],
  iconAnchor:   [30, 20],
  popupAnchor:  [0, 0]
});

// Ajouter les points of interest
for (var k in pois.features){
  var poi = pois.features[k];
//   var iconeMarqueur = icones['vert'];
//   if (bati.icone == 'rouge' || bati.icone == 'bleu') {
//     iconeMarqueur = icones[bati.icone];
//   }
  var icone_marqueur = icones[poi.properties.type];

  var marqueur = L.marker(
    [poi.geometry.coordinates[1],poi.geometry.coordinates[0]]
    ,{icon: icone_marqueur}
    ).addTo(mymap);
  poi.marqueur = marqueur;
  
  marqueur.bindPopup("<b>" + poi.properties.nom + "</b><br>" + poi.properties.ville + " " + "(" + poi.properties.canton + ")<br>");
};

// fonction pour changer nos icones
// de couleurs en cliquant dessus
// en cliquant sur une autre icone
// l'icones précédente revient
// à sa couleur d'origine
function change_info(j){
  var dessins = document.querySelectorAll('.tracks path')
  for (var i=0;i < dessins.length;i++){
    dessins[i].setAttribute('fill','#131212')
  }
  var el = document.getElementById('dino'+j)
  el.setAttribute('fill','#00919c')

  var info_dino=info[j-1]
  document.querySelector('.info_track').innerHTML=info_dino

  for (var k in pois.features){
    var poi = pois.features[k];
    var type_poi = poi.properties.type;
    var icone_marqueur = icones[type_poi];
    if (poi.properties.no != j){
      icone_marqueur = icones_desactivees[type_poi];
    }
    poi.marqueur.setIcon(icone_marqueur);
  }
}


//#131212