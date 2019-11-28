import * as THREE from 'three'
import Viewport from './Viewport'

const camera = new THREE.OrthographicCamera(
  Viewport.width / -2,
  Viewport.width / 2,
  Viewport.height / 2,
  Viewport.height / -2,
  1,
  1000
)

camera.position.set(0, 0, 1)

window.addEventListener('resize', () => {
  camera.aspect = Viewport.ratio
  camera.updateProjectionMatrix()
})

export default camera
