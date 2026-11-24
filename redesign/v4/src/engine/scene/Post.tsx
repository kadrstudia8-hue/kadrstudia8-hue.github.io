import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import {
  BlendFunction, BloomEffect, Effect, EffectAttribute, EffectComposer, EffectPass, RenderPass, ToneMappingEffect,
  ToneMappingMode, VignetteEffect,
} from 'postprocessing'
import { Color, DataTexture, HalfFloatType, NearestFilter, RedFormat, RepeatWrapping, Uniform, UnsignedByteType, Vector2, Vector4 } from 'three'
import { dom } from '../dom'
import { rig } from '../rig'
import { STILL } from '../quality'

/** Lens: radial chromatic aberration (as a delta, keeps bloom), anamorphic streak, exposure. */
const lensFrag = /* glsl */ `
uniform float uCA; uniform float uStreak; uniform vec3 uTint; uniform float uExposure;
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 c = inputColor.rgb;
#if LENS_FULL
  vec2 dir = uv - 0.5;
  float r2 = dot(dir, dir);
  vec2 off = dir * r2 * uCA;
  vec3 cc = texture2D(inputBuffer, uv).rgb;
  c.r += texture2D(inputBuffer, uv + off).r - cc.r;
  c.b += texture2D(inputBuffer, uv - off).b - cc.b;
  vec3 s = vec3(0.0);
  for (int i = -12; i <= 12; i++) {
    float o = float(i) / 12.0;
    vec3 t = texture2D(inputBuffer, uv + vec2(o * 0.175, 0.0)).rgb;
    s += max(t - vec3(0.9), 0.0) * exp(-abs(o) * 3.0);
  }
  c += uTint * dot(s, vec3(0.3333)) * uStreak * 0.16;
#endif
  outputColor = vec4(c * uExposure, inputColor.a);
}`

/** Readability mask after tone mapping (own pass): <= 0.22 under data-v4-safe and left of the cloud stage, 120 px feather. */
const maskFrag = /* glsl */ `
uniform vec4 uSafe[6]; uniform int uSafeN; uniform vec2 uRes; uniform vec2 uLeft; uniform float uDim;
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float m = 1.0;
  vec2 px = uv * uRes;
  for (int i = 0; i < 6; i++) {
    if (i >= uSafeN) break;
    vec4 r = uSafe[i];
    vec2 lo = r.xy * uRes, hi = r.zw * uRes;
    vec2 q = abs(px - (lo + hi) * 0.5) - (hi - lo) * 0.5;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    m = min(m, mix(0.22, 1.0, smoothstep(0.0, 120.0, d)));
  }
  m = min(m, mix(1.0, mix(0.12, 1.0, smoothstep(uLeft.x, uLeft.x + 120.0, px.x)), uLeft.y));
  outputColor = vec4(inputColor.rgb * m * uDim, inputColor.a);
}`

class MaskEffect extends Effect {
  constructor() {
    const safe = Array.from({ length: 6 }, () => new Vector4())
    super('V4Mask', maskFrag, {
      uniforms: new Map<string, Uniform>([
        ['uSafe', new Uniform(safe)], ['uSafeN', new Uniform(0)], ['uRes', new Uniform(new Vector2(1, 1))],
        ['uLeft', new Uniform(new Vector2(0, 0))], ['uDim', new Uniform(1)],
      ]),
    })
  }
}

class LensEffect extends Effect {
  constructor(full: boolean) {
    super('V4Lens', lensFrag, {
      attributes: full ? EffectAttribute.CONVOLUTION : EffectAttribute.NONE,
      defines: new Map([['LENS_FULL', full ? '1' : '0']]),
      uniforms: new Map<string, Uniform>([
        ['uCA', new Uniform(0.0035)], ['uStreak', new Uniform(0.35)], ['uTint', new Uniform(new Color('#9CCBFF'))],
        ['uExposure', new Uniform(1.05)],
      ]),
    })
  }
}

/** Film grain after tone mapping: interleaved-gradient noise shifted every frame, stronger in shadows. */
const grainFrag = /* glsl */ `
uniform float uGrain; uniform sampler2D uNoise; uniform vec2 uOff;
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // 256 px white-noise tile, random offset every frame: no regular hatching
  float n = texture2D(uNoise, (gl_FragCoord.xy + uOff) / 256.0).r;
  float lum = dot(inputColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  float k = uGrain * mix(1.0, 0.45, smoothstep(0.05, 0.6, lum));
  outputColor = vec4(inputColor.rgb + (n - 0.5) * k, inputColor.a);
}`
function noiseTile() {
  const d = new Uint8Array(256 * 256)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 256) | 0
  const t = new DataTexture(d, 256, 256, RedFormat, UnsignedByteType)
  t.wrapS = t.wrapT = RepeatWrapping
  t.magFilter = t.minFilter = NearestFilter
  t.needsUpdate = true
  return t
}

class GrainEffect extends Effect {
  constructor() {
    super('V4Grain', grainFrag, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform>([['uGrain', new Uniform(0.055)], ['uNoise', new Uniform(noiseTile())], ['uOff', new Uniform(new Vector2())]]),
    })
  }
}

export default function Post({ tier }: { tier: number }) {
  const { gl, scene, camera, size } = useThree()
  const full = tier >= 3
  const { composer, mask, grain } = useMemo(() => {
    const composer = new EffectComposer(gl, { frameBufferType: HalfFloatType, multisampling: full ? 4 : 0 })
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new BloomEffect({
      mipmapBlur: true, intensity: full ? 0.9 : 0.6, luminanceThreshold: 0.62, luminanceSmoothing: 0.2, radius: 0.72,
      levels: full ? 8 : 5,
    })
    const lens = new LensEffect(full)
    const tone = new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC })
    const vignette = new VignetteEffect({ offset: 0.32, darkness: 0.78 })
    const grain = new GrainEffect()
    composer.addPass(new EffectPass(camera, bloom, lens, tone, vignette))
    const mask = new MaskEffect()
    composer.addPass(new EffectPass(camera, mask, grain))
    return { composer, mask, grain }
  }, [gl, scene, camera, full])

  useEffect(() => () => composer.dispose(), [composer])
  useEffect(() => { composer.setSize(size.width, size.height) }, [composer, size])

  useFrame((_, delta) => {
    const u = mask.uniforms
    const safe = u.get('uSafe')!.value as Vector4[]
    for (let i = 0; i < dom.safeN; i++) safe[i].fromArray(dom.safe, i * 4)
    u.get('uSafeN')!.value = dom.safeN
    ;(u.get('uRes')!.value as Vector2).set(dom.vw, dom.vh)
    u.get('uDim')!.value = rig.dim
    ;(u.get('uLeft')!.value as Vector2).set(rig.leftX, Math.min(1, rig.farm * 1.5))
    if (!STILL) (grain.uniforms.get('uOff')!.value as Vector2).set(Math.random() * 256, Math.random() * 256)
    composer.render(delta)
  }, 1)

  return null
}
