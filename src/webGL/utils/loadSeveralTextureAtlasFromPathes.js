import loadTextureAtlasFromPath from '@/webGL/utils/loadTextureAtlasFromPath'

export default function loadSeveralTextureAtlasFromPathes(pathes) {
  const promises = []
  let textures = {}

  pathes.forEach(path => {
    let promise = new Promise((resolve, reject) => {
      loadTextureAtlasFromPath(path).then(texturesAtlas => {
        resolve(texturesAtlas)
      })
    })
    promises.push(promise)
  })

  // return new Promise((resolve, reject) => {
  return Promise.all(promises).then(test => {
    textures = { ...textures, ...test }

    console.log(test)
    // resolve(textures)
  })
  // })
}
