import VirtualScroll from 'virtual-scroll'
import Events from '../plugins/events'
import Viewport from '../webGL/utils/Viewport'
const virtualScroll = new VirtualScroll({
  useKeyboard: false,
})

virtualScroll.amountScroll = 0

virtualScroll.on(e => {
  if (virtualScroll.disabled) return
  virtualScroll.amountScroll += e.deltaY / 2
  virtualScroll.amountScroll = Math.max(0, virtualScroll.amountScroll)
  virtualScroll.amountScroll = Math.min(
    Viewport.width * 18.1,
    virtualScroll.amountScroll
  )
  Events.emit('scroll', { amountScroll: virtualScroll.amountScroll, event: e })
})

export default virtualScroll
