import * as PIXI from 'pixi.js'
import AssetManager from '@/services/AssetsManager'
import events from '@/plugins/events.js'

import Intro from './stages/Intro'

const parameters = {
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  // autoResize: true,
  // resizeTo: window,
  antialias: true
}

export default class WebGL extends PIXI.Application {
  constructor(view) {
    super({
      ...parameters,
      view
    })

    this.stages = {
      Intro
    }
    this._resize()
    window.addEventListener('resize', this._resize.bind(this))
  }

  _resize() {
    this.stage.scale.x = this.stage.scale.y =
      window.innerWidth / window.innerHeight
    this.renderer.resize(window.innerWidth, window.innerHeight)
  }

  init() {
    Intro.init()
    console.log(Intro)
    this.stage.addChild(Intro)

    console.log(this)
  }
}
