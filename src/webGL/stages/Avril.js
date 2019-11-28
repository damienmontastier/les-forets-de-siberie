import * as THREE from 'three'
import gsap from 'gsap'
import Layers from '@/webGL/utils/Layers'
import Parallax from '@/webGL/utils/Parallax'
import TextureAtlas from '@/webGL/utils/TextureAtlas'
// import atlasJSON from '@/assets/avril/avril_part1.json'
import loadTextureAtlasFromPath from '@/webGL/utils/loadTextureAtlasFromPath'
import loadSeveralTextureAtlasFromPathes from '@/webGL/utils/loadSeveralTextureAtlasFromPathes'

// const parts = [
//   { texture: '/assets/avril/avril_part1.png', json: atlasJSON },
//   { texture: '/assets/avril/avril_part1.png', json: atlasJSON },
// ]

const pathesArray = [
  '/assets/avril/atlases/part1/',
  '/assets/avril/atlases/part2/',
]

class Chapter1 extends THREE.Object3D {
  constructor() {
    super()
  }
  init() {
    this.loadAssets().then(() => {
      console.log('createParts')
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
        // console.log(textures)
      })
    })
  }
}

const stage1 = new Chapter1()
export default stage1
