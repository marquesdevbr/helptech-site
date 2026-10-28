/* ==========================================================
   Casa Viva — script.js  (PROJETO DEMONSTRATIVO / FICTÍCIO)
   Nenhum pagamento é processado e nenhum dado é enviado.
   1. Dados dos produtos      2. Utilidades (dinheiro, aviso)
   3. Estado do carrinho      4. Catálogo (busca, filtro, ordem)
   5. Visualização rápida     6. Carrinho (gaveta)
   7. Frete e cupom           8. Finalizar pedido (demonstração)
   9. Newsletter             10. Menu mobile e animação ao rolar
   ========================================================== */

/* 1. DADOS DOS PRODUTOS ------------------------------------
   Para adicionar um produto, copie uma linha e mude os valores.
   a e b são as duas cores do fundo; icone é o desenho (SVG). */
const PRODUTOS = [
  { id: 1,  nome: "Vaso Terra Cotta",       cat: "sala",    preco: 89.9,  a: "#d98a68", b: "#c8643c", desc: "Vaso de cerâmica em tom terra, ideal para galhos secos.",       destaque: true,  icone: '<path d="M8 4h8M9 4c0 3-3 4-3 8 0 4 2 7 6 7s6-3 6-7c0-4-3-5-3-8"/>' },
  { id: 2,  nome: "Luminária de Mesa Alba", cat: "sala",    preco: 189.9, a: "#e3c9a0", b: "#b8873a", desc: "Cúpula de tecido e base de madeira, luz quente e suave.",        destaque: true,  icone: '<path d="M8 4h8l3 9H5zM12 13v6M8 20h8"/>' },
  { id: 3,  nome: "Almofada Linho Natural", cat: "sala",    preco: 69.9,  a: "#a9c0ae", b: "#6b8f71", desc: "Almofada de linho com enchimento macio, 45 x 45 cm.",            destaque: false, icone: '<path d="M4 6c5-2 11-2 16 0-2 4-2 8 0 12-5 2-11 2-16 0 2-4 2-8 0-12z"/>' },
  { id: 4,  nome: "Manta Tricot Areia",     cat: "sala",    preco: 159.9, a: "#e9d3b0", b: "#c9a066", desc: "Manta de tricô para o sofá, toque aconchegante.",                destaque: false, icone: '<path d="M4 7h16v11H4zM4 11h16M4 15h16M8 7v11M12 7v11M16 7v11"/>' },
  { id: 5,  nome: "Quadro Folhas Verdes",   cat: "quarto",  preco: 119.9, a: "#8fb59a", b: "#3f5e47", desc: "Quadro com moldura de madeira e ilustração botânica.",           destaque: true,  icone: '<rect x="5" y="5" width="14" height="14" rx="1.5"/><path d="M12 17c-3-1-4-4-3-8 4 0 6 3 3 8zM12 17V9"/>' },
  { id: 6,  nome: "Jogo de Cama Percal",    cat: "quarto",  preco: 249.9, a: "#f0d9cc", b: "#d98a68", desc: "Jogo de cama de algodão, toque fresco e macio, casal.",           destaque: false, icone: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15h18M6 10V7h5v3"/>' },
  { id: 7,  nome: "Abajur Cúpula Rosé",     cat: "quarto",  preco: 139.9, a: "#f3d9c9", b: "#c8643c", desc: "Abajur compacto para a mesa de cabeceira.",                      destaque: false, icone: '<path d="M9 5h6l2.5 8h-11zM12 13v5M9 19h6"/>' },
  { id: 8,  nome: "Cesto de Palha",         cat: "quarto",  preco: 79.9,  a: "#e2c892", b: "#a97b55", desc: "Cesto trançado para organizar mantas e brinquedos.",             destaque: false, icone: '<path d="M5 9h14l-1.5 10h-11zM5 9c0-3 3-5 7-5s7 2 7 5M8 13h8"/>' },
  { id: 9,  nome: "Jogo de Canecas (4 un.)", cat: "cozinha", preco: 99.9,  a: "#d9b36a", b: "#b8873a", desc: "Quatro canecas de cerâmica esmaltada, 300 ml cada.",             destaque: true,  icone: '<path d="M5 8h10v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM15 10h2a2 2 0 0 1 0 4h-2M8 4v1M12 4v1"/>' },
  { id: 10, nome: "Tábua de Madeira",       cat: "cozinha", preco: 74.9,  a: "#c99a6a", b: "#8d6444", desc: "Tábua de corte e servir em madeira maciça.",                    destaque: false, icone: '<rect x="4" y="9" width="16" height="9" rx="2.5"/><circle cx="17" cy="13.5" r="1"/>' },
  { id: 11, nome: "Pote Hermético de Vidro", cat: "cozinha", preco: 49.9,  a: "#a9d0c7", b: "#4f7a8a", desc: "Pote de vidro com tampa de bambu para mantimentos.",              destaque: false, icone: '<rect x="6" y="8" width="12" height="11" rx="2"/><path d="M7 5h10v3H7zM9 12h6"/>' },
  { id: 12, nome: "Jogo de Panos de Prato",  cat: "cozinha", preco: 39.9,  a: "#f0d9a8", b: "#d98a68", desc: "Três panos de prato em algodão, estampa listrada.",              destaque: false, icone: '<path d="M6 4h12v16H6zM6 9h12M6 14h12"/>' },
  { id: 13, nome: "Vaso Jardim Cimento",    cat: "jardim",  preco: 129.9, a: "#b9bfba", b: "#6f7873", desc: "Vaso de cimento grande para plantas de sol.",                    destaque: true,  icone: '<path d="M4 10h16l-2 10H6zM12 10V6M12 6c-3 0-4-2-4-4 3 0 4 1 4 4zM12 7c2 0 4-1 4-3-2 0-4 1-4 3z"/>' },
  { id: 14, nome: "Lanterna de Jardim",     cat: "jardim",  preco: 109.9, a: "#8d8f6a", b: "#4a5236", desc: "Lanterna de metal para velas, resistente ao tempo.",             destaque: false, icone: '<path d="M10 4h4M12 4v2M8 6h8l1 3H7zM7 9v9h10V9M12 11v4M7 18h10"/>' },
  { id: 15, nome: "Regador Vintage",        cat: "jardim",  preco: 84.9,  a: "#9cc0a4", b: "#3f6a4a", desc: "Regador de metal com bico longo, 2 litros.",                     destaque: false, icone: '<path d="M5 10h10v8H5zM15 12l5-4M5 12H3M9 10V7h4v3"/>' },
  { id: 16, nome: "Kit 3 Suculentas Decor", cat: "jardim",  preco: 59.9,  a: "#b7d9b4", b: "#5f9a68", desc: "Três vasinhos decorativos prontos para decorar a varanda.",       destaque: false, icone: '<path d="M7 20h10M8 20c0-3 1-5 4-5s4 2 4 5M12 15c-3 0-5-2-5-6 3 0 5 2 5 6zM12 15c3 0 5-2 5-6-3 0-5 2-5 6z"/>' }
];

const NOMES_CAT = { sala: "Sala", quarto: "Quarto", cozinha: "Cozinha", jardim: "Jardim" };

/* 2. UTILIDADES ---------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const dinheiro = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const porId = (id) => PRODUTOS.find((p) => p.id === id);

// aviso rápido na parte de baixo (também lido por leitores de tela)
let toastTimer;
function aviso(texto) {
  const t = $("#toast");
  t.textContent = texto;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

// desenho do produto: gradiente + ícone
function tileHTML(p, tag) {
  return `<div class="tile" style="--a:${p.a}; --b:${p.b};">
    ${tag ? `<span class="tag">${tag}</span>` : ""}
    <svg viewBox="0 0 24 24" aria-hidden="true">${p.icone}</svg>
  </div>`;
}

/* 3. ESTADO DO CARRINHO ---------------------------------------
   Guardamos só { id, qtd }. O localStorage fica dentro de try/catch:
   se o navegador bloquear, o carrinho continua funcionando (sem salvar). */
const CHAVE = "casaviva-demo-carrinho";
let carrinho = [];
let cupomAtivo = false;
let frete = null; // null = ainda não calculado

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || "[]");
    if (Array.isArray(salvo)) {
      carrinho = salvo.filter((i) => porId(i.id) && Number.isInteger(i.qtd) && i.qtd > 0 && i.qtd <= 10);
    }
  } catch (e) { carrinho = []; }
}
function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(carrinho)); } catch (e) { /* sem problemas */ }
}

