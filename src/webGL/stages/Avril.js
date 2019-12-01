import * as THREE from 'three'
import loadSeveralTextureAtlasFromPathes from '@/webGL/utils/loadSeveralTextureAtlasFromPathes'
import Part from '@/webGL/utils/Part'
import GUI from '@/plugins/dat-gui.js'
import LakeReflect from '../components/LakeReflect'
import Viewport from '../utils/Viewport'
import Wind from '../components/Wind'
import Fire from '../components/Fire'
import Stars from '../components/Stars'
import AuroreBoreale from '../components/AuroreBoreale'
let positions = require('../../../public/assets/avril/positions/positions')

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

    this.scale.setScalar(Viewport.width)
  }
  init({ renderer }) {
    this.renderer = renderer
    this.loadAssets().then(textures => {
      this.textures = textures

      //this.initParts()

      //LAKE REFLECT
      this.lake = new LakeReflect({
        map: this.utilsTextures['utils_montagne-reflet'].texture,
        alphaMap: this.utilsTextures['utils_montagne-reflet-alpha'].texture,
      })

      this.lake.scale.setScalar(Viewport.width + 10)

      //this.add(this.lake)
      //LAKE REFLECT

      //WIND
      this.wind = new Wind({ map: this.utilsTextures['utils_wind'].texture })
      //this.wind.scale.setScalar(Viewport.width)

      // this.wind2 = new Wind({ map: this.utilsTextures['utils_wind'].texture })
      //this.wind2.scale.setScalar(Viewport.width - 10)
      // this.wind2.position.y = 50
      //this.add(this.wind)
      //this.add(this.wind)
      //WIND

      //FIRE
      let loader = new THREE.TextureLoader().load(
        '/assets/avril/sprites/fire/sprite.png',
        texture => {
          this.fire = new Fire({
            map: texture,
            horizontalTiles: 4,
            verticalTiles: 4,
          })
          //this.add(this.fire)
        }
      )

      this.stars = new Stars()
      // this.stars.scale.setScalar(Viewport.width)
      //this.add(this.stars)
      //FIRE

      this.auroreBoreale = new AuroreBoreale({ renderer: this.renderer })
      this.add(this.auroreBoreale)

      this.auroreBoreale.position.z = 0.001
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

      let positionY = positions[name] ? positions[name].y : 0
      part.position.y = positionY

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

      let params =
        positions['part' + partIndex] !== undefined
          ? positions['part' + partIndex].sprites[texture.name]
          : { y: 0, fullwidth: false }

      if (!parts['part' + partIndex]) parts['part' + partIndex] = {}
      parts['part' + partIndex]['layer' + layerIndex] = { texture, params }
    }
    return parts
  }
}

const avril = new Avril()
export default avril
