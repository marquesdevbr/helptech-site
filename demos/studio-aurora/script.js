/* ==========================================================
   Studio Aurora — script.js  (PROJETO DEMONSTRATIVO / FICTÍCIO)
   1. Menu mobile            2. Aberto/fechado agora
   3. Galeria com filtro     4. Agendamento passo a passo
   5. Animação ao rolar
   NADA é enviado nem guardado: o site é fictício.
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
   Horário fictício: terça a sexta 9h–19h, sábado 9h–17h,
   domingo e segunda fechado. Usa o relógio de quem vê a página. */
(function () {
  const badge = document.getElementById("open-badge");
  if (!badge) return;

  const now = new Date();
  const day = now.getDay(); // 0 = domingo ... 6 = sábado
  const minutes = now.getHours() * 60 + now.getMinutes();

  let closes = 0; // 0 = fechado o dia todo
  if (day >= 2 && day <= 5) closes = 19 * 60;
  if (day === 6) closes = 17 * 60;

  const isOpen = closes > 0 && minutes >= 9 * 60 && minutes < closes;
  badge.classList.add(isOpen ? "is-open" : "is-closed");
  badge.textContent = isOpen
    ? "Aberto agora · até às " + closes / 60 + "h"
    : "Fechado agora · ter a sex 9h–19h, sáb 9h–17h";
})();

/* 3. GALERIA COM FILTRO ------------------------------------- */
(function () {
  const group = document.querySelector(".filters");
  const list = document.getElementById("galeria-lista");
  const status = document.getElementById("galeria-status");
  if (!group || !list) return;

  const buttons = group.querySelectorAll("[data-filter]");
  const tiles = list.querySelectorAll("[data-category]");

  function apply(filter) {
    let visible = 0;
    tiles.forEach((tile) => {
      const show = filter === "todos" || tile.dataset.category === filter;
      tile.hidden = !show; // o atributo hidden esconde o item
      if (show) visible++;
    });
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === filter)));
    status.textContent = "Mostrando " + visible + " de " + tiles.length + " inspirações.";
  }

  buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.filter)));
  apply("todos");
})();

/* 4. AGENDAMENTO PASSO A PASSO ------------------------------- */
(function () {
  const form = document.getElementById("agenda-form");
  if (!form) return;

  const steps = Array.from(form.querySelectorAll(".step"));
  const stepperItems = Array.from(document.querySelectorAll("#stepper li"));
  const btnBack = document.getElementById("btn-voltar");
  const btnNext = document.getElementById("btn-avancar");
  const errorBox = document.getElementById("erro");
  const status = document.getElementById("status");
  const dateInput = document.getElementById("data");
  const slotsBox = document.getElementById("slots");
  const slotsHint = document.getElementById("slots-hint");
  const summary = document.getElementById("resumo");

  let current = 0; // índice da etapa atual (0 a 3)
  let finished = false;

  // data mínima = hoje (ajustada ao fuso do navegador)
  const today = new Date();
  const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = iso;

  // ---- utilidades -------------------------------------------------
  const money = (n) => "R$ " + n.toLocaleString("pt-BR");
  const checked = (name) => form.querySelector('input[name="' + name + '"]:checked');
  const isClosed = (iso) => { const d = new Date(iso + "T12:00:00").getDay(); return d === 0 || d === 1; };
  const brDate = (iso) => iso.split("-").reverse().join("/");

  // "sorteio" estável: a mesma data+hora sempre dá o mesmo resultado
  function isBusy(isoDate, hour) {
    let h = 0;
    const text = isoDate + hour;
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 997;
    return h % 4 === 0; // cerca de 1 em cada 4 horários aparece ocupado
  }

  // ---- gera os horários da data escolhida --------------------------
  function renderSlots() {
    slotsBox.innerHTML = "";
    const v = dateInput.value;

    if (!v) { slotsHint.textContent = "Escolha uma data para ver os horários."; return; }
    if (v < iso) { slotsHint.textContent = "Escolha uma data de hoje em diante."; return; }
    if (isClosed(v)) { slotsHint.textContent = "O salão fecha aos domingos e às segundas. Escolha outro dia."; return; }

    const isSaturday = new Date(v + "T12:00:00").getDay() === 6;
    const lastHour = isSaturday ? 16 : 18;
    slotsHint.textContent = "Horários disponíveis (os riscados já estão ocupados):";

    for (let hour = 9; hour <= lastHour; hour++) {
      const label = String(hour).padStart(2, "0") + ":00";
      const busy = isBusy(v, label);
      const id = "slot-" + hour;

      const wrap = document.createElement("div");
      wrap.className = "slot";
      wrap.innerHTML =
        '<input type="radio" name="horario" id="' + id + '" value="' + label + '"' + (busy ? " disabled" : "") + ">" +
        '<label for="' + id + '">' + label + "</label>";
      slotsBox.appendChild(wrap);
    }
  }
  dateInput.addEventListener("change", renderSlots);

  // ---- mostra a etapa certa ---------------------------------------
  function show(n) {
    current = n;
    steps.forEach((s, i) => { s.hidden = i !== n; });
    stepperItems.forEach((li, i) => {
      li.classList.toggle("done", i < n);
      if (i === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    btnBack.disabled = n === 0;
    btnNext.textContent = n === steps.length - 1 ? "Confirmar agendamento" : "Continuar";
    errorBox.textContent = "";
    if (n === 3) buildSummary();
  }

  // ---- valida a etapa atual (devolve texto do erro ou "") ----------
  function validate(n) {
    if (n === 0 && !checked("servico")) return "Escolha um serviço para continuar.";
    if (n === 1 && !checked("profissional")) return "Escolha uma profissional para continuar.";
    if (n === 2) {
      const v = dateInput.value;
      if (!v) return "Escolha uma data.";
      if (v < iso) return "Escolha uma data de hoje em diante.";
      if (isClosed(v)) return "O salão fecha aos domingos e às segundas.";
      if (!checked("horario")) return "Escolha um horário.";
    }
    if (n === 3) {
      if (document.getElementById("nome").value.trim().length < 3) return "Digite o seu nome (mínimo 3 letras).";
    }
    return "";
  }

  // ---- resumo da etapa final ---------------------------------------
  function buildSummary() {
    const s = checked("servico");
    summary.innerHTML =
      "<div><dt>Serviço</dt><dd>" + s.value + "</dd></div>" +
      "<div><dt>Profissional</dt><dd>" + checked("profissional").value + "</dd></div>" +
      "<div><dt>Data</dt><dd>" + brDate(dateInput.value) + ", " + checked("horario").value + "</dd></div>" +
      '<div class="total"><dt>Valor</dt><dd>' + money(Number(s.dataset.price)) + "</dd></div>";
  }

  btnNext.addEventListener("click", () => {
    if (finished) return;
    const msg = validate(current);
    errorBox.textContent = msg;
    if (msg) return;

    if (current < steps.length - 1) { show(current + 1); return; }

    // última etapa: confirmação de DEMONSTRAÇÃO
    const nome = document.getElementById("nome").value.trim();
    status.textContent =
      "Agendamento de demonstração para " + nome + ": " + checked("servico").value + ", " +
      brDate(dateInput.value) + " às " + checked("horario").value + ". " +
      "Nada foi enviado: este é um site fictício.";
    status.hidden = false;
    finished = true;
    btnNext.disabled = true;
    btnBack.disabled = true;
  });

  btnBack.addEventListener("click", () => { if (current > 0 && !finished) show(current - 1); });

  show(0);
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