const subtotal = () => carrinho.reduce((s, i) => s + porId(i.id).preco * i.qtd, 0);
const totalItens = () => carrinho.reduce((s, i) => s + i.qtd, 0);
const desconto = () => (cupomAtivo ? Math.round(subtotal() * 10) / 100 : 0);
// frete grátis acima de R$ 300 (regra fictícia, igual à da página)
const freteValor = () => (frete === null ? null : subtotal() >= 300 ? 0 : frete);
const total = () => subtotal() - desconto() + (freteValor() || 0);

function adicionar(id) {
  const item = carrinho.find((i) => i.id === id);
  if (item) { if (item.qtd < 10) item.qtd++; else { aviso("Limite de 10 unidades por produto."); return; } }
  else carrinho.push({ id, qtd: 1 });
  salvar();
  desenharCarrinho();
  aviso(`“${porId(id).nome}” foi para o carrinho.`);
  const badge = $("#cart-badge");
  badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
}

/* 4. CATÁLOGO: BUSCA, FILTRO E ORDEM -------------------------- */
const estado = { cat: "todos", busca: "", ordem: "destaques" };

function desenharCatalogo() {
  const termo = estado.busca.trim().toLowerCase();
  let lista = PRODUTOS.filter((p) =>
    (estado.cat === "todos" || p.cat === estado.cat) &&
    (!termo || (p.nome + " " + p.desc).toLowerCase().includes(termo))
  );

  if (estado.ordem === "menor") lista.sort((x, y) => x.preco - y.preco);
  else if (estado.ordem === "maior") lista.sort((x, y) => y.preco - x.preco);
  else if (estado.ordem === "nome") lista.sort((x, y) => x.nome.localeCompare(y.nome, "pt-BR"));
  else lista.sort((x, y) => Number(y.destaque) - Number(x.destaque) || x.id - y.id);

  $("#lista-produtos").innerHTML = lista.map((p) => `
    <article class="card">
      ${tileHTML(p, p.destaque ? "Destaque" : "")}
      <div class="card-body">
        <span class="card-cat">${NOMES_CAT[p.cat]}</span>
        <h3>${p.nome}</h3>
        <p>${p.desc}</p>
        <div class="card-price-row"><span class="price">${dinheiro(p.preco)}</span></div>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-ver="${p.id}">Ver detalhes</button>
          <button class="btn btn-primary btn-sm" type="button" data-add="${p.id}">Adicionar</button>
        </div>
      </div>
    </article>`).join("");

  $("#vazio").hidden = lista.length > 0;
  $("#status-produtos").textContent = `${lista.length} de ${PRODUTOS.length} produtos.`;

  // marca o filtro ativo
  $$(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.cat === estado.cat)));
}

