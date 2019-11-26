<template>
  <div class="intro">
    <div class="intro--inner">
      <h1>Introduction</h1>
    </div>
  </div>
</template>

<script>
import Intro from '@/webGL/stages/Intro'
export default {
  name: 'intro',
  mounted() {
    this.$nextTick(() => {
      this.$webgl.add('intro', Intro)
    })
  },
}
</script>

<style lang="scss">
.intro {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  &--inner {
    color: red;
    font-size: 60px;
  }
}
</style>
