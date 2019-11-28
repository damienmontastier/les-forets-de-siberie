import * as THREE from 'three'
import Sprite from '../utils/Sprite'

export default class Fire extends THREE.Object3D {
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
        value: 0,
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

        vec2 hash( vec2 p )
        {
          p = vec2( dot(p,vec2(127.1,311.7)),
               dot(p,vec2(269.5,183.3)) );
          return -1.0 + 2.0*fract(sin(p)*43758.5453123);
        }
        
        float noise( in vec2 p )
        {
          const float K1 = 0.366025404; // (sqrt(3)-1)/2;
          const float K2 = 0.211324865; // (3-sqrt(3))/6;
          
          vec2 i = floor( p + (p.x+p.y)*K1 );
          
          vec2 a = p - i + (i.x+i.y)*K2;
          vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
          vec2 b = a - o + K2;
          vec2 c = a - 1.0 + 2.0*K2;
          
          vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
          
          vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
          
          return dot( n, vec3(70.0) );
        }
        
        float fbm(vec2 uv)
        {
          float f;
          mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
          f  = 0.5000*noise( uv ); uv = m*uv;
          f += 0.2500*noise( uv ); uv = m*uv;
          f += 0.1250*noise( uv ); uv = m*uv;
          f += 0.0625*noise( uv ); uv = m*uv;
          f = 0.5 + 0.5*f;
          return f;
        }

        void main() {
          float gradient = mix(1.,0.,vUv.y);
          float noise = fbm(vUv * 0.8 + vec2(0.,uTime*0.5)) * 0.1;


          vec2 dUv = vUv * uMapRepeat + uMapOffset;
          dUv.x += noise -0.05;
          vec4 color = texture2D(uMap,dUv );
          gl_FragColor = color;

          if(noise > 0.25 * gradient) {
            gl_FragColor.a = 0.;
          }
          //float mask = mix(0.3,1.,vUv.y+0.5);
          //gl_FragColor.a *= mask;

          //gl_FragColor = vec4(vec3(mask),1.0);
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

    setInterval(() => {
      this.uniforms.uTime.value += 0.01
    }, 14)
  }
}