$$(".chip").forEach((c) => c.addEventListener("click", () => { estado.cat = c.dataset.cat; desenharCatalogo(); }));
$("#busca").addEventListener("input", (e) => { estado.busca = e.target.value; desenharCatalogo(); });
$("#ordem").addEventListener("change", (e) => { estado.ordem = e.target.value; desenharCatalogo(); });
$("#limpar").addEventListener("click", () => {
  estado.cat = "todos"; estado.busca = ""; estado.ordem = "destaques";
  $("#busca").value = ""; $("#ordem").value = "destaques";
  desenharCatalogo();
});

// cartões de categoria: mostram a quantidade e filtram o catálogo
$$("[data-count]").forEach((el) => {
  const n = PRODUTOS.filter((p) => p.cat === el.dataset.count).length;
  el.textContent = `${n} produtos`;
});
$$(".cat-card").forEach((card) => card.addEventListener("click", () => {
  estado.cat = card.dataset.cat;
  desenharCatalogo();
  $("#produtos").scrollIntoView({ behavior: "smooth" });
}));

// cliques nos botões dos cartões (delegação de eventos)
$("#lista-produtos").addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  const ver = e.target.closest("[data-ver]");
  if (add) adicionar(Number(add.dataset.add));
  if (ver) abrirVisualizacao(Number(ver.dataset.ver));
});

