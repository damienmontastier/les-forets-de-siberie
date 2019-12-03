import TweenMax, { Power4 } from 'gsap'
import VirtualScroll from '../../plugins/virtual-scroll'
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

          TweenMax.to(element.position, 0.8, {
            y: -y * speed,
            ease: 'power4.inout',
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
