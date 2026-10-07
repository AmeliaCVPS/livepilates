# Site — Live Pilates (Parada Inglesa, Zona Norte de São Paulo)

Esta pasta já tem uma **cópia do modelo de pilates** (`index.html`, `style.css`, `script.js`, `favicon.svg`), feito originalmente para outro estúdio (Studio Martins). Personalize esse modelo para o **Live Pilates**.

**Regras gerais:**
- **Mantenha o layout do modelo.** Mexa só em **textos, links, cores** e no **background animado** descrito na seção 5.
- **Não invente informação.** Tudo que não estiver neste arquivo fica como `[PREENCHER]`, com um comentário `<!-- PREENCHER: ... -->` no código.
- **Remova todo resquício do Studio Martins**: nome, monograma "SM", endereço do Ipiranga, Instagram, telefone, textos sobre 60+, Metrô Alto do Ipiranga, aparelhos citados e fotos. No final, rode uma busca (`Martins`, `Ipiranga`, `92551`, `studio.martins`, `Arcipreste`, `60+`) para garantir que não sobrou nada.
- A pasta `img/` do modelo **não foi copiada** de propósito: aquelas fotos são de outro estúdio.

---

## 1. Dados do cliente

- **Nome:** Live Pilates
- **Dona e instrutora:** Gleides
- **Bairro:** Parada Inglesa, Zona Norte de São Paulo
- **Endereço:** R. Manuel Taveira, 106 – Sala 01 – Parada Inglesa, São Paulo – SP, CEP 02245-050
- **WhatsApp:** `5511982082617` → `https://wa.me/5511982082617`
- **Horário:** terça a sexta, das 15:00 às 20:00 · segunda, sábado e domingo fechado. *(Horário tirado do Google Maps; deixe `<!-- CONFIRMAR: horário com a Gleides -->` na tabela e nas constantes de horário do `script.js`.)*
- **Coordenadas (Google):** -23.4871034, -46.6080778
- **Diferencial:** atendimento individualizado, com a própria Gleides acompanhando cada aluno. Também trabalha com fisioterapia.
- **Prova social:** 5,0 estrelas no Google, alunos desde 2018, casos de melhora de dor lombar crônica. *(No Google são **9 avaliações** hoje. Mostre "5,0 no Google" e o número 9 numa constante no topo do `script.js`, fácil de atualizar.)*

---

## 2. Textos

- **Título (hero):** "Pilates individualizado na Parada Inglesa"
- **Subtítulo:** "Aulas acompanhadas de perto pela Gleides, pra você se livrar das dores e se movimentar melhor."
- **Botão principal:** "Agendar aula experimental". Abre o WhatsApp com a mensagem: "Oi, Gleides! Vi o site e quero agendar uma aula experimental."
- **Botão secundário do hero:** "Como chegar" (rola até o mapa).
- **Selos do hero:** "★ 5,0 no Google" e o selo "Aberto agora / Fechado agora" que o modelo já calcula (ajuste os horários).
- **Seção "Para quem é"** (use a seção de cards de modalidades do modelo, com os ícones em círculo): 4 cards
  1. Dor nas costas e lombar
  2. Postura
  3. Quem nunca fez pilates
  4. Reabilitação
  Escreva uma frase curta e neutra em cada card, sem prometer resultado médico (ex.: "Exercícios orientados para fortalecer e aliviar a região lombar."). Não cite aparelhos específicos.