/* 5. VISUALIZAÇÃO RÁPIDA -------------------------------------- */
function abrirVisualizacao(id) {
  const p = porId(id);
  $("#qv-content").innerHTML = `
    ${tileHTML(p, p.destaque ? "Destaque" : "")}
    <div class="qv-info">
      <span class="card-cat">${NOMES_CAT[p.cat]}</span>
      <h2 id="qv-title">${p.nome}</h2>
      <span class="price">${dinheiro(p.preco)}</span>
      <p>${p.desc}</p>
      <ul class="qv-points">
        <li>Produto fictício, criado para esta demonstração.</li>
        <li>Em até 6x sem juros (condição fictícia).</li>
        <li>Troca em 30 dias (condição fictícia).</li>
      </ul>
      <button class="btn btn-primary" type="button" data-add-qv="${p.id}">Adicionar ao carrinho</button>
    </div>`;
  $("#quick-view").showModal();
}
$("#qv-content").addEventListener("click", (e) => {
  const b = e.target.closest("[data-add-qv]");
  if (b) { adicionar(Number(b.dataset.addQv)); $("#quick-view").close(); }
});

/* 6. CARRINHO (GAVETA) ----------------------------------------- */
function desenharCarrinho() {
  const n = totalItens();
  const vazio = n === 0;

  // número no ícone do carrinho
  const badge = $("#cart-badge");
  badge.hidden = vazio;
  badge.textContent = n;
  $("#cart-open").setAttribute("aria-label", vazio ? "Abrir carrinho, vazio" : `Abrir carrinho, ${n} ${n === 1 ? "item" : "itens"}`);

  $("#cart-empty").hidden = !vazio;
  $("#cart-extras").hidden = vazio;
  $("#cart-foot").hidden = vazio;

  $("#cart-list").innerHTML = carrinho.map((i) => {
    const p = porId(i.id);
    return `<li class="cart-item">
      ${tileHTML(p)}
      <div>
        <h3>${p.nome}</h3>
        <span class="unit">${dinheiro(p.preco)} cada</span>
        <div class="cart-item-row">
          <div class="qty" role="group" aria-label="Quantidade de ${p.nome}">
            <button type="button" data-menos="${p.id}" aria-label="Diminuir quantidade" ${i.qtd <= 1 ? "disabled" : ""}>−</button>
            <output aria-live="polite">${i.qtd}</output>
            <button type="button" data-mais="${p.id}" aria-label="Aumentar quantidade" ${i.qtd >= 10 ? "disabled" : ""}>+</button>
          </div>
          <strong>${dinheiro(p.preco * i.qtd)}</strong>
          <button class="link-btn" type="button" data-remover="${p.id}">Remover</button>
        </div>
      </div>
    </li>`;
  }).join("");

  desenharTotais();
}

function desenharTotais() {
  $("#t-subtotal").textContent = dinheiro(subtotal());
  $("#t-discount-row").hidden = !cupomAtivo;
  $("#t-discount").textContent = "− " + dinheiro(desconto());
  const f = freteValor();
  $("#t-shipping").textContent = f === null ? "a calcular" : f === 0 ? "Grátis" : dinheiro(f);
  $("#t-total").textContent = dinheiro(total());
}

$("#cart-list").addEventListener("click", (e) => {
  const mais = e.target.closest("[data-mais]");
  const menos = e.target.closest("[data-menos]");
  const rem = e.target.closest("[data-remover]");
  let id;
  if (mais) { id = Number(mais.dataset.mais); const it = carrinho.find((i) => i.id === id); if (it && it.qtd < 10) it.qtd++; }
  if (menos) { id = Number(menos.dataset.menos); const it = carrinho.find((i) => i.id === id); if (it && it.qtd > 1) it.qtd--; }
  if (rem) {
    id = Number(rem.dataset.remover);
    carrinho = carrinho.filter((i) => i.id !== id);
    aviso("Item removido do carrinho.");
  }
  if (id !== undefined) { salvar(); desenharCarrinho(); }
});

