/* ==========================================================
   Patas & Cia — script.js  (PROJETO DEMONSTRATIVO / FICTÍCIO)
   1. Menu mobile        2. Aberto/fechado agora
   3. Produtos (filtro)  4. Agendamento com estimativa de preço
   5. Animação ao rolar
   ========================================================== */

/* HORÁRIO FICTÍCIO: seg a sáb, 9h às 18h. Domingo fechado.
   (0 = domingo ... 6 = sábado). */
const FUNCIONAMENTO = { 0: null, 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [9, 18] };

/* PREÇOS FICTÍCIOS DOS SERVIÇOS (valor base para porte pequeno).
   Para mudar um valor, altere o número correspondente. */
const SERVICOS = {
  "Banho":            { cao: 50, gato: 60 },
  "Tosa":             { cao: 70, gato: 80 },
  "Banho e tosa":     { cao: 110, gato: 125 },
  "Consulta veterinária": { cao: 120, gato: 120 },
};
/* Multiplicador por porte (consulta não muda com o porte) */
const PORTE = { pequeno: 1, medio: 1.3, grande: 1.7 };
const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
  badge.textContent = aberto ? "Aberto agora · até às 18h" : "Fechado agora · seg a sáb, 9h às 18h";
})();

/* 3. PRODUTOS: FILTRO POR CATEGORIA -----------------------------
   Os botões têm data-filter; os produtos têm data-category. */
(function () {
  const botoes = document.querySelectorAll("#filtros .chip");
  const itens = document.querySelectorAll("#produtos .product");
  const contador = document.getElementById("produtos-contagem");

  function filtrar(cat) {
    let n = 0;
    itens.forEach((li) => {
      const mostrar = cat === "todos" || li.dataset.category === cat;
      li.hidden = !mostrar;
      if (mostrar) n++;
    });
    botoes.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === cat)));
    contador.textContent = `Mostrando ${n} de ${itens.length} produtos.`;
  }
  botoes.forEach((b) => b.addEventListener("click", () => filtrar(b.dataset.filter)));
  filtrar("todos");
})();

/* 4. AGENDAMENTO COM ESTIMATIVA DE PREÇO ------------------------
   O valor muda ao escolher serviço, animal e porte.
   No fim, só mostra uma mensagem: nada é enviado. */
(function () {
  const form = document.getElementById("pet-form");
  const valorEl = document.getElementById("estimativa-valor");
  const obsEl = document.getElementById("estimativa-obs");
  const status = document.getElementById("pet-status");
  const dataEl = form.elements["data"];

  // a data mínima é hoje
  const h = new Date();
  dataEl.min = `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, "0")}-${String(h.getDate()).padStart(2, "0")}`;

  const animal = () => (form.querySelector('input[name="animal"]:checked') || {}).value;
  const porte = () => (form.querySelector('input[name="porte"]:checked') || {}).value;

  // calcula a estimativa; devolve null se faltar escolha
  function calcular() {
    const servico = form.elements["servico"].value;
    if (!servico || !animal() || !porte()) return null;
    const base = SERVICOS[servico][animal()];
    const consulta = servico === "Consulta veterinária";
    return consulta ? base : base * PORTE[porte()];
  }

  function atualizar() {
    const v = calcular();
    if (v === null) {
      valorEl.textContent = "—";
      obsEl.textContent = "Escolha serviço, animal e porte para ver a estimativa.";
    } else {
      valorEl.textContent = brl(v);
      obsEl.textContent = "Valor fictício, só para demonstração.";
    }
  }
  form.addEventListener("change", () => { atualizar(); status.hidden = true; });

  function erro(campo, texto) {
    document.getElementById("erro-" + campo).textContent = texto;
    const el = form.elements[campo];
    if (el && el.nodeName) el.setAttribute("aria-invalid", texto ? "true" : "false");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let primeiro = null;
    const marcar = (campo, msg, el) => { erro(campo, msg); if (msg && !primeiro) primeiro = el; };

    marcar("servico", form.elements["servico"].value ? "" : "Escolha um serviço.", form.elements["servico"]);
    marcar("animal", animal() ? "" : "Escolha cachorro ou gato.", form.querySelector('input[name="animal"]'));
    marcar("porte", porte() ? "" : "Escolha o porte.", form.querySelector('input[name="porte"]'));

    // data: obrigatória, não pode ser passada nem domingo
    let msgData = "";
    if (!dataEl.value) msgData = "Escolha uma data.";
    else {
      const d = new Date(dataEl.value + "T12:00:00");
      const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
      if (d < hoje) msgData = "Escolha uma data a partir de hoje.";
      else if (d.getDay() === 0) msgData = "Aos domingos estamos fechados. Escolha outro dia.";
    }
    marcar("data", msgData, dataEl);

    const pet = form.elements["pet"].value.trim();
    marcar("pet", pet.length >= 2 ? "" : "Digite o nome do seu pet.", form.elements["pet"]);

    if (primeiro) { primeiro.focus(); return; }

    const [a, m, d] = dataEl.value.split("-");
    status.textContent =
      `Agendamento de demonstração para ${pet}: ${form.elements["servico"].value}, ` +
      `${d}/${m}/${a}, estimativa ${brl(calcular())}. Nada foi enviado: este é um site fictício.`;
    status.hidden = false;
    form.reset();
    atualizar();
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
