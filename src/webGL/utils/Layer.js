import * as THREE from 'three'
import Viewport from './Viewport'

export default class Layer extends THREE.Object3D {
  constructor() {
    super()

    this.addLayer()
  }

  addLayer() {
    return this
  }

  addMesh(mesh, folder) {
    this.add(mesh)
    this.addLayerToGUI(mesh, folder)
  }

  addLayerToGUI(mesh, folder) {
    this.fullwidth = false

    folder
      .add(mesh.position, 'y')
      .step(1)
      .name('y')

    folder.add(this, 'fullwidth').onChange(bool => {
      if (bool) mesh.scale.set(mesh.ratio, 1, 1)
      else mesh.scale.set(1, mesh.ratio, 1)
    })
  }
}