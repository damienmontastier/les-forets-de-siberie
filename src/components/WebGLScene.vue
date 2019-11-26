<template>
  <canvas class="webGLScene"></canvas>
</template>

<script>
import Vue from 'vue'
import WebGL from '@/webGL'
export default {
  name: 'WebglScene',
  mounted() {
    // Init webgl
<<<<<<< HEAD

=======
>>>>>>> 19b10e4004cea33d4c85de729e8e011958d11769
    Vue.prototype.$webgl = Vue.prototype.$webgl || new WebGL(this.$el)
    this.$webgl.init()
    this.$webgl.initStage(this.$route.path.replace('/', ''))
  },
  beforeDestroy() {
    this.$webgl.destroy()
    Vue.prototype.$webgl = null
  }
}
</script>
