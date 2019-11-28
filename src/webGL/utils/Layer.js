import * as THREE from 'three'
import Viewport from './Viewport'

export default class Layer extends THREE.Object3D {
  constructor(meshes) {
    super()

    this.addLayer()
  }

  addLayer() {
    return new THREE.Object3D()
  }

  addMesh(mesh) {
    this.add(mesh)
    mesh.scale.x = Viewport.width
    mesh.scale.y = Viewport.width
    // this.layersPosition[idLayer].add(mesh)
  }

  addLayerToGUI(sprite, folder) {
    // folder.add(sprite.position, 'y').name('y position')
  }
}
