import * as THREE from 'three'
import TextureAtlas from '../utils/TextureAtlas'
import atlasJSON from '@/assets/intro/intro_branches_sprite.json'
import Sprite from '../utils/Sprite'
import Viewport from '../utils/Viewport'
import Viewsize from '../utils/Viewsize'
import Camera from '../utils/Camera'
import gsap from 'gsap'

class Intro extends THREE.Object3D {
  constructor() {
    super()
  }

  init() {
    this.targetSprite = false
    this.mouse = new THREE.Vector3()
    this.selectedObject
    // loading assets
    this.loadAssets().then(this.start.bind(this))
    document.addEventListener('touchstart', this.handleTouchStart.bind(this))
    document.addEventListener('touchend', this.handleTouchEnd.bind(this))
  }
  handleTouchStart(e) {
    this.children.forEach((sprite, index) => {
      let dirPosition = new THREE.Vector2(sprite.position.x, sprite.position.y)
        .normalize()
        .multiplyScalar(10)

      gsap.to(sprite.position, {
        delay: index * 0.15,
        duration: 1,
        ease: 'power4.in',
        x: dirPosition.x,
        y: dirPosition.y,
      })
    })
  }
  handleTouchEnd(e) {
    this.targetSprite = false
  }

  loadAssets() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.TextureLoader()

      loader.load('/assets/intro/atlas/intro_branches_sprite.png', texture => {
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
        sprite.scale.set(3, 3, 3)

        let position = new THREE.Vector3()

        // if (Math.round(Math.random())) {
        let x = this.randomBetweenTwoValues(
          -Viewsize.width - sprite.scale.x,
          Viewsize.width - sprite.scale.x
        )
        let y = this.faceToFace(Viewsize.height - sprite.scale.y)
        position.x = x
        position.y = y
        // } else {
        //   let x = this.faceToFace(
        //     Viewsize.width - sprite.geometry.parameters.width / 2
        //   )
        //   let y = this.randomBetweenTwoValues(
        //     -Viewsize.height / 2 + sprite.geometry.parameters.height,
        //     Viewsize.height / 2 + +sprite.geometry.parameters.height
        //   )
        //   position.x = x
        //   position.y = y
        //   position.z = 0
        // }

        this.add(sprite)

        sprite.position.copy(position)

        sprite.renderOrder = index
      }
    })
  }

  faceToFace = width => {
    return Math.round(Math.random()) ? -width / 2 : width / 2
  }

  randomBetweenTwoValues = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

export default new Intro()
