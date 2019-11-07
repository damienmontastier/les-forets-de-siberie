import { EventEmitter } from 'events'
// import Vue from 'vue'

// const events = new Vue({
//     data() {
//         return {
//             emitter: new EventEmitter()
//         }
//     },
//     created() {
//         this.emitter.setMaxListeners(50)

//         Vue.prototype.$events = this.emitter
//     }
// })

// const eventsPlugin = {
//     install(Vue) {
//         Vue.prototype.$events = events
//     }
// };

// export default events;
// export { eventsPlugin };

let events = new EventEmitter()
events.setMaxListeners(50)

export default events
