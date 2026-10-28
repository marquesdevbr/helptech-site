/* ==========================================================
   Ritmo Fit — script.js  (PROJETO DEMONSTRATIVO / FICTÍCIO)
   1. Menu mobile            2. Aberto/fechado agora
   3. Grade de aulas (dados + filtros)
   4. Planos (mensal/anual)  5. Formulário de aula experimental
   6. Animação ao rolar
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
   Horário fictício:
     segunda a sexta: 5h30 às 22h30  |  sábado: 8h às 14h  |  domingo: fechado
   Usa o relógio do computador de quem está vendo a página. */
(function () {
  const badge = document.getElementById("open-badge");
  if (!badge) return;

  const now = new Date();
  const day = now.getDay(); // 0 = domingo ... 6 = sábado
  const minutes = now.getHours() * 60 + now.getMinutes();

  let isOpen = false;
  let closing = "";
  if (day >= 1 && day <= 5) { isOpen = minutes >= 5 * 60 + 30 && minutes < 22 * 60 + 30; closing = "22h30"; }
  if (day === 6) { isOpen = minutes >= 8 * 60 && minutes < 14 * 60; closing = "14h"; }

  badge.classList.add(isOpen ? "is-open" : "is-closed");
  badge.textContent = isOpen
    ? `Aberto agora · até às ${closing}`
    : "Fechado agora · veja os horários abaixo";
})();

/* 3. GRADE DE AULAS -----------------------------------------
   Os dados ficam neste array: [dia, horário, modalidade, professor(a)].
   Dia: 1 = segunda ... 6 = sábado. Para mudar a grade, edite só aqui. */
const MODALIDADES = {
  funcional: { nome: "Funcional", sala: "Sala Funcional" },
  spinning: { nome: "Spinning", sala: "Sala Bike" },
  danca: { nome: "Dança", sala: "Sala Multiuso" },
  yoga: { nome: "Yoga", sala: "Sala Zen" },
  boxe: { nome: "Boxe Fit", sala: "Sala Multiuso" },
};
const DIAS = { 1: "Seg", 2: "Ter", 3: "Qua", 4: "Qui", 5: "Sex", 6: "Sáb" };
const DIAS_LONGOS = { 1: "Segunda", 2: "Terça", 3: "Quarta", 4: "Quinta", 5: "Sexta", 6: "Sábado" };

const AULAS = [
  [1, "06:00", "funcional", "Bruno"], [1, "07:00", "spinning", "Carla"], [1, "18:30", "boxe", "Diego"], [1, "19:30", "yoga", "Marina"],
  [2, "06:00", "spinning", "Carla"], [2, "08:00", "danca", "Letícia"], [2, "18:30", "funcional", "Bruno"], [2, "19:30", "danca", "Letícia"],
  [3, "06:00", "funcional", "Bruno"], [3, "07:00", "yoga", "Marina"], [3, "18:30", "spinning", "Carla"], [3, "19:30", "boxe", "Diego"],
  [4, "06:00", "spinning", "Carla"], [4, "08:00", "danca", "Letícia"], [4, "18:30", "funcional", "Bruno"], [4, "19:30", "yoga", "Marina"],
  [5, "06:00", "funcional", "Bruno"], [5, "07:00", "boxe", "Diego"], [5, "18:30", "danca", "Letícia"], [5, "19:30", "spinning", "Carla"],
  [6, "09:00", "funcional", "Bruno"], [6, "10:00", "danca", "Letícia"], [6, "11:00", "yoga", "Marina"],
];

(function () {
  const list = document.getElementById("grade-lista");
  const status = document.getElementById("grade-status");
  const modBox = document.getElementById("filtro-modalidade");
  const diaBox = document.getElementById("filtro-dia");
  if (!list || !modBox || !diaBox) return;

  const state = { mod: "todas", dia: "todos" };

  // cria os botões de filtro a partir dos dados
  function makeChip(box, value, label, group) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.value = value;
    b.dataset.group = group;
    b.textContent = label;
    b.setAttribute("aria-pressed", String(value === (group === "mod" ? "todas" : "todos")));
    box.appendChild(b);
  }
  makeChip(modBox, "todas", "Todas", "mod");
  Object.keys(MODALIDADES).forEach((k) => makeChip(modBox, k, MODALIDADES[k].nome, "mod"));
  makeChip(diaBox, "todos", "Todos", "dia");
  Object.keys(DIAS).forEach((d) => makeChip(diaBox, d, DIAS[d], "dia"));

  // desenha a lista conforme os filtros escolhidos
  function render() {
    const items = AULAS
      .filter(([d, , m]) => (state.mod === "todas" || m === state.mod) && (state.dia === "todos" || String(d) === state.dia))
      .sort((a, b) => a[0] - b[0] || a[1].localeCompare(b[1]));

    list.innerHTML = "";
    items.forEach(([d, hora, m, prof]) => {
      const li = document.createElement("li");
      li.className = "class-row";
      li.innerHTML =
        `<span class="c-day" title="${DIAS_LONGOS[d]}">${DIAS[d]}</span>` +
        `<span class="c-time">${hora}</span>` +
        `<span class="c-mod">${MODALIDADES[m].nome}</span>` +
        `<span class="c-info">Prof. ${prof} · ${MODALIDADES[m].sala}</span>`;
      list.appendChild(li);
    });

    // aviso lido por leitores de tela (a região tem aria-live no HTML)
    status.textContent = items.length
      ? `Mostrando ${items.length} de ${AULAS.length} aulas.`
      : "Nenhuma aula encontrada com esses filtros. Tente outra combinação.";
  }

  // clique nos botões de filtro (um único ouvinte para os dois grupos)
  [modBox, diaBox].forEach((box) => {
    box.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      state[btn.dataset.group] = btn.dataset.value;
      box.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === btn)));
      render();
    });
  });

  render();
})();

