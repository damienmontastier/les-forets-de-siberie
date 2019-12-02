import VirtualScroll from 'virtual-scroll'
import Events from '../plugins/events'
const virtualScroll = new VirtualScroll()

let amountScroll = 0

virtualScroll.on(e => {
  amountScroll += -e.deltaY

  Events.emit('scroll', { amountScroll, event: e })
})

export default virtualScroll
