import * as THREE from 'three'
import Viewport from '../utils/Viewport'
import { Flowmap } from './FlowMap'
import Mouse from '../../plugins/Mouse'

export default class AuroreBoreale extends THREE.Object3D {
  constructor({ renderer }) {
    super()

    this.renderer = renderer

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

  update() {
    this.bufferMaterial.uniforms.uTime.value += 0.01
    this.material.uniforms.uTime.value += 0.01
    this.render()
  }

  render() {
    this.flowmap.velocity.lerp(
      Mouse.velocity,
      Mouse.velocity.length() ? 0.5 : 0.1
    )

    this.flowmap.mouse.copy(Mouse.normalized)

    this.flowmap.update()

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

          // Use flow to adjust the uv lookup of a texture
          //vec2 uv = gl_FragCoord.xy / 600.0;
          vec2 uv = vUv;
          uv += flow.xy * 0.15;
          vec3 tex = texture2D(uMap, uv).rgb;

          // tex = mix(tex, flow * 0.5 + 0.5, smoothstep( -0.3, 0.7, sin(uTime)));

          float distance = distance(vUv,vec2(0.5));
          float alpha = 1.-(distance*2.);

          gl_FragColor = vec4(tex,alpha);
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
      dissipation: 0.002,
      falloff: 0.2,
    })
    this.bufferScene = new THREE.Scene()
    this.bufferTexture = new THREE.WebGLRenderTarget(256, 256, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat,
    })
    this.bufferMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
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
        uniform float uTime;
          
        float random(vec2 p)
        {
            vec3 p3  = fract(vec3(p.xyx) * .1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
        }
        
        vec3 noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
        
          vec2 df = 20.0*f*f*(f*(f-2.0)+1.0);
          f = f*f*f*(f*(f*6.-15.)+10.);
        
          float a = random(i + vec2(0.5));
          float b = random(i + vec2(1.5, 0.5));
          float c = random(i + vec2(.5, 1.5));
          float d = random(i + vec2(1.5, 1.5));
        
          float k = a - b - c + d;
          float n = mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        
          return vec3(n, vec2(b - a + k * f.y, c - a + k * f.x) * df);
        }
          
        mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
        float tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);}
        vec2 tri2(in vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));}
          
        float fbmAurora(vec2 p, float spd) {
            float z = 1.8;
            float z2 = 2.5;
          float rz = 0.;
            p *= mm2(p.x * 0.06);
            vec2 bp = p;
          for (float i = 0.; i < 5.; i++ ) {
                vec2 dg = tri2(bp*1.85)*.75;
                dg *= mm2(uTime*spd);
                p -= dg/z2;
        
                bp *= 1.3;
                z2 *= .45;
                z *= .42;
            p *= 1.21 + (rz-1.0)*.02;
                
                rz += tri(p.x+tri(p.y))*z;
                p*= sin(uTime * 0.05) * cos(uTime * 0.01);
          }
            return clamp(1. / pow(rz * 20., 1.3), 0.,1.);
        }
          
        vec4 aurora( vec3 rd) {
          vec4 col = vec4(0);
          vec4 avgCol = vec4(0);    
        
          for (float i=0.; i < 5.; i++) {
              float of = 0.006*random(vUv)*smoothstep(0.,15., i);
              float pt = ((.8+pow(i,1.4)*.002)) / (rd.y * 2. + 0.4);
              pt -= of;
            vec3 bpos = 5.5 + pt * rd;
            vec2 p = bpos.zx;
            float rzt = fbmAurora(p, 0.06);
              vec4 col2 = vec4(0,0,0, rzt);
              col2.rgb = (sin(1.-vec3(2.15,-.5, 1.2) +i * 0.043) * 0.5 + 0.5)*rzt;
            avgCol = mix(avgCol, col2, .5);
              col += avgCol * exp2(-i*0.065 - 2.5) * smoothstep(0., 5., i);
            }
            col *= (clamp(rd.y*15.+.4,0.,1.)) *10.;
        
            return smoothstep(0.,1.1,pow(col,vec4(1.))*1.5);
        }
          
        vec3 setSkyColor(vec3 dir) {
          vec3 color = mix(vec3(0.006,0.026,0.095), vec3(0.007,0.011,0.035), dir.y);
          //color += stars(dir.xz / dir.y);
          color += aurora(dir).rgb;
          return color;
        }
          
        void main() {
          vec3 dUv = noise(vUv) / 10. * uTime;
          vec3 color = setSkyColor(vec3(vUv,1.0));

          gl_FragColor = vec4(color,1.0);
        }
      `,
      transparent: true,
    })
    const plane = new THREE.PlaneBufferGeometry(Viewport.width, Viewport.height)
    this.bufferObject = new THREE.Mesh(plane, this.bufferMaterial)
    this.bufferScene.add(this.bufferObject)
  }
}
