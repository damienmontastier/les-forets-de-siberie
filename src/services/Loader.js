import * as PIXI from 'pixi.js'

export default class Loader {
  constructor() {
    this.groups = {}
    this.files = {}
  }

  addGroup(group) {
    this.groups[group.name] = { files: {},loaded:false }
    let loader = new PIXI.Loader()
    this.groups[group.name].loader = loader
    group.files.forEach(file => {
      loader.add(file.name, '/assets' + file.path)
    })
  }

  loadGroup(name) {
    let group = this.groups[name]
    if (!group) {
      console.warn(`group: ${name} doesn't exist`)
      return
    }
    let loader = group.loader
    let files = group.files
    loader.load()
    return new Promise((resolve,reject)=>{
      loader.onComplete.add((loaderRef, ressources) => {
        Object.values(ressources).forEach(ressource => {
          files[ressource.name] = ressource
          this.files[name + '/' + ressource.name] = ressource
        })
        group.loaded = true
        resolve(files)
      })
    })
  }
}