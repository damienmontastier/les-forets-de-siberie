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

      if (layers.params.anchor) sprite.setAnchor(layers.params.anchor)

      sprite.updateWorldMatrix()

      this.addToLayer({ indexLayer: key, mesh: sprite })
    })
  }

  addToLayer({ indexLayer, mesh, fullwidth = false }) {
    let layerFolder

    if (fullwidth) mesh.children[0].fullwidth(true)

    // let layer = this._layers[idLayer]

    // if (!layer) {
    this.createLayer(indexLayer)
    layerFolder = GUI.__folders[this.namePart].addFolder(mesh.name)
    // }

    this._layers[indexLayer].addMesh(mesh, layerFolder)
  }

  createLayer(indexLayer) {
    this._layers[indexLayer] = new Layer()

    this._layers[indexLayer].position.z = -indexLayer * 0.1
    this.add(this._layers[indexLayer])
  }
}
