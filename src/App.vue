<template>
  <div id="app">
    <router-view />
    <WebGLScene />
  </div>
</template>

<script>
import Vue from 'vue'
import WebGLScene from '@/components/WebGLScene'

import Events from '@/plugins/events.js'
Vue.use(Events)

export default {
  name: 'app',
  components: {
    WebGLScene
  },
  created() {
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: $primary;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
