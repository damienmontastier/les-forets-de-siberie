import loadTextureAtlasFromPath from '@/webGL/utils/loadTextureAtlasFromPath'

export default function loadSeveralTextureAtlasFromPathes(pathes) {
  const promises = []
  let textures = {}

  pathes.forEach(path => {
    let promise = new Promise((resolve, reject) => {
      loadTextureAtlasFromPath(path).then(texturesAtlas => {
        textures = { ...textures, ...texturesAtlas }
        resolve()
      })
    })
    promises.push(promise)
  })

  return new Promise((resolve, reject) => {
    Promise.all(promises).then(() => {
      resolve(textures)
    })
  })
}
