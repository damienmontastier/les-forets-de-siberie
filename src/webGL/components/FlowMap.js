import * as THREE from 'three'

export class Flowmap {
  constructor({ renderer, size = 128, falloff = 0.1, dissipation = 0.02 }) {
    this.renderer = renderer

    this.size = size
    this.falloff = falloff
    this.dissipation = dissipation
    this.mouse = new THREE.Vector2()
    this.velocity = new THREE.Vector2()
    this.resolution = new THREE.Vector2(window.innerWidth, window.innerHeight)

    this.initCamera()
    this.initFBO()
  }

  initCamera() {
    this.camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      1,
      1000
    )
    this.camera.position.z = 2
  }

  initFBO() {
    this.bufferScene = new THREE.Scene()
    //Create 2 buffer textures
    this.textureA = new THREE.WebGLRenderTarget(this.size, this.size, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
    })
    this.textureB = new THREE.WebGLRenderTarget(this.size, this.size, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
    })
    //Pass textureA to shader
    this.bufferMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: {
          value: this.resolution,
        },
        tMap: { value: this.textureA.texture },
        uFalloff: { value: this.falloff },
        uAlpha: { value: 1 },
        uDissipation: { value: this.dissipation },

        // User needs to update these
        uMouse: { value: this.mouse },
        uVelocity: { value: this.velocity },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
      uniform vec2 uResolution;

      uniform sampler2D tMap;
      uniform float uFalloff;
      uniform float uAlpha;
      uniform float uDissipation;

      uniform vec2 uMouse;
      uniform vec2 uVelocity;

      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(tMap, vUv);
        vec2 cursor = vUv - uMouse;
        cursor.x *= uResolution.x/uResolution.y;
        vec3 stamp = vec3(uVelocity * vec2(1, -1), 1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0));
        float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;
        color.rgb = mix(color.rgb, stamp, vec3(falloff));
        gl_FragColor = color;

        gl_FragColor.rbg -= vec3(uDissipation);
      }
      `,
    })
    const plane = new THREE.PlaneBufferGeometry(
      window.innerWidth,
      window.innerHeight
    )
    this.bufferObject = new THREE.Mesh(plane, this.bufferMaterial)
    this.bufferScene.add(this.bufferObject)
  }

  update() {
    this.renderer.setRenderTarget(this.textureB)
    this.renderer.render(this.bufferScene, this.camera)

    var t = this.textureA
    this.textureA = this.textureB
    this.textureB = t

    this.bufferMaterial.uniforms.tMap.value = this.textureA.texture
    this.texture = this.textureA.texture
  }
}
