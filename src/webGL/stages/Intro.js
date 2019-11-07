import * as PIXI from 'pixi.js'
import AssetManager from '@/services/AssetsManager'

class Intro extends PIXI.Container {
  constructor() {
    super()
  }

  loadAssets() {
    return new Promise((resolve, reject) => {
      AssetManager.getGroup('intro').then(assets => {
        this.assets = assets
        resolve()
      })
    })
  }

  init() {
    this.loadAssets().then(this.start.bind(this))
  }

  start() {
    console.log(this.assets)
    let sprite = new PIXI.Sprite(this.assets['background'].texture)
    this.addChild(sprite)
  }
}

export default new Intro()
