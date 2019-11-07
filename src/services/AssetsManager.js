import stage1 from '@/data/stage1.json'
import Loader from './Loader'
import * as PIXI from 'pixi.js'

class Manager {
  constructor() {
    this.loader = new Loader(new PIXI.Loader())
    this.loader.addGroup(stage1)
  }

  getGroup(name) {
    return new Promise((resolve,reject)=>{
      this.loader.loadGroup(name).then((files)=>{
        resolve(files)
      })
    })
  }
}

export default new Manager()