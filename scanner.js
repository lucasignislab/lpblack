/* Scanner (React Bits) — port vanilla WebGL2 para a seção da oferta.
   Cores do design system: orange #FF7E4A → gold #FFB800 → picos brancos. */
(function () {
  const canvas = document.getElementById("offer-scanner");
  if (!canvas) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const config = {
    color1: "#FF7E4A", // Brand Orange
    color2: "#FFB800", // Brand Gold
    color3: "#FFFFFF", // picos
    speed: 0.5,
    sweepSpeed: 0.25,
    sweepWidth: 1.6,
    sweepFalloff: 6,
    scale: 1.5,
    frequency: 2,
    ripple: 0.22,
    bandDensity: 11,
    lineSharpness: 5.5,
    glow: 0.22,
    scanDirection: 0.0, // vertical
    colorSpread: 0.7,
    brightness: 1.0,
    contrast: 1.15,
    softness: 1.4,
    vignette: 0.45,
    scanline: 1.0,
    grain: 1.0,
    grainIntensity: 0.05,
    opacity: 1.0,
    mouseRadius: 0.5,
    mouseStrength: 0.5,
  };

  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
  });
  if (!gl) return;

  const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uSweepFalloff;
uniform float uScale;
uniform float uFrequency;
uniform float uRipple;
uniform float uBandDensity;
uniform float uLineSharpness;
uniform float uGlow;
uniform float uColorSpread;
uniform float uBrightness;
uniform float uContrast;
uniform float uSoftness;
uniform float uVignette;
uniform float uOpacity;
uniform float uScanline;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uDirection;
uniform vec2 uMouse;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uMouseActive;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

const float TAU = 6.2831853;

float signalField(vec2 p, float t) {
  float w = sin(p.x * 1.3 + t * 0.7);
  w += sin(p.y * 1.7 - t * 0.52) * 0.8;
  w += sin((p.x + p.y) * 0.9 + t * 0.91) * 0.6;
  w += sin((p.x - p.y) * 1.53 - t * 0.63) * 0.42;
  return w * 0.35;
}

vec3 palette(float f) {
  f = clamp(f, 0.0, 1.0);
  f = pow(f, uContrast);
  vec3 c = mix(uColor1, uColor2, smoothstep(0.08, 0.6, f));
  return mix(c, uColor3, smoothstep(0.68, 1.0, f));
}

float scanBand(float x, float aa, float sharp) {
  float v = mix(0.5, 0.5 + 0.5 * cos(x * TAU), aa);
  return pow(v, sharp);
}

