import * as THREE from 'three'
import TextureAtlas from '../utils/TextureAtlas'
import atlasJSON from '../../../public/assets/intro/atlas/intro_branche.json'
import Sprite from '../utils/Sprite'
import Viewport from '../utils/Viewport'
import Camera from '../utils/Camera'
import VirtualScroll from '../../plugins/virtual-scroll'
import gsap from 'gsap'
import loadTextureAtlasFromPath from '@/webGL/utils/loadTextureAtlasFromPath'

class Intro extends THREE.Object3D {
  constructor() {
    super()

    this.centerPosition = []
    this.scale.setScalar(Viewport.width + Viewport.width * 0.06)
  }

  init() {
    this.animationPlayed = false
    console.log('viewport : ', Viewport)

    this.loadAssets().then(this.start.bind(this))
    document.addEventListener('touchstart', this.handleTouchStart.bind(this))

    setTimeout(() => {
      this.startLoadingAnimation()
    }, 5000)

    // VirtualScroll.on(e => {
    //   console.log('event', e.originalEvent)
    // })
  }

  startLoadingAnimation() {
    gsap.to(this.getPositionMeshes, {
      duration: 1,
      ease: 'power4.inOut',
      stagger: {
        amount: 2,
      },
      x: index => this.children[index].centerPosition.x,
      y: index => this.children[index].centerPosition.y,
    })
  }

  handleTouchStart(e) {
    if (this.animationPlayed) return

    this.animationPlayed = true

    gsap
      .to(this.getPositionMeshes, {
        duration: 1,
        ease: 'power4.inOut',
        stagger: {
          amount: 2,
        },
        onComplete: () => {
          this.finish()
        },
        x: index => this.children[index].finalPositon.x,
        y: index => this.children[index].finalPositon.y,
      })
      .then(() => {
        this.endIntro()
      })
  }

  loadAssets() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.TextureLoader()

      loader.load('/assets/intro/atlas/intro_branche.png', texture => {
        this.textureAtlas = new TextureAtlas(atlasJSON.frames, texture.image)
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

      let mesh = sprite.children[0]

      mesh.scale.multiplyScalar(1.5)

      mesh.centerPosition = this.getCenterPosition

      mesh.finalPositon = this.getFinalPosition(mesh.centerPosition)

      let loadingPosition = this.getFinalPosition(
        mesh.centerPosition
      ).multiplyScalar(2)

      mesh.position.x = loadingPosition.x
      mesh.position.y = loadingPosition.y

      this.add(mesh)

      let angleToTheCenter =
        this.findAngle(
          new THREE.Vector3(0, 0, 0),
          mesh.position,
          new THREE.Vector3(mesh.position.x, 0, 0)
        ) * Math.sign(mesh.position.x)

      if (mesh.position.y > 0) {
        const radian = this.flipRadian(angleToTheCenter)
        mesh.rotation.set(0, 0, -radian)
      } else mesh.rotation.set(0, 0, angleToTheCenter)

      mesh.renderOrder = index
    })
  }

  get getCenterPosition() {
    let x, y

    if (Math.round(Math.random())) {
      x = this.randomBetweenTwoValues(-0.4, 0.4)
      y = this.faceToFace(0.4)
    } else {
      x = this.faceToFace(0.4)
      y = this.randomBetweenTwoValues(-0.4, 0.4)
    }
    this.centerPosition.push({ x, y })
    return new THREE.Vector2(x, y)
  }

  getFinalPosition({ x, y }) {
    return new THREE.Vector2(x, y).normalize().multiplyScalar(1.25)
  }

  get getPositionMeshes() {
    let a = this.children
      .sort((a, b) => b.renderOrder - a.renderOrder)
      .map(sprite => sprite.position)
    return a
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
