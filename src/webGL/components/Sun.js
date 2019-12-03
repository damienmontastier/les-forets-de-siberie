import * as THREE from 'three'
import Sprite from '../utils/Sprite'

export default class Sun extends THREE.Object3D {
  constructor({ map, map2 }) {
    super()

    this.map = map
    this.map2 = map2

    this.initMaterial()
    this.initMesh()

    setInterval(() => {
      this.uniforms.uTime.value += 0.01
      this.uniforms.uProgress.value = Math.sin(this.uniforms.uTime.value)
    }, 14)
  }

  initMaterial() {
    this.uniforms = {
      uMap1: {
        value: this.map,
      },
      uMapOffset1: {
        value: this.map.offset,
      },
      uMapRepeat1: {
        value: this.map.repeat,
      },
      uMap2: {
        value: this.map2,
      },
      uMapOffset2: {
        value: this.map2.offset,
      },
      uMapRepeat2: {
        value: this.map2.repeat,
      },
      uTime: {
        value: 0,
      },
      uProgress: {
        value: 0,
      },
    }

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
      
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap1;
        uniform vec2 uMapOffset1;
        uniform vec2 uMapRepeat1;

        uniform sampler2D uMap2;
        uniform vec2 uMapOffset2;
        uniform vec2 uMapRepeat2;

        uniform float uProgress;

        varying vec2 vUv;

        vec3 hsv2rgb(vec3 c){
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        void main() {
          vec4 color1 = texture2D(uMap1,vUv * uMapRepeat1  + uMapOffset1 );
          vec4 color2 = texture2D(uMap2,vUv * uMapRepeat2  + uMapOffset2 );
          // vec3 filter = vec3(uProgress,1.-uProgress,1.-uProgress);
          
          // color.rgb *= filter;
          vec4 color = mix(color1,color2,uProgress);
          gl_FragColor = color;
        }
      `,
    })
  }

  initMesh() {
    this.sprite = new Sprite({
      texture: this.map,
      size: this.map._size,
      material: this.material,
    })
    this.add(this.sprite)
  }
}
