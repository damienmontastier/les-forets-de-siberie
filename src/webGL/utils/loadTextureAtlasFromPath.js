import TextureAtlas from '@/webGL/utils/TextureAtlas'
import * as THREE from 'three'

export default function loadAtlasTextureFromPath(path) {
  let promises = []

  let jsonLoad = new Promise((resolve, reject) => {
    fetch(path + 'atlas.json')
      .then(response => response.json())
      .then(data => {
        resolve(data.frames)
      })
  })

  let imageLoad = new Promise((resolve, reject) => {
    let loader = new THREE.TextureLoader()

    loader.load(path + 'atlas.png', texture => {
      resolve(texture)
    })
  })

  promises = [jsonLoad, imageLoad]

  return new Promise((resolve, reject) => {
    Promise.all(promises).then(data => {
      resolve(new TextureAtlas(data[0], data[1].image).textures)
    })
  })
}
