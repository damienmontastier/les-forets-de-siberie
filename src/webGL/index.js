import * as THREE from 'three'
const OrbitControls = require('three-orbitcontrols')
import Camera from './utils/Camera'
import Viewport from './utils/Viewport'
import TouchEvent from '../plugins/touch-events'
import Viewsize from './utils/Viewsize'
import gsap from 'gsap'

export default class WebGL {
  constructor(canvas, container = document.body) {
    this.canvas = canvas
    this.container = container

    window.addEventListener('resize', this.onWindowResize.bind(this), false)

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
      alpha: true,
    })
    this.renderer.setSize(Viewport.width, Viewport.height)
    this.renderer.setClearColor(0x00000, 0) // second param is opacity, 0 => transparent
    this.renderer.setPixelRatio = window.devicePixelRatio

    // scene
    this.scene = new THREE.Scene()

    document.addEventListener('touchstart', e => {
      let mousex = (e.changedTouches[0].clientX / window.innerWidth) * 2 - 1
      let mousey = -(e.changedTouches[0].clientY / window.innerHeight) * 2 + 1
      var geometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 32)
      var material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
      })
      var plane = new THREE.Mesh(geometry, material)
      let x = this.map(mousex, -1, 1, -Viewsize.width / 2, Viewsize.width / 2)
      console.log(x)

      let y = this.map(mousey, -1, 1, -Viewsize.height / 2, Viewsize.height / 2)
      plane.position.set(x, y, 0)
      console.log('here')
      gsap.to(plane.position, {
        y: -10,
        duration: 10,
        onComplete: () => {
          console.log(this.scene.remove(plane))
        },
      })
      this.scene.add(plane)
      console.log(this.scene)
    })

    //controls
    this.controls = new OrbitControls(Camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.25
    this.controls.enableZoom = false

    //mouse
    this.mouse = new THREE.Vector2()

    //axes
    this.scene.add(new THREE.AxesHelper(Viewport.width / 2))
  }

  init() {
    // animation loop

    this.scenes = {}
    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  map = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2

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