- **Diferenciais** (use a seção de pilares/destaques do modelo): atendimento individualizado; a própria Gleides acompanha cada aluno; alunos desde 2018; também trabalha com fisioterapia.
- **Seção "Sobre a Gleides":** `[PREENCHER]`. Deixe um texto curto e neutro de exemplo, claramente marcado, como: "À frente do Live Pilates, a Gleides acompanha pessoalmente cada aluno, com aulas adaptadas às necessidades de cada um. [PREENCHER: formação, registro profissional e trajetória]". Foto: placeholder `img/gleides.webp`.
- **Como funciona a aula experimental:** mantenha os 3 passos do modelo (chame no WhatsApp → agende o horário → venha conhecer), trocando o número e o nome.
- **Planos e valores:** mantenha a estrutura, com valores e frequências como `[PREENCHER]` e `MOSTRAR_PRECOS = false`.
- **Depoimentos:** 3 cards com o texto `[PREENCHER COM AVALIAÇÃO REAL DO GOOGLE]` e `[nome]`. **Não escreva depoimentos inventados.** Botão "Ver avaliações no Google" apontando para a busca do Maps (abaixo).
- **Perguntas frequentes:** mantenha o acordeão; respostas sem dado confirmado ficam `[PREENCHER]`. Inclua "Preciso ter experiência com pilates?" e "Atende quem tem dor lombar?" com respostas `[PREENCHER]`.
- **Rodapé:** Live Pilates, endereço, horário, WhatsApp. Instagram: `[PREENCHER]`.

### Links
- **WhatsApp:** todos os botões usam `wa.me/5511982082617` com mensagem pronta. Mensagens:
  - aula experimental (hero, passos, botão flutuante): "Oi, Gleides! Vi o site e quero agendar uma aula experimental."
  - planos: "Oi, Gleides! Vi o site e queria saber os valores das aulas."
  - dúvida: "Oi, Gleides! Vi o site e tenho uma dúvida."
- **Google Maps (botões):** `https://www.google.com/maps/search/?api=1&query=Live+Pilates+Parada+Inglesa+R.+Manuel+Taveira+106`
- **Mapa incorporado:** `https://www.google.com/maps?q=R.+Manuel+Taveira,+106+-+Parada+Inglesa,+S%C3%A3o+Paulo+-+SP,+02245-050&output=embed`
- **Botão flutuante de WhatsApp** visível em todas as seções da página (o modelo já tem; confirme que ele aparece do topo ao rodapé e não cobre botões no celular).

---

## 3. SEO

- **Title:** "Pilates na Parada Inglesa | Live Pilates – Zona Norte SP"
- **Description:** "Studio de pilates individualizado na Parada Inglesa, Zona Norte de São Paulo. Agende sua aula experimental pelo WhatsApp."
- Atualize Open Graph (`og:title`, `og:description`, `og:site_name`) com esses textos.
- JSON-LD: troque para os dados do Live Pilates (nome, telefone `+55 11 98208-2617`, endereço, CEP, coordenadas e horário de terça a sexta 15:00–20:00). **Sem `aggregateRating`.** Remova `sameAs` do Instagram antigo.
- Troque o `<title>`, o `aria-label` da marca e todos os `alt` que citam o Studio Martins.

---

## 4. Cores e marca

O modelo é preto e branco. Para o Live Pilates, use uma paleta **calma e viva** ("Live"), que transmita alívio e movimento:

| Papel | Cor sugerida |
|---|---|
| Fundo base | `#F7F5F0` (off-white quente) |
| Cartões / seções alternadas | `#E6EFEC` (verde-água bem claro) |
| **Principal** (texto forte, botões, seções escuras, ícones) | `#0F4F4C` (verde-petróleo profundo) |
| **Acento** (detalhes, hover, selo do dia de hoje) | `#F08A6C` (coral suave) |
| Texto secundário | `#4A5A58` |

- Troque só as **variáveis CSS** do `:root` e as cores fixas que aparecerem no CSS (procure `#111`, `#2b2b2b`, `#F7F6F4`, `rgba(247, 246, 244`). Garanta contraste AA.
- **Logo:** troque o monograma "SM" por um monograma **"LP"** no mesmo estilo (círculo na cor principal, letras claras), no `<symbol>` do `index.html` e no `favicon.svg`. Nome do texto da marca: "Live Pilates".
- Mantenha as fontes do modelo.

