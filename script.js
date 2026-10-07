/* ==========================================================
   Live Pilates — configurações fáceis de editar
   ========================================================== */

// Mude para true quando tiver os valores dos planos (e preencha data-preco em cada card no index.html).
const MOSTRAR_PRECOS = false;

// Avaliações no Google (hoje: 9). Atualize aqui quando mudar; aparece na seção "Avaliações".
const AVALIACOES_GOOGLE = 9;

const WHATSAPP_NUMERO = '5511982082617';

// Mensagem pronta de cada botão (atributo data-wa="..." no HTML) — assim o estúdio sabe de onde veio o contato.
const WHATSAPP_MENSAGENS = {
  experimental: 'Oi, Gleides! Vi o site e quero agendar uma aula experimental.',
  planos: 'Oi, Gleides! Vi o site e queria saber os valores das aulas.',
  duvida: 'Oi, Gleides! Vi o site e tenho uma dúvida.',
  flutuante: 'Oi, Gleides! Vi o site e quero agendar uma aula experimental.',
};

// Horários (0 = domingo ... 6 = sábado), em minutos desde a meia-noite. null = fechado.
// CONFIRMAR: horário com a Gleides (tirado do Google Maps). Se mudar, ajuste também a tabela e o rodapé no index.html e o JSON-LD.
const HORARIOS = {
  0: null,
  1: null,
  2: [15 * 60, 20 * 60],
  3: [15 * 60, 20 * 60],
  4: [15 * 60, 20 * 60],
  5: [15 * 60, 20 * 60],
  6: null,
};
const NOMES_DIA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

// Galeria "Conheça o estúdio" (acordeão). Ajuste aqui o comportamento.
const ACORDEAO = {
  painelInicial: 3,      // foto aberta ao carregar (0 = primeira)
  gatilho: 'hover',      // 'hover' (mouse passa por cima) ou 'click'
  expansao: 0.45,        // fração da largura ocupada pela foto aberta (0.2 – 0.9)
  expansaoMobile: 0.5,   // idem, no celular (acordeão vertical)
  duracao: 0.6,          // segundos
  easing: 'power3.out',
  parallax: 0.5,         // deslize interno da imagem (0 desliga)
  inclinacao: 8,         // graus de rotação 3D nas fotos fechadas (0 desliga)
  atrasoLegenda: 0.06,
  tonsDeCinza: false,    // fotos fechadas em preto e branco (false = coloridas)
};
/* ========================================================== */

