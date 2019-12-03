import * as THREE from 'three'
import loadSeveralTextureAtlasFromPathes from '@/webGL/utils/loadSeveralTextureAtlasFromPathes'
import Part from '@/webGL/utils/Part'
import GUI from '@/plugins/dat-gui.js'
import LakeReflect from '../components/LakeReflect'
import Viewport from '../utils/Viewport'
import Wind from '../components/Wind'
import Fire from '../components/Fire'
import Stars from '../components/Stars'
import Events from '../../plugins/events'

import Parallax from '@/webGL/utils/Parallax'
import AudioManager from '../../plugins/audio-manager'
import gsap from 'gsap'

import AuroreBoreale from '../components/AuroreBoreale'
import Frost from '../components/Frost'
import Water from '../components/Water'
import Sun from '../components/Sun'
import Background from '../components/Background'

let positions = require('../../../public/assets/avril/positions/positions')
let avril_sprites = require('../../../public/sounds/avril_sprites.mp3')

const pathesArray = [
  '/assets/avril/atlases/part1/',
  '/assets/avril/atlases/part2/',
  '/assets/avril/atlases/lake-reflect/',
  '/assets/avril/atlases/part3/',
  '/assets/avril/atlases/part6/',
  '/assets/avril/atlases/wind/',
  '/assets/avril/atlases/part4/',
  '/assets/avril/atlases/sun/',
  '/assets/avril/atlases/background/',
]

class Avril extends THREE.Object3D {
  constructor() {
    super()

    this.scale.setScalar(Viewport.width + Viewport.width * 0.06)
  }

  init({ renderer }) {
    this.renderer = renderer

    this.loadAssets().then(textures => {
      this.textures = textures

      this.initParts()

      Parallax.add(this.parts['part1'])
      AudioManager.play('lake')

      //LAKE REFLECT
      this.lake = new LakeReflect({
        map: this.utilsTextures['utils_montagne-reflet'].texture,
        alphaMap: this.utilsTextures['utils_montagne-reflet-alpha'].texture,
      })
      this.lake.name = this.lake.children[0].name
      this.parts['part1'].addToLayer({
        indexLayer: 0,
        mesh: this.lake,
        fullwidth: true,
      })
      //LAKE REFLECT

      //WIND
      // this.wind = new Wind({ map: this.utilsTextures['utils_wind'].texture })
      //this.wind.scale.setScalar(Viewport.width)
      // this.lake.fullwidth = true

      //WIND
      this.wind = new Wind({ map: this.utilsTextures['utils_wind'].texture })
      this.wind.name = this.wind.children[0].name
      this.parts['part2'].addToLayer({
        indexLayer: 0,
        mesh: this.wind,
        fullwidth: true,
      })

      // this.wind2 = new Wind({ map: this.utilsTextures['utils_wind'].texture })
      //this.wind2.scale.setScalar(Viewport.width - 10)
      // this.wind2.position.y = 50
      //this.add(this.wind)
      // this.add(this.wind)
      //WIND

      let loader = new THREE.TextureLoader()

      //FIRE
      loader.load('/assets/avril/sprites/fire/sprite.png', texture => {
        this.fire = new Fire({
          map: texture,
          horizontalTiles: 4,
          verticalTiles: 4,
        })
        this.fire.name = 'Fire'
        this.parts['part1'].addToLayer({
          indexLayer: 0.1,
          mesh: this.fire,
        })
        this.fire.position.y = 1
        this.fire.scale.set(2, 2.5, 1)
      })

      this.stars = new Stars()
      this.stars.name = 'Stars'
      // this.parts['part6'].addToLayer({
      //   indexLayer: 0,
      //   mesh: this.stars,
      // })

      // AURORE
      this.auroreBoreale = new AuroreBoreale({ renderer: this.renderer })
      this.auroreBoreale.position.z = 0.001
      this.auroreBoreale.name = 'Aurore Boreale'
      this.parts['auroreBoreal'] = new Part({ name: 'auroreBoreal' })

      this.parts['auroreBoreal'].position.y = this.getPositionY('auroreBoreal')

      this.add(this.parts['auroreBoreal'])
      this.addGUIPart(GUI.__folders['auroreBoreal'], this.parts['auroreBoreal'])
      this.parts['auroreBoreal'].addToLayer({
        indexLayer: 0,
        mesh: this.auroreBoreale,
      })
      this.parts['auroreBoreal'].boundingBox = this.getBoudingBoxPart(
        this.parts['auroreBoreal']
      )
      // AURORE

      loader.load('/assets/avril/textures/frost.jpg', texture => {
        this.frost = new Frost({ renderer: this.renderer, map: texture })
        //this.add(this.frost)
      })

      //WATER
      this.water = new Water({ map: this.utilsTextures['utils_water'].texture })
      //this.add(this.water)
      //WATER

      //SUN
      this.sun = new Sun({
        map: this.utilsTextures['utils_sun-red'].texture,
        map2: this.utilsTextures['utils_sun-yellow'].texture,
      })
      //this.add(this.sun)
      //SUN

      let backgroundTextures = []
      Object.keys(this.utilsTextures)
        .filter(name => {
          return name.includes('background')
        })
        .forEach(key => {
          backgroundTextures.push(this.utilsTextures[key].texture)
        })

      //BACKGROUND
      this.background = new Background({
        texture: this.utilsTextures['utils_background0'].texture,
      })
      this.add(this.background)
      this.background.position.z = -0.5
      //BACKGROUND
      this.handleEvents()
    })
  }
  handleEvents() {
    let current = this.getObjectByName('part1')

    Events.on('scroll', data => {
      this.amountScroll = data.amountScroll

      gsap.to(this.position, {
        y: -this.amountScroll,
        duration: 1,
      })

      if (current != this.currentPart) {
        this.currentPartChanged({ current: this.currentPart, last: current })
      }

      current = this.currentPart

      this.doesCurrentStepChanged = current
    })
  }