$("#cart-open").addEventListener("click", () => $("#cart").showModal());

/* 7. FRETE E CUPOM (TUDO FICTÍCIO) ------------------------------ */
// CEP: máscara 00000-000 enquanto digita
$("#cep").addEventListener("input", (e) => {
  const d = e.target.value.replace(/\D/g, "").slice(0, 8);
  e.target.value = d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
});

$("#cep-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const campo = $("#cep"), msg = $("#cep-msg");
  const d = campo.value.replace(/\D/g, "");
  if (d.length !== 8) {
    msg.textContent = "Digite um CEP com 8 números."; msg.className = "msg err";
    campo.setAttribute("aria-invalid", "true"); frete = null;
  } else {
    // regra fictícia: o valor depende só do primeiro número do CEP
    const p = Number(d[0]);
    frete = p <= 3 ? 14.9 : p <= 6 ? 24.9 : 34.9;
    campo.setAttribute("aria-invalid", "false");
    msg.className = "msg ok";
    msg.textContent = subtotal() >= 300
      ? "Frete grátis (compras acima de R$ 300, regra fictícia)."
      : `Frete fictício: ${dinheiro(frete)}.`;
  }
  desenharTotais();
});

$("#cupom-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const campo = $("#cupom"), msg = $("#cupom-msg");
  const codigo = campo.value.trim().toUpperCase();
  if (codigo === "DEMO10") {
    cupomAtivo = true;
    msg.textContent = "Cupom aplicado: 10% de desconto."; msg.className = "msg ok";
    campo.setAttribute("aria-invalid", "false");
    $("#cupom-remove").hidden = false;
  } else {
    cupomAtivo = false;
    msg.textContent = codigo ? "Cupom inválido. Dica: use DEMO10." : "Digite um cupom.";
    msg.className = "msg err";
    campo.setAttribute("aria-invalid", "true");
    $("#cupom-remove").hidden = true;
  }
  desenharTotais();
});

$("#cupom-remove").addEventListener("click", () => {
  cupomAtivo = false;
  $("#cupom").value = "";
  $("#cupom-msg").textContent = "Cupom removido."; $("#cupom-msg").className = "msg";
  $("#cupom-remove").hidden = true;
  desenharTotais();
});

/* 8. FINALIZAR PEDIDO (DEMONSTRAÇÃO) ----------------------------
   Valida os campos e mostra uma confirmação na tela.
   NADA é enviado, guardado ou cobrado. */
function linhasResumo() {
  return carrinho.map((i) => {
    const p = porId(i.id);
    return `<li><span>${i.qtd} × ${p.nome}</span><span>${dinheiro(p.preco * i.qtd)}</span></li>`;
  }).join("");
}

function totaisHTML() {
  const f = freteValor();
  return `
    <div><dt>Subtotal</dt><dd>${dinheiro(subtotal())}</dd></div>
    ${cupomAtivo ? `<div class="discount"><dt>Desconto (DEMO10)</dt><dd>− ${dinheiro(desconto())}</dd></div>` : ""}
    <div><dt>Frete (fictício)</dt><dd>${f === null ? "não calculado" : f === 0 ? "Grátis" : dinheiro(f)}</dd></div>
    <div class="grand"><dt>Total</dt><dd>${dinheiro(total())}</dd></div>`;
}

function mostrarEtapaFormulario() {
  $("#ck-step-form").hidden = false;
  $("#ck-step-done").hidden = true;
}

$("#checkout-open").addEventListener("click", () => {
  if (!carrinho.length) return;
  $("#ck-items").innerHTML = linhasResumo();
  $("#ck-totals").innerHTML = totaisHTML();
  mostrarEtapaFormulario();
  $("#cart").close();
  $("#checkout").showModal();
});

const regrasCheckout = {
  nome: (v) => (v.trim().length < 3 ? "Digite o seu nome (mínimo 3 letras)." : ""),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Digite um e-mail válido."),
  endereco: (v) => (v.trim().length < 5 ? "Digite um endereço fictício (mínimo 5 caracteres)." : ""),
};

