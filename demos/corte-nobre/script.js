/* ==========================================================
   Corte Nobre — script.js  (PROJETO DEMONSTRATIVO / FICTÍCIO)
   1. Menu mobile          2. Aberto/fechado agora
   3. Agenda (dias e horários)   4. Confirmação (só demonstração)
   5. Animação ao rolar
   ========================================================== */

/* HORÁRIO FICTÍCIO DE FUNCIONAMENTO
   Segunda a sexta: 9h às 19h | Sábado: 9h às 17h | Domingo: fechado.
   Para mudar, altere as linhas abaixo (0 = domingo ... 6 = sábado). */
const FUNCIONAMENTO = {
  0: null,
  1: [9, 19], 2: [9, 19], 3: [9, 19], 4: [9, 19], 5: [9, 19],
  6: [9, 17],
};
const NOMES_DIA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const DOIS = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${DOIS(d.getMonth() + 1)}-${DOIS(d.getDate())}`;

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

/* 2. ABERTO / FECHADO AGORA (usa o relógio de quem vê a página) */
(function () {
  const badge = document.getElementById("open-badge");
  const agora = new Date();
  const faixa = FUNCIONAMENTO[agora.getDay()];
  const h = agora.getHours() + agora.getMinutes() / 60;
  const aberto = faixa && h >= faixa[0] && h < faixa[1];
  badge.classList.add(aberto ? "is-open" : "is-closed");
  badge.textContent = aberto ? `Aberto agora · até às ${faixa[1]}h` : "Fechado agora · seg a sex 9h às 19h, sáb 9h às 17h";
})();

/* 3. AGENDA ---------------------------------------------------
   O usuário escolhe um dos próximos 7 dias. Os horários ocupados
   são inventados, mas estáveis: dependem só da data e da hora
   (a mesma data sempre mostra os mesmos horários ocupados). */
function ocupado(dataISO, hora) {
  let h = 0;
  const texto = dataISO + hora;
  for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) % 997;
  return h % 3 === 0; // cerca de 1 em cada 3 horários
}

(function () {
  const diasEl = document.getElementById("dias");
  const slotsEl = document.getElementById("slots");
  const dicaEl = document.getElementById("slots-dica");
  const form = document.getElementById("agenda-form");
  const status = document.getElementById("agenda-status");
  let diaEscolhido = null;

  // cria os botões dos próximos 7 dias
  const hoje = new Date();
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);
    return d;
  });

  diasEl.innerHTML = dias.map((d, i) => {
    const fechado = FUNCIONAMENTO[d.getDay()] === null;
    return `<button type="button" class="day" data-dia="${iso(d)}" aria-pressed="false" ${fechado ? "disabled" : ""}
      aria-label="${NOMES_DIA[d.getDay()]}, dia ${d.getDate()}${fechado ? ", fechado" : ""}${i === 0 ? ", hoje" : ""}">
      <small>${i === 0 ? "hoje" : NOMES_DIA[d.getDay()]}</small><strong>${d.getDate()}</strong>
    </button>`;
  }).join("");

  // desenha os horários do dia escolhido
  function desenharHorarios() {
    if (!diaEscolhido) { slotsEl.innerHTML = ""; return; }
    const d = new Date(diaEscolhido + "T12:00:00");
    const [abre, fecha] = FUNCIONAMENTO[d.getDay()];
    const agora = new Date();
    const ehHoje = diaEscolhido === iso(agora);
    let livres = 0, html = "";

    for (let h = abre; h < fecha; h++) {
      const hora = `${DOIS(h)}:00`;
      const passou = ehHoje && h <= agora.getHours();
      const indisponivel = passou || ocupado(diaEscolhido, hora);
      if (!indisponivel) livres++;
      html += `<label class="slot"><input type="radio" name="horario" value="${hora}" ${indisponivel ? "disabled" : ""}>
        <span>${hora}</span></label>`;
    }
    slotsEl.innerHTML = html;
    dicaEl.textContent = livres
      ? `${livres} ${livres === 1 ? "horário livre" : "horários livres"} neste dia. Os riscados já estão ocupados.`
      : "Sem horários livres neste dia. Escolha outro dia.";
  }

  diasEl.addEventListener("click", (e) => {
    const botao = e.target.closest(".day");
    if (!botao || botao.disabled) return;
    diaEscolhido = botao.dataset.dia;
    diasEl.querySelectorAll(".day").forEach((b) => b.setAttribute("aria-pressed", String(b === botao)));
    status.hidden = true;
    erro("horario", "");
    desenharHorarios();
  });

  /* 4. CONFIRMAÇÃO — SÓ DEMONSTRAÇÃO (nada é enviado nem guardado) */
  function erro(campo, texto) {
    document.getElementById("erro-" + campo).textContent = texto;
    const el = form.elements[campo];
    if (el && el.setAttribute && el.nodeName) el.setAttribute("aria-invalid", texto ? "true" : "false");
  }

  form.elements["nome"].addEventListener("input", () => {
    if (form.elements["nome"].getAttribute("aria-invalid") === "true") validarNome();
  });
  function validarNome() {
    const ok = form.elements["nome"].value.trim().length >= 3;
    erro("nome", ok ? "" : "Digite o seu nome (mínimo 3 letras).");
    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.hidden = true;
    let primeiro = null;

    if (!form.elements["servico"].value) {
      erro("servico", "Escolha um serviço.");
      primeiro = form.elements["servico"];
    } else erro("servico", "");

    const hora = form.querySelector('input[name="horario"]:checked');
    if (!diaEscolhido) { document.getElementById("erro-horario").textContent = "Escolha um dia."; primeiro = primeiro || diasEl.querySelector(".day:not(:disabled)"); }
    else if (!hora) { document.getElementById("erro-horario").textContent = "Escolha um horário livre."; primeiro = primeiro || slotsEl.querySelector("input:not(:disabled)") || diasEl.querySelector(".day:not(:disabled)"); }
    else document.getElementById("erro-horario").textContent = "";

    if (!validarNome()) primeiro = primeiro || form.elements["nome"];
    if (primeiro) { primeiro.focus(); return; }

    const [a, m, d] = diaEscolhido.split("-");
    status.textContent =
      `Agendamento de demonstração para ${form.elements["nome"].value.trim()}: ` +
      `${form.elements["servico"].value}, ${d}/${m}/${a} às ${hora.value}. ` +
      `Nada foi enviado: este é um site fictício.`;
    status.hidden = false;
    form.reset();
    diaEscolhido = null;
    diasEl.querySelectorAll(".day").forEach((b) => b.setAttribute("aria-pressed", "false"));
    slotsEl.innerHTML = "";
    dicaEl.textContent = "Escolha um dia para ver os horários.";
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
