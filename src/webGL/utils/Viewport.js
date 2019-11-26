class Viewport {
  get width() {
    return window.innerWidth
  }
  get height() {
    return window.innerHeight
  }
  get ratio() {
    return this.width / this.height
  }
}

export default new Viewport()
