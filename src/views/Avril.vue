<template>
  <div>avril</div>
</template>

<script>
import Avril from '@/webGL/stages/Avril'
export default {
  name: 'avril',
  mounted() {
    this.$nextTick(() => {
      this.$webgl.add('avril', Avril)
    })
  },
}
</script>

<style></style>
