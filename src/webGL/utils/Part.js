import * as THREE from 'three'
import Layerr from './Layer'
import Sprite from './Sprite'
import Viewport from './Viewport'
import GUI from '@/plugins/dat-gui.js'

export default class Part extends THREE.Object3D {
  constructor({ name, layers }) {
    super()
    this.namePart = name
    this.layersPart = layers
    this.init()
  }

  init() {
    Object.values(this.layersPart).forEach((layers, key) => {
      let sprite = new Sprite({
        texture: layers.texture,
        size: layers.texture._size,
      })
      if (layers.params.fullwidth) sprite.fullwidth(true)
      console.log(layers.params)
      sprite.position.y = layers.params.y
      this.addToLayer(key, sprite)
    })
  }

  addToLayer(idLayer, mesh) {
    let layer = this.layersPart[idLayer]
    let layerFolder
    if (!layer) {
      this.createLayer(idLayer)
      layerFolder = GUI.__folders[this.namePart].addFolder('layer ' + idLayer)
      layerFolder.open()
    }

    this.layersPart[idLayer].addMesh(mesh, layerFolder)
  }

  createLayer(idLayer) {
    this.layersPart[idLayer] = new Layerr()
    this.layersPart[idLayer].scale.x = Viewport.width
    this.layersPart[idLayer].scale.y = Viewport.width
    this.add(this.layersPart[idLayer])
  }
}
