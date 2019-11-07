import * as PIXI from 'pixi.js'
import AssetManager from '@/services/AssetsManager'
import events from '@/plugins/events.js'

import Intro from './stages/Intro'

const parameters = {
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  autoResize: true,
  resizeTo: window,
  antialias: true
}

export default class WebGL extends PIXI.Application {
  constructor(
    view
  ) {
    super({
      ...parameters,
      view
    })

    this.stages = {
      Intro
    }
  }

  init() {
    Intro.init()
    this.stage.addChild(Intro)

    console.log(this)
  }
}