function erroCampo(campo, texto) {
  $("#erro-" + campo.name).textContent = texto;
  campo.setAttribute("aria-invalid", texto ? "true" : "false");
}

Object.keys(regrasCheckout).forEach((nome) => {
  const campo = $("#ck-form").elements[nome];
  campo.addEventListener("blur", () => erroCampo(campo, regrasCheckout[nome](campo.value)));
  campo.addEventListener("input", () => {
    if (campo.getAttribute("aria-invalid") === "true") erroCampo(campo, regrasCheckout[nome](campo.value));
  });
});

// ao escolher a forma de pagamento, o aviso de erro some
$$('input[name="pagamento"]').forEach((r) =>
  r.addEventListener("change", () => { $("#erro-pagamento").textContent = ""; })
);

$("#ck-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  let primeiroErro = null;

  Object.keys(regrasCheckout).forEach((nome) => {
    const campo = form.elements[nome];
    const msg = regrasCheckout[nome](campo.value);
    erroCampo(campo, msg);
    if (msg && !primeiroErro) primeiroErro = campo;
  });

  const pagamento = form.querySelector('input[name="pagamento"]:checked');
  $("#erro-pagamento").textContent = pagamento ? "" : "Escolha uma forma de pagamento.";
  if (!pagamento && !primeiroErro) primeiroErro = form.querySelector('input[name="pagamento"]');

  if (primeiroErro) { primeiroErro.focus(); return; }

  // monta a confirmação (número do pedido inventado)
  const numero = "CV-" + String(Math.floor(100000 + Math.random() * 900000));
  $("#ck-done-name").textContent = form.elements["nome"].value.trim();
  $("#ck-order").textContent = "Pedido de demonstração " + numero;
  $("#ck-done-items").innerHTML = linhasResumo() +
    `<li class="sum-total"><span>Total (${pagamento.value}, fictício)</span><span>${dinheiro(total())}</span></li>`;

  $("#ck-step-form").hidden = true;
  $("#ck-step-done").hidden = false;
  $("#ck-done-title").setAttribute("tabindex", "-1");
  $("#ck-done-title").focus();

  // limpa tudo
  carrinho = []; cupomAtivo = false; frete = null;
  salvar();
  form.reset();
  $("#cupom").value = ""; $("#cep").value = "";
  $("#cupom-msg").textContent = ""; $("#cep-msg").textContent = "";
  $("#cupom-remove").hidden = true;
  desenharCarrinho();
});

/* botões "fechar" e clique fora da janela */
$$("dialog").forEach((d) => {
  d.addEventListener("click", (e) => {
    if (e.target === d || e.target.closest("[data-close]")) d.close();
  });
});
$("#checkout").addEventListener("close", mostrarEtapaFormulario);

/* 9. NEWSLETTER (DEMONSTRAÇÃO) ---------------------------------- */
$("#news-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const campo = $("#news-email"), msg = $("#news-msg");
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(campo.value.trim())) {
    msg.textContent = "Inscrição de demonstração registrada. Nada foi enviado.";
    campo.setAttribute("aria-invalid", "false");
    campo.value = "";
  } else {
    msg.textContent = "Digite um e-mail válido.";
    campo.setAttribute("aria-invalid", "true");
  }
});

/* 10. MENU MOBILE E ANIMAÇÃO AO ROLAR ---------------------------- */
(function () {
  const toggle = $(".nav-toggle"), links = $("#nav-links");
  function abrir(sim) {
    links.classList.toggle("is-open", sim);
    toggle.setAttribute("aria-expanded", String(sim));
    toggle.setAttribute("aria-label", sim ? "Fechar menu" : "Abrir menu");
  }
  toggle.addEventListener("click", () => abrir(toggle.getAttribute("aria-expanded") !== "true"));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) abrir(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") abrir(false); });
})();

(function () {
  const itens = $$(".reveal");
  if (!("IntersectionObserver" in window)) { itens.forEach((el) => el.classList.add("is-visible")); return; }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); } });
  }, { threshold: 0.15 });
  itens.forEach((el) => obs.observe(el));
})();

/* INÍCIO ---------------------------------------------------------- */
carregar();
desenharCatalogo();
desenharCarrinho();
