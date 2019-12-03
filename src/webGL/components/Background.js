import * as THREE from 'three'
import Sprite from '../utils/Sprite'
import Viewport from '../utils/Viewport'

export default class Background extends THREE.Object3D {
  constructor({ texture }) {
    super()
    this.texture = texture
    texture.minFilter = THREE.LinearFilter
    //texture.magFilter = THREE.NearestFilter
    //texture.format = THREE.RGBFormat
    this.initGeometry()
    this.initMaterial()
    this.initMesh()
  }

  initGeometry() {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
  }

  initMaterial() {
    this.uniforms = {
      uMap: {
        value: this.texture,
      },
    }
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        precision highp float;

        varying vec2 vUv;
        uniform sampler2D uMap;

        void main() {
          vec2 uv = vUv;

          float size = (1.0 / 6.0);
          float offset = floor(uv.y / size);

          uv.x *= size;
          uv.x += size * offset;
          uv.y = mod(uv.y, size) / size;

          vec3 color = texture2D(uMap, uv).rgb;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })
  }

  initMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.add(this.mesh)
    this.mesh.scale.set(1, 20, 1)
  }
}
