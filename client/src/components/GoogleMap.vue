<template>
  <div>
    <Navbar />
    <gmap-map :center="center" :zoom="12" style="width:100vw;  height: 100vh;">
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        @click="openInfoWindow(m);"
      ></gmap-marker>

      <gmap-info-window
        v-if="selectedLocation !== null"
        :position="{ lat: parseFloat(selectedLocation.position.lat), lng: parseFloat(selectedLocation.position.lng) }"
        :opened="infoBoxOpen"
        @closeclick="infoBoxOpen = false;"
      >
        <div class="infoWindow" style="width: 300px;">
          <h2 id="infoWindow-location">Device UUID: {{ selectedLocation.title }}</h2>
          <br>
          <h2 id="infoWindow-location">Naslov: {{ selectedLocation.address }}</h2>
          <br>
          <button @click="closeInfoWindow();">Close</button>
        </div>
      </gmap-info-window>
    </gmap-map>
  </div>
</template>

<script>
import Navbar from "./Navbar";
import axios from "axios";
export default {
  name: "GoogleMap",
  components: {
    Navbar
  },
  data() {
    return {
      center: { lat: 46.5547, lng: 15.6459 },
      markers: [],
      places: [],
      currentPlace: null,
      selectedLocation: null,
      infoBoxOpen: false,
    };
  },

  mounted() {
    this.fetchLocations();
    this.geolocate();
  },

  methods: {
    // receives a place object via the autocomplete component
    fetchLocations() {
      axios.get("http://localhost:5000/api/v1/lokacija").then(response => {
        console.log(response);
        response.data.forEach(entry => {
          var name = entry.name == undefined ? entry.uuid : entry.name;
          this.addMarker(
            name,
            parseFloat(entry.latitude),
            parseFloat(entry.longitude),
            entry.address
          );
        });
      });
    },
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker(name, lat, lng, address) {
      const marker = {
        lat: lat,
        lng: lng
      };
      this.markers.push({ position: marker, title: name, address: address });
      this.places.push(this.currentPlace);
      this.center = marker;
      this.currentPlace = null;
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    openInfoWindow(location) {
      this.selectedLocation = location;
      this.infoBoxOpen = true;
    },
    closeInfoWindow() {
      this.infoBoxOpen = false;
    }
  }
};
</script>