import VirtualScroll from 'virtual-scroll'
import Events from '../plugins/events'
const virtualScroll = new VirtualScroll({
  useKeyboard: false,
})

let amountScroll = 0

virtualScroll.on(e => {
  amountScroll += e.deltaY / 2
  amountScroll = Math.max(0, amountScroll)
  Events.emit('scroll', { amountScroll, event: e })
})

export default virtualScroll