(function () {
  'use strict';

  /* ---- Número de avaliações do Google ---- */
  document.querySelectorAll('[data-avaliacoes]').forEach(function (el) { el.textContent = String(AVALIACOES_GOOGLE); });

  /* ---- Links do WhatsApp com mensagem ---- */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    const msg = WHATSAPP_MENSAGENS[a.dataset.wa] || WHATSAPP_MENSAGENS.experimental;
    a.href = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(msg);
  });

  /* ---- Menu mobile ---- */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('menu');
  function fecharMenu() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }
  toggle.addEventListener('click', function () {
    const aberto = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(aberto));
    toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', fecharMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharMenu(); });

  /* ---- Planos: mostrar preços ou "consulte pelo WhatsApp" ---- */
  document.querySelectorAll('.plan').forEach(function (card) {
    const preco = card.querySelector('.plan-price');
    const rotulo = card.querySelector('.plan-btn-label');
    if (MOSTRAR_PRECOS) {
      preco.textContent = card.dataset.preco || '';
      rotulo.textContent = 'Quero este plano';
    } else {
      preco.textContent = 'Consulte valores pelo WhatsApp';
      preco.style.fontSize = '1.25rem';
      preco.style.fontFamily = 'var(--font-body)';
      rotulo.textContent = 'Consultar valores';
    }
  });

  /* ---- Horário de São Paulo: dia de hoje + "Aberto agora" ---- */
  function agoraEmSP() {
    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false,
    }).formatToParts(new Date());
    const get = function (t) { return partes.find(function (p) { return p.type === t; }).value; };
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { dia: dia, minutos: (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10) };
  }
  function hhmm(min) {
    return String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');
  }
  function textoStatus(agora) {
    const hoje = HORARIOS[agora.dia];
    if (hoje && agora.minutos >= hoje[0] && agora.minutos < hoje[1]) {
      return { aberto: true, texto: 'Aberto agora · fecha às ' + hhmm(hoje[1]) };
    }
    if (hoje && agora.minutos < hoje[0]) {
      return { aberto: false, texto: 'Fechado agora · abre hoje às ' + hhmm(hoje[0]) };
    }
    for (let i = 1; i <= 7; i++) {
      const d = (agora.dia + i) % 7;
      if (HORARIOS[d]) {
        const quando = i === 1 ? 'amanhã' : NOMES_DIA[d];
        return { aberto: false, texto: 'Fechado agora · abre ' + quando + ' às ' + hhmm(HORARIOS[d][0]) };
      }
    }
    return { aberto: false, texto: 'Fechado agora' };
  }
  function atualizarHorarios() {
    const agora = agoraEmSP();
    document.querySelectorAll('.hours tr').forEach(function (tr) {
      tr.classList.toggle('today', Number(tr.dataset.day) === agora.dia);
    });
    const s = textoStatus(agora);
    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.textContent = s.texto;
      el.classList.toggle('is-open', s.aberto);
      el.classList.toggle('is-closed', !s.aberto);
    });
  }
  atualizarHorarios();
  setInterval(atualizarHorarios, 60000);

  /* ---- Fallback das fotos: se não carregar, aparece o placeholder ---- */
  function falhou(img) {
    const pai = img.parentElement;
    img.remove();
    if (pai) pai.classList.add('img-failed');
  }
  document.querySelectorAll('img').forEach(function (img) {
    if (!img.getAttribute('src')) return; // <img> da lightbox só ganha src ao abrir
    if (img.complete && img.naturalWidth === 0) falhou(img);
    else img.addEventListener('error', function () { falhou(img); }, { once: true });
  });

  /* ---- Animação ao rolar (respeita prefers-reduced-motion via CSS) ---- */
  const itens = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    itens.forEach(function (el) { io.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Lightbox da galeria ---- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  const links = Array.from(document.querySelectorAll('#gallery .ag-panel'));
  let atual = 0;

  function mostrar(i) {
    atual = (i + links.length) % links.length;
    const a = links[atual];
    const miniatura = a.querySelector('img');
    lbImg.src = a.getAttribute('href');
    lbImg.alt = miniatura ? miniatura.alt : '';
    lbCap.textContent = a.dataset.caption || '';
  }
  function abrirLightbox(i) {
    mostrar(i);
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
  }
  lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
  lb.querySelector('.lb-prev').addEventListener('click', function () { mostrar(atual - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { mostrar(atual + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); }); // clique no fundo
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') mostrar(atual - 1);
    if (e.key === 'ArrowRight') mostrar(atual + 1);
  });

  /* ---- Galeria em acordeão (adaptada do AccordionGallery, React Bits) ----
     Passar o mouse / tocar / focar abre a foto; clicar de novo na foto aberta amplia (lightbox). */
  const raiz = document.getElementById('gallery');
  const paineis = links;
  if (raiz && paineis.length) {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mqVertical = window.matchMedia('(max-width: 640px)');
    const total = paineis.length;
    const midias = paineis.map(function (p) { return p.querySelector('.ag-panel__media'); });
    const barras = paineis.map(function (p) { return p.querySelector('.ag-panel__bar'); });
    const textos = paineis.map(function (p) { return p.querySelector('.ag-panel__text'); });
    const temGsap = typeof window.gsap !== 'undefined';
    let ativo = Math.min(Math.max(ACORDEAO.painelInicial, 0), total - 1);
    let tamanhoMidia = 320;
    let tl = null;
    let primeira = true;

    function cfg() {
      const vertical = mqVertical.matches;
      return {
        vertical: vertical,
        expand: Math.min(Math.max(vertical ? ACORDEAO.expansaoMobile : ACORDEAO.expansao, 0.2), 0.9),
        tilt: vertical ? 0 : ACORDEAO.inclinacao,
      };
    }

    function aplicar(animar) {
      const c = cfg();
      const grow = total > 1 ? (c.expand * (total - 1)) / (1 - c.expand) : 1;
      const dur = animar && !reduzido ? ACORDEAO.duracao : 0;
      if (tl) tl.kill();
      tl = temGsap ? gsap.timeline() : null;

      paineis.forEach(function (painel, i) {
        const aberto = i === ativo;
        const midia = midias[i], barra = barras[i], texto = textos[i];
        const rot = aberto ? 0 : i < ativo ? c.tilt : -c.tilt;
        const deriva = Math.max(-1.5, Math.min(1.5, ativo - i));
        const desloc = deriva * ACORDEAO.parallax * tamanhoMidia * 0.06;
        const cinza = ACORDEAO.tonsDeCinza ? (aberto ? 0 : 1) : 0;
        const escurecer = aberto ? 0 : 0.35;
        const rotProp = c.vertical ? { rotateX: -rot } : { rotateY: rot };
        const mx = c.vertical ? 0 : aberto ? 0 : desloc;
        const my = c.vertical ? (aberto ? 0 : desloc) : 0;

        paineis[i].classList.toggle('ag-panel--active', aberto);
        paineis[i].setAttribute('aria-current', aberto ? 'true' : 'false');

        if (temGsap) {
          tl.to(painel, Object.assign({ flexGrow: aberto ? grow : 1, duration: dur, ease: ACORDEAO.easing }, rotProp), 0);
          tl.to(midia, { xPercent: -50, yPercent: -50, x: mx, y: my, '--ag-gray': cinza, '--ag-dim': escurecer, duration: dur, ease: ACORDEAO.easing }, 0);
          if (aberto) tl.to([barra, texto], { opacity: 1, x: 0, duration: dur, ease: ACORDEAO.easing, stagger: reduzido ? 0 : ACORDEAO.atrasoLegenda }, 0);
          else tl.to([barra, texto], { opacity: 0, x: -14, duration: dur * 0.6, ease: ACORDEAO.easing }, 0);
        } else {
          // sem GSAP (ex.: CDN bloqueado): mesmo layout, sem animação
          painel.style.flexGrow = aberto ? grow : 1;
          midia.style.transform = 'translate(-50%, -50%) translate(' + mx + 'px,' + my + 'px)';
          midia.style.setProperty('--ag-gray', cinza);
          midia.style.setProperty('--ag-dim', escurecer);
          barra.style.opacity = texto.style.opacity = aberto ? 1 : 0;
        }
      });
    }

    function medir() {
      const c = cfg();
      raiz.classList.toggle('ag--vertical', c.vertical);
      const r = raiz.getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(raiz).columnGap) || 10;
      const usavel = Math.max((c.vertical ? r.height : r.width) - gap * (total - 1), 120);
      tamanhoMidia = Math.max(140, usavel * c.expand * 1.22);
      raiz.style.setProperty('--ag-media-size', tamanhoMidia + 'px');
      aplicar(!primeira);
    }

    function definirAtivo(i) {
      if (i === ativo) return;
      ativo = i;
      aplicar(true);
    }

    raiz.classList.add('ag-on');
    if (temGsap) gsap.set(midias, { xPercent: -50, yPercent: -50 });
    medir();
    primeira = false;
    mqVertical.addEventListener('change', function () {
      if (temGsap) { gsap.set(paineis, { clearProps: 'transform' }); gsap.set(midias, { x: 0, y: 0 }); }
      medir();
    });
    if ('ResizeObserver' in window) new ResizeObserver(medir).observe(raiz);

    paineis.forEach(function (painel, i) {
      let eraAberto = true, veioDoPonteiro = false;
      painel.addEventListener('pointerenter', function (e) {
        if (ACORDEAO.gatilho === 'hover' && e.pointerType === 'mouse') definirAtivo(i);
      });
      painel.addEventListener('pointerdown', function () { eraAberto = i === ativo; veioDoPonteiro = true; });
      painel.addEventListener('focus', function () { definirAtivo(i); });
      painel.addEventListener('click', function (e) {
        e.preventDefault();
        const abre = veioDoPonteiro ? eraAberto : true; // teclado (Enter): foco já abriu a foto, então amplia
        veioDoPonteiro = false;
        if (midias[i].classList.contains('img-failed')) { definirAtivo(i); return; } // sem foto real ainda: só abre o painel
        if (abre) abrirLightbox(i); else definirAtivo(i);
      });
      painel.addEventListener('keydown', function (e) {
        const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        paineis[(i + dir + total) % total].focus();
      });
    });
  }
})();

/* ---- Fundo animado do hero (PlasmaWave) ----
   Módulo carregado só se o navegador tiver WebGL. Sem WebGL (ou se falhar), fica o gradiente estático do CSS. */
(function () {
  'use strict';
  const alvo = document.getElementById('hero-plasma');
  if (!alvo) return;
  let temWebGL = false;
  try {
    const t = document.createElement('canvas');
    temWebGL = !!(window.WebGLRenderingContext && (t.getContext('webgl') || t.getContext('experimental-webgl')));
  } catch (e) { temWebGL = false; }
  if (!temWebGL) return;

  const css = getComputedStyle(document.documentElement);
  const cor1 = css.getPropertyValue('--ink').trim() || '#0F4F4C';
  const cor2 = css.getPropertyValue('--accent').trim() || '#F08A6C';

  import('./plasmawave.js').then(function (m) {
    const pw = m.criarPlasmaWave(alvo, { colors: [cor1, cor2] });
    if (pw) alvo.classList.add('pw-ativo');
  }).catch(function () { /* mantém o gradiente estático */ });
})();