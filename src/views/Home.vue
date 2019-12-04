<template>
  <div class="home">
    <div class="loader"></div>
    <div class="intro">
      <Title></Title>
    </div>
  </div>
</template>

<script>
import Intro from '@/webGL/stages/Intro'
import Title from '@/components/svg/IntroTitle'

export default {
  name: 'intro',
  components: {
    Title,
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
  position: relative;
  width: 100%;
  height: 100vh;

  .loader {
    background: url('/assets/intro/loader.gif');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .intro {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    width: 250px;
    svg {
      width: 100%;
    }
  }
}
</style>
