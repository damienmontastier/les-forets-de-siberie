<template>
  <div id="app">
    <router-view />
    <WebGLScene />
    <!-- <div v-else id="mobile">
      <div>You're not on mobile</div>
    </div>-->
  </div>
</template>

<script>
import Vue from 'vue'
import WebGLScene from '@/components/WebGLScene'
import Events from '@/plugins/events.js'
import { isMobile } from 'mobile-device-detect'

export default {
  name: 'app',
  mounted() {
    //window.addEventListener('click', this.openFullscreen.bind(this))
  },
  data() {
    return {
      isMobile: isMobile,
    }
  },
  methods: {
    openFullscreen() {
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen()
      } else if (document.body.mozRequestFullScreen) {
        /* Firefox */
        document.body.mozRequestFullScreen()
      } else if (document.body.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        document.body.webkitRequestFullscreen()
      } else if (document.body.msRequestFullscreen) {
        /* IE/Edge */
        document.body.msRequestFullscreen()
      }
    },
  },
  components: {
    WebGLScene,
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
