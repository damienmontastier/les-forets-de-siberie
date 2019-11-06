import {
    EventEmitter
} from 'events'

const test = {

    install(Vue) {
        Vue.mixin({
            created() {
                const emitter = new EventEmitter()
                emitter.setMaxListeners(50)

                Vue.prototype.$events = emitter
            }
        });
    }
};

export default test;