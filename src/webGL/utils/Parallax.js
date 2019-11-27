import TweenMax, { Power4 } from 'gsap'
import VirtualScroll from '../../plugins/virtual-scroll'

export default class Parallax {
  constructor({ layers }) {
    this.layers = layers

    this.init()
  }
  init() {
    VirtualScroll.on(e => {
      Object.values(this.layers.children).forEach((element, index) => {
        const speed = index == 0 ? 1 * 0.09 : index * 0.09
        console.log(speed)
        TweenMax.to(element.position, 0.8, {
          y: '+=' + e.deltaY * speed,
          ease: Power4.easeOut,
        })
      })
    })
  }
}
