import * as THREE from 'three'
import TextureAtlas from '../utils/TextureAtlas'
import atlasJSON from '@/assets/intro/intro_branches_sprite.json'
import Sprite from '../utils/Sprite'
import Viewport from '../utils/Viewport'
import Viewsize from '../utils/Viewsize'
import Camera from '../utils/Camera'
import VirtualScroll from '../../plugins/virtual-scroll'
import gsap from 'gsap'

class Intro extends THREE.Object3D {
  constructor() {
    super()
  }

  init() {
    this.targetSprite = false
    console.log('viewport : ', Viewport)
    console.log('viewsize : ', Viewsize)

    this.loadAssets().then(this.start.bind(this))
    document.addEventListener('touchstart', this.handleTouchStart.bind(this))
    document.addEventListener('touchend', this.handleTouchEnd.bind(this))
  }

  handleTouchStart(e) {
    this.targetSprite = true

    const position = this.children
      .sort((a, b) => b.renderOrder - a.renderOrder)
      .map(sprite => sprite.position)

    const dirPosition = this.children.map(sprite => {
      return new THREE.Vector2(sprite.position.x, sprite.position.y)
        .normalize()
        .multiplyScalar(Viewsize.height)
    })

    gsap
      .to(position, {
        duration: 0.5,
        ease: 'power4.in',
        stagger: {
          amount: 3,
        },
        x: index => dirPosition[index].x,
        y: index => dirPosition[index].y,
      })
      .then(() => {
        this.endIntro()
      })
  }

  handleTouchEnd() {
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

  endIntro() {
    console.log('intro animation is finish')
  }

  start() {
    this.textures = Object.entries(this.textureAtlas.textures)

    this.textures.forEach((element, index) => {
      let sprite = new Sprite({
        texture: this.textureAtlas.getTexture(element[0]),
        size: this.textureAtlas.getSize(element[0]),
      })

      sprite.scale.set(4, 4, 4)

      let spritePosition = new THREE.Vector3()
      let x, y

      if (Math.round(Math.random())) {
        x = this.randomBetweenTwoValues(-Viewsize.width, Viewsize.width)
        y = this.faceToFace(Viewsize.height)
      } else {
        x = this.faceToFace(Viewsize.width)
        y = this.randomBetweenTwoValues(-Viewsize.height, Viewsize.height)
      }

      spritePosition.x = x / 2
      spritePosition.y = y / 2
      spritePosition.z = 0

      sprite.position.copy(spritePosition)

      this.add(sprite)

      let angleToTheCenter =
        this.findAngle(
          new THREE.Vector3(0, 0, 0),
          sprite.position,
          new THREE.Vector3(sprite.position.x, 0, 0)
        ) * Math.sign(sprite.position.x)

      if (sprite.position.y > 0) {
        const radian = this.flipRadian(angleToTheCenter)
        sprite.rotation.set(0, 0, -radian)
      } else sprite.rotation.set(0, 0, angleToTheCenter)

      sprite.renderOrder = index
    })
  }

  faceToFace = width => {
    return Math.round(Math.random()) ? -width / 2 : width / 2
  }
  flipRadian = angle => {
    return (angle + Math.PI) % (2 * Math.PI)
  }
  randomBetweenTwoValues = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  findAngle = (A, B, C) => {
    var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2))
    var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2))
    var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2))
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB))
  }
}

export default new Intro()