/* 4. PLANOS — alternância mensal / anual (preços fictícios) ------
   Mensal: valor cheio por mês. Anual: valor por mês com desconto,
   cobrado em um pagamento único (valor × 12). */
(function () {
  const buttons = document.querySelectorAll("[data-billing]");
  const cards = document.querySelectorAll("[data-plan]");
  const live = document.getElementById("plano-status");
  if (!buttons.length || !cards.length) return;

  function fmt(n) { return "R$ " + n.toLocaleString("pt-BR"); }

  function apply(mode) {
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.billing === mode)));
    cards.forEach((card) => {
      const mensal = Number(card.dataset.mensal);
      const anual = Number(card.dataset.anual);
      const value = mode === "mensal" ? mensal : anual;
      card.querySelector(".price-value").textContent = fmt(value);
      card.querySelector(".price-note").textContent =
        mode === "mensal" ? "Sem fidelidade, cancele quando quiser." : `Pagamento único de ${fmt(anual * 12)} por ano.`;
    });
    if (live) live.textContent = mode === "mensal" ? "Mostrando preços do plano mensal." : "Mostrando preços do plano anual, com desconto.";
  }

  buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.billing)));
  apply("mensal");
})();

/* 5. FORMULÁRIO DE AULA EXPERIMENTAL — SÓ DEMONSTRAÇÃO
   Valida os campos e mostra uma confirmação na tela.
   NADA é enviado nem guardado: o site é fictício. */
(function () {
  const form = document.getElementById("trial-form");
  if (!form) return;
  const status = document.getElementById("trial-status");

  // preenche as opções de modalidade e de dia com os mesmos dados da grade
  const selMod = form.elements["modalidade"];
  Object.keys(MODALIDADES).forEach((k) => selMod.add(new Option(MODALIDADES[k].nome, k)));
  const selDia = form.elements["dia"];
  Object.keys(DIAS_LONGOS).forEach((d) => selDia.add(new Option(DIAS_LONGOS[d], d)));

  function setError(field, message) {
    document.getElementById("erro-" + field.name).textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  // regras: cada função devolve o texto do erro ("" = campo ok)
  const rules = {
    nome: (v) => (v.trim().length < 3 ? "Digite seu nome (mínimo 3 letras)." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Digite um e-mail válido, como nome@exemplo.com."),
    modalidade: (v) => (!v ? "Escolha uma modalidade." : ""),
    dia: (v) => {
      if (!v) return "Escolha um dia.";
      // só aceita dias em que a modalidade escolhida tem aula
      const mod = selMod.value;
      if (mod && !AULAS.some(([d, , m]) => String(d) === v && m === mod)) {
        return `Não há aula de ${MODALIDADES[mod].nome} nesse dia. Veja a grade acima.`;
      }
      return "";
    },
  };

  Object.keys(rules).forEach((name) => {
    const f = form.elements[name];
    f.addEventListener("blur", () => setError(f, rules[name](f.value)));
    f.addEventListener("input", () => { if (f.getAttribute("aria-invalid") === "true") setError(f, rules[name](f.value)); });
    f.addEventListener("change", () => { if (f.getAttribute("aria-invalid") === "true") setError(f, rules[name](f.value)); });
  });
  // ao trocar a modalidade, revalida o dia
  selMod.addEventListener("change", () => { if (selDia.value) setError(selDia, rules.dia(selDia.value)); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.hidden = true;

    let firstInvalid = null;
    Object.keys(rules).forEach((name) => {
      const f = form.elements[name];
      const msg = rules[name](f.value);
      setError(f, msg);
      if (msg && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    const horarios = AULAS.filter(([d, , m]) => String(d) === selDia.value && m === selMod.value).map((a) => a[1]).join(" e ");
    status.textContent =
      `Pedido de aula experimental de demonstração para ${form.elements["nome"].value.trim()}: ` +
      `${MODALIDADES[selMod.value].nome}, ${DIAS_LONGOS[selDia.value]} (${horarios}). ` +
      "Nada foi enviado: este é um site fictício.";
    status.hidden = false;
    form.reset();
  });
})();

/* 6. ANIMAÇÃO AO ROLAR ----------------------------------------- */
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
  }, { threshold: 0.12 });
  items.forEach((el) => obs.observe(el));
})();
