import * as THREE from 'three'
import Layer from './Layer'
import Sprite from './Sprite'
import Viewport from './Viewport'
import GUI from '@/plugins/dat-gui.js'

export default class Part extends THREE.Object3D {
  constructor({ name, layers }) {
    super()
    this.namePart = name
    this.layersData = layers
    this._layers = {}
    this.init()
  }

  init() {
    Object.values(this.layersData).forEach((layers, key) => {
      let sprite = new Sprite({
        texture: layers.texture,
        size: layers.texture._size,
      })

      if (layers.params.fullwidth) sprite.fullwidth(true)

      sprite.position.y = layers.params.y

      this.addToLayer(key, sprite)
    })
  }

  addToLayer(idLayer, mesh) {
    let layer = this._layers[idLayer]
    let layerFolder
    if (!layer) {
      this.createLayer(idLayer)
      layerFolder = GUI.__folders[this.namePart].addFolder('layer ' + idLayer)
      layerFolder.open()
    }
    this._layers[idLayer].addMesh(mesh, layerFolder)
  }

  createLayer(idLayer) {
    this._layers[idLayer] = new Layer()

    this.add(this._layers[idLayer])
  }
}
