import * as THREE from 'three'
import Clock from '../utils/Clock'
import Raf from '../utils/Raf'

export default class Fire extends THREE.Object3D {
  constructor({ map, horizontalTiles, verticalTiles }) {
    super()

    this.map = map
    this.horizontalTiles = horizontalTiles
    this.verticalTiles = verticalTiles

    this.initGeometry()
    this.initMaterial()
    this.initMesh()

    this.initAnimator()

    this.frameCount = 0

    this.yoyo = 1

    Raf.add('fire', this.update.bind(this))
  }

  update() {
    this.uniforms.uTime.value = Clock.getElapsedTime() * 0.5
    this.frameCount++
    this.frameCount = this.frameCount % 7
    if (this.frameCount === 0) {
      this.currentTile += this.yoyo
      if (this.yoyo === 1 && this.currentTile === this.maxTile) {
        this.yoyo = -1
      }
      if (this.yoyo === -1 && this.currentTile === 0) {
        this.yoyo = 1
      }

      this.setOffset()
    }
  }

  initAnimator() {
    this.currentTile = 0
  }

  setOffset() {
    let indexRow = Math.floor(this.currentTile / this.horizontalTiles)
    let indexColumn = this.currentTile % this.horizontalTiles

    this.uniforms.uOffset.value.x = indexColumn
    this.uniforms.uOffset.value.y = indexRow % this.verticalTiles
  }

  initGeometry() {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
  }

  initMaterial() {
    this.uniforms = {
      uMap: {
        value: this.map,
      },
      uTiles: {
        value: new THREE.Vector2(this.horizontalTiles, this.verticalTiles),
      },
      uOffset: {
        value: new THREE.Vector2(0, 0),
      },
      uTime: {
        value: 0,
      },
    }
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
          varying vec2 vUv;

          void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(position), 1.0 );
          }
      `,
      fragmentShader: `
          uniform sampler2D uMap;
          uniform vec2 uTiles;
          uniform vec2 uOffset;
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

          #define NUM_OCTAVES	10

          float fbm(vec2 x) {
            float v = 0.0;
            float a = 0.5;
            vec2 shift = vec2(100);
            // Rotate to reduce axial bias
              mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
            for (int i = 0; i < NUM_OCTAVES; ++i) {
              v += a * snoise(x);
              x = rot * x * 2.0 + shift;
              a *= 0.5;
            }
            return v;
          }

          void main() {
            float noise = fbm(vUv + vec2(0.,uTime)) * 0.01;

            vec2 offset = vec2(uOffset.x,-uOffset.y + (uTiles.y-1.));
            vec2 tile = vUv * vec2(1./uTiles.x,1./uTiles.y) + (offset/uTiles);
            tile.x += noise;
            vec4 color = texture2D(uMap,tile);
            gl_FragColor = color;
          }
      `,
      transparent: true,
    })
  }

  initMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.add(this.mesh)
  }

  get maxTile() {
    return this.verticalTiles * this.horizontalTiles - 1
  }
}
