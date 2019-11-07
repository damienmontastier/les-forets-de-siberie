import * as PIXI from 'pixi.js'
import Vue from 'vue'
import events from '@/assets/js/events.js'

export default class WebGL extends PIXI.Application {
  constructor(
    view,
    parameters = {
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: window.devicePixelRatio || 1,
      autoResize: true,
      antialias: true
    }
  ) {
    super({
      ...parameters,
      view
    })
  }

  init() {}
}
