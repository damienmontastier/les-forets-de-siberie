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
import AudioManager from '../../plugins/audio-manager'
import gsap from 'gsap'

import AuroreBoreale from '../components/AuroreBoreale'
let positions = require('../../../public/assets/avril/positions/positions')

let avril_sprites = require('../../../public/sounds/avril_sprites.mp3')

AudioManager.add(avril_sprites).then(() => {
  // console.log('ok load')
})
AudioManager.play('lake')

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
      // console.log(e.y)
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
      // this.lake.fullwidth = true
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
      this.parts['part2'].addToLayer({
        indexLayer: 0,
        mesh: this.wind,
        fullwidth: true,
      })

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
          this.parts['part1'].addToLayer({
            indexLayer: 2,
            mesh: this.fire,
          })
          this.fire.position.y = 1.5
          this.fire.scale.set(2, 1.5, 1)
        }
      )

      this.stars = new Stars()
      this.stars.name = 'Stars'
      this.parts['part6'].addToLayer({
        indexLayer: 0,
        mesh: this.stars,
      })

      this.auroreBoreale = new AuroreBoreale({ renderer: this.renderer })
      this.auroreBoreale.name = 'Aurore Boreale'
      this.auroreBoreale.fullwidth = true
      this.parts['part3'].addToLayer({
        indexLayer: 4,
        mesh: this.auroreBoreale,
      })

      Object.values(this.parts).forEach(element => {
        let bouding = this.getBoudingBoxPart(element)
        // console.log(bouding)
        let helper = new THREE.Box3Helper(bouding, 0xff0000)
        this.add(helper)
        console.log(element.name, bouding)
      })
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

      part.updateMatrixWorld()

      let positionY = positions[name] ? positions[name].y : 0
      part.position.y = positionY

      folder.add(part.position, 'y').name('position y part')
      folder.add(part, 'visible')

      part.name = name
      this.parts[name] = part

      this.add(part)
    }
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

        // let height = boundingBox.max.y - boundingBox.min.y
        // let planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
        // let planeMaterial = new THREE.MeshBasicMaterial({
        //   color: 0xffffff,
        // })
        // let plane = new THREE.Mesh(planeGeometry, planeMaterial)
        // this.add(plane)
        // plane.position.z = -0.1
        // plane.position.y = boundingBox.min.y + height / 2
        // plane.scale.set(1, height, 1)

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
