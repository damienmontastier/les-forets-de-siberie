import * as THREE from 'three'
import Viewport from '../utils/Viewport'
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  ChromaticAberrationEffect,
} from 'postprocessing'
import HeatWaveEffect from './effects/HeatWave'

class Renderer {
  constructor() {}

  init({ scene, camera, canvas }) {
    this.scene = scene
    this.camera = camera
    this.canvas = canvas

    this.initRenderer()
    this.initComposer()
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    })
    this.renderer.setSize(Viewport.width, Viewport.height)
    this.renderer.setClearColor(0x00000, 0) // second param is opacity, 0 => transparent
    this.renderer.setPixelRatio = window.devicePixelRatio
  }

  initComposer() {
    this.HeatWaveEffect = new HeatWaveEffect()
    this.composer = new EffectComposer(this.renderer)
    const effectPass = new EffectPass(this.camera, this.HeatWaveEffect)
    effectPass.renderToScreen = true
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(effectPass)
  }

  render(delta) {
    if (this.isComposerEnabled) {
      this.composer.render(delta)
    } else {
      this.renderer.clear()
      this.renderer.setRenderTarget(null)
      this.renderer.render(this.scene, this.camera)
    }
  }
}

export default new Renderer()
