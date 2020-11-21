<template>
  <div id="map" />
</template>

<script>
import mapboxgl from 'mapbox-gl'
//import firedata from './public/fire_nrt_M6_167051.geojson'
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
      })
      this.nav = new mapboxgl.NavigationControl()
      this.map.addControl(this.nav)
      this.map.on('click', this.mapClickEvent)
      this.map.on('load', () => {
        this.map.loadImage('./fire.png', (error, image) => {
          if (error) throw error

          this.map.addImage('fire', image)
        })
        this.map.addSource('firepoints', {
          type: 'geojson',
          data: './fire_nrt_M6_167051.geojson',
        })
        this.map.addLayer({
          id: 'firepoints',
          type: 'symbol',
          source: 'firepoints',
          layout: {
            'icon-image': 'fire',
            // get the title name from the source's "title" property
            'text-offset': [0, 1.25],
            'text-anchor': 'top',
            'icon-size': 0.05,
          },
        })
      })
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