### Fotos (placeholders)
- Use **placeholders neutros** nos lugares das fotos (hero, sobre, Gleides, fachada, galeria), com o texto "Foto do studio — trocar pela foto real" e o nome do arquivo esperado (`img/hero.webp`, `img/gleides.webp`, `img/studio-01.webp`, `img/fachada.webp`…). O modelo já tem o fallback automático: se o arquivo não existir, aparece o placeholder.
- Se usar alguma foto ilustrativa gratuita (ex.: Unsplash) para o print, marque cada uma com `<!-- TROCAR: foto ilustrativa, não é do studio -->` e `alt` "Foto ilustrativa de aula de pilates". **Nunca** apresente foto de banco de imagem como se fosse do studio ou da Gleides.
- Galeria em acordeão: mantenha a estrutura, com 4 a 6 placeholders.

---

## 5. Background animado: PlasmaWave (fitas de movimento)

Adicione no **hero** o componente **PlasmaWave**, do React Bits. O código original está em `referencia-plasmawave-reactbits.txt`, nesta pasta. Duas fitas de luz se curvam devagar, como o movimento fluido e controlado do pilates.

- **Sem React:** o site é HTML/CSS/JS puro. Reescreva como módulo JavaScript puro (`plasmawave.js`, com `criarPlasmaWave(container, opcoes)` que devolve `{ pausar, retomar, destruir }`). A dependência é a biblioteca **ogl**: baixe o ESM para `vendor/ogl.mjs` e importe localmente (alternativa: `https://cdn.jsdelivr.net/npm/ogl/+esm`). Comentário de crédito ao React Bits no topo; confira a licença antes de publicar.
- **Modo claro** (`lightMode: true`), para as fitas aparecerem sobre o fundo off-white.
- **Cores:** verde-petróleo `#0F4F4C` numa fita e coral `#F08A6C` na outra, lidas das variáveis CSS.
- **Discreto:** as fitas passam atrás da foto do hero, em leve diagonal, nunca atrás do título. Se competirem com o texto, coloque por cima um véu off-white semitransparente (`rgba(247, 245, 240, 0.4)`).
- Configuração inicial (num objeto no topo do arquivo): `speed1: 0.03`, `speed2: 0.03`, `dir2: -1`, `bend1: 0.9`, `bend2: 0.5`, `rotationDeg: -10`.
- **Desempenho (obrigatório):** `devicePixelRatio` até 1,5; renderizar a ~0,6× da resolução; ~30fps no celular; pausar com `IntersectionObserver` quando o hero sai da tela e com `visibilitychange`; tratar perda de contexto WebGL; `pointer-events: none` no canvas.
- **Fallbacks (obrigatório):** sem WebGL, gradiente estático verde-água → off-white em CSS; com `prefers-reduced-motion`, um quadro parado; o canvas entra com fade.

---

## 6. Celular

- O site precisa ficar **perfeito em 390px**: sem rolagem lateral, textos legíveis, botões fáceis de tocar, e o botão flutuante sem cobrir conteúdo importante.
- Teste também 768px e desktop.

---

## 7. Rodar localmente para o print

Depois de terminar, sirva a pasta localmente (por exemplo, `npx serve .` ou `python -m http.server 8000` dentro de `Documentos\clientes\live-pilates`) e me diga **exatamente** como abrir:
- o endereço (ex.: `http://localhost:8000`);
- como deixar o Chrome no modo celular para o print (F12 → Ctrl+Shift+M → escolher um iPhone de 390px).
Se possível, crie também um `abrir-site.bat` que inicia o servidor e abre o navegador com dois cliques.

---

## 8. Ao terminar

1. Confira as seções em 390px e no desktop, todos os botões de WhatsApp (cada um com sua mensagem), o mapa, os links do Maps e o selo "Aberto agora" (segunda deve aparecer fechado).
2. Confirme a busca de resquícios do Studio Martins sem resultados.
3. Me entregue a **lista completa de todos os `[PREENCHER]` e `CONFIRMAR`** e a lista de fotos com os nomes de arquivo.
4. **Relatório de uso:** informe quantos tokens esta execução gastou, quantos tokens restam e quantas execuções iguais a esta ainda seria possível fazer com os tokens restantes. Se algum desses números não estiver disponível para você, diga isso claramente e dê a melhor estimativa possível, explicando como chegou nela.
