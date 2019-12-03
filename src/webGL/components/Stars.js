import * as THREE from 'three'

export default class Stars extends THREE.Object3D {
  constructor() {
    super()
    this.amount = 1000
    this.initGeometry()
    this.initMaterial()
    this.initMesh()
  }

  initGeometry() {
    this.geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(this.amount * 3)
    const sizes = new Float32Array(this.amount)

    for (let i = 0, i2 = 0, i3 = 0; i < this.amount; i++, i2 += 2, i3 += 3) {
      const angle = Math.PI * 2 * Math.random()
      positions[i3 + 0] = Math.random() //axe X
      positions[i3 + 1] = Math.random() * 6 //axe Y
      positions[i3 + 2] = 0 //axe Z

      sizes[i] = Math.random() * 3
    }

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  }

  initMaterial() {
    this.uniforms = {
      uTime: { value: 0 },
    }
    this.material = new THREE.ShaderMaterial({
      //transparent: true,
      uniforms: this.uniforms,
      vertexShader: `
        attribute float aSize;

        varying vec3 vPosition;

        void main() {
            //vec4 mvPosition = modelViewMatrix * vec4( position , 0. );
            vPosition = position;
            gl_PointSize = aSize;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
      `,
      fragmentShader: `
      //uniform sampler2D tDiffuse;

      vec2 hash( vec2 p )
      {
        p = vec2( dot(p,vec2(127.1,311.7)),
             dot(p,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
      }

      uniform float uTime;

      varying vec3 vPosition;

      void main() {
          //vec4 texture = texture2D(tDiffuse, gl_PointCoord);

          vec2 random = hash(vPosition.xy);
          float alpha = 1.0;
          alpha *= sin((uTime * (random.y * 40.))  + random.x);
          gl_FragColor = vec4(1., 1., 1., alpha);
        }
      `,
      transparent: true,
    })
  }

  initMesh() {
    this.mesh = new THREE.Points(this.geometry, this.material)
    this.add(this.mesh)
    this.mesh.position.set(-0.5, -0.5, 0)

    setInterval(() => {
      this.uniforms.uTime.value += 0.001
    }, 14)
  }
}
