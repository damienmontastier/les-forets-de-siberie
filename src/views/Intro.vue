<template>
  <div>ontro</div>
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

<style></style>
