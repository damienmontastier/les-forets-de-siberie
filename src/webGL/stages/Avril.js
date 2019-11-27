import * as THREE from 'three'
import TweenMax from 'gsap'
import Layers from '@/webGL/utils/Layers'
import Parallax from '@/webGL/utils/Parallax'
import TextureAtlas from '@//webGL/utils/TextureAtlas'
import atlasJSON from '@/assets/chapter1/test.json'

class Chapter1 extends THREE.Object3D {
  constructor() {
    super()
  }
  init() {
    return new Promise(resolve => {
      this.loadAssets().then(() => {
        const layers = new Layers({
          textures: this.textures,
          textureAtlas: this.textureAtlas,
        })
        this.add(layers)
        const parallax = new Parallax({ layers })
        resolve()
      })
    })
  }
  loadAssets() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.TextureLoader()

      loader.load('/assets/intro/atlas/atlas.png', texture => {
        this.textureAtlas = new TextureAtlas(atlasJSON, texture.image)
        this.textures = this.textureAtlas.textures
        resolve(this.textures, this.textureAtlas)
      })
    })
  }
}

const stage1 = new Chapter1()
export default stage1
