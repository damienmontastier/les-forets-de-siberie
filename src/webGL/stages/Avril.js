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

      var geometry = new THREE.BoxGeometry(1, 1, 1)
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      var cube = new THREE.Mesh(geometry, material)

      // this.parts['part1'].addToLayer(0, cube)
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
    let folder
    for (let [name, layers] of Object.entries(this.partedTextures)) {
      folder = GUI.addFolder(name)
      let part = new Part({ name, layers })
      folder
        .add(part.position, 'y')
        .step(1)
        .name('position y part')
      part.name = name
      this.parts[name] = part
      this.add(part)
    }
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
