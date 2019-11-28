import * as THREE from 'three'

export default class Sprite extends THREE.Object3D {
  constructor({ texture, size, material = null }) {
    super()

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

    if (material) {
      this.material = material
    } else {
      this.material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      })
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.add(this.mesh)

    this.ratio = size.height / size.width
    this.mesh.scale.set(1, this.ratio, 1)
  }
}
