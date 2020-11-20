<template>
  <div id="app">
    <mymap />
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import mymap from 'components/Map.vue'

export default {
  name: 'App',
  components: {
    mymap,
  },
}
</script>

<style>
@import 'assets/css/base.css';
#app {
  width: 1000px;
  height: 500px;
}
</style>