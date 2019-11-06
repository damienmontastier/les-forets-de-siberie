<template>
  <canvas class="webGLScene"></canvas>
</template>

<script>
import Vue from "vue";
import WebGL from "@/webGL";
export default {
  name: "WebglScene",
  mounted() {
    // Init webgl
    this.$nextTick(() => {
      Vue.prototype.$webgl = Vue.prototype.$webgl || new WebGL(this.$el);
      // Check if mounted
      this.$webgl.init();
    });
  },
  beforeDestroy() {
    this.$webgl.destroy();
    Vue.prototype.$webgl = null;
  }
};
</script>