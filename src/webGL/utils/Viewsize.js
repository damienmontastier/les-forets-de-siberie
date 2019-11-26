import Camera from './Camera'
import Viewport from './Viewport'
class Viewsize {
  get height() {
    const distance = Camera.position.z
    const vFov = (Camera.fov * Math.PI) / 180
    return 2 * Math.tan(vFov / 2) * distance
  }

  get width() {
    return this.height * Viewport.ratio
  }
}

export default new Viewsize()
