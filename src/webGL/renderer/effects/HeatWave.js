import { Uniform } from 'three'
import { Effect, BlendFunction } from 'postprocessing'

const fragment = `

uniform float frequency;
uniform float amplitude;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float distortion=sin(uv.y*frequency + (time*10.))*amplitude;

  //float noise = fbm(vUv + vec2(0.,time)) * 0.1;
  outputColor = texture2D(inputBuffer, uv + vec2(distortion,0.));
}
`

export default class HeatWave extends Effect {
  constructor({
    blendFunction = BlendFunction.NORMAL,
    frequency = 50.0,
    amplitude = 0.009,
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
