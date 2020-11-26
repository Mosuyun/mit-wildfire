<template>
  <div id="map">
    <div class="timeline">
      <div class="slider">
        <vue-slider
          id="slider"
          v-model="value"
          :data="date"
          :absorb="true"
          :tooltip="'always'"
          :use-keyboard="true"
          :marks="true"
          :enable-cross="false"
          style="width: 80vw"
          @drag-end="filter(value)"
        >
          <template #dot>
            <img :src="'./fire.png'" class="custom-dot" style="width: 25px" />
          </template>
        </vue-slider>
      </div>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import VueSlider from 'vue-slider-component'

const mapboxToken =
  'pk.eyJ1IjoibW9zdXl1biIsImEiOiJjazMxYnZ5Y3UwN201M2RvazN3OXI2MWU0In0.ZF9801IzUETje05jGnrE7w'

export default {
  name: 'Map',
  components: {
    VueSlider,
  },
  data() {
    return {
      map: null,
      value: '2020-09-01',
      /*marks: {
        '2020-09-01': '2020-09-01',
        '2020-10-01': '2020-10-01',
      },*/
      date: [],
      interval: null,
      intervalState: false,
    }
  },
  mounted() {
    this.initMap()
    this.initDate()
  },
  methods: {
    initMap: function () {
      console.log('start')
      mapboxgl.accessToken = mapboxToken
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
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
        /*this.map.addSource('firepoints', {
          type: 'geojson',
          data: './data/fire_nrt_M6_167051.geojson',
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
        })*/

        // 加载火点图和热力图
        var j, tempDate, sourseName, data, layerHeat, layerPoint, fireSourse
        var map = this.map
        // 2020.9
        for (j = 1; j < 10; j++) {
          tempDate = '2020-09-0' + j
          layerHeat = 'fireMap' + tempDate
          layerPoint = 'firePoint' + tempDate
          sourseName = 'wildfires' + tempDate
          fireSourse = 'firepoints' + tempDate
          data = './data/' + tempDate + '.geojson'
          this.$options.methods.buildFireMap(
            sourseName,
            data,
            layerHeat,
            layerPoint,
            fireSourse,
            map
          )
        }
        console.log(j)
        for (j = 10; j < 31; j++) {
          console.log('enter')
          tempDate = '2020-09-' + j
          layerHeat = 'fireMap' + tempDate
          layerPoint = 'firePoint' + tempDate
          sourseName = 'wildfires' + tempDate
          fireSourse = 'firepoints' + tempDate
          data = './data/' + tempDate + '.geojson'
          console.log(tempDate)
          this.$options.methods.buildFireMap(
            sourseName,
            data,
            layerHeat,
            layerPoint,
            fireSourse,
            map
          )
        }
        console.log('out')
        tempDate = '2020-10-01'
        layerHeat = 'fireMap' + tempDate
        layerPoint = 'firePoint' + tempDate
        sourseName = 'wildfires' + tempDate
        fireSourse = 'firepoints' + tempDate
        data = './data/' + tempDate + '.geojson'
        console.log(tempDate)
        this.$options.methods.buildFireMap(
          sourseName,
          data,
          layerHeat,
          layerPoint,
          fireSourse,
          map
        )
        alert('loaded')
      })
    },
    buildFireMap: function (
      sourseName,
      data,
      layerHeat,
      layerPoint,
      fireSourse,
      map
    ) {
      map.addSource(sourseName, {
        type: 'geojson',
        data: data,
      })

      // 热力图图层
      map.addLayer(
        {
          id: layerHeat,
          type: 'heatmap',
          source: sourseName,
          maxzoom: 9,
          paint: {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              0,
              0,
              6,
              1,
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              1,
              9,
              3,
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(33,102,172,0)',
              0.2,
              'rgb(103,169,207)',
              0.4,
              'rgb(209,229,240)',
              0.6,
              'rgb(253,219,199)',
              0.8,
              'rgb(239,138,98)',
              1,
              'rgb(178,24,43)',
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              2,
              9,
              20,
            ],
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              1,
              9,
              0,
            ],
          },
        },
        'waterway-label'
      )

      console.log(layerHeat)
      map.setLayoutProperty(layerHeat, 'visibility', 'none')

      // 散点图图层
      map.addSource(fireSourse, {
        type: 'geojson',
        data: data,
      })

      map.addLayer(
        {
          id: layerPoint,
          type: 'symbol',
          source: fireSourse,
          layout: {
            'icon-image': 'fire',
            'icon-allow-overlap': true,
            'icon-size': 0.05,
          },
        },
        'waterway-label'
      )

      // 悬浮显示信息窗
      var popupTime = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      })
      map.on('mouseenter', layerPoint, (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer'

        /* var dayOrnight
        if (e.features[0].properties.daynight.match('D')) {
          dayOrnight = 'Day'
        } else {
          dayOrnight = 'Night'
        } */

        var coordinates = e.features[0].geometry.coordinates.slice()
        var description =
          'Brightness: ' +
          e.features[0].properties.brightness +
          '</br>' +
          /* 'Date: ' +
          e.features[0].properties.acq_date +
          '</br>' +
          'time: ' +
          dayOrnight +
          '</br>' + */
          'Instrument: ' +
          e.features[0].properties.instrument

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popupTime.setLngLat(coordinates).setHTML(description).addTo(map)
      })

      map.on('mouseleave', layerPoint, () => {
        map.getCanvas().style.cursor = ''
        popupTime.remove()
      })
    },
    initDate: function () {
      var dateList = []
      var j, tempDate
      // 2020.9
      for (j = 1; j < 10; j++) {
        tempDate = '2020-09-0' + j
        dateList.push(tempDate)
      }
      for (j = 10; j < 31; j++) {
        tempDate = '2019-09-' + j
        dateList.push(tempDate)
      }
      dateList.push('2020-10-01')
      this.date = dateList
      console.log('datelist:')
      console.log(this.date)
    },
    filter: function (value) {
      console.log(this.value)
      console.log(value)
      var layers = this.map.getStyle().layers
      var i, layerHeat, layerPoint
      // 关闭已打开火点图
      for (i = 0; i < layers.length; i++) {
        if (layers[i].id.indexOf('fire') > -1) {
          this.map.setLayoutProperty(layers[i].id, 'visibility', 'none')
        }
      }
      //打开选中日期火点图
      layerHeat = 'fireMap' + value
      layerPoint = 'firePoint' + value
      this.map.setLayoutProperty(layerPoint, 'visibility', 'visible')
      this.map.setLayoutProperty(layerHeat, 'visibility', 'visible')
      console.log(layerHeat)
    },
  },
}
</script>

<style lang="scss" scoped>
#map {
  position: fixed;
  width: 100vw;
  height: 100vh;
}
.mapboxgl-popup {
  max-width: 400px;
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
}
.timeline {
  position: absolute;
  bottom: 30px;
  width: 100%;
  left: 100px;
  .slider {
    width: 80%;
    float: left;
    margin-left: 100px;
  }
  .icons-list {
    width: 5%;
    float: left;
    font-size: 24px;
    position: absolute;
    z-index: 100;
  }
}
</style>
