import { Howl, Howler } from 'howler'

let sounds = require('../../public/sounds/avril_sprites.mp3')

class AudioManager {
  constructor() {}
  add(sounds) {
    return new Promise((resolve, reject) => {
      this.sprite = new Howl({
        src: sounds,
        sprite: {
          lake: [0, 4000],
          fire: [5000, 9200],
          auroreBoreal: [15000, 11000],
          wind: [27000, 9000],
          part3: [38000, 12000],
          part6: [52000, 8600],
          frost: [61200, 12000],
        },

        onload: () => {
          resolve()
        },
      })
    })
  }
  play(id) {
    this.sprite.play(id)
  }
  stop() {
    this.sprite.stop()
  }
}

export default new AudioManager()
