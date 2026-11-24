// Shared GLSL chunks for the Light Engine.

/** 7-stop V4 spectrum (lilac, violet, cyan, lime, amber, pink, lilac), in linear-ish sRGB, smooth interpolation. */
export const SPECTRUM = /* glsl */ `
vec3 v4spectrum(float x) {
  x = clamp(x, 0.0, 1.0);
  vec3 c0 = vec3(0.725, 0.651, 1.000); // B9A6FF
  vec3 c1 = vec3(0.612, 0.549, 1.000); // 9C8CFF
  vec3 c2 = vec3(0.490, 0.890, 1.000); // 7DE3FF
  vec3 c3 = vec3(0.843, 1.000, 0.122); // D7FF1F
  vec3 c4 = vec3(1.000, 0.769, 0.420); // FFC46B
  vec3 c5 = vec3(0.961, 0.545, 0.816); // F58BD0
  vec3 c6 = vec3(0.725, 0.651, 1.000); // B9A6FF
  vec3 c;
  if (x < 0.12) c = mix(c0, c1, smoothstep(0.0, 0.12, x));
  else if (x < 0.30) c = mix(c1, c2, smoothstep(0.12, 0.30, x));
  else if (x < 0.50) c = mix(c2, c3, smoothstep(0.30, 0.50, x));
  else if (x < 0.68) c = mix(c3, c4, smoothstep(0.50, 0.68, x));
  else if (x < 0.86) c = mix(c4, c5, smoothstep(0.68, 0.86, x));
  else c = mix(c5, c6, smoothstep(0.86, 1.0, x));
  return pow(c, vec3(2.2)); // to linear
}
`

/** Value noise + 2-octave fbm. */
export const NOISE = /* glsl */ `
float v4hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.17, 0.13));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float v4noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(v4hash(i + vec3(0,0,0)), v4hash(i + vec3(1,0,0)), f.x),
                 mix(v4hash(i + vec3(0,1,0)), v4hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(v4hash(i + vec3(0,0,1)), v4hash(i + vec3(1,0,1)), f.x),
                 mix(v4hash(i + vec3(0,1,1)), v4hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float v4fbm(vec3 p) {
  return 0.62 * v4noise(p) + 0.38 * v4noise(p * 2.07 + 3.1);
}
`

/** Cheap pseudo curl noise (divergence-free-ish), good enough for particles. */
export const CURL = /* glsl */ `
vec3 v4curl(vec3 p) {
  float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0), dy = vec3(0.0, e, 0.0), dz = vec3(0.0, 0.0, e);
  #define PN(q) vec3(sin(q.y*1.7+cos(q.z*1.3)), sin(q.z*1.5+cos(q.x*1.9)), sin(q.x*1.3+cos(q.y*1.6)))
  vec3 px0 = PN((p - dx)), px1 = PN((p + dx));
  vec3 py0 = PN((p - dy)), py1 = PN((p + dy));
  vec3 pz0 = PN((p - dz)), pz1 = PN((p + dz));
  #undef PN
  float x = (py1.z - py0.z) - (pz1.y - pz0.y);
  float y = (pz1.x - pz0.x) - (px1.z - px0.z);
  float z = (px1.y - px0.y) - (py1.x - py0.x);
  return vec3(x, y, z) / (2.0 * e);
}
`

/** Rounded box SDF in pixel space. p and b in px. */
export const SDF = /* glsl */ `
float v4box(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
`
