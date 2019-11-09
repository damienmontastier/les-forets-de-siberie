import * as THREE from 'three'

export default class TextureAtlas {
  constructor(json, image) {
    this.textures = {}
    let texture = new THREE.Texture(image)
    texture.needsUpdate = true

    let frames = json.frames
    Object.keys(frames).forEach((key, i) => {
      let frame = frames[key]
      let t = texture.clone()
      let data = frame.frame
      t.repeat.set(data.w / image.width, data.h / image.height)
      t.offset.x = data.x / image.width
      t.offset.y = 1 - data.h / image.height - data.y / image.height
      t.needsUpdate = true

      t._size = { width: data.w, height: data.h }

      let id = frame.filename.replace('.png', '').toLowerCase()
      this.textures[id] = t
    })
  }

  getTexture(id) {
    return this.textures[id]
  }

  getSize(id) {
    return this.textures[id]._size
  }
}
