/* ==========================================================
   Sabor & Brasa — script.js  (PROJETO DEMONSTRATIVO / FICTÍCIO)
   1. Menu mobile        2. Aberto/fechado agora
   3. Abas do cardápio   4. Formulário de reserva (demonstração)
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
   Horário fictício: terça a domingo, das 11h30 às 23h. Segunda fechado.
   Usa o relógio do computador de quem está vendo a página. */
(function () {
  const badge = document.getElementById("open-badge");
  if (!badge) return;

  const now = new Date();
  const day = now.getDay();                          // 0 = domingo, 1 = segunda ...
  const minutes = now.getHours() * 60 + now.getMinutes();
  const opens = 11 * 60 + 30;
  const closes = 23 * 60;

  const isOpen = day !== 1 && minutes >= opens && minutes < closes;

  badge.classList.add(isOpen ? "is-open" : "is-closed");
  badge.textContent = isOpen
    ? "Aberto agora · até às 23h"
    : "Fechado agora · ter a dom, 11h30 às 23h";
})();

/* 3. ABAS DO CARDÁPIO (com teclado: setas, Home e End) -------- */
(function () {
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;

  function select(tab) {
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));

    tab.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next); next.focus(); }
    });
  });
})();

/* 4. FORMULÁRIO DE RESERVA — SÓ DEMONSTRAÇÃO
   Valida os campos e mostra uma confirmação na tela.
   NADA é enviado nem guardado: o site é fictício. */
(function () {
  const form = document.getElementById("reserva-form");
  if (!form) return;

  const status = document.getElementById("reserva-status");
  const dateInput = form.elements["data"];

  // não permite escolher uma data que já passou
  const today = new Date();
  const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = iso;

  function setError(field, message) {
    const err = document.getElementById("erro-" + field.name);
    err.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  // regras de cada campo (devolve o texto do erro, ou "" se estiver ok)
  const rules = {
    nome: (v) => (v.trim().length < 3 ? "Digite seu nome (mínimo 3 letras)." : ""),
    data: (v) => {
      if (!v) return "Escolha uma data.";
      if (v < iso) return "Escolha uma data de hoje em diante.";
      // segunda-feira o restaurante fictício está fechado
      const d = new Date(v + "T12:00:00");
      return d.getDay() === 1 ? "Fechamos às segundas. Escolha outro dia." : "";
    },
    horario: (v) => (!v ? "Escolha um horário." : ""),
    pessoas: (v) => {
      const n = Number(v);
      return !Number.isInteger(n) || n < 1 || n > 12 ? "Informe de 1 a 12 pessoas." : "";
    },
  };

  // valida ao sair de cada campo
  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener("blur", () => setError(field, rules[name](field.value)));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") setError(field, rules[name](field.value));
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.hidden = true;

    let firstInvalid = null;
    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      const msg = rules[name](field.value);
      setError(field, msg);
      if (msg && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) { firstInvalid.focus(); return; }

    // formata a data como dd/mm/aaaa
    const [y, m, d] = form.elements["data"].value.split("-");
    const pessoas = form.elements["pessoas"].value;

    status.textContent =
      `Reserva de demonstração para ${form.elements["nome"].value.trim()}: ` +
      `${d}/${m}/${y}, às ${form.elements["horario"].value}, ${pessoas} ` +
      `${pessoas === "1" ? "pessoa" : "pessoas"}. Nada foi enviado: este é um site fictício.`;
    status.hidden = false;
    form.reset();
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