<template>
  <div id="map">
    <div class="timeline">
      <div class="slider">
        <vue-slider
          id="slider"
          v-model="value"
          :v-data="date"
          :absorb="true"
          :tooltip="'always'"
          :use-keyboard="true"
          :marks="marks"
          style="width: 80vw; z-index: 100"
          @drag-end="filter(value)"
        >
          <template #dot>
            <img :src="'./fire.png'" class="custom-dot" style="width: 25px" />
          </template>
        </vue-slider>
      </div>
      <div class="icons-list">
        <left-circle-two-tone style="margin-right: 15px" @click="OpenAll()" />
        <play-circle-two-tone
          v-if="!intervalState"
          style="margin-right: 15px"
          @click="Play()"
        />
        <pause-circle-two-tone
          v-if="intervalState"
          style="margin-right: 15px"
          @click="Pause()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import VueSlider from 'vue-slider-component'
import '@/assets/css/fire.css'

import {
  PlayCircleTwoTone,
  PauseCircleTwoTone,
  LeftCircleTwoTone,
} from '@ant-design/icons-vue'

const mapboxToken =
  'pk.eyJ1IjoibW9zdXl1biIsImEiOiJjazMxYnZ5Y3UwN201M2RvazN3OXI2MWU0In0.ZF9801IzUETje05jGnrE7w'