  currentPartChanged({ current, last }) {
    console.log(current, last, this.currentPart)

    AudioManager.stop(last.name)
    AudioManager.play(current.name)
    Parallax.remove(last)
    Parallax.add(current)
  }

  loadAssets() {
    let promises = []
    return new Promise((resolve, reject) => {
      promises.push(
        new Promise((resolve, reject) => {
          loadSeveralTextureAtlasFromPathes(pathesArray).then(textures => {
            resolve(textures)
          })
        })
      )
      promises.push(
        new Promise((resolve, reject) => {
          AudioManager.add(avril_sprites).then(() => {
            resolve()
          })
        })
      )

      Promise.all(promises).then(values => {
        resolve(values[0])
      })
    })
  }

  addGUIPart(folder, part) {
    folder.add(part.position, 'y').name('position y part')
    folder.add(part, 'visible')
  }

  initParts() {
    this.parts = {}
    let folder

    Object.entries(this.partedTextures).forEach(partedTextures => {
      let name = partedTextures[0]
      let textures = partedTextures[1]

      // folder = GUI.addFolder(name)

      let part = new Part({ name, textures })

      part.updateMatrixWorld()

      let positionY = positions[name] ? positions[name].y : 0
      part.position.y = positionY

      this.addGUIPart(GUI.__folders[name], part)

      part.name = name
      this.parts[name] = part

      this.add(part)

      let bounding = this.getBoudingBoxPart(part)
      bounding.height = bounding.max.y - bounding.min.y

      this.parts[name].boundingBox = bounding
    })
  }

  getPositionY(part) {
    if (!positions[part]) return 0
    else return positions[part].y
  }

  get currentPart() {
    // if (this.parts) return this.parts['part1']

    let downParts = Object.values(this.parts)
      .filter(part => {
        let partY = part.boundingBox.min.y * Viewport.width
        // console.log(part.name, partY)
        return partY < this.amountScroll
      })
      .sort((a, b) => {
        return a.boundingBox.min.y - b.boundingBox.min.y
      })

    let length = downParts.length
    let current = downParts[length - 1]

    return current
  }

  getBoudingBoxPart(part) {
    let array = []
    part.traverse(mesh => {
      if (mesh.geometry) {
        mesh.geometry.computeBoundingBox()
        let boundingBox = new THREE.Box3()
        boundingBox.copy(mesh.geometry.boundingBox)
        mesh.updateMatrixWorld(true)
        boundingBox.applyMatrix4(mesh.matrixWorld)
        boundingBox.applyMatrix4(part.matrixWorld)
        boundingBox.min.y += part.position.y
        boundingBox.max.y += part.position.y
        boundingBox.min.z = 0
        boundingBox.max.z = 1

        array.push(boundingBox.min, boundingBox.max)
      }
    })
    return new THREE.Box3().setFromPoints(array)
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
