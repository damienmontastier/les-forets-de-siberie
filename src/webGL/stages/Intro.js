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
    this.touchStartPosition = new THREE.Vector3(0, 0, 0)
    this.touchMovePosition = new THREE.Vector3(0, 0, 0)
    this.selectedObject
    console.log('viewport : ', this.viewport)
    console.log('viewsize : ', this.viewSize)
    // loading assets
    this.loadAssets().then(this.start.bind(this))
    document.addEventListener('touchstart', this.handleTouchStart.bind(this))
    document.addEventListener('touchend', this.handleTouchEnd.bind(this))
    document.addEventListener('touchmove', this.handleTouchMove.bind(this))
  }
  handleTouchStart(e) {
    this.touchStartPosition.x =
      (e.touches[0].clientX / window.innerWidth) * 2 - 1
    this.touchStartPosition.y =
      -(e.touches[0].clientY / window.innerHeight) * 2 + 1
    this.touchStartPosition.z = 0

    this.raycaster.setFromCamera(this.touchStartPosition, Camera)
    const intersects = this.raycaster.intersectObjects(this.children, true)
    let order = null
    if (intersects.length == 0) return
    else {
      this.targetSprite = true

      intersects.filter(intersect => {
        if (order != 'null' && intersect.object.parent.renderOrder >= order) {
          this.selectedObject = intersect.object.parent

          this.selectedObject.vectorNormalized = new THREE.Vector2(
            this.selectedObject.position.x,
            this.selectedObject.position.y
          ).normalize()
          // .multiplyScalar(5)
        }
        order = intersect.object.parent.renderOrder
      })
    }
  }
  handleTouchEnd(e) {
    this.targetSprite = false
  }

  handleTouchMove(e) {
    if (this.targetSprite) {
      this.touchMovePosition.x =
        (e.touches[0].clientX / window.innerWidth) * 2 - 1
      this.touchMovePosition.y =
        -(e.touches[0].clientY / window.innerHeight) * 2 + 1
      this.touchMovePosition.z = 0

      console.log(this.touchMovePosition.y)

      TweenMax.to(this.selectedObject.position, 5, {
        x: this.touchMovePosition.x,
        y: this.touchMovePosition.y,
        ease: Power4.easeOut,
      })
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
        sprite.scale.set(1, 1, 1)

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
  dist = (x1, y1, x2, y2) =>
    Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

export default new Intro()
