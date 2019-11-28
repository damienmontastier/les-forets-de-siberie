import TextureAtlas from '@/webGL/utils/TextureAtlas'
import * as THREE from 'three'
import loadTextureAtlasFromPath from '@/webGL/utils/loadTextureAtlasFromPath'

export default function loadSeveralTextureAtlasFromPathes(pathes) {
  const promises = []

  pathes.forEach(path => {
    let promise = new Promise((resolve, reject) => {
      loadTextureAtlasFromPath(path).then(resolve)
    })
    promises.push(promise)
  })

  return Promise.all(promises)
}
