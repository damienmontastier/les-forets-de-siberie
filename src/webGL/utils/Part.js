import * as THREE from 'three'
import Layer from './Layer'
import Sprite from './Sprite'
import Viewport from './Viewport'
import GUI from '@/plugins/dat-gui.js'

export default class Part extends THREE.Object3D {
  constructor({ name, layers }) {
    super()

    this.namePart = name
    this.partLayer = layers

    this.init()
  }

  init() {
    Object.values(this.partLayer).forEach((texture, key) => {
      let sprite = new Sprite({
        texture: texture.texture,
        size: texture.texture._size,
      })
      this.addToLayer(key, sprite)
    })
  }

  addToLayer(idLayer, mesh) {
    let layer = this.layers[idLayer]
    let layerFolder
    if (!layer) {
      this.createLayer(idLayer)
      layerFolder = GUI.__folders[this.namePart].addFolder('layer ' + idLayer)
      layerFolder.open()
    }

    this.layers[idLayer].addMesh(mesh, layerFolder)
  }

  createLayer(idLayer) {
    this.layers[idLayer] = new Layer()
    this.layers[idLayer].scale.x = Viewport.width
    this.layers[idLayer].scale.y = Viewport.width
    this.add(this.layers[idLayer])
  }
}
