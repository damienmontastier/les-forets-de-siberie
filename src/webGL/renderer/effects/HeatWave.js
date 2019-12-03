import { Uniform } from 'three'
import { Effect, BlendFunction } from 'postprocessing'

const fragment = `

uniform float frequency;
uniform float amplitude;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float distortion=sin(uv.y*frequency - (time*10.))*amplitude;

  float distance = distance(vUv,vec2(0.5));
  float alpha = distance * 0.5;
  distortion *= alpha;
  vec4 color = texture2D(inputBuffer, uv + vec2(distortion,0.));
  //color.rgb = vec3(alpha);
  outputColor = color;
}
`

export default class HeatWave extends Effect {
  constructor({
    blendFunction = BlendFunction.NORMAL,
    frequency = 300.0,
    amplitude = 0.018,
  } = {}) {
    super('BadTVEffect', fragment, {
      blendFunction,
      uniforms: new Map([
        ['frequency', new Uniform(frequency)],
        ['amplitude', new Uniform(amplitude)],
      ]),
    })
  }
}
