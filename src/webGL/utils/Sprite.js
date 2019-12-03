import * as THREE from 'three'
import Viewport from './Viewport'

export default class Sprite extends THREE.Object3D {
  constructor({ texture, size, material = null }) {
    super()

    this.size = size

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

    if (material) {
      this.material = material
    } else {
      this.material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.01,
      })
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.name = texture.name
    this.add(this.mesh)

    this.ratio = this.size.width / this.size.height

    this.mesh.scale.set(this.ratio, 1, 1)
  }
  fullwidth(bool) {
    if (bool) {
      this.ratio = this.size.height / this.size.width
      this.mesh.scale.set(1, this.ratio, 1)
    } else {
      this.ratio = this.size.width / this.size.height
      this.mesh.scale.set(this.ratio, 1, 1)
    }
  }

  setAnchor(side) {
    let positionX
    let halfWidth = (this.mesh.scale.x / 2) * Viewport.width
    if (side === 'left') {
      positionX = -Viewport.width / 2 + halfWidth
    } else if (side === 'right') {
      positionX = Viewport.width / 2 - halfWidth
    } else if (side === 'center') {
      // position = -Viewport.width / 2 - this.mesh.scale.x / 2
    }
    this.position.x = positionX / Viewport.width
  }
}
