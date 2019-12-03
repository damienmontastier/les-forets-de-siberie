import * as THREE from 'three'
import Sprite from '../utils/Sprite'

export default class LakeReflect extends THREE.Object3D {
  constructor({ map, alphaMap }) {
    super()
    this.uniforms = {
      uMap: {
        value: map,
      },
      uAlphaMap: {
        value: alphaMap,
      },
      uMapOffset: {
        value: map.offset,
      },
      uMapRepeat: {
        value: map.repeat,
      },
      uAlphaMapOffset: {
        value: alphaMap.offset,
      },
      uAlphaMapRepeat: {
        value: alphaMap.repeat,
      },
      uTime: {
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
        uniform sampler2D uMap;
        uniform vec2 uMapOffset;
        uniform vec2 uMapRepeat;

        uniform vec2 uAlphaMapOffset;
        uniform vec2 uAlphaMapRepeat;

        uniform float uTime;

        varying vec2 vUv;

        // Simplex 2D noise
        //
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          float noise = snoise(vUv + vec2(0.,uTime)) * 0.01;
          vec2 dUv = vUv * uMapRepeat  + uMapOffset;
          float influence = texture2D(uMap,vUv * uAlphaMapRepeat + uAlphaMapOffset).r;
          dUv.x += noise * influence;
          vec4 color = texture2D(uMap,dUv );
          gl_FragColor = color;
        }
      `,
    })
    this.sprite = new Sprite({
      texture: map,
      size: map._size,
      material: this.material,
    })
    this.add(this.sprite)

    setInterval(() => {
      this.uniforms.uTime.value += 0.01
    }, 14)
  }

  update(time) {
    this.uniforms.uTime.value = time
  }
}
