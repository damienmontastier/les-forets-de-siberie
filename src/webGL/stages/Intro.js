import * as THREE from 'three'
import TextureAtlas from '../utils/TextureAtlas'
import atlasJSON from '@/assets/intro/atlas_intro.json'
import Sprite from '../utils/Sprite'

class Intro extends THREE.Object3D {
  constructor() {
    super()
  }

  init() {
    // loading assets
    this.loadAssets().then(this.start.bind(this))
  }

  loadAssets() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.TextureLoader()

      loader.load('/assets/intro/atlas/atlas.png', texture => {
        this.textureAtlas = new TextureAtlas(atlasJSON, texture.image)
        resolve()
      })
    })
  }

  start() {
    let sprite = new Sprite({
      texture: this.textureAtlas.getTexture('sans titre - 1-07'),
      size: this.textureAtlas.getSize('sans titre - 1-07')
    })

    this.add(sprite)
  }
}

export default new Intro()
