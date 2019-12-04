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

import Renderer from '../renderer'

import Parallax from '@/webGL/utils/Parallax'
import AudioManager from '../../plugins/audio-manager'
import gsap from 'gsap'

import AuroreBoreale from '../components/AuroreBoreale'
import Frost from '../components/Frost'
import Water from '../components/Water'
import Sun from '../components/Sun'
import Background from '../components/Background'
import virtualScroll from '../../plugins/virtual-scroll'

let positions = require('../../../public/assets/avril/positions/positions')
let avril_voix = require('../../../public/sounds/avril_voix.mp3')
let avril_bruitages = require('../../../public/sounds/avril_bruitages.mp3')

let timecodes_voix = {
  lake: [0, 4000],
  fire: [5000, 9200],
  auroreBoreal: [15000, 11000],
  wind: [27000, 9000],
  part3: [38000, 12000],
  part6: [52000, 8600],
  frost: [61200, 12000],
}

let timecodes_bruitages = {
  fire: [0, 10050],
  wind: [10060, 9900],
  part3: [20070, 9970],
  part6: [30060, 7800],
  part6: [37190, 10000],
}

const pathesArray = [
  '/assets/avril/atlases/part1/',
  '/assets/avril/atlases/lake-reflect/',
  '/assets/avril/atlases/part3/',
  '/assets/avril/atlases/part6/',
  '/assets/avril/atlases/wind/',
  '/assets/avril/atlases/part4/',
  '/assets/avril/atlases/sun/',
  '/assets/avril/atlases/background/',
]

const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2

class Avril extends THREE.Object3D {
  constructor() {
    super()

    this.scale.setScalar(Viewport.width + Viewport.width * 0.06)
  }

