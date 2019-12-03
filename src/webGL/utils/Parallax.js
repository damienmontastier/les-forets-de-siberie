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
      Object.values(this.currentLayersToParallax.children).forEach(
        (element, index) => {
          console.log(this.currentLayersToParallax)
          const speed = index == 0 ? 1 * 0.08 : element.position.z * 0.5

          TweenMax.to(element.position, 0.8, {
            y:
              ((values.amountScroll -
                this.currentLayersToParallax.boundingBox.height) /
                Viewport.width) *
              speed,
            ease: Power4.easeOut,
          })
        }
      )
    })
  }
  add(current) {
    this.currentPart = current
    console.log(current)
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
