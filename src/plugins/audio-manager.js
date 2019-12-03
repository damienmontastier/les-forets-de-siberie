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
          part1: [5000, 9000],
          auroreBoreal: [15000, 11000],
          part2: [27000, 9000],
          part3: [38000, 12000],
          part4: [52000, 8600],
          part6: [61200, 5000],
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
