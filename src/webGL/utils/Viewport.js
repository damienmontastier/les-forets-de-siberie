class Viewport {
  constructor() {
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
  }
  onWindowResize = () => {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.ratio = this.width / this.height
  }
}

export default new Viewport()
