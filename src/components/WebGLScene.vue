<template>
  <canvas class="webGLScene"></canvas>
</template>

<script>
import Vue from 'vue'
import WebGL from '@/webGL'
export default {
  name: 'WebglScene',
  created() {},
  mounted() {
    // Init webgl
<<<<<<< HEAD

    this.$nextTick(() => {
      Vue.prototype.$webgl = Vue.prototype.$webgl || new WebGL(this.$el)
      this.$webgl.init()
    })
=======
    Vue.prototype.$webgl = Vue.prototype.$webgl || new WebGL(this.$el)
    this.$webgl.init()
>>>>>>> d46fdfa87aa6a8f52f1f50ef3066f125d57c783a
  },
  beforeDestroy() {
    this.$webgl.destroy()
    Vue.prototype.$webgl = null
  }
}
</script>
