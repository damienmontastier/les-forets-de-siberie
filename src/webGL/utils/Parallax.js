import TweenMax, { Power4 } from 'gsap'

export default class Parallax {
  constructor({ layers }) {
    this.layers = layers

    this.init()
  }
  init() {
    document.addEventListener('touchstart', this.handleTouchStart.bind(this))
    document.addEventListener('touchend', this.handleTouchEnd.bind(this))
    document.addEventListener('touchmove', this.handleTouchMove.bind(this))
  }
  handleTouchStart(e) {
    let touches = e.touches[0] // measure start values

    this.startPosition = {
      x: touches.pageX,
      y: touches.pageY
    }
  }
  handleTouchEnd(e) {}

  handleTouchMove(e) {
    if (e.touches.length > 1 || (e.scale && e.scale !== 1)) return
    let touches = event.touches[0]

    this.delta = touches.pageY - this.startPosition.y
    console.log(this.delta)
    Object.values(this.layers.children).forEach((element, index) => {
      let speed = index + 1
      TweenMax.to(element.position, 0.8, {
        y: '+=' + (this.delta / 100) * speed,
        ease: Power4.easeOut
      })
    })
  }
}
