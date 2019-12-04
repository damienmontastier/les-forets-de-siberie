import gsap from 'gsap'
import Events from '../../plugins/events'
import Viewport from './Viewport'

class Parallax {
  constructor() {
    this.currentPart
  }
  init() {
    Events.on('scroll', values => {
      if (this.disable) return
      Object.values(this.currentLayersToParallax.children)
        .filter(element => element.parallax)
        .forEach((element, index) => {
          let y =
            values.amountScroll / Viewport.width - this.currentPart.position.y

          const speed = index == 0 ? 1 * 0.08 : element.position.z * 1

          gsap.to(element.position, {
            y: -y * speed,
            duration: 0.8,
          })
        })
    })
  }
  add(current) {
    this.currentPart = current
    this.init()
  }
  remove() {
    this.currentPart = null
  }

  get currentLayersToParallax() {
    return this.currentPart
  }
}

export default new Parallax()
