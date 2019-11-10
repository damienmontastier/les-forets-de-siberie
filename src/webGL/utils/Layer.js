export default class Layer {
  constructor(opts) {
    this.textures = opts.textures

    this.layers = []
    this.sortLayer()
  }
  sortLayer() {
    let lastIdLayer
    console.log(this.textures)

    Object.entries(this.textures).forEach(([key, value], index) => {
      if (key.includes('layer')) {
        let name = key.split(/-|_/)[0]
        let idLayer = name.slice(-1)

        if (idLayer != lastIdLayer) {
          this.layers[idLayer] = new Array()
        }

        this.layers[idLayer].push(value)

        console.log(this.layers)

        lastIdLayer = idLayer
      }
    })

    // console.log(this.layers)
  }
}
