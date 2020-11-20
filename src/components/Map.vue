<template>
  <div id="map" />
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
        //center: [-74.5447, 40.6892],
        zoom: 5.82,
        //pitch: 45.0,
        //bearing: 0.0,
      })
      this.nav = new mapboxgl.NavigationControl()
      this.map.addControl(this.nav)
      this.map.on('click', this.mapClickEvent)
      this.map.on('load', () => {
        this.map.addSource('wms-test-source', {
          type: 'raster',
          // use the tiles option to specify a WMS tile source URL
          // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
          tiles: [
            'https://firms.modaps.eosdis.nasa.gov/wms/key/087ff567715d6be09e3fda9d4b8c9599/?REQUEST=GetMap&layers=fires_modis_24&WIDTH=1024&HEIGHT=512&BBOX=-180,-90,180,90&src=EPSG:3857',
            //'https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015',
          ],
          //tileSize: 256,
        })
        this.map.addLayer(
          {
            id: 'wms-test-layer',
            type: 'raster',
            source: 'wms-test-source',
            paint: {},
          },
          'aeroway-line'
        )
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
