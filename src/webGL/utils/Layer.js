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
    this.anchor = 'center'

    folder.add(mesh.position, 'y').name('y')

    console.log(this)
    folder.add(this, 'fullwidth').onChange(bool => {
      mesh.fullwidth(bool)
    })

    folder.add(this, 'visible')

    folder.add(this, 'anchor', ['left', 'center', 'right']).onChange(anchor => {
      mesh.setAnchor(anchor)
    })
  }
}
