import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { MousePlugin } from './plugins/Mouse'
import AudioManager from '@/plugins/audio-manager'

const bande_sonore = require('../public/sounds/bande_sonore.mp3')

let elem = document.documentElement

document.addEventListener('touchstart', () => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen()
  }
})

AudioManager.add({ path: bande_sonore, volume: 0.1 }).then(sound => {
  sound.play()

  if (router.app._route.path != '/avril') {
    // setTimeout(() => {
    //   router.push('/avril')
    // }, 2000)
  }
})

Vue.use(MousePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
