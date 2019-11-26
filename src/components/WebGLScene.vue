<template>
  <canvas class="webGLScene"></canvas>
</template>

<script>
import Vue from 'vue'
import WebGL from '@/webGL'
export default {
  name: 'WebglScene',
  mounted() {
    console.log('WebglScene mounted')
    Vue.prototype.$webgl = Vue.prototype.$webgl || new WebGL(this.$el)
    this.$webgl.init()
  },
  beforeDestroy() {
    this.$webgl.destroy()
    Vue.prototype.$webgl = null
  },
}
</script>
