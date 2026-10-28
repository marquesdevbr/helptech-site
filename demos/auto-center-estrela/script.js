/* ==========================================================
   Auto Center Estrela — script.js  (PROJETO DEMONSTRATIVO / FICTÍCIO)
   1. Menu mobile       2. Aberto/fechado agora
   3. Orçamento com estimativa ao vivo
   4. Acompanhe seu carro (código de demonstração)
   5. Animação ao rolar
   ========================================================== */

/* HORÁRIO FICTÍCIO: seg a sex 8h às 18h | sábado 8h às 12h | domingo fechado.
   (0 = domingo ... 6 = sábado) */
const FUNCIONAMENTO = { 0: null, 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 12] };

/* MULTIPLICADOR POR TIPO DE VEÍCULO (valores fictícios) */
const TIPO_VEICULO = { hatch: 1, sedan: 1.15, suv: 1.35 };
const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ETAPAS DO ACOMPANHAMENTO (código de demonstração: DEMO-123)
   "atual" indica em qual etapa o carro fictício está (0 = primeira). */
const ACOMPANHAMENTO = {
  "DEMO-123": {
    carro: "Hatch prata (fictício)",
    atual: 2,
    etapas: [
      { t: "Veículo recebido", d: "Entrada registrada e checklist feito." },
      { t: "Diagnóstico", d: "Verificação dos itens do orçamento." },
      { t: "Serviço em andamento", d: "Mecânico trabalhando no veículo." },
      { t: "Teste e revisão final", d: "Teste de rodagem e conferência." },
      { t: "Pronto para retirada", d: "Aviso ao cliente para buscar o carro." },
    ],
  },
};

/* 1. MENU MOBILE ------------------------------------------- */
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  function abrir(sim) {
    links.classList.toggle("is-open", sim);
    toggle.setAttribute("aria-expanded", String(sim));
    toggle.setAttribute("aria-label", sim ? "Fechar menu" : "Abrir menu");
  }
  toggle.addEventListener("click", () => abrir(toggle.getAttribute("aria-expanded") !== "true"));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) abrir(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") abrir(false); });
})();

/* 2. ABERTO / FECHADO AGORA ------------------------------------ */
(function () {
  const badge = document.getElementById("open-badge");
  const agora = new Date();
  const faixa = FUNCIONAMENTO[agora.getDay()];
  const h = agora.getHours() + agora.getMinutes() / 60;
  const aberto = faixa && h >= faixa[0] && h < faixa[1];
  badge.classList.add(aberto ? "is-open" : "is-closed");
  badge.textContent = aberto ? `Aberto agora · até às ${faixa[1]}h` : "Fechado agora · seg a sex 8h às 18h, sáb 8h às 12h";
})();

/* 3. ORÇAMENTO COM ESTIMATIVA AO VIVO ---------------------------
   Cada checkbox tem data-valor (preço base fictício) e data-nome.
   O total = soma dos serviços × multiplicador do tipo de veículo. */
(function () {
  const form = document.getElementById("orc-form");
  const lista = document.getElementById("orc-lista");
  const totalEl = document.getElementById("orc-total");
  const status = document.getElementById("orc-status");

  const marcados = () => [...form.querySelectorAll('input[name="servico"]:checked')];

  function atualizar() {
    const tipo = form.elements["tipo"].value;
    const itens = marcados();
    if (!itens.length) {
      lista.innerHTML = '<li>Nenhum serviço escolhido.</li>';
      totalEl.textContent = brl(0);
      return 0;
    }
    const mult = TIPO_VEICULO[tipo] || 1;
    let total = 0;
    lista.innerHTML = itens.map((i) => {
      const v = Number(i.dataset.valor) * mult;
      total += v;
      return `<li><span>${i.dataset.nome}</span><span>${brl(v)}</span></li>`;
    }).join("");
    totalEl.textContent = brl(total);
    return total;
  }
  form.addEventListener("change", () => { atualizar(); status.hidden = true; document.getElementById("erro-servico").textContent = ""; });

  function erro(campo, texto) {
    document.getElementById("erro-" + campo).textContent = texto;
    const el = form.elements[campo];
    if (el && el.nodeName) el.setAttribute("aria-invalid", texto ? "true" : "false");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let primeiro = null;

    if (!marcados().length) { document.getElementById("erro-servico").textContent = "Escolha pelo menos um serviço."; primeiro = form.querySelector('input[name="servico"]'); }
    else document.getElementById("erro-servico").textContent = "";

    if (!form.elements["tipo"].value) { erro("tipo", "Escolha o tipo do veículo."); primeiro = primeiro || form.elements["tipo"]; }
    else erro("tipo", "");

    const nome = form.elements["nome"].value.trim();
    if (nome.length < 3) { erro("nome", "Digite o seu nome (mínimo 3 letras)."); primeiro = primeiro || form.elements["nome"]; }
    else erro("nome", "");

    if (primeiro) { primeiro.focus(); return; }

    const total = atualizar();
    status.textContent = `Pedido de orçamento de demonstração para ${nome}: estimativa de ${brl(total)}. Nada foi enviado: este é um site fictício e o valor real dependeria da avaliação do veículo.`;
    status.hidden = false;
    form.reset();
    atualizar();
  });
  atualizar();
})();

/* 4. ACOMPANHE SEU CARRO ---------------------------------------- */
(function () {
  const form = document.getElementById("track-form");
  const campo = document.getElementById("codigo");
  const erroEl = document.getElementById("erro-codigo");
  const resultado = document.getElementById("track-result");
  const carroEl = document.getElementById("track-car");
  const linha = document.getElementById("timeline");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cod = campo.value.trim().toUpperCase();
    const dados = ACOMPANHAMENTO[cod];
    if (!dados) {
      campo.setAttribute("aria-invalid", "true");
      erroEl.textContent = cod ? "Código não encontrado. Neste site de demonstração use DEMO-123." : "Digite o código do serviço.";
      resultado.hidden = true;
      campo.focus();
      return;
    }
    campo.setAttribute("aria-invalid", "false");
    erroEl.textContent = "";
    carroEl.innerHTML = `<span>Veículo: <b>${dados.carro}</b></span><span>Código: <b>${cod}</b></span>`;
    linha.innerHTML = dados.etapas.map((et, i) => {
      const cls = i < dados.atual ? "done" : i === dados.atual ? "current" : "";
      const sit = i < dados.atual ? "Concluído" : i === dados.atual ? "Em andamento" : "Aguardando";
      return `<li class="${cls}"><strong>${et.t}</strong><small>${sit} · ${et.d}</small></li>`;
    }).join("");
    resultado.hidden = false;
  });
})();

/* 5. ANIMAÇÃO AO ROLAR ----------------------------------------- */
(function () {
  const itens = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { itens.forEach((el) => el.classList.add("is-visible")); return; }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); } });
  }, { threshold: 0.15 });
  itens.forEach((el) => obs.observe(el));
})();
