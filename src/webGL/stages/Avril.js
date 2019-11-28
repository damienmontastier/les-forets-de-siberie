import * as THREE from 'three'
import gsap from 'gsap'
import Layers from '@/webGL/utils/Layers'
import Parallax from '@/webGL/utils/Parallax'
import loadSeveralTextureAtlasFromPathes from '@/webGL/utils/loadSeveralTextureAtlasFromPathes'
import Parts from '@/webGL/utils/Parts'

const pathesArray = [
  '/assets/avril/atlases/part1/',
  '/assets/avril/atlases/part2/',
]

class Chapter1 extends THREE.Object3D {
  constructor() {
    super()
  }
  init() {
    this.loadAssets().then(textures => {
      console.log(textures)

      //Create part

      // const layers = new Layers({
      //   textures: this.textures,
      //   textureAtlas: this.textureAtlas,
      // })
      // this.add(layers)
      // const parallax = new Parallax({ layers })
    })
  }
  loadAssets() {
    return new Promise((resolve, reject) => {
      loadSeveralTextureAtlasFromPathes(pathesArray).then(textures => {
        resolve(textures)
      })
    })
  }
}

const stage1 = new Chapter1()
export default stage1