export default {
  name: 'Map',
  components: {
    VueSlider,
    PlayCircleTwoTone,
    PauseCircleTwoTone,
    LeftCircleTwoTone,
  },
  data: function () {
    return {
      map: null,
      value: '2020-07-31',
      marks: {
        '2020-07-31': '2020-07-31',
        '2020-11-10': '2020-11-10',
      },
      date: [],
      interval: null,
      intervalState: false,
    }
  },
  beforeMount() {
    this.initDate()
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
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [117.97017, -2.49417],
        zoom: 4.87,
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
        for (j = 0; j < 98; j++) {
          tempDate = this.date[j]
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
        // 2020.9
        /*for (j = 1; j < 10; j++) {
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
        )*/
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
      console.log('buildmap' + sourseName)
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
      var popup = new mapboxgl.Popup({
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
          'FRP: ' +
          e.features[0].properties.frp +
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

        console.log(coordinates)

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map)
        console.log(popup.isOpen())
      })

      map.on('mouseleave', layerPoint, () => {
        map.getCanvas().style.cursor = ''
        popup.remove()
      })
    },
    initDate: function () {
      console.log(typeof this.date)
      var dateList = [
        '2020-07-31',
        '2020-08-01',
        '2020-08-02',
        '2020-08-03',
        '2020-08-04',
        '2020-08-05',
        '2020-08-06',
        '2020-08-07',
        '2020-08-08',
        '2020-08-09',
        '2020-08-10',
        '2020-08-11',
        '2020-08-12',
        '2020-08-13',
        '2020-08-14',
        '2020-08-15',
        '2020-08-16',
        '2020-08-17',
        '2020-08-18',
        '2020-08-19',
        '2020-08-20',
        '2020-08-21',
        '2020-08-22',
        '2020-08-23',
        '2020-08-24',
        '2020-08-25',
        '2020-08-28',
        '2020-08-29',
        '2020-08-30',
        '2020-08-31',
        '2020-09-01',
        '2020-09-02',
        '2020-09-03',
        '2020-09-04',
        '2020-09-05',
        '2020-09-06',
        '2020-09-07',
        '2020-09-08',
        '2020-09-09',
        '2020-09-10',
        '2020-09-11',
        '2020-09-12',
        '2020-09-13',
        '2020-09-14',
        '2020-09-15',
        '2020-09-16',
        '2020-09-17',
        '2020-09-18',
        '2020-09-19',
        '2020-09-20',
        '2020-09-21',
        '2020-09-22',
        '2020-09-23',
        '2020-09-24',
        '2020-09-25',
        '2020-09-26',
        '2020-09-27',
        '2020-09-28',
        '2020-09-29',
        '2020-09-30',
        '2020-10-01',
        '2020-10-02',
        '2020-10-03',
        '2020-10-04',
        '2020-10-05',
        '2020-10-06',
        '2020-10-07',
        '2020-10-08',
        '2020-10-09',
        '2020-10-10',
        '2020-10-11',
        '2020-10-12',
        '2020-10-13',
        '2020-10-14',
        '2020-10-15',
        '2020-10-16',
        '2020-10-17',
        '2020-10-18',
        '2020-10-19',
        '2020-10-20',
        '2020-10-21',
        '2020-10-22',
        '2020-10-23',
        '2020-10-24',
        '2020-10-25',
        '2020-10-27',
        '2020-10-28',
        '2020-10-29',
        '2020-10-30',
        '2020-11-01',
        '2020-11-03',
        '2020-11-04',
        '2020-11-05',
        '2020-11-06',
        '2020-11-07',
        '2020-11-08',
        '2020-11-09',
        '2020-11-10',
      ]
      //var j, tempDate
      // 2020.9
      /*for (j = 1; j < 10; j++) {
        tempDate = '2020-09-0' + j
        dateList.push(tempDate)
      }
      for (j = 10; j < 31; j++) {
        tempDate = '2020-09-' + j
        dateList.push(tempDate)
      }
      dateList.push('2020-10-01')
      console.log(typeof this.date)*/
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
    Play: function () {
      var layerPoint, layerHeat, preLayerHeat, preLayerPoint
      if (this.intervalState) {
        clearInterval(this.interval)
      }
      var layers = this.map.getStyle().layers
      // 关闭已打开火点图
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].id.indexOf('fire') > -1) {
          this.map.setLayoutProperty(layers[i].id, 'visibility', 'none')
        }
      }
      var Index = this.date.indexOf(this.value)
      this.intervalState = true
      this.interval = setInterval(() => {
        console.log('loop')
        layerHeat = 'fireMap' + this.date[Index + 1]
        layerPoint = 'firePoint' + this.date[Index + 1]
        preLayerHeat = 'fireMap' + this.date[Index]
        preLayerPoint = 'firePoint' + this.date[Index]
        this.map.setLayoutProperty(preLayerPoint, 'visibility', 'none')
        this.map.setLayoutProperty(preLayerHeat, 'visibility', 'none')
        this.map.setLayoutProperty(layerPoint, 'visibility', 'visible')
        this.map.setLayoutProperty(layerHeat, 'visibility', 'visible')
        Index++
        this.value = this.date[Index]
        console.log(Index)
      }, 50)
    },
    Pause: function () {
      // 停止播放
      var value = this.value
      clearInterval(this.interval)
      this.intervalState = false
      console.log(this.value)
      this.value = value
    },
    OpenAll: function () {
      //打开所有图层
      var layers = this.map.getStyle().layers
      console.log('openall')
      // 关闭已打开火点图及热力图
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].id.indexOf('fire') > -1) {
          this.map.setLayoutProperty(layers[i].id, 'visibility', 'none')
        }
      }
      // 打开所有火点图
      for (i = 0; i < layers.length; i++) {
        if (layers[i].id.indexOf('firePoint') !== -1) {
          console.log(layers[i].id)
          this.map.setLayoutProperty(layers[i].id, 'visibility', 'visible')
        }
      }
      this.value = this.date[0]
    },
  },
}
</script>

<style lang="scss" scoped>
#map {
  position: fixed;
  width: 100%;
  height: 97%;
  top: 3%;
  left: 0px;
}
.mapboxgl-popup {
  max-width: 400px;
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  z-index: 100;
  color: white;
}
.timeline {
  position: absolute;
  bottom: 30px;
  width: 100%;
  left: 100px;
  z-index: 100;
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
