import * as THREE from 'three'
import Sprite from './Sprite'
import Viewport from './Viewport'
import GUI from '@/plugins/dat-gui.js'

export default class Layer extends THREE.Object3D {
  constructor({ textures, textureAtlas }) {
    super()
    this.textures = textures
    this.textureAtlas = textureAtlas
    this.layersPosition = []
    this.init()
  }
  init() {
    this.sortLayer()
    this.layersPosition.forEach(element => {
      this.add(element)
    })
  }

  sortLayer() {
    let lastIdLayer
    Object.entries(this.textures).forEach(([key], index) => {
      let folder
      let sprite = new Sprite({
        texture: this.textureAtlas.getTexture(key),
        size: this.textureAtlas.getSize(key),
      })

      if (key.includes('layer')) {
        let name = key.split(/-|_/)[1]
        let idLayer = name.slice(name.length - 1, name.length)

        // If it's new layer
        if (idLayer != lastIdLayer) {
          // folder = GUI.addFolder('Layer' + idLayer)
          this.layersPosition[idLayer] = new THREE.Object3D()
          this.layersPosition[idLayer].position.z = -idLayer
        }
        this.layersPosition[idLayer].positionLayer = idLayer

        this.addMesh(sprite, idLayer)

        this.addLayerToGUI(sprite, folder)

        lastIdLayer = idLayer
      }
    })
  }

  addMesh(mesh, idLayer) {
    mesh.position.y = -Viewport.height / 2 + Viewport.width / 2
    mesh.scale.x = Viewport.width
    mesh.scale.y = Viewport.width

    this.layersPosition[idLayer].add(mesh)
  }
  addLayerToGUI(sprite, folder) {
    // folder.add(sprite.position, 'y').name('y position')
  }
}
