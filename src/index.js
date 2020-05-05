import { getGlobalData } from "./globalData.js";

// add comas to larger numbers
const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

// sort countries by cases; add them to DOM
const getSortedCountries = async () => {
  const markers = [];
  const res = await fetch(`https://corona.lmao.ninja/v2/countries?sort=cases`);
  const data = await res.json();
  data.map((country) => {
    markers.push([
      country.countryInfo.lat,
      country.countryInfo.long,
      country.countryInfo.flag,
      country.country,
      country.cases,
      country.todayCases,
      country.deaths,
      country.todayDeaths,
      country.recovered,
    ]);
  });

  for (var i = 0; i < markers.length; i++) {
    const lat = markers[i][0];
    const lon = markers[i][1];
    const countryFlag = markers[i][2];
    const countryName = markers[i][3];
    const countryCases = markers[i][4];
    const countryCasesToday = markers[i][5];
    const countryDeaths = markers[i][6];
    const countryDeathsToday = markers[i][7];

    // dislay/style popup text
    const popupText = `<div class="popup">
    <img src=${countryFlag} alt="country-flag"/>        
    <h3>${countryName}</h3>
    <hr />
    <div class="popup-cases">${formatNumber(countryCases)} Cases
    <div class="popup-cases data-today">
    +${formatNumber(countryCasesToday)} Cases Today
    </div>
    </div>
    <hr />
    <div class="popup-deaths">
    ${formatNumber(countryDeaths)} Deaths
    <div class="popup-deaths data-today">
    +${formatNumber(countryDeathsToday)} Deaths Today
    </div>
    </div>
    </div>`;

    // dynamic circlemarker sizes
    const markerLocation = new L.LatLng(lat, lon);
    const marker = new L.circleMarker(markerLocation, {
      color: "#D51F1F",
      fillColor: "#ED7D70",
      radius:
        countryCases > 100000
          ? 60
          : countryCases > 50000
          ? 40
          : countryCases > 20000
          ? 20
          : countryCases > 10000
          ? 15
          : countryCases > 5000
          ? 10
          : countryCases > 1000
          ? 9
          : countryCases > 500
          ? 8
          : countryCases > 100
          ? 7
          : countryCases > 50
          ? 5
          : 3,
    });
    map.addLayer(marker);

    marker.bindPopup(popupText);
  }
};

const getSortedPostions = async () => {
  const res = await fetch(`https://corona.lmao.ninja/v2/countries?sort=cases`);
  const data = await res.json();
  data.map((country) => {
    // display/style each individual sorted country
    let countryName = document.createElement("div");
    countryName.id = "sorted-countries-style";
    countryName.innerHTML = `<span class="sorted-countries-name">${
      country.country
    }</span>- 
    <span class="sorted-countries-cases">${formatNumber(country.cases)}</span> 
    <span id="sorted-countries-lat">${[country.countryInfo.lat]}</span>
    <span id="sorted-countries-lon">${[country.countryInfo.long]}</span>
    
    `;
    // change map postion to country coords when an individual sorted country is clicked
    countryName.onclick = function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
      map.setView(
        new L.LatLng(country.countryInfo.lat, country.countryInfo.long),
        window.innerWidth < 514 ? 5 : 6
      );
    };
    document
      .getElementById("sorted-countries-country")
      .appendChild(countryName);
  });
};

// leaflet map variable & configuration
var map = L.map("mapid", {
  maxZoom: 18,
  minZoom: 2,
  maxBounds: [
    [-100, -Infinity],
    [100, Infinity],
  ],
  worldCopyJump: true,
}).setView([30.751278, -32.613858], 2);

//map layer
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution:
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  subdomains: ["a", "b", "c"],
}).addTo(map);

getGlobalData();
getSortedCountries();
getSortedPostions();
