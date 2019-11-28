import * as THREE from 'three'
import loadSeveralTextureAtlasFromPathes from '@/webGL/utils/loadSeveralTextureAtlasFromPathes'
import Part from '@/webGL/utils/Part'
import GUI from '@/plugins/dat-gui.js'
import LakeReflect from '../components/LakeReflect'
import Viewport from '../utils/Viewport'
import Wind from '../components/Wind'
import Fire from '../components/Fire'

const pathesArray = [
  '/assets/avril/atlases/part1/',
  '/assets/avril/atlases/part2/',
  '/assets/avril/atlases/lake-reflect/',
  '/assets/avril/atlases/part3/',
  '/assets/avril/atlases/wind/',
]

class Avril extends THREE.Object3D {
  constructor() {
    super()
  }
  init() {
    this.loadAssets().then(textures => {
      this.textures = textures

      this.initParts()

      //LAKE REFLECT
      console.log(this.utilsTextures)
      this.lake = new LakeReflect({
        map: this.utilsTextures['utils_montagne-reflet'].texture,
        alphaMap: this.utilsTextures['utils_montagne-reflet-alpha'].texture,
      })

      this.lake.scale.setScalar(Viewport.width + 10)

      //this.add(this.lake)
      //LAKE REFLECT

      //WIND
      this.wind = new Wind({ map: this.utilsTextures['utils_wind'].texture })
      this.wind.scale.setScalar(Viewport.width)

      // this.wind2 = new Wind({ map: this.utilsTextures['utils_wind'].texture })
      // this.wind2.scale.setScalar(Viewport.width - 10)
      // this.wind2.position.y = 50
      //this.add(this.wind)
      // this.add(this.wind2)
      //WIND

      //FIRE
      console.log(this.textures)
      this.fire = new Fire({ map: this.textures['utils_fire'] })
      this.fire.scale.setScalar(Viewport.width / 2)

      this.add(this.fire)
      //FIRE
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
    for (let [name, layers] of Object.entries(this.partedTextures)) {
      GUI.addFolder(name)
      let part = new Part({ name, layers })
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
        textures[key] = { texture: this.textures[key] }
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
