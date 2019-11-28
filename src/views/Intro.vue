<template>
  <div class="intro">
    <div class="intro--inner">
      <fevrierTitle></fevrierTitle>
    </div>
  </div>
</template>

<script>
import Intro from '@/webGL/stages/Intro'
import fevrierTitle from '@/components/svg/FevrierTitle'

export default {
  name: 'intro',
  components: {
    fevrierTitle,
  },
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
    svg {
      width: 100%;
    }
  }
}
</style>
