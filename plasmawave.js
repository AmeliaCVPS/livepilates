/* ==========================================================
   PlasmaWave — fitas de luz em movimento (background do hero)
   Adaptado do componente <PlasmaWave /> do React Bits (https://reactbits.dev),
   reescrito em JavaScript puro (sem React). Usa a biblioteca OGL (MIT).
   ATENÇÃO: confira a licença do React Bits antes de publicar o site.
   ========================================================== */
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from './vendor/ogl.mjs';

/* ---- Configuração inicial (fácil de ajustar) ---- */
export const PLASMA_CONFIG = {
  speed1: 0.03,
  speed2: 0.03,
  dir2: -1,
  bend1: 0.9,
  bend2: 0.5,
  rotationDeg: -10,
  focalLength: 0.8,
  xOffset: 0,
  yOffset: 0,
  lightMode: true,
  escala: 0.6,        // renderiza a ~0,6x da resolução (CSS estica o canvas)
  dprMax: 1.5,
  fpsCelular: 30,
  fpsDesktop: 60,
};

function hexToRgb(hex) {
  hex = hex.trim().replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform float iTime;
uniform vec2  iResolution;
uniform vec2  uOffset;
uniform float uRotation;
uniform float uFocalLength;
uniform float uSpeed1;
uniform float uSpeed2;
uniform float uDir2;
uniform float uBend1;
uniform float uBend2;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform float uLightMode;

const float lt   = 0.3;
const float pi   = 3.14159;
const float pi2  = 6.28318;
const float pi_2 = 1.5708;
#define MAX_STEPS 14

void mainImage(out vec4 C, in vec2 U) {
  float t = iTime * pi;
  float s = 1.0;
  float d = 0.0;
  vec2  R = iResolution;

  vec3 o = vec3(0.0, 0.0, -7.0);
  vec3 u = normalize(vec3((U - 0.5 * R) / R.y, uFocalLength));
  vec2 k = vec2(0.0);
  vec3 p;

  float t1 = t * 0.7;
  float t2 = t * 0.9;
  float tSpeed1 = t * uSpeed1;
  float tSpeed2 = t * uSpeed2 * uDir2;

  for (int i = 0; i < MAX_STEPS; ++i) {
    p = o + u * d;
    p.x -= 15.0;

    float px = p.x;
    float wob1 = uBend1 + sin(t1 + px * 0.8) * 0.1;
    float wob2 = uBend2 + cos(t2 + px * 1.1) * 0.1;

    float px2 = px + pi_2;
    vec2 sinOffset = sin(vec2(px, px2) + tSpeed1) * wob1;
    vec2 cosOffset = cos(vec2(px, px2) + tSpeed2) * wob2;

    vec2 yz = p.yz;
    float pxLt = px + lt;
    k.x = max(pxLt, length(yz - sinOffset) - lt);
    k.y = max(pxLt, length(yz - cosOffset) - lt);

    float current = min(k.x, k.y);
    s = min(s, current);
    if (s < 0.001 || d > 300.0) break;
    d += s * 0.7;
  }

  float sqrtD = sqrt(d);
  vec3 raw = max(cos(d * pi2) - s * sqrtD - vec3(k, 0.0), 0.0);
  float field = max(raw.r, max(raw.g, raw.b));
  float outerMask = smoothstep(0.0, 0.055, field);
  float glowMask = smoothstep(0.012, 0.13, field);
  float coreMask = smoothstep(0.075, 0.27, field);
  if (uLightMode < 0.5 && field < 0.15) discard;
  raw.gb += uLightMode > 0.5 ? 0.1 * glowMask : 0.1;
  raw = raw * 0.4 + raw.brg * 0.6 + raw * raw;
  float lum = dot(raw, vec3(0.299, 0.587, 0.114));
  float w1 = max(0.0, 1.0 - k.x * 2.0);
  float w2 = max(0.0, 1.0 - k.y * 2.0);
  float wt = w1 + w2 + 0.001;
  vec3 baseColor = (uColor1 * w1 + uColor2 * w2) / wt;
  vec3 c = baseColor * lum * 3.5;
  if (uLightMode > 0.5) {
    float lightW1 = exp(-max(k.x, 0.0) * 4.0);
    float lightW2 = exp(-max(k.y, 0.0) * 4.0);
    vec3 lightBase = (uColor1 * lightW1 + uColor2 * lightW2) / (lightW1 + lightW2 + 0.001);
    float lightLuma = dot(lightBase, vec3(0.299, 0.587, 0.114));
    vec3 vividColor = clamp(pow(max(mix(vec3(lightLuma), lightBase, 1.35), 0.0), vec3(0.64)) * 1.14, 0.0, 1.0);
    float colorPresence = clamp(outerMask * 0.34 + glowMask * 1.08 + coreMask * 0.22, 0.0, 1.0);
    vec3 lightColor = mix(vec3(1.0), vividColor, colorPresence);
    lightColor = mix(lightColor, vec3(1.0), coreMask * smoothstep(0.16, 0.95, lum) * 0.1);
    C = vec4(lightColor, 1.0);
  } else {
    C = vec4(c, 1.0);
  }
}

void main() {
  vec2 coord = gl_FragCoord.xy + uOffset;
  coord -= 0.5 * iResolution;
  float c = cos(uRotation), s = sin(uRotation);
  coord = mat2(c, -s, s, c) * coord;
  coord += 0.5 * iResolution;

  vec4 color;
  mainImage(color, coord);
  gl_FragColor = color;
}
`;

/**
 * Cria o fundo animado dentro de `container`.
 * Devolve { pausar, retomar, destruir }.
 * opcoes.colors = [cor1, cor2] (hex). Demais chaves sobrescrevem PLASMA_CONFIG.
 */
export function criarPlasmaWave(container, opcoes) {
  const cfg = Object.assign({}, PLASMA_CONFIG, opcoes || {});
  const cores = cfg.colors || ['#0F4F4C', '#F08A6C'];
  const celular = window.matchMedia('(max-width: 760px)').matches || navigator.maxTouchPoints > 0;
  const intervalo = 1000 / (celular ? cfg.fpsCelular : cfg.fpsDesktop);
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio || 1, cfg.dprMax) * cfg.escala,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'default',
    });
  } catch (e) {
    return null; // sem WebGL: o CSS cuida do fallback
  }
  const gl = renderer.gl;
  if (!gl) return null;

  const canvas = gl.canvas;
  canvas.style.pointerEvents = 'none';
  canvas.setAttribute('aria-hidden', 'true');
  gl.clearColor(0, 0, 0, 0);
  container.appendChild(canvas);

  const camera = new Camera(gl);
  const scene = new Transform();
  const geometry = new Geometry(gl, {
    position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
  });
  const uniformOffset = new Float32Array([cfg.xOffset, cfg.yOffset]);
  const uniformResolution = new Float32Array([1, 1]);

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: uniformResolution },
      uOffset: { value: uniformOffset },
      uRotation: { value: (cfg.rotationDeg * Math.PI) / 180 },
      uFocalLength: { value: cfg.focalLength },
      uSpeed1: { value: cfg.speed1 },
      uSpeed2: { value: cfg.speed2 },
      uDir2: { value: cfg.dir2 },
      uBend1: { value: cfg.bend1 },
      uBend2: { value: cfg.bend2 },
      uColor1: { value: hexToRgb(cores[0]) },
      uColor2: { value: hexToRgb(cores[1]) },
      uLightMode: { value: cfg.lightMode ? 1 : 0 },
    },
  });
  new Mesh(gl, { geometry, program }).setParent(scene);

  function redimensionar() {
    const r = container.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height);
    // OGL deixa o canvas com style width/height em px; deixamos o CSS esticar
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    uniformResolution[0] = r.width * renderer.dpr;
    uniformResolution[1] = r.height * renderer.dpr;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    if (!rodando) desenhar(tempo);
  }

  let rodando = false;
  let visivel = true;
  let abaVisivel = !document.hidden;
  let contextoPerdido = false;
  let rafId = 0;
  let ultimo = 0;
  let tempo = 0;       // tempo acumulado em segundos (não avança enquanto pausado)
  let anterior = 0;
  const inicio = 4;    // começa em um instante com boa composição

  function desenhar(t) {
    program.uniforms.iTime.value = inicio + t;
    renderer.render({ scene, camera });
  }

  function quadro(agora) {
    rafId = requestAnimationFrame(quadro);
    if (agora - ultimo < intervalo - 1) return;
    ultimo = agora;
    tempo += (agora - anterior) / 1000;
    anterior = agora;
    desenhar(tempo);
  }

  function atualizar() {
    const deveRodar = visivel && abaVisivel && !contextoPerdido && !reduzido && !pausadoManual;
    if (deveRodar && !rodando) {
      rodando = true;
      anterior = performance.now();
      rafId = requestAnimationFrame(quadro);
    } else if (!deveRodar && rodando) {
      rodando = false;
      cancelAnimationFrame(rafId);
    }
  }

  let pausadoManual = false;

  const ro = new ResizeObserver(redimensionar);
  ro.observe(container);
  redimensionar();

  // Um quadro parado (também é o resultado final com prefers-reduced-motion)
  desenhar(tempo);
  canvas.classList.add('pw-pronto');

  const io = new IntersectionObserver(function (entradas) {
    visivel = entradas[0].isIntersecting;
    atualizar();
  }, { threshold: 0 });
  io.observe(container);

  function aoMudarAba() { abaVisivel = !document.hidden; atualizar(); }
  document.addEventListener('visibilitychange', aoMudarAba);

  function perdeu(e) {
    e.preventDefault();
    contextoPerdido = true;
    canvas.classList.remove('pw-pronto');
    atualizar();
  }
  function restaurou() {
    contextoPerdido = false;
    redimensionar();
    desenhar(tempo);
    canvas.classList.add('pw-pronto');
    atualizar();
  }
  canvas.addEventListener('webglcontextlost', perdeu, false);
  canvas.addEventListener('webglcontextrestored', restaurou, false);

  atualizar();

  return {
    pausar: function () { pausadoManual = true; atualizar(); },
    retomar: function () { pausadoManual = false; atualizar(); },
    destruir: function () {
      rodando = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', aoMudarAba);
      canvas.removeEventListener('webglcontextlost', perdeu);
      canvas.removeEventListener('webglcontextrestored', restaurou);
      if (canvas.parentNode === container) container.removeChild(canvas);
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    },
  };
}
