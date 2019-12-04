<template>
  <div>
    <video ref="video" src="/videos/FIN.mp4"></video>
  </div>
</template>

<script>
import Avril from '@/webGL/stages/Avril'
import Events from '@/plugins/events'
export default {
  name: 'avril',
  mounted() {
    this.$nextTick(() => {
      this.$webgl.add('avril', Avril)
    })
    Events.once('video fin', () => {
      this.$refs.video.classList.add('above')
      this.$refs.video.play()
    })
  },
}
</script>

<style scoped>
video {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: black;
  visibility: hidden;
}
video.above {
  z-index: 10000;
  visibility: visible;
}
</style>
