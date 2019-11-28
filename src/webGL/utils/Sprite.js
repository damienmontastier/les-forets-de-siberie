import * as THREE from 'three'

export default class Sprite extends THREE.Object3D {
  constructor({ texture, size, fullwidth = true }) {
    super()

    this.ratio = size.height / size.width

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 10, 10)
    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      // transparent: true,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.scale.set(1, this.ratio, 1)
    this.add(this.mesh)
  }
}
