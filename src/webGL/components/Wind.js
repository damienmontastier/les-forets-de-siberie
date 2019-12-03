import * as THREE from 'three'
import Sprite from '../utils/Sprite'
import Raf from '../utils/Raf'
import Clock from '../utils/Clock'

export default class Wind extends THREE.Object3D {
  constructor({ map }) {
    super()
    this.uniforms = {
      uMap: {
        value: map,
      },
      uMapOffset: {
        value: map.offset,
      },
      uMapRepeat: {
        value: map.repeat,
      },
      uTime: {
        value: Math.random(),
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
        uniform sampler2D uMap;
        uniform vec2 uMapOffset;
        uniform vec2 uMapRepeat;

        uniform float uTime;

        varying vec2 vUv;

        void main() {
          float x = (vUv.x + mod(uTime,1.9) - 1.5 );
          float gradient = mix(1.0,0.,x * x * 2.);
          vec4 color = texture2D(uMap,vUv * uMapRepeat  + uMapOffset);
          color.a *= 2.;
          gl_FragColor = color * gradient;
          //gl_FragColor = vec4(vec3(gradient),1.0);
        }
      `,
      transparent: true,
    })
    this.sprite = new Sprite({
      texture: map,
      size: map._size,
      material: this.material,
    })
    this.add(this.sprite)

    Raf.add('wind', this.update.bind(this))
  }

  update() {
    this.uniforms.uTime.value = Clock.getElapsedTime() * 0.5
  }
}
