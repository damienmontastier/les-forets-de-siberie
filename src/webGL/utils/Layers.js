import * as THREE from 'three'
import Sprite from './Sprite'

export default class Layer extends THREE.Object3D {
  constructor({ textures, textureAtlas }) {
    super()
    this.textures = textures
    this.textureAtlas = textureAtlas
    this.layersPosition = []
    this.init()
  }
  init() {
    this.sortLayer().then(() => {
      this.layersPosition.forEach(element => {
        this.children.push(element)
      })
    })
  }

  sortLayer() {
    let lastIdLayer

    return new Promise((resolve, reject) => {
      Object.entries(this.textures).forEach(([key, value], index) => {
        let sprite = new Sprite({
          texture: this.textureAtlas.getTexture(key),
          size: this.textureAtlas.getSize(key),
        })
        sprite.position.y = Math.random() * 20

        // if (key.includes('layer')) {
        // let name = key.split(/-|_/)[0]
        // let idLayer = name.slice(-1)

        let name = key.split(/-|_/)[2]
        let idLayer = name.slice(0, 1)

        if (idLayer != lastIdLayer) {
          this.layersPosition[idLayer] = new THREE.Object3D()
          this.layersPosition[idLayer].position.z = -idLayer
        }

        this.layersPosition[idLayer].add(sprite)
        this.layersPosition[idLayer].positionLayer = idLayer

        lastIdLayer = idLayer

        resolve(this.layersPosition)
        // }
      })
    })
  }
}
