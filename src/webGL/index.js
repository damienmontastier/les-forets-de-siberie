import * as THREE from 'three'
const OrbitControls = require('three-orbitcontrols')
import Camera from './utils/Camera'
import Viewport from './utils/Viewport'

import Renderer from './renderer'
import Clock from './utils/Clock'
import Raf from './utils/Raf'

export default class WebGL {
  constructor(canvas, container = document.body) {
    this.canvas = canvas
    this.container = container

    window.addEventListener('resize', this.onWindowResize.bind(this), false)

    // renderer
    // this.renderer = new THREE.WebGLRenderer({
    //   antialias: true,
    //   canvas: this.canvas,
    //   alpha: true,
    // })
    // this.renderer.setSize(Viewport.width, Viewport.height)
    // this.renderer.setClearColor(0x00000, 0) // second param is opacity, 0 => transparent
    // this.renderer.setPixelRatio = window.devicePixelRatio

    // scene
    this.scene = new THREE.Scene()

    //renderer
    this.renderer = Renderer
    this.renderer.init({
      canvas: this.canvas,
      scene: this.scene,
      camera: Camera,
    })

    //mouse
    this.mouse = new THREE.Vector2()

    //axes
    this.scene.add(new THREE.AxesHelper(Viewport.width / 2))

    //clock
    this.clock = new THREE.Clock()
  }

  init() {
    // animation loop

    this.scenes = {}

    // this.update()
    Raf.add('webgl', this.update.bind(this))
  }

  update() {
    // requestAnimationFrame(this.update.bind(this))
    let delta = Clock.getDelta()
    this.renderer.render(delta)
  }

  add(id, group) {
    this.scenes[id] = group

    this.scene.add(group)
    group.init({ renderer: this.renderer.renderer })
  }

  // render() {
  //   // called every frame
  //   let delta = this.clock.getDelta()
  //   console.log(delta)
  //   this.renderer.render(delta)
  // }

  onWindowResize() {
    // this.renderer.setSize(Viewport.width, Viewport.height)
  }

  destroy() {}
}
