import * as THREE from 'three'
import TextureAtlas from '../utils/TextureAtlas'
import Sprite from '../utils/Sprite'
import atlasJSON from '@/assets/chapter1/test.json'

export default class Layer extends THREE.Object3D {
  constructor() {
    super()

    this.layers = []
    this.init()
  }
  init() {
    this.loadAssets()
      .then(() => this.sortLayer())
      .then(() => {
        this.layers.forEach(element => {
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
    let promise = new Promise((resolve, reject) => {
      Object.entries(this.textures).forEach(([key, value], index) => {
        let sprite = new Sprite({
          texture: this.textureAtlas.getTexture(key),
          size: this.textureAtlas.getSize(key)
        })

        // if (key.includes('layer')) {
        // let name = key.split(/-|_/)[0]
        // let idLayer = name.slice(-1)

        let name = key.split(/-|_/)[2]
        let idLayer = name.slice(0, 1)

        if (idLayer != lastIdLayer) {
          this.layers[idLayer] = new Array()
        }

        this.layers[idLayer].push(sprite)

        lastIdLayer = idLayer

        resolve(this.layers)
        // }
      })
    })
    return promise
  }
}
