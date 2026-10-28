/* ==========================================================
   Pão de Praça — script.js  (PROJETO DEMONSTRATIVO / FICTÍCIO)
   1. Menu mobile         2. Aberto/fechado agora
   3. Vitrine do dia (dados + filtro)
   4. Encomenda de bolo (cálculo ao vivo + formulário)
   5. Animação ao rolar
   ========================================================== */

/* 1. MENU MOBILE ------------------------------------------- */
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
})();

/* 2. ABERTO / FECHADO AGORA
   Horário fictício: segunda a sábado 6h–19h, domingo 6h–12h.
   Usa o relógio do computador de quem está vendo a página. */
(function () {
  const badge = document.getElementById("open-badge");
  if (!badge) return;

  const now = new Date();
  const day = now.getDay();                           // 0 = domingo
  const minutes = now.getHours() * 60 + now.getMinutes();
  const opens = 6 * 60;
  const closes = (day === 0 ? 12 : 19) * 60;

  const isOpen = minutes >= opens && minutes < closes;

  badge.classList.add(isOpen ? "is-open" : "is-closed");
  badge.textContent = isOpen
    ? `Aberto agora · até às ${day === 0 ? 12 : 19}h`
    : "Fechado agora · seg a sáb 6h–19h, dom 6h–12h";
})();

/* 3. VITRINE DO DIA ---------------------------------------------
   Para adicionar um produto, inclua uma linha neste array.
   Categorias: paes, doces, salgados, cafe */
(function () {
  const lista = document.getElementById("vitrine-lista");
  const status = document.getElementById("vitrine-status");
  const filtros = document.getElementById("filtros");
  if (!lista || !filtros) return;

  // ícones simples (traços de SVG) usados em cada categoria
  const ICONES = {
    paes: '<path d="M4 15c0-4 3-7 8-7s8 3 8 7v3H4zM8 11l2 3M12 10l2 3M16 11l1 3"/>',
    doces: '<path d="M6 12h12l-1.5 8h-9zM6 12a6 4 0 0 1 12 0M12 5v3"/>',
    salgados: '<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>',
    cafe: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 5h-2M7 3v3M11 3v3"/>',
  };

  // cores de cada categoria (degradê do cartão)
  const CORES = {
    paes: ["#c98a2b", "#a8561f"],
    doces: ["#d9728f", "#a8446a"],
    salgados: ["#d98c3a", "#b5651d"],
    cafe: ["#7a4b2a", "#4a2c17"],
  };

  const PRODUTOS = [
    { cat: "paes", nome: "Pão de fermentação natural", desc: "Casca crocante e miolo macio.", preco: 18, tag: "Do dia" },
    { cat: "paes", nome: "Baguete", desc: "Clássica, ótima para sanduíches.", preco: 9 },
    { cat: "paes", nome: "Pão de queijo mineiro", desc: "Seis unidades, saem quentinhos.", preco: 14, tag: "Quentinho" },
    { cat: "paes", nome: "Focaccia de alecrim", desc: "Azeite, sal grosso e alecrim.", preco: 16 },
    { cat: "doces", nome: "Sonho de creme", desc: "Recheado na hora, com açúcar e canela.", preco: 8 },
    { cat: "doces", nome: "Torta de limão (fatia)", desc: "Base crocante e merengue maçaricado.", preco: 14, tag: "Do dia" },
    { cat: "doces", nome: "Brigadeiro gourmet", desc: "Chocolate belga e granulado.", preco: 6 },
    { cat: "doces", nome: "Bolo de cenoura (fatia)", desc: "Com cobertura de chocolate.", preco: 10 },
    { cat: "salgados", nome: "Coxinha", desc: "Massa leve e recheio de frango.", preco: 9 },
    { cat: "salgados", nome: "Empada de frango", desc: "Massa podre que derrete na boca.", preco: 8 },
    { cat: "salgados", nome: "Pastel de forno", desc: "Assado, de carne ou queijo.", preco: 8 },
    { cat: "salgados", nome: "Croissant de presunto e queijo", desc: "Folhado e amanteigado.", preco: 14, tag: "Quentinho" },
    { cat: "cafe", nome: "Café coado", desc: "Feito na hora, no ponto.", preco: 6 },
    { cat: "cafe", nome: "Cappuccino", desc: "Espresso, leite vaporizado e canela.", preco: 11 },
    { cat: "cafe", nome: "Café com leite", desc: "Cremoso e na temperatura certa.", preco: 9 },
    { cat: "cafe", nome: "Chocolate quente", desc: "Cremoso, com chantilly.", preco: 12 },
  ];

  const NOMES_CAT = { todos: "itens", paes: "pães", doces: "doces", salgados: "salgados", cafe: "itens de café" };

  // formata número como moeda: 18 -> "R$ 18"
  const reais = (n) => "R$ " + n.toLocaleString("pt-BR");

  // cria os cartões da vitrine
  lista.innerHTML = PRODUTOS.map((p) => {
    const [c1, c2] = CORES[p.cat];
    return `
      <article class="item reveal is-visible" data-categoria="${p.cat}">
        <div class="item-art" style="--c1:${c1}; --c2:${c2};" aria-hidden="true">
          <svg viewBox="0 0 24 24">${ICONES[p.cat]}</svg>
          ${p.tag ? `<span class="item-tag">${p.tag}</span>` : ""}
        </div>
        <div class="item-body">
          <h3>${p.nome}</h3>
          <p>${p.desc}</p>
          <span class="price">${reais(p.preco)}</span>
        </div>
      </article>`;
  }).join("");

  const itens = lista.querySelectorAll(".item");
  const botoes = filtros.querySelectorAll("[data-filter]");

  function aplicar(filtro) {
    let visiveis = 0;
    itens.forEach((el) => {
      const mostrar = filtro === "todos" || el.dataset.categoria === filtro;
      el.hidden = !mostrar;
      if (mostrar) visiveis++;
    });
    botoes.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === filtro)));
    status.textContent = `Mostrando ${visiveis} ${NOMES_CAT[filtro]} da vitrine de hoje.`;
  }

  botoes.forEach((b) => b.addEventListener("click", () => aplicar(b.dataset.filter)));
  aplicar("todos");
})();

