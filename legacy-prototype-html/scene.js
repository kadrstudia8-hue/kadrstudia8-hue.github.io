/* KADR Studio site: background scene. Gold film dust behind the content that re-forms into cinema shapes
   (reel, frame, strip, play, dust) as you scroll. Raw WebGL1, no third-party code, nothing is loaded or sent.
   Contract: <canvas id="scene" aria-hidden="true"> first in <body>; elements opt in with
   data-scene="reel|frame|strip|play|dust" and optional data-scene-x / -y / -scale / -alpha.
   <html> gets .has-scene (running) or .no-webgl (fallback). Debug: window.KadrScene.setShape(name) / .refresh(). */
(function () {
  "use strict";
  var TAU = Math.PI * 2;

  /* ---------- point clouds: every shape is the same N particles, unit-ish radius, orientation baked in ---------- */
  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function g3(r) { return r() + r() + r() - 1.5; } /* soft jitter, roughly gaussian */
  /* rotation Ry(yaw)·Rx(pitch)·Rz(roll), column-major (WebGL layout) */
  function rot(yaw, pitch, roll, m) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch), cz = Math.cos(roll), sz = Math.sin(roll);
    m = m || new Float32Array(9);
    m[0] = cy * cz + sy * sx * sz; m[3] = -cy * sz + sy * sx * cz; m[6] = sy * cx;
    m[1] = cx * sz;                m[4] = cx * cz;                 m[7] = -sx;
    m[2] = -sy * cz + cy * sx * sz; m[5] = sy * sz + cy * sx * cz; m[8] = cy * cx;
    return m;
  }
  function build(n, seed, parts, o) {
    var r = rng(seed), out = new Float32Array(n * 3), P = [0, 0, 0], M = rot(o[0], o[1], o[2]), tot = 0, i = 0, j, k, c;
    for (k = 0; k < parts.length; k++) tot += parts[k][0];
    for (k = 0; k < parts.length; k++) {
      c = k === parts.length - 1 ? n - i : Math.round(parts[k][0] / tot * n);
      for (j = 0; j < c && i < n; j++, i++) {
        parts[k][1](r, P);
        out[i * 3] = M[0] * P[0] + M[3] * P[1] + M[6] * P[2];
        out[i * 3 + 1] = M[1] * P[0] + M[4] * P[1] + M[7] * P[2];
        out[i * 3 + 2] = M[2] * P[0] + M[5] * P[1] + M[8] * P[2];
      }
    }
    return out;
  }
  /* a point on the outline of a rectangle with half-sizes a, b */
  function rectEdge(r, a, b, P) {
    var t = r() * 4 * (a + b);
    if (t < 2 * a) { P[0] = t - a; P[1] = b; return; } t -= 2 * a;
    if (t < 2 * b) { P[0] = a; P[1] = b - t; return; } t -= 2 * b;
    if (t < 2 * a) { P[0] = a - t; P[1] = -b; return; } t -= 2 * a;
    P[0] = -a; P[1] = t - b;
  }

  /* film reel: two flanges with 6 round cut-outs, rim, hub, a little wound film between the flanges */
  function reel(n) {
    var h = 0.1, HR = 0.22, holes = [], k;
    for (k = 0; k < 6; k++) holes.push([Math.cos(k * TAU / 6 + 0.52) * 0.57, Math.sin(k * TAU / 6 + 0.52) * 0.57]);
    function side(r) { return (r() < 0.5 ? -h : h) + g3(r) * 0.01; }
    return build(n, 11, [
      [0.26, function (r, P) {
        var a = r() * TAU, q = r(), d = 1, z = (r() * 2 - 1) * h;
        if (q < 0.8) { d = 0.92 + 0.08 * Math.sqrt(r()); z = q < 0.4 ? h : -h; }
        P[0] = Math.cos(a) * d; P[1] = Math.sin(a) * d; P[2] = z + g3(r) * 0.008;
      }],
      [0.36, function (r, P) {
        var x = 0, y = 0, a, d, t, j, ok;
        for (t = 0; t < 40; t++) {
          a = r() * TAU; d = Math.sqrt(0.0676 + r() * 0.7788); x = Math.cos(a) * d; y = Math.sin(a) * d; ok = true;
          for (j = 0; j < 6; j++) if ((x - holes[j][0]) * (x - holes[j][0]) + (y - holes[j][1]) * (y - holes[j][1]) < HR * HR) { ok = false; break; }
          if (ok) break;
        }
        P[0] = x; P[1] = y; P[2] = side(r);
      }],
      [0.18, function (r, P) {
        var c = holes[(r() * 6) | 0], a = r() * TAU;
        P[0] = c[0] + Math.cos(a) * HR + g3(r) * 0.006; P[1] = c[1] + Math.sin(a) * HR + g3(r) * 0.006; P[2] = side(r);
      }],
      [0.12, function (r, P) {
        var a = r() * TAU, d = 0.25, z = (r() * 2 - 1) * h * 1.6;
        if (r() < 0.5) { d = 0.08 + 0.17 * Math.sqrt(r()); z = r() < 0.5 ? -h * 1.6 : h * 1.6; }
        P[0] = Math.cos(a) * d; P[1] = Math.sin(a) * d; P[2] = z;
      }],
      [0.08, function (r, P) {
        var a = r() * TAU, d = 0.26 + 0.24 * Math.sqrt(r());
        P[0] = Math.cos(a) * d; P[1] = Math.sin(a) * d; P[2] = (r() * 2 - 1) * h * 0.8;
      }]
    ], [-0.5, 0.2, 0]);
  }

  /* one 16:9 film frame: picture outline, faint picture light, strip edges, 8 sprocket holes top and bottom */
  function frame(n) {
    var A = 0.98, B = 0.55;
    function bow(r, P, s) { P[2] = 0.06 - 0.12 * P[0] * P[0] + g3(r) * s; }
    return build(n, 23, [
      [0.28, function (r, P) { rectEdge(r, A, B, P); P[0] += g3(r) * 0.01; P[1] += g3(r) * 0.01; bow(r, P, 0.02); }],
      [0.16, function (r, P) { P[0] = (r() * 2 - 1) * A; P[1] = (r() * 2 - 1) * B; bow(r, P, 0.05); }],
      [0.14, function (r, P) { P[0] = (r() * 2 - 1) * 1.15; P[1] = (r() < 0.5 ? -0.86 : 0.86) + g3(r) * 0.008; bow(r, P, 0.015); }],
      [0.42, function (r, P) {
        var i = (r() * 8) | 0, s = r() < 0.5 ? -1 : 1;
        rectEdge(r, 0.055, 0.038, P); P[0] += -1.05 + i * 0.3; P[1] += s * 0.73; bow(r, P, 0.012);
      }]
    ], [0.28, -0.12, -0.04]);
  }

  /* a ribbon of film (8 frames) curving diagonally through depth, with a gentle twist */
  function strip(n) {
    var F = 8, WV = 0.34, c0 = [0, 0, 0], c1 = [0, 0, 0], c2 = [0, 0, 0], Q = [0, 0];
    function C(s, o) { o[0] = -2.5 + 5 * s; o[1] = -1.25 + 2.5 * s + 0.32 * Math.sin(TAU * s); o[2] = 0.9 * Math.sin(Math.PI * 1.4 * s - 0.4) - 0.45; }
    function put(r, P, s, v) {
      C(s, c0); C(s - 0.002, c1); C(s + 0.002, c2);
      var tx = c2[0] - c1[0], ty = c2[1] - c1[1], tz = c2[2] - c1[2], l = Math.sqrt(tx * tx + ty * ty + tz * tz);
      tx /= l; ty /= l; tz /= l;
      var bx = ty, by = -tx, bl = Math.sqrt(bx * bx + by * by); bx /= bl; by /= bl;   /* in-plane side vector */
      var mx = by * tz, my = -bx * tz, mz = bx * ty - by * tx;                         /* side × tangent */
      var a = 0.9 * Math.sin(Math.PI * 1.2 * s) - 0.2, ca = Math.cos(a), sa = Math.sin(a), w = v * WV;
      P[0] = c0[0] + (bx * ca + mx * sa) * w + g3(r) * 0.006;
      P[1] = c0[1] + (by * ca + my * sa) * w + g3(r) * 0.006;
      P[2] = c0[2] + mz * sa * w + g3(r) * 0.006;
    }
    return build(n, 37, [
      [0.2, function (r, P) { put(r, P, r(), r() < 0.5 ? -1 : 1); }],
      [0.36, function (r, P) {
        var f = (r() * F) | 0, k = (r() * 4) | 0, s = r() < 0.5 ? -1 : 1;
        rectEdge(r, 0.055, 0.075, Q); put(r, P, (f + (k + 0.5) / 4 + Q[0]) / F, s * 0.82 + Q[1]);
      }],
      [0.12, function (r, P) { put(r, P, Math.min(1, ((r() * (F + 1)) | 0) / F + g3(r) * 0.002), (r() * 2 - 1) * 0.66); }],
      [0.32, function (r, P) { put(r, P, (((r() * F) | 0) + 0.05 + r() * 0.9) / F, (r() * 2 - 1) * 0.64); }]
    ], [0, 0.12, 0]);
  }

  /* a solid, rounded play triangle inside a thin ring */
  function play(n) {
    var RR = 0.11, V = [], NR = [], k, a, b, dx, dy, l;
    for (k = 0; k < 3; k++) V.push([Math.cos(k * TAU / 3) * 0.512, Math.sin(k * TAU / 3) * 0.512]);
    for (k = 0; k < 3; k++) {
      a = V[k]; b = V[(k + 1) % 3]; dx = b[0] - a[0]; dy = b[1] - a[1]; l = Math.sqrt(dx * dx + dy * dy);
      NR.push([dy / l, -dx / l]); /* outward normal, vertices are counter-clockwise */
    }
    return build(n, 53, [
      [0.55, function (r, P) {
        var u = r(), v = r(), d = RR * Math.sqrt(r()), t = r() * TAU;
        if (u + v > 1) { u = 1 - u; v = 1 - v; }
        P[0] = V[0][0] + u * (V[1][0] - V[0][0]) + v * (V[2][0] - V[0][0]) + Math.cos(t) * d;
        P[1] = V[0][1] + u * (V[1][1] - V[0][1]) + v * (V[2][1] - V[0][1]) + Math.sin(t) * d;
        P[2] = (r() * 2 - 1) * 0.07;
      }],
      [0.17, function (r, P) {
        var i = (r() * 3) | 0, p = V[i], q = V[(i + 1) % 3], t = r(), a1, da;
        if (r() < 0.82) { P[0] = p[0] + t * (q[0] - p[0]) + NR[i][0] * RR; P[1] = p[1] + t * (q[1] - p[1]) + NR[i][1] * RR; }
        else {
          a1 = Math.atan2(NR[(i + 2) % 3][1], NR[(i + 2) % 3][0]); da = Math.atan2(NR[i][1], NR[i][0]) - a1;
          while (da < 0) da += TAU;
          P[0] = p[0] + Math.cos(a1 + t * da) * RR; P[1] = p[1] + Math.sin(a1 + t * da) * RR;
        }
        P[2] = g3(r) * 0.05;
      }],
      [0.28, function (r, P) {
        var t = r() * TAU, d = 1 + g3(r) * 0.012;
        P[0] = Math.cos(t) * d; P[1] = Math.sin(t) * d; P[2] = g3(r) * 0.02;
      }]
    ], [-0.22, 0.08, 0]);
  }

  /* dust motes in a wide projector beam coming from the upper left, plus a few strays */
  function dust(n) {
    var A = [-3, 1.9, -1.8], D = [4.3, -2.6, 1.4], L = Math.sqrt(D[0] * D[0] + D[1] * D[1] + D[2] * D[2]), tn = Math.tan(0.34);
    var ax = [D[0] / L, D[1] / L, D[2] / L], u = [ax[1], -ax[0], 0], ul = Math.sqrt(u[0] * u[0] + u[1] * u[1]);
    u[0] /= ul; u[1] /= ul;
    var w = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]];
    L *= 1.25;
    return build(n, 71, [
      [0.82, function (r, P) {
        var t = L * (0.12 + 0.88 * Math.pow(r(), 0.45)), d = t * tn * Math.sqrt(r()), a = r() * TAU, c = Math.cos(a) * d, s = Math.sin(a) * d, k;
        for (k = 0; k < 3; k++) P[k] = A[k] + ax[k] * t + u[k] * c + w[k] * s;
      }],
      [0.18, function (r, P) { P[0] = (r() * 2 - 1) * 3.2; P[1] = (r() * 2 - 1) * 1.9; P[2] = (r() * 2 - 1) * 1.3 - 0.2; }]
    ], [0, 0, 0]);
  }

  var GEN = { reel: reel, frame: frame, strip: strip, play: play, dust: dust };
  /* per shape: drift amplitude (units), brightness */
  var LOOK = { reel: [0.012, 1], frame: [0.01, 1], strip: [0.014, 1], play: [0.01, 0.95], dust: [0.11, 0.7] };

  if (typeof module === "object" && module && module.exports) { module.exports = { GEN: GEN, rot: rot }; return; } /* node self-test */

  /* ---------- page ---------- */
  var doc = document, html = doc.documentElement, canvas = doc.getElementById("scene");
  if (!canvas || !canvas.getContext) return;
  var cs = canvas.style;
  cs.position = "fixed"; cs.left = cs.top = cs.right = cs.bottom = "0"; cs.width = cs.height = "100%";
  cs.zIndex = "0"; cs.pointerEvents = "none"; cs.display = "block";

  function fail() { html.classList.remove("has-scene"); html.classList.add("no-webgl"); cs.display = "none"; }
  function mq(q) { return !!(window.matchMedia && matchMedia(q).matches); }
  var OPT = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, failIfMajorPerformanceCaveat: true };
  var gl = null;
  try { gl = canvas.getContext("webgl", OPT) || canvas.getContext("experimental-webgl", OPT); } catch (e) { gl = null; }
  if (!gl) { fail(); return; }

  var calm = mq("(prefers-reduced-motion: reduce)") || !!(navigator.connection && navigator.connection.saveData);
  var phone = mq("(pointer: coarse)") && Math.min(screen.width, screen.height) < 820;
  var weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  var N = phone ? 5000 : weak ? 9000 : 14000;

  var VS = [
    "precision highp float;",
    "attribute vec3 aFrom; attribute vec3 aTo; attribute vec4 aRnd;",
    "uniform mat3 uRot; uniform vec2 uRes; uniform vec2 uCenter;",
    "uniform float uR; uniform float uPR; uniform float uSize; uniform float uGain;",
    "uniform float uDrift; uniform float uMorph; uniform float uTime;",
    "varying mediump vec3 vCol;",
    "void main() {",
    /* staggered, eased per-particle progress along a curved path */
    "  float k = clamp((uMorph - aRnd.x * 0.45) / 0.55, 0.0, 1.0);",
    "  float e = k * k * k * (k * (k * 6.0 - 15.0) + 10.0);",
    "  vec3 d = aTo - aFrom;",
    "  vec3 rn = fract(aRnd.w * vec3(13.17, 27.31, 41.73)) - 0.5;",
    "  vec3 p = mix(aFrom, aTo, e) + (cross(d, vec3(0.0, 0.0, 1.0)) * 0.22 + rn * (0.4 * length(d) + 0.08)) * sin(3.14159 * e);",
    /* breathing: slow per-particle drift plus a soft travelling swell */
    "  vec3 ph = fract(aRnd.w * vec3(1.0, 7.13, 3.71)) * 6.2832;",
    "  float sp = 0.25 + fract(aRnd.w * 5.3) * 0.3;",
    "  p += sin(uTime * sp * vec3(0.53, 0.47, 0.41) + ph) * uDrift;",
    "  p *= 1.0 + 0.012 * sin(uTime * 0.55 + dot(p, vec3(1.7, 2.3, 1.1)));",
    "  p = uRot * p;",
    "  float f = 6.0 / (6.0 - clamp(p.z, -4.0, 3.5));",
    "  vec2 s = uCenter + vec2(p.x, -p.y) * f * uR;",
    "  gl_Position = vec4(s.x / uRes.x * 2.0 - 1.0, 1.0 - s.y / uRes.y * 2.0, 0.0, 1.0);",
    "  float sz = uSize * (0.55 + aRnd.z * 1.1) * f * uPR;",
    "  gl_PointSize = clamp(sz, 1.0, 9.0 * uPR);",
    "  float c = aRnd.y;",
    "  vec3 col = mix(mix(vec3(0.788, 0.588, 0.310), vec3(0.851, 0.698, 0.435), clamp(c * 2.0, 0.0, 1.0)),",
    "                 vec3(0.949, 0.827, 0.608), clamp(c * 2.0 - 1.0, 0.0, 1.0));",
    "  float spk = step(0.965, fract(aRnd.w * 91.7));",
    "  col = mix(col, vec3(0.953, 0.914, 0.824), spk) * (1.0 + spk * 0.5 * sin(uTime * 1.3 + ph.x));",
    "  float fog = clamp(0.75 + p.z * 0.35, 0.12, 1.0);",
    "  float lit = clamp(sz / 1.6, 0.0, 1.0);",
    "  vCol = col * (uGain * fog * lit * lit);",
    "}"
  ].join("\n");
  var FS = [
    "precision mediump float;",
    "varying vec3 vCol;",
    "void main() {",
    "  vec2 q = gl_PointCoord * 2.0 - 1.0;",
    "  float r2 = dot(q, q);",
    "  if (r2 > 1.0) discard;",
    "  float a = 1.0 - r2;",
    "  vec3 c = vCol * (a * a);",
    "  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));",
    "}"
  ].join("\n");

  var U = {}, bufs = {}, data = {}, boundA = null, boundB = null, rnd = new Float32Array(N * 4), MR = new Float32Array(9);
  (function () { var r = rng(7), i; for (i = 0; i < N; i++) { rnd[i * 4] = r(); rnd[i * 4 + 1] = r(); rnd[i * 4 + 2] = Math.pow(r(), 1.6); rnd[i * 4 + 3] = r(); } })();

  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function initGL() {
    var p = gl.createProgram(), b;
    gl.attachShader(p, shader(gl.VERTEX_SHADER, VS)); gl.attachShader(p, shader(gl.FRAGMENT_SHADER, FS));
    gl.bindAttribLocation(p, 0, "aFrom"); gl.bindAttribLocation(p, 1, "aTo"); gl.bindAttribLocation(p, 2, "aRnd");
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) throw new Error(gl.getProgramInfoLog(p));
    gl.useProgram(p);
    "uRot uRes uCenter uR uPR uSize uGain uDrift uMorph uTime".split(" ").forEach(function (k) { U[k] = gl.getUniformLocation(p, k); });
    b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, rnd, gl.STATIC_DRAW);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0); gl.enableVertexAttribArray(1); gl.enableVertexAttribArray(2);
    gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.clearColor(0, 0, 0, 0);
    bufs = {}; boundA = boundB = null;
  }
  /* shape buffers are generated lazily and kept; a pair change only re-points the two attributes */
  function buf(name) {
    if (!bufs[name]) {
      if (!data[name]) data[name] = GEN[name](N);
      bufs[name] = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bufs[name]); gl.bufferData(gl.ARRAY_BUFFER, data[name], gl.STATIC_DRAW);
    }
    return bufs[name];
  }
  function bind(a, b) {
    if (a !== boundA) { gl.bindBuffer(gl.ARRAY_BUFFER, buf(a)); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); boundA = a; }
    if (b !== boundB) { gl.bindBuffer(gl.ARRAY_BUFFER, buf(b)); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0); boundB = b; }
  }

  /* ---------- sections ---------- */
  var DEF = { c: 0, shape: "dust", x: 0.5, y: 0.5, scale: 1, alpha: 1 };
  var els = [], cfg = [], secs = [], W = 1, H = 1, dpr = 1;
  function num(el, k, d, lo, hi) { var v = parseFloat(el.getAttribute("data-scene-" + k)); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : d; }
  function scan() {
    els = [].slice.call(doc.querySelectorAll("[data-scene]"));
    cfg = els.map(function (el) {
      var s = (el.getAttribute("data-scene") || "").trim().toLowerCase();
      return { shape: GEN.hasOwnProperty(s) ? s : "dust", x: num(el, "x", 0.5, -0.5, 1.5), y: num(el, "y", 0.5, -0.5, 1.5),
        scale: num(el, "scale", 1, 0.1, 4), alpha: num(el, "alpha", 1, 0, 1) };
    });
    measure();
  }
  function measure() {
    var sy = window.pageYOffset || 0, out = [], i, r, c;
    for (i = 0; i < els.length; i++) {
      if (!els[i].getClientRects().length) continue;
      r = els[i].getBoundingClientRect(); c = cfg[i];
      out.push({ c: r.top + sy + r.height / 2, shape: c.shape, x: c.x, y: c.y, scale: c.scale, alpha: c.alpha });
    }
    out.sort(function (p, q) { return p.c - q.c; });
    secs = out;
  }
  /* continuous position between section centres: i + progress, with a hold around each centre */
  function targetG() {
    var n = secs.length, yc = (window.pageYOffset || 0) + H / 2, i, t;
    if (n < 2 || yc <= secs[0].c) return 0;
    for (i = 0; i < n - 1; i++) if (yc < secs[i + 1].c) {
      t = (yc - secs[i].c) / Math.max(1, secs[i + 1].c - secs[i].c);
      return i + Math.min(1, Math.max(0, (t - 0.15) / 0.7));
    }
    return n - 1;
  }
  var ov = null, ST = { a: "dust", b: "dust", m: 0, x: 0.5, y: 0.5, scale: 1, alpha: 1, drift: 0, gain: 1 };
  function state(g) {
    var n = secs.length, sa = DEF, sb = DEF, m = 0, i, e, a, b, sm;
    if (n === 1) sa = sb = secs[0];
    else if (n > 1) { i = Math.max(0, Math.min(n - 2, Math.floor(g))); m = Math.max(0, Math.min(1, g - i)); sa = secs[i]; sb = secs[i + 1]; }
    e = m * m * (3 - 2 * m);
    a = sa.shape; b = sb.shape; sm = m;
    if (ov) { a = ov.from; b = ov.to; sm = Math.max(0, Math.min(1, ov.s.x)); }
    ST.a = a; ST.b = b; ST.m = sm;
    ST.x = sa.x + (sb.x - sa.x) * e; ST.y = sa.y + (sb.y - sa.y) * e;
    ST.scale = sa.scale + (sb.scale - sa.scale) * e; ST.alpha = sa.alpha + (sb.alpha - sa.alpha) * e;
    e = sm * sm * (3 - 2 * sm);
    ST.drift = LOOK[a][0] + (LOOK[b][0] - LOOK[a][0]) * e; ST.gain = LOOK[a][1] + (LOOK[b][1] - LOOK[a][1]) * e;
    return ST;
  }

  /* ---------- render ---------- */
  function resize() {
    W = canvas.clientWidth || window.innerWidth || 1; H = canvas.clientHeight || window.innerHeight || 1;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (W * H * dpr * dpr > 4.2e6) dpr = Math.max(1, Math.sqrt(4.2e6 / (W * H)));
    var w = Math.round(W * dpr), h = Math.round(H * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    measure();
  }
  function render(s, t, yaw, pitch, roll, fade) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    var alpha = s.alpha * fade, x = s.x;
    if (alpha < 0.004) return false;
    if (W < 760) x = 0.5 + (x - 0.5) * 0.3; /* narrow screens: keep side-placed shapes mostly on screen */
    bind(s.a, s.b);
    gl.uniformMatrix3fv(U.uRot, false, rot(yaw, pitch, roll, MR));
    gl.uniform2f(U.uRes, W, H); gl.uniform2f(U.uCenter, x * W, s.y * H);
    gl.uniform1f(U.uR, 0.34 * Math.min(W, H) * s.scale); gl.uniform1f(U.uPR, dpr); gl.uniform1f(U.uSize, 2.3);
    gl.uniform1f(U.uGain, 0.9 * alpha * s.gain); gl.uniform1f(U.uDrift, s.drift);
    gl.uniform1f(U.uMorph, s.m); gl.uniform1f(U.uTime, t);
    gl.drawArrays(gl.POINTS, 0, N);
    return true;
  }

  /* springs (critically-ish damped) so nothing snaps; ζ≈0.8 for the parallax tilt */
  function spring(s, to, k, z, dt, vmax) {
    s.v += (-k * (s.x - to) - 2 * z * Math.sqrt(k) * s.v) * dt;
    if (vmax && Math.abs(s.v) > vmax) s.v = s.v < 0 ? -vmax : vmax;
    s.x += s.v * dt;
  }
  var G = { x: 0, v: 0 }, TX = { x: 0, v: 0 }, TY = { x: 0, v: 0 }, ptr = [0, 0];
  var raf = 0, last = 0, time = 0, born = 0, lost = false, settle = 0, booted = false;

  function tick(now) {
    raf = 0;
    if (lost || doc.hidden) return;
    var dt = Math.min(0.05, Math.max(0, (now - last) / 1000)), gt = targetG(), steps = Math.max(1, Math.ceil(dt * 120)), h = dt / steps, i, s, fade, drawn;
    last = now; time += dt;
    for (i = 0; i < steps; i++) {
      spring(G, gt, 38, 0.9, h, 3);
      spring(TX, ptr[0], 14, 0.8, h); spring(TY, ptr[1], 14, 0.8, h);
      if (ov) spring(ov.s, 1, 30, 0.9, h);
    }
    s = state(G.x);
    if (!born) born = now; /* wall clock, so a throttled tab still fades in on time */
    fade = Math.min(1, (now - born) / 1600); fade = fade * fade * (3 - 2 * fade);
    drawn = render(s, time,
      0.045 * Math.sin(time * 0.21) + 0.02 * Math.sin(time * 0.13 + 1.7) + TX.x * 0.14,
      0.035 * Math.sin(time * 0.17 + 0.6) + TY.x * 0.1,
      0.02 * Math.sin(time * 0.11 + 2.1), fade);
    /* invisible and settled: stop until scroll / resize / API wakes us */
    if (!drawn && fade >= 1 && Math.abs(G.x - gt) < 1e-3 && Math.abs(G.v) < 1e-3) return;
    raf = requestAnimationFrame(tick);
  }
  function wake() {
    if (lost || !booted) return;
    if (calm) { clearTimeout(settle); settle = setTimeout(still, 160); return; }
    if (!raf && !doc.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }
  /* reduced motion / save-data: one static frame of the current section's shape */
  function still() {
    if (lost) return;
    var i = Math.round(targetG());
    G.x = Math.max(0, Math.min(Math.max(0, secs.length - 1), i)); G.v = 0;
    if (ov) ov.s.x = 1;
    render(state(G.x), 0, 0, 0, 0, 1);
  }

  try { initGL(); } catch (e) { fail(); return; }
  html.classList.remove("no-webgl"); html.classList.add("has-scene");
  scan(); resize();
  G.x = targetG(); booted = true;

  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener("resize", function () { resize(); if (calm) still(); else wake(); });
  window.addEventListener("load", function () { measure(); wake(); });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { measure(); wake(); });
  if (window.ResizeObserver) new ResizeObserver(function () { measure(); wake(); }).observe(doc.body || html);
  doc.addEventListener("visibilitychange", function () { if (!doc.hidden) wake(); });
  if (!calm) {
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      ptr[0] = Math.max(-1, Math.min(1, e.clientX / W * 2 - 1)); ptr[1] = Math.max(-1, Math.min(1, e.clientY / H * 2 - 1));
    }, { passive: true });
    doc.addEventListener("mouseout", function (e) { if (!e.relatedTarget) ptr[0] = ptr[1] = 0; });
    window.addEventListener("blur", function () { ptr[0] = ptr[1] = 0; });
  }
  canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); lost = true; if (raf) cancelAnimationFrame(raf); raf = 0; }, false);
  canvas.addEventListener("webglcontextrestored", function () {
    lost = false;
    try { initGL(); } catch (e) { fail(); return; }
    resize(); if (calm) still(); else wake();
  }, false);

  window.KadrScene = {
    /* force a shape (debug); a falsy name hands control back to the scroll position */
    setShape: function (name) {
      if (!name) ov = null;
      else if (GEN.hasOwnProperty(name)) { var c = state(G.x); ov = { from: c.m < 0.5 ? c.a : c.b, to: name, s: { x: calm ? 1 : 0, v: 0 } }; }
      if (calm) still(); else wake();
    },
    /* re-scan data-scene elements after the page changed its layout */
    refresh: function () { scan(); if (calm) still(); else wake(); }
  };

  if (calm) still(); else wake();
})();
