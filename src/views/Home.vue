<template>
  <div class="home">
    <div class="loader"></div>
    <div class="intro"></div>
  </div>
</template>

<script>
import Intro from '@/webGL/stages/Intro'

export default {
  name: 'intro',
  components: {},
  mounted() {
    this.$nextTick(() => {
      this.$webgl.add('intro', Intro)
    })
  },
}
</script>

<style lang="scss">
.home {
  position: relative;
  width: 100%;
  height: 100vh;

  .loader {
    background: url('/assets/intro/loader.gif');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    width: 100%;
    z-index: 999;
    height: 100%;
    position: absolute;
  }

  .intro {
    svg {
      width: 100%;
    }
  }
}
</style>
