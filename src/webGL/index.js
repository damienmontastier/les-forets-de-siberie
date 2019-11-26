import * as THREE from 'three'
const OrbitControls = require('three-orbitcontrols')
import Camera from './utils/Camera'
import Viewport from './utils/Viewport'

export default class WebGL {
  constructor(canvas, container = document.body) {
    this.canvas = canvas
    this.container = container

    window.addEventListener('resize', this.onWindowResize.bind(this), false)

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    })
    this.renderer.setSize(Viewport.width, Viewport.height)
    this.renderer.setPixelRatio = window.devicePixelRatio

    // scene
    this.scene = new THREE.Scene()

    //controls
    this.controls = new OrbitControls(Camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.25
    this.controls.enableZoom = false

    //mouse
    this.mouse = new THREE.Vector2()

    //axes
    this.scene.add(new THREE.AxesHelper(5))
  }

  init() {
    // animation loop

    this.scenes = {}
    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  add(id, group) {
    this.scenes[id] = group

    this.scene.add(group)
    group.init()
  }

  render() {
    // called every frame
    this.renderer.render(this.scene, Camera)
  }

  onWindowResize() {
    this.renderer.setSize(Viewport.width, Viewport.height)
  }

  initStage(name) {
    console.log('route changed: ' + name)
    // TODO : init Stage with this name if exists
  }

  destroy() {}
}
