import { Howl, Howler } from 'howler'

class AudioManager {
  constructor() {}
  addSprite(path, volume = 1.0, timecodes = null) {
    return new Promise((resolve, reject) => {
      let sounds = new Howl({
        src: path,
        sprite: timecodes,
        volume: volume,
        onload: () => {
          resolve(sounds)
        },
      })
    })
  }
  add({ path, volume = 1.0 }) {
    return new Promise((resolve, reject) => {
      let sound = new Howl({
        src: path,
        loop: true,
        volume: volume,
        onload: () => {
          resolve(sound)
        },
      })
    })
  }
  play(sound, name) {
    sound.play(name)
  }
  stop(sound) {
    sound.stop()
  }
}

export default new AudioManager()
