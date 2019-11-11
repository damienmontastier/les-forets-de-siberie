import * as THREE from 'three'
import TextureAtlas from './TextureAtlas'
import Sprite from './Sprite'
import atlasJSON from '@/assets/chapter1/test.json'

export default class Layer extends THREE.Object3D {
  constructor() {
    super()

    this.layersPosition = []
    this.init()
  }
  init() {
    this.loadAssets()
      .then(() => this.sortLayer())
      .then(() => {
        this.layersPosition.forEach(element => {
          this.children.push(element)
        })
      })
  }
  loadAssets() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.TextureLoader()

      loader.load('/assets/intro/atlas/atlas.png', texture => {
        this.textureAtlas = new TextureAtlas(atlasJSON, texture.image)
        this.textures = this.textureAtlas.textures
        resolve(this.textures)
      })
    })
  }
  sortLayer() {
    let lastIdLayer

    return new Promise((resolve, reject) => {
      Object.entries(this.textures).forEach(([key, value], index) => {
        let sprite = new Sprite({
          texture: this.textureAtlas.getTexture(key),
          size: this.textureAtlas.getSize(key)
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
