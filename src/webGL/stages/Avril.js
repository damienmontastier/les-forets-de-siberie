import * as THREE from 'three'
import loadTextureAtlasFromPath from '@/webGL/utils/loadTextureAtlasFromPath'
import Sprite from '../utils/Sprite'
import ChapterPart from '../components/ChapterPart'

// 'part1':{
//   'part1_layer0': {
//     'position': {
//       'y':1
//     }
//   }
// }

class Chapter1 extends THREE.Object3D {
  constructor() {
    super()
  }
  init() {
    //load tous les atlas et tous les assets
    //load les parametres de position (part et prop)
    //pendant ce temps -> loading
    //puis -> prechauffage des textures

    //trier toutes les textures (sprite et utils)
    //sprite -> directement add aux parties avec sa position
    //utils -> pouvoir acceder a la texture par référence à la volée

    //créer une partie pour chaque partie dans le tri contenant les layers
    this.loadAssets().then(() => {
      this.createParts()
    })
  }
  loadAssets() {
    return new Promise((resolve, reject) => {
      loadTextureAtlasFromPath('/assets/avril/atlases/part1/').then(
        textureAtlas => {
          this.addTextures(textureAtlas.textures)
          // this.add(new Sprite(textureAtlas.getTextureAndSize('part1_layer0')))
          resolve()
        }
      )
    })
  }
  addTextures(textures) {
    if (!this.textures) this.textures = {}
    this.textures = { ...this.textures, ...textures }
    console.log(this.textures)
  }
  createParts() {
    console.log(this.partedTextures)
    this.parts = {}
    for (let [name, part] of Object.entries(this.textures)) {
      console.log(part)
      // this.parts[name] = part
    }
    // Objectthis.partedTextures
    // this.parts = {}
    // this.parts['part1'] = new ChapterPart({layers:
    //   [
    //     {
    //       "part1_layer0": {
    //         texture
    //         position
    //       }
    //     }
    //   ]
    // })
  }

  start() {}

  get partedTextures() {
    let parts = {}
    for (let [name, texture] of Object.entries(this.textures)) {
      let partIndex = name
        .split('_')
        .filter(index => index.includes('part'))[0]
        .replace('part', '')
      let layerIndex = name
        .split('_')
        .filter(index => index.includes('layer'))[0]
        .replace('layer', '')
      if (!parts['part' + partIndex]) parts['part' + partIndex] = {}
      parts['part' + partIndex]['layer' + layerIndex] = texture
    }
    return parts
  }
}

export default new Chapter1()
