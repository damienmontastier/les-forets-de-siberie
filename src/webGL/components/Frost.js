import * as THREE from 'three'
import Viewport from '../utils/Viewport'
import { Flowmap } from './FlowMap'
import Mouse from '../../plugins/Mouse'
import gsap from 'gsap'
import Events from '../../plugins/events'

export default class Frost extends THREE.Object3D {
  constructor({ renderer, map }) {
    super()

    this.renderer = renderer
    this.map = map

    this.camera = new THREE.OrthographicCamera(
      Viewport.width / -2,
      Viewport.width / 2,
      Viewport.height / 2,
      Viewport.height / -2,
      1,
      1000
    )
    this.camera.position.z = 2

    this.initBufferTexture()
    this.initGeometry()
    this.initMaterial()
    this.initMesh()

    setInterval(() => {
      this.update()
    }, 14)
  }

  fadeIn() {
    gsap.to(this.bufferMaterial.uniforms.uFrostyness, 3, {
      value: 5,
      onComplete: () => {
        this.enabled = true
        setTimeout(() => {
          Events.emit('video fin')
        }, 4000)
      },
    })
  }

  update() {
    this.render()
  }

  render() {
    this.flowmap.velocity.copy(new THREE.Vector2(1, 1))

    if (this.enabled) {
      this.flowmap.mouse.copy(Mouse.normalized)
      this.flowmap.update()
    }

    this.renderer.setRenderTarget(this.bufferTexture)
    this.renderer.render(this.bufferScene, this.camera)

    this.renderer.setRenderTarget(null)
    this.renderer.render(this.bufferScene, this.camera)
  }

  initGeometry() {
    this.geometry = new THREE.PlaneBufferGeometry(
      1,
      Viewport.height / Viewport.width,
      1,
      1
    )
  }

  initMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: {
          value: this.bufferTexture.texture,
        },
        uFlow: {
          value: this.flowmap.textureB.texture,
        },
        uTime: {
          value: 0,
        },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        varying vec2 vUv;

        uniform sampler2D uMap;
        uniform sampler2D uFlow;
        uniform float uTime;

        void main() {
          // R and G values are velocity in the x and y direction
          // B value is the velocity length
          vec3 flow = texture2D(uFlow, vUv).rgb;

          vec4 texture = texture2D(uMap, vUv);

          gl_FragColor = vec4(texture.rgb,min(1.-flow.b,texture.r));
        }
      `,
      transparent: true,
    })
  }

  initMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.add(this.mesh)
  }

  initBufferTexture() {
    this.flowmap = new Flowmap({
      renderer: this.renderer,
      dissipation: 0.0,
      falloff: 0.1,
      size: 1024,
    })
    this.bufferScene = new THREE.Scene()
    this.bufferTexture = new THREE.WebGLRenderTarget(512, 512, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat,
    })
    this.bufferMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMap: {
          value: this.map,
        },
        uFrostyness: {
          value: 0,
        },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        //https://www.shadertoy.com/view/MsySzy


        varying vec2 vUv;
        uniform float uTime;
        uniform sampler2D uMap;

        #define FROSTYNESS 1.0
        #define COLORIZE   1.0
        #define COLOR_RGB  0.7,1.0,1.0

        uniform float uFrostyness;

        float rand(vec2 uv) {
        
            float a = dot(uv, vec2(92., 80.));
            float b = dot(uv, vec2(41., 62.));
            
            float x = sin(a) + cos(b) * 51.;
            return fract(x);
        }
          
        void main() {
          vec4 frost = texture2D(uMap, vUv);
          vec2 rnd = vec2(rand(vUv+frost.r*.05), rand(vUv+frost.b*.05));
          float distance = distance(vUv,vec2(0.5));
          rnd *= .025+frost.rg*uFrostyness* (1.-distance);
          gl_FragColor = vec4(rnd.r);
        }
      `,
      transparent: true,
    })
    const plane = new THREE.PlaneBufferGeometry(Viewport.width, Viewport.height)
    this.bufferObject = new THREE.Mesh(plane, this.bufferMaterial)
    this.bufferScene.add(this.bufferObject)
  }
}
