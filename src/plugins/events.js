import { EventEmitter } from 'events'

const events = new EventEmitter()
events.setMaxListeners(50)

export default events
