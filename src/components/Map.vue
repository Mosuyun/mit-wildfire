<template>
  <div id="map">test</div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
const mapboxToken =
  'pk.eyJ1IjoibW9zdXl1biIsImEiOiJjazMxYnZ5Y3UwN201M2RvazN3OXI2MWU0In0.ZF9801IzUETje05jGnrE7w'

export default {
  name: 'Map',
  data() {
    return {
      map: null,
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap: function () {
      console.log('start')
      mapboxgl.accessToken = mapboxToken
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-119.32302, 37.40631],
        zoom: 5.82,
        pitch: 45.0,
        bearing: 0.0,
      })
      this.nav = new mapboxgl.NavigationControl()
      this.map.addControl(this.nav)
      this.map.on('click', this.mapClickEvent)
    },
    mapClickEvent: function (e) {
      console.log('经纬度是', e.lngLat)
    },
  },
}
</script>

<style>
#map {
  width: 1000px;
  height: 500px;
  background-color: blueviolet;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
