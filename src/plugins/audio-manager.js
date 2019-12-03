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
          aurore: [15000, 11000],
          part2: [27000, 9000],
          part3: [38000, 12000],
          part4: [52000, 8600],
          end: [61200, 2000],
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
  stop(id) {
    this.sprite.stop(id)
  }
}

export default new AudioManager()
