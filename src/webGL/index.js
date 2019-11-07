import * as PIXI from 'pixi.js'
import AssetManager from '@/services/AssetsManager'
import events from '@/plugins/events.js'

const parameters = {
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  autoResize: true,
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
  }

  init() {
    AssetManager.getGroup('stage1').then((assets)=>{})
  }
}
