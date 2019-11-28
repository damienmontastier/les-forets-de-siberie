import * as THREE from 'three'
import gsap from 'gsap'
import Parallax from '@/webGL/utils/Parallax'
import loadSeveralTextureAtlasFromPathes from '@/webGL/utils/loadSeveralTextureAtlasFromPathes'
import Part from '@/webGL/utils/Part'
import GUI from '@/plugins/dat-gui.js'

const pathesArray = [
  '/assets/avril/atlases/part1/',
  '/assets/avril/atlases/part2/',
  '/assets/avril/atlases/part3/',
]

class Avril extends THREE.Object3D {
  constructor() {
    super()
  }
  init() {
    this.loadAssets().then(textures => {
      this.textures = textures

      this.initParts()

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
  initParts() {
    this.parts = {}
    let GUIPartFolder
    for (let [name, layers] of Object.entries(this.partedTextures)) {
      GUIPartFolder = GUI.addFolder(name)
      let part = new Part({ name, layers })
      this.parts[name] = part
      this.add(part)
    }
    console.log(this)
  }

  get utilsTextures() {
    let textures = {}
    Object.keys(this.textures)
      .filter(texture => texture.includes('utils'))
      .forEach(key => {
        textures[key] = this.textures[key]
      })
    return textures
  }

  get partedTextures() {
    let parts = {}

    let textures = {}
    Object.keys(this.textures)
      .filter(texture => !texture.includes('utils'))
      .forEach(key => {
        textures[key] = this.textures[key]
      })

    for (let [name, texture] of Object.entries(textures)) {
      let partIndex = name
        .split('_')
        .filter(index => index.includes('part'))[0]
        .replace('part', '')
      let layerIndex = name
        .split('_')
        .filter(index => index.includes('layer'))[0]
        .replace('layer', '')
      if (!parts['part' + partIndex]) parts['part' + partIndex] = {}
      parts['part' + partIndex]['layer' + layerIndex] = { texture }
    }
    return parts
  }
}

const avril = new Avril()
export default avril