/* 4. ENCOMENDA DE BOLO — SÓ DEMONSTRAÇÃO
   - Soma tamanho + sabor + recheio + extras ao vivo.
   - Valida nome e data ao enviar. NADA é enviado nem guardado. */
(function () {
  const form = document.getElementById("bolo-form");
  if (!form) return;

  const resumoLista = document.getElementById("resumo-lista");
  const resumoTotal = document.getElementById("resumo-total");
  const status = document.getElementById("bolo-status");
  const contador = document.getElementById("contador");

  const reais = (n) => "R$ " + n.toLocaleString("pt-BR");

  // lê o formulário e devolve as linhas do resumo + total
  function calcular() {
    const linhas = [];
    let total = 0;

    const tam = form.querySelector('input[name="tamanho"]:checked');
    const precoTam = Number(tam.dataset.price);
    linhas.push([`Bolo ${tam.value.toLowerCase()}`, precoTam]);
    total += precoTam;

    ["sabor", "recheio"].forEach((nome) => {
      const sel = form.elements[nome];
      const opt = sel.options[sel.selectedIndex];
      const add = Number(opt.dataset.add);
      linhas.push([`${nome === "sabor" ? "Massa de" : "Recheio de"} ${opt.value.toLowerCase()}`, add]);
      total += add;
    });

    form.querySelectorAll('input[name="extra"]:checked').forEach((cb) => {
      const add = Number(cb.dataset.add);
      linhas.push([cb.value, add]);
      total += add;
    });

    return { linhas, total };
  }

  // desenha o resumo na tela
  function atualizar() {
    const { linhas, total } = calcular();
    resumoLista.innerHTML = linhas
      .map(([nome, valor]) => `<li><span>${nome}</span><span>${valor === 0 ? "incluso" : reais(valor)}</span></li>`)
      .join("");
    resumoTotal.textContent = reais(total);
  }

  form.addEventListener("input", atualizar);
  form.addEventListener("change", atualizar);
  atualizar();

  // contador de caracteres da mensagem
  form.elements["mensagem"].addEventListener("input", (e) => {
    contador.textContent = e.target.value.length;
  });

  // data mínima de retirada: hoje + 2 dias
  const dataInput = form.elements["data"];
  const limite = new Date();
  limite.setDate(limite.getDate() + 2);
  const iso = new Date(limite.getTime() - limite.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dataInput.min = iso;

  function setError(field, message) {
    document.getElementById("erro-" + field.name).textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  // regras (devolvem o texto do erro, ou "" se estiver ok)
  const regras = {
    nome: (v) => (v.trim().length < 3 ? "Digite seu nome (mínimo 3 letras)." : ""),
    data: (v) => {
      if (!v) return "Escolha a data de retirada.";
      if (v < iso) return "Pedimos 2 dias de antecedência. Escolha uma data a partir de " + iso.split("-").reverse().join("/") + ".";
      return "";
    },
  };

  Object.keys(regras).forEach((nome) => {
    const campo = form.elements[nome];
    campo.addEventListener("blur", () => setError(campo, regras[nome](campo.value)));
    campo.addEventListener("input", () => {
      if (campo.getAttribute("aria-invalid") === "true") setError(campo, regras[nome](campo.value));
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.hidden = true;

    let primeiroErro = null;
    Object.keys(regras).forEach((nome) => {
      const campo = form.elements[nome];
      const msg = regras[nome](campo.value);
      setError(campo, msg);
      if (msg && !primeiroErro) primeiroErro = campo;
    });
    if (primeiroErro) { primeiroErro.focus(); return; }

    const { total } = calcular();
    const [a, m, d] = dataInput.value.split("-");
    status.textContent =
      `Pedido de demonstração de ${form.elements["nome"].value.trim()}: bolo para retirada em ${d}/${m}/${a}, ` +
      `total estimado de ${reais(total)}. Nada foi enviado: este é um site fictício.`;
    status.hidden = false;

    form.reset();
    contador.textContent = "0";
    atualizar();
  });
})();

/* 5. ANIMAÇÃO AO ROLAR ----------------------------------------- */
(function () {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => obs.observe(el));
})();
