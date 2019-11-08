import * as THREE from 'three'

export default class WebGL {
  constructor(canvas,container = document.body) {
    this.canvas = canvas
    this.container = container
  }

  init() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    this.container.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this),
      false
    )

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas
    })
    this.renderer.setSize(this.viewport.width, this.viewport.height)
    console.log(this.viewport)
    this.renderer.setPixelRatio = window.devicePixelRatio

    // scene
    this.scene = new THREE.Scene()

    // camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.viewport.aspectRatio,
      0.1,
      100
    )
    this.camera.position.set(0, 0, 10)

    //mouse
    this.mouse = new THREE.Vector2()

    // animation loop
    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  render() {
    // called every frame
    this.renderer.render(this.scene, this.camera)
  }

  onMouseMove(event) {
    // get normalized mouse position on viewport
    this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1
    this.mouse.y = -(event.clientY / this.viewport.height) * 2 + 1
  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.viewport.width, this.viewport.height)
  }

  get viewport() {
    let width = this.container.clientWidth
    let height = this.container.clientHeight
    let aspectRatio = width / height
    return {
      width,
      height,
      aspectRatio
    }
  }

  get viewSize() {
    let distance = this.camera.position.z
    let vFov = (this.camera.fov * Math.PI) / 180
    let height = 2 * Math.tan(vFov / 2) * distance
    let width = height * this.viewport.aspectRatio
    return { width, height, vFov }
  }
}