void main() {
  float aspect = iResolution.x / iResolution.y;
  vec2 uv0 = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
  vec2 p = uv0 / max(uScale, 0.001);

  float t = iTime * uSpeed;

  float mouseBoost = 0.0;
  vec2 mUv = vec2((uMouse.x * 2.0 - 1.0) * aspect, uMouse.y * 2.0 - 1.0);
  vec2 md = uv0 - mUv;
  float r = max(uMouseRadius, 0.001);
  mouseBoost = exp(-dot(md, md) / (r * r)) * uMouseStrength * uMouseActive;

  float axis;
  if (uDirection < 0.5) axis = p.y;
  else if (uDirection < 1.5) axis = p.x;
  else axis = (p.x + p.y) * 0.70710678;

  float sig = signalField(p * uFrequency, t);
  float coord = axis + sig * uRipple;

  float phase = coord / max(uSweepWidth, 0.05) - t * uSweepSpeed;
  float sweep = pow(0.5 + 0.5 * cos(phase * TAU), max(uSweepFalloff, 0.1));

  float lc = coord * uBandDensity;
  float aa = 1.0 / (1.0 + uSoftness * fwidth(lc) * 3.0);
  aa = clamp(aa * (1.0 + mouseBoost * 0.6), 0.0, 1.0);

  float bodyBase = clamp(0.5 + 0.5 * sig, 0.0, 1.0);
  float body = bodyBase * bodyBase * uGlow * sweep;

  float sharp = max(uLineSharpness, 0.1);
  float split = uColorSpread * 0.16;
  float fr = clamp(scanBand(lc + split, aa, sharp) * sweep + body, 0.0, 1.0);
  float fg = clamp(scanBand(lc, aa, sharp) * sweep + body, 0.0, 1.0);
  float fb = clamp(scanBand(lc - split, aa, sharp) * sweep + body, 0.0, 1.0);

  vec3 col = vec3(palette(fr).r, palette(fg).g, palette(fb).b);

  float inten = (fr + fg + fb) * 0.3333333 * uBrightness;
  inten *= 1.0 + mouseBoost * 0.9;

  if (uScanline > 0.5) {
    inten *= 1.0 - 0.18 * (0.5 + 0.5 * cos(gl_FragCoord.y * 1.7));
  }

  if (uGrain > 0.5) {
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453);
    inten += (g - 0.5) * uGrainIntensity;
  }

  inten *= clamp(1.0 - uVignette * smoothstep(0.55, 1.65, length(uv0)), 0.0, 1.0);
  inten = clamp(inten, 0.0, 1.0);

  float a = clamp(inten * uOpacity, 0.0, 1.0);
  fragColor = vec4(clamp(col, 0.0, 1.0) * a, a);
}
`;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  const vertexShader = compile(gl.VERTEX_SHADER, `#version 300 es
in vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  // Triângulo full-screen (equivalente ao Triangle do ogl)
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.clearColor(0, 0, 0, 0);

  const uniforms = {};
  [
    "iTime", "iResolution", "uSpeed", "uSweepSpeed", "uSweepWidth", "uSweepFalloff",
    "uScale", "uFrequency", "uRipple", "uBandDensity", "uLineSharpness", "uGlow",
    "uColorSpread", "uBrightness", "uContrast", "uSoftness", "uVignette", "uOpacity",
    "uScanline", "uGrain", "uGrainIntensity", "uDirection", "uMouse",
    "uMouseRadius", "uMouseStrength", "uMouseActive", "uColor1", "uColor2", "uColor3",
  ].forEach((name) => {
    uniforms[name] = gl.getUniformLocation(program, name);
  });

  function hexToRgb(hex) {
    const c = hex.replace("#", "");
    return [
      parseInt(c.slice(0, 2), 16) / 255,
      parseInt(c.slice(2, 4), 16) / 255,
      parseInt(c.slice(4, 6), 16) / 255,
    ];
  }
  const c1 = hexToRgb(config.color1);
  const c2 = hexToRgb(config.color2);
  const c3 = hexToRgb(config.color3);

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(canvas.clientWidth));
    const h = Math.max(1, Math.floor(canvas.clientHeight));
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
  }
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);

  // Uniforms estáticos
  gl.uniform1f(uniforms.uSpeed, config.speed);
  gl.uniform1f(uniforms.uSweepSpeed, config.sweepSpeed);
  gl.uniform1f(uniforms.uSweepWidth, config.sweepWidth);
  gl.uniform1f(uniforms.uSweepFalloff, config.sweepFalloff);
  gl.uniform1f(uniforms.uScale, config.scale);
  gl.uniform1f(uniforms.uFrequency, config.frequency);
  gl.uniform1f(uniforms.uRipple, config.ripple);
  gl.uniform1f(uniforms.uBandDensity, config.bandDensity);
  gl.uniform1f(uniforms.uLineSharpness, config.lineSharpness);
  gl.uniform1f(uniforms.uGlow, config.glow);
  gl.uniform1f(uniforms.uColorSpread, config.colorSpread);
  gl.uniform1f(uniforms.uBrightness, config.brightness);
  gl.uniform1f(uniforms.uContrast, config.contrast);
  gl.uniform1f(uniforms.uSoftness, config.softness);
  gl.uniform1f(uniforms.uVignette, config.vignette);
  gl.uniform1f(uniforms.uOpacity, config.opacity);
  gl.uniform1f(uniforms.uScanline, config.scanline);
  gl.uniform1f(uniforms.uGrain, config.grain);
  gl.uniform1f(uniforms.uGrainIntensity, config.grainIntensity);
  gl.uniform1f(uniforms.uDirection, config.scanDirection);
  gl.uniform1f(uniforms.uMouseRadius, config.mouseRadius);
  gl.uniform1f(uniforms.uMouseStrength, config.mouseStrength);
  gl.uniform3f(uniforms.uColor1, c1[0], c1[1], c1[2]);
  gl.uniform3f(uniforms.uColor2, c2[0], c2[1], c2[2]);
  gl.uniform3f(uniforms.uColor3, c3[0], c3[1], c3[2]);

  // Interação do mouse (ouvida na seção, já que o canvas fica atrás do conteúdo)
  const section = canvas.closest("section") || canvas.parentElement;
  let currentMouse = [0.5, 0.5];
  let targetMouse = [0.5, 0.5];
  let mouseActive = 0;
  let targetMouseActive = 0;

  section.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    targetMouse = [
      (e.clientX - rect.left) / rect.width,
      1.0 - (e.clientY - rect.top) / rect.height,
    ];
    targetMouseActive = 1;
  });
  section.addEventListener("mouseleave", () => {
    targetMouseActive = 0;
  });

  const t0 = performance.now();

  function render(t) {
    gl.uniform1f(uniforms.iTime, (t - t0) * 0.001);

    currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
    currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
    gl.uniform2f(uniforms.uMouse, currentMouse[0], currentMouse[1]);
    mouseActive += 0.05 * (targetMouseActive - mouseActive);
    gl.uniform1f(uniforms.uMouseActive, reducedMotion ? 0 : mouseActive);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  if (reducedMotion) {
    requestAnimationFrame(render);
    return;
  }

  let frameId = null;
  let visible = false;

  function loop(t) {
    render(t);
    frameId = visible && !document.hidden ? requestAnimationFrame(loop) : null;
  }

  function tryStart() {
    if (visible && !document.hidden && frameId === null) {
      frameId = requestAnimationFrame(loop);
    }
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) tryStart();
  }).observe(canvas);

  document.addEventListener("visibilitychange", tryStart);
})();
