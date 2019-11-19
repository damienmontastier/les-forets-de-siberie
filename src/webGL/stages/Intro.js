import * as THREE from 'three'
import TextureAtlas from '../utils/TextureAtlas'
import atlasJSON from '@/assets/intro/atlas_intro.json'
import Sprite from '../utils/Sprite'
import Viewport from '../utils/Viewport'
import Camera from '../utils/Camera'
import TweenMax, { Power4 } from 'gsap'

class Intro extends THREE.Object3D {
  constructor() {
    super()
  }

  init() {
    this.targetSprite = false
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.selectedObject
    console.log('viewport : ', this.viewport)
    console.log('viewsize : ', this.viewSize)
    // loading assets
    this.loadAssets().then(this.start.bind(this))
    document.addEventListener('touchstart', this.handleTouchStart.bind(this))
    document.addEventListener('touchend', this.handleTouchEnd.bind(this))
    document.addEventListener('touchmove', this.handleTouchMove.bind(this))
    document.addEventListener('touchleave', this.handleTouchLeave.bind(this))
  }
  handleTouchStart(e) {
    this.raycaster.setFromCamera(this.mouse, Camera)
    const intersects = this.raycaster.intersectObjects(this.children, true)
    let order = null
    if (intersects.length == 0) return
    else {
      this.targetSprite = true

      intersects.filter(intersect => {
        if (order != 'null' && intersect.object.parent.renderOrder >= order) {
          this.selectedObject = intersect.object.parent
        }
        order = intersect.object.parent.renderOrder
      })
    }
  }
  handleTouchEnd(e) {
    this.targetSprite = false
  }
  handleTouchLeave(e) {
    console.log('yah')
  }
  handleTouchMove(e) {
    this.mouse = {
      x: (e.touches[0].clientX / window.innerWidth) * 2 - 1,
      y: -(e.touches[0].clientY / window.innerHeight) * 2 + 1,
    }
    if (this.targetSprite) {
      TweenMax.to(this.selectedObject.position, 2, {
        x: this.mouse.x,
        y: this.mouse.y,
        ease: Power4.easeOut,
      })
      console.log('move sprite')
    }
  }
  loadAssets() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.TextureLoader()

      loader.load('/assets/intro/atlas/atlas.png', texture => {
        this.textureAtlas = new TextureAtlas(atlasJSON, texture.image)
        resolve()
      })
    })
  }

  start() {
    this.textures = Object.entries(this.textureAtlas.textures)

    this.textures.forEach((element, index, key) => {
      if (index < 10) {
        let sprite = new Sprite({
          texture: this.textureAtlas.getTexture(element[0]),
          size: this.textureAtlas.getSize(element[0]),
        })
        sprite.scale.set(2, 2, 2)

        let positionSpriteX = this.faceToFace(
          this.viewSize.width - sprite.geometry.parameters.width / 2
        )
        let positionSpriteY = this.randomBetweenTwoValues(
          -this.viewSize.height / 2,
          this.viewSize.height / 2
        )

        this.add(sprite)

        sprite.position.set(positionSpriteX, positionSpriteY, 1)

        sprite.renderOrder = index
      }
    })
  }
  get viewSize() {
    let distance = Camera.position.z
    let vFov = (Camera.fov * Math.PI) / 180
    let height = 2 * Math.tan(vFov / 2) * distance
    let width = (height * window.innerWidth) / window.innerHeight
    return { width, height, vFov }
  }
  get viewport() {
    let width = window.innerWidth
    let height = window.innerHeight
    let aspectRatio = width / height
    return {
      width,
      height,
      aspectRatio,
    }
  }
  faceToFace = width => {
    return Math.round(Math.random()) ? -width / 2 : width / 2
  }
  randomBetweenTwoValues = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

export default new Intro()
