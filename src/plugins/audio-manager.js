import { Howl, Howler } from 'howler'

let sounds = require('../../public/sounds/avril_sprites.mp3')

class AudioManager {
  constructor() {}
  add(sounds) {
    return new Promise((resolve, reject) => {
      this.sprite = new Howl({
        autoplay: false,
        loop: false,
        src: [sounds],
        sprite: {
          lake: [0, 4000],
          part1: [5000, 14000],
          aurore: [15000, 26000],
          part2: [27000, 36000],
          part3: [38000, 50000],
          part4: [52000, 60600],
          end: [61200, 61400],
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
    this.sprite.pause(id)
  }
}

export default new AudioManager()
