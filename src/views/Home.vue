<template>
  <div class="home">
    <div class="loader"></div>
    <div class="intro">
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
.home {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .loader {
    background-image: url(/assets/intro/loader.gif);
  }

  .intro {
    svg {
      width: 100%;
    }
  }
}
</style>
