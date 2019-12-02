import * as THREE from 'three'
import loadSeveralTextureAtlasFromPathes from '@/webGL/utils/loadSeveralTextureAtlasFromPathes'
import Part from '@/webGL/utils/Part'
import GUI from '@/plugins/dat-gui.js'
import LakeReflect from '../components/LakeReflect'
import Viewport from '../utils/Viewport'
import Wind from '../components/Wind'
import Fire from '../components/Fire'
import Stars from '../components/Stars'
import Parallax from '@/webGL/utils/Parallax'
import VirtualScroll from '../../plugins/virtual-scroll'
import gsap from 'gsap'

import AuroreBoreale from '../components/AuroreBoreale'
let positions = require('../../../public/assets/avril/positions/positions')

const pathesArray = [
  '/assets/avril/atlases/part1/',
  '/assets/avril/atlases/part2/',
  '/assets/avril/atlases/lake-reflect/',
  '/assets/avril/atlases/part3/',
  '/assets/avril/atlases/part6/',
  '/assets/avril/atlases/wind/',
]

class Avril extends THREE.Object3D {
  constructor() {
    super()

    this.scale.setScalar(Viewport.width + Viewport.width * 0.06)
  }

  init({ renderer }) {
    VirtualScroll.on(e => {
      gsap.to(this.position, {
        y: '+=' + e.deltaY,
        duration: 1,
      })
    })

    this.renderer = renderer
    this.loadAssets().then(textures => {
      this.textures = textures

      this.initParts()

      //LAKE REFLECT
      this.lake = new LakeReflect({
        map: this.utilsTextures['utils_montagne-reflet'].texture,
        alphaMap: this.utilsTextures['utils_montagne-reflet-alpha'].texture,
      })
      this.lake.fullwidth = true
      this.lake.name = this.lake.children[0].name
      this.parts['part1'].addToLayer(0, this.lake, true)
      //LAKE REFLECT

      //WIND
      this.wind = new Wind({ map: this.utilsTextures['utils_wind'].texture })
      this.wind.name = this.wind.children[0].name
      this.parts['part2'].addToLayer(0, this.wind, true)

      // this.wind2 = new Wind({ map: this.utilsTextures['utils_wind'].texture })
      //this.wind2.scale.setScalar(Viewport.width - 10)
      // this.wind2.position.y = 50
      // this.add(this.wind)
      // this.add(this.wind)
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
          this.fire.name = 'Fire'
          this.parts['part1'].addToLayer(1, this.fire)
          console.log(this.fire)
          this.fire.position.y = 1
          this.fire.scale.set(2, 1.5, 1)
        }
      )

      this.stars = new Stars()
      this.stars.name = 'Stars'
      this.parts['part6'].addToLayer(0, this.stars)

      this.auroreBoreale = new AuroreBoreale({ renderer: this.renderer })
      this.auroreBoreale.name = 'Aurore Boreale'
      this.auroreBoreale.fullwidth = true
      this.parts['part3'].addToLayer(4, this.auroreBoreale)
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

      let bouding = this.getBoudingBoxPart(part)
      var box = new THREE.Box3().setFromArray(bouding)

      let height = box.max.y - box.min.y
      // console.log(height, name)

      var geometry = new THREE.BoxGeometry(1, height, 0.05)
      var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true,
      })
      var cube = new THREE.Mesh(geometry, material)
      cube.position.z = -0.4
      console.log('Y', name, part.position.y)
      cube.position.y = part.position.y - box.min.y / 2
      this.add(cube)

      folder.add(part.position, 'y').name('position y part')
      folder.add(part, 'visible')

      part.name = name
      this.parts[name] = part

      this.add(part)
    }
  }

  getBoudingBoxPart(part) {
    let array = []
    Object.values(part.children).forEach(element => {
      var box = new THREE.Box3().setFromObject(element.children[0])
      array.push(
        box.min.x,
        box.min.y,
        box.min.z,
        box.max.x,
        box.max.y,
        box.max.z
      )
    })
    return array
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