  init({ renderer }) {
    this.renderer = renderer
    this.loadAssets().then(response => {
      this.textures = response.textures

      this.initParts()

      Parallax.disable = true
      this.titleChapterAsDone = false
      this.sprites_voice.play('lake')
      this.sprites_voice.fade(0, 0.5, 800)

      this.sprites_bruitages.play('wind')
      this.sprites_bruitages.fade(0, 0.3, 1500)

      Parallax.add(this.parts['part1'])
      this.sprites_bruitages.play('fire')

      this.sprites_voice.once('end', () => {
        this.titleChapterAsDone = true
      })

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
      this.wind = new Wind({ map: this.utilsTextures['utils_wind'].texture })
      this.wind.name = this.wind.children[0].name

      this.parts['wind'] = new Part({ name: 'wind' })
      this.parts['wind'].position.y = this.getPositionY('wind')
      this.add(this.parts['wind'])
      this.addGUIPart(GUI.__folders['wind'], this.parts['wind'])
      this.parts['wind'].addToLayer({
        indexLayer: 0,
        mesh: this.wind,
        fullwidth: true,
        parallax: false,
      })
      this.parts['wind'].boundingBox = this.getBoudingBoxPart(
        this.parts['wind']
      )
      //WIND

      //FIRE
      let loader = new THREE.TextureLoader()

      loader.load('/assets/avril/sprites/fire/sprite.png', texture => {
        this.fire = new Fire({
          map: texture,
          horizontalTiles: 4,
          verticalTiles: 4,
        })
        this.fire.name = 'Fire'

        this.parts['fire'] = new Part({ name: 'fire' })
        this.parts['fire'].position.y = this.getPositionY('fire')
        this.add(this.parts['fire'])
        this.addGUIPart(GUI.__folders['fire'], this.parts['fire'])
        this.parts['fire'].addToLayer({
          indexLayer: 0,
          mesh: this.fire,
        })
        this.parts['fire'].boundingBox = this.getBoudingBoxPart(
          this.parts['fire']
        )
        this.fire.scale.set(2, 3, 1)
        this.fire.position.z = -0.2
      })

      // STARS
      this.stars = new Stars()
      this.stars.name = 'Stars'
      this.parts['stars'] = new Part({ name: 'stars', interact: false })
      this.parts['stars'].position.y = this.getPositionY('stars')
      this.add(this.parts['stars'])
      this.addGUIPart(GUI.__folders['stars'], this.parts['stars'])
      this.parts['stars'].addToLayer({
        indexLayer: 0,
        mesh: this.stars,
        parallax: false,
      })
      this.parts['stars'].boundingBox = this.getBoudingBoxPart(
        this.parts['stars']
      )

      // STARS

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
        parallax: false,
      })
      this.parts['auroreBoreal'].boundingBox = this.getBoudingBoxPart(
        this.parts['auroreBoreal']
      )
      // AURORE

      loader.load('/assets/avril/textures/frost.jpg', texture => {
        this.frost = new Frost({ renderer: this.renderer, map: texture })
        this.frost.name = 'frost'
        this.parts['frost'] = new Part({ name: 'frost' })

        this.parts['frost'].position.y = this.getPositionY('frost')

        this.add(this.parts['frost'])
        this.addGUIPart(GUI.__folders['frost'], this.parts['frost'])
        this.parts['frost'].addToLayer({
          indexLayer: 0,
          mesh: this.frost,
          parallax: false,
        })
        this.parts['frost'].boundingBox = this.getBoudingBoxPart(
          this.parts['frost']
        )
      })

      //WATER
      this.water = new Water({ map: this.utilsTextures['utils_water'].texture })
      this.parts['part3'].addToLayer({
        indexLayer: 4,
        mesh: this.water,
        parallax: false,
      })
      //WATER

      //SUN
      this.sun = new Sun({
        map: this.utilsTextures['utils_sun-red'].texture,
        map2: this.utilsTextures['utils_sun-yellow'].texture,
      })
      this.sun.position.z = -0.1
      this.parts['sun'] = new Part({ name: 'sun', interact: false })
      this.parts['sun'].position.y = this.getPositionY('sun')
      this.add(this.parts['sun'])
      this.addGUIPart(GUI.__folders['sun'], this.parts['sun'])
      this.parts['sun'].addToLayer({
        indexLayer: 0,
        mesh: this.sun,
        parallax: false,
      })
      this.parts['sun'].boundingBox = this.getBoudingBoxPart(this.parts['sun'])

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
      this.background.position.z = -1
      this.background.position.y = 8
      //BACKGROUND

      //HeatWave
      //Renderer.isComposerEnabled = true
      // setTimeout(() => {
      //   Renderer.HeatWaveEffect.uniforms.get('amplitude').value = 0.09
      // }, 2000)

      //heatwave

      this.handleEvents()
    })
  }
  handleEvents() {
    let current = this.getObjectByName('part1')
    Events.on('scroll', data => {
      this.amountScroll = Math.max(0, data.amountScroll)

      if (!this.titleChapterAsDone) return

      gsap.to(this.position, {
        y: -this.amountScroll,
        duration: 1,
        onUpdate: () => {
          this.detectSun()
        },
      })

      if (this.amountScroll <= 0) {
        Parallax.disable = true
      } else {
        Parallax.disable = false
      }

      if (current != this.currentPart && this.currentPart != undefined) {
        this.currentPartChanged({ current: this.currentPart, last: current })
      }

      current = this.currentPart

      this.doesCurrentStepChanged = current

      this.detectAuroreBoreale()

      this.detectFrost()
    })
  }

  detectFrost() {
    if (this.amountScroll > 17.7 * Viewport.width) {
      gsap.to(this.position, 1, {
        y: -18.1 * Viewport.width,
        onStart: () => {
          this.frost.fadeIn()
        },
      })
      virtualScroll.disabled = true
    }
  }

  detectAuroreBoreale() {
    if (this.parts['auroreBoreal'].done) return
    let boundingBox = this.parts['auroreBoreal'].boundingBox
    let y = boundingBox.min.y * Viewport.width
    let height = boundingBox.max.y - boundingBox.min.y
    height *= Viewport.width
    if (this.amountScroll > y) {
      this.parts['auroreBoreal'].done = true
      virtualScroll.disabled = true

      virtualScroll.amountScroll = this.amountScroll + height / 2 + 100

      gsap.to(this.position, 1, {
        y: -(y + height / 2 + 100),
      })

      setTimeout(() => {
        virtualScroll.disabled = false
      }, 5000)
    }
  }

  detectSun() {
    let boundingBox = this.parts['sun'].boundingBox
    let height = boundingBox.max.y - boundingBox.min.y
    let y = (boundingBox.min.y + height - 0.1 + height / 2) * Viewport.width

    if (-(this.position.y + 599) > y) {
      Renderer.isComposerEnabled = false
      this.parts['sun'].sticky = false
      return
    }

    let deltaY = -this.position.y - y
    // console.log(deltaY)
    let mappedValue = map(deltaY, 0, 600, 0, 1)

    // console.log(mappedValue)
    let amplitude = 1 - mappedValue

    if (-this.position.y > y) {
      Renderer.HeatWaveEffect.uniforms.get('amplitude').value = amplitude * 0.1
      this.sun.uniforms.uProgress.value = mappedValue
    }

    if (this.parts['sun'].sticky) {
      this.parts['sun'].position.y =
        boundingBox.min.y + height / 2 + deltaY / Viewport.width
      // console.log(this.parts['sun'].position.y)
      return
    }

    if (-this.position.y > y) {
      this.parts['sun'].sticky = true

      Renderer.isComposerEnabled = true
      Renderer.HeatWaveEffect.uniforms.get('amplitude').value = 0.1

      gsap.fromTo(
        Renderer.HeatWaveEffect.uniforms.get('amplitude'),
        1,
        {
          value: 0,
        },
        {
          value: 0.1,
          ease: 'power4.out',
        }
      )
    }
  }

  currentPartChanged({ current, last }) {
    this.sprites_voice.stop()
    this.sprites_bruitages.stop()

    this.sprites_voice.play(current.name)
    this.sprites_voice.fade(0, 0.5, 1500)

    this.sprites_bruitages.play(current.name)
    this.sprites_bruitages.fade(0, 0.3, 1500)

    Parallax.remove(last)
    Parallax.add(current)
  }

  loadAssets() {
    let promises = []
    let voices = new Promise((resolve, reject) => {
      AudioManager.addSprite(avril_voix, 0.5, timecodes_voix).then(sounds => {
        this.sprites_voice = sounds
        resolve({ name: sounds })
      })
    })
    let bruitages = new Promise((resolve, reject) => {
      AudioManager.addSprite(avril_bruitages, 0.3, timecodes_bruitages).then(
        sounds => {
          this.sprites_bruitages = sounds
          resolve({ name: sounds })
        }
      )
    })

    let atlases = new Promise((resolve, reject) => {
      loadSeveralTextureAtlasFromPathes(pathesArray).then(textures => {
        resolve({ name: 'textures', data: textures })
      })
    })

    promises.push(atlases)
    promises.push(voices)
    promises.push(bruitages)

    return new Promise((resolve, reject) => {
      Promise.all(promises).then(data => {
        let response = {}
        Object.values(data).forEach(value => {
          response[value.name] = value.data
        })
        resolve(response)
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
        return partY < this.amountScroll && part.interact
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
