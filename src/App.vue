<template>
  <div id="nav">
    <router-link to="/"> Fire Map </router-link> |
    <router-link to="/about"> About </router-link>
  </div>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: right;
  vertical-align: middle;
  color: #2c3e50;
}

#nav {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 3%;
  margin: 0px;
  background-color: rgba(161, 233, 238, 0.685);

  a {
    font-weight: bold;
    font-size: 18px;
    color: #494b4d;
    margin-left: 10px;
    margin-right: 10px;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
