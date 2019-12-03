class Raf {
  constructor() {
    this.callbacks = {}
    this.isRunning = false
  }

  loop() {
    this.isRunning = true
    this.rafId = requestAnimationFrame(this.loop.bind(this))

    Object.values(this.callbacks).forEach(callback => {
      callback()
    })
  }

  add(id, callback) {
    this.callbacks[id] = callback

    if (!this.isRunning) {
      this.loop()
    }
  }

  remove(id) {
    if (!this.callbacks[id]) {
      console.warn(`Raf: ${id} callback doesn't exist`)
    }
    delete this.callbacks[id]

    if (Object.keys(this.callbacks).length === 0) {
      this.isRunning = false
      cancelAnimationFrame(this.rafId)
    }
  }
}

export default new Raf()
