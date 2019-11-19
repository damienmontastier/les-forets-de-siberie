import * as THREE from 'three'

export default class Sprite extends THREE.Object3D {
  constructor({ texture, size }) {
    super()

    this.ratio = size.width / size.height

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.scale.set(this.ratio, 1, 1)
    this.add(this.mesh)
  }
}
