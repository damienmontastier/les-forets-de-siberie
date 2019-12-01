import * as THREE from 'three'

import Vue from 'vue'
import Viewport from '../webGL/utils/Viewport'
const mouse = new Vue({
  data() {
    return {
      position: new THREE.Vector2(-100000, -10000),
      normalized: new THREE.Vector2(-1, -1),
      velocity: new THREE.Vector2(),
    }
  },

  methods: {
    updateMouse(e) {
      if (e.changedTouches && e.changedTouches.length) {
        e.x = e.changedTouches[0].pageX
        e.y = e.changedTouches[0].pageY
      }

      this.position.set(e.x, e.y)
      this.normalized.set(e.x / Viewport.width, 1.0 - e.y / Viewport.height)

      if (!this.lastTime) {
        this.lastTime = performance.now()
        this.lastMouse = new THREE.Vector2(e.x, e.y)
      }

      const deltaX = e.x - this.lastMouse.x
      const deltaY = e.y - this.lastMouse.y

      this.lastMouse.set(e.x, e.y)

      let time = performance.now()

      // Avoid dividing by 0
      let delta = Math.max(14, time - this.lastTime)
      this.lastTime = time
      this.velocity.x = deltaX / delta
      this.velocity.y = deltaY / delta
      // Flag update to prevent hanging velocity values when not moving
      this.velocity.needsUpdate = true
    },
    update() {
      if (!this.velocity.needsUpdate) {
        this.normalized.set(-1, -1)
        this.velocity.set(0, 0)
      }
      this.velocity.needsUpdate = false
    },
  },

  created() {
    window.addEventListener('touchstart', this.updateMouse.bind(this), false)
    window.addEventListener('touchmove', this.updateMouse.bind(this), false)
    window.addEventListener('touchend', this.updateMouse.bind(this), false)
  },
  mounted() {
    requestAnimationFrame(this.update.bind(this))
  },
})

const MousePlugin = {
  install() {
    Vue.prototype.$mouse = mouse
  },
}

export default mouse
export { MousePlugin }
