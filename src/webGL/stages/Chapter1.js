import * as THREE from 'three'
import TweenMax from 'gsap'
import Layer from '@/webGL/utils/Layer'
import TextureAtlas from '../utils/TextureAtlas'

import atlasJSON from '@/assets/chapter1/test.json'

class Chapter1 extends THREE.Object3D {
  constructor() {
    super()
  }
  init() {
    this.loadAssets().then(textureAtlas => {
      const layer = new Layer({ textureAtlas })
    })

    // const layer = new Layer()
    // document.addEventListener('touchmove', this.handleScroll.bind(this))
    // document.addEventListener('touchstart', this.handleStart.bind(this))

    this.start()
  }

  loadAssets() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.TextureLoader()

      loader.load('/assets/intro/atlas/atlas.png', texture => {
        this.textureAtlas = new TextureAtlas(atlasJSON, texture.image)
        resolve(this.textureAtlas)
      })
    })
  }

  start() {
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // var geometry = new THREE.BoxGeometry(1, 1, 1)
    // for (let index = 0; index < 10; index++) {
    //   let cube = new THREE.Mesh(geometry, material)
    //   cube.position.set(1, 1 * index, 1)
    //   cube.material.color = THREE.Color(0xffffff)
    //   this.add(cube)
    // }
  }
  handleScroll(e) {
    TweenMax.to(this.position, 1, {
      y: 2
    })
  }
  handleStart(e) {
    console.log(e)
  }
}

const stage1 = new Chapter1()
export default stage1
