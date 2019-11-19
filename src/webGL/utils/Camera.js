import * as THREE from 'three'
import Viewport from './Viewport'

const camera = new THREE.PerspectiveCamera(40, Viewport.ratio, 0.1, 100)

camera.position.set(0, 0, 10)

export default window !== 'undefined' ? camera : null
