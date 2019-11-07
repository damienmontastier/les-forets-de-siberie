<template>
  <div id="app">
    <router-view />
    <WebGLScene v-if="isMobile" />
    <div v-else id="mobile">
      <div>You're not on mobile</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import WebGLScene from '@/components/WebGLScene'

import Events from '@/plugins/events.js'

import { isMobile } from 'mobile-device-detect'

export default {
  name: 'app',
  data() {
    return {
      isMobile: isMobile
    }
  },
  components: {
    WebGLScene
  },
<<<<<<< HEAD
  created() {
  }
=======
  created() {}
>>>>>>> 3f864eec5dc200554ef2382103d166dae201b4fc
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
