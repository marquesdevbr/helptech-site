/* ==========================================================
   HelpTech — contato.js
   Validação e envio do formulário da página de contato.
   1. Configuração   2. Validação   3. Envio
   ========================================================== */

/* 1. CONFIGURAÇÃO -----------------------------------------------
   EMAIL_DESTINO: quando vocês tiverem um e-mail oficial da HelpTech,
   escreva-o entre as aspas (ex.: "contato@seudominio.com").
   - Vazio ("")  -> MODO DEMONSTRAÇÃO: nada é enviado, só aparece
                    uma mensagem de confirmação.
   - Preenchido  -> ao enviar, abre o programa de e-mail do visitante
                    com a mensagem já escrita para esse endereço.
   Assim o formulário funciona sem expor WhatsApp nem telefones. */
const EMAIL_DESTINO = "";

(function () {
  const form = document.getElementById("contato-form");
  const status = document.getElementById("contato-status");
  if (!form) return;

  /* 2. VALIDAÇÃO ------------------------------------------------ */
  // mostra ou limpa o erro de um campo
  function setErro(campo, texto) {
    document.getElementById("erro-" + campo).textContent = texto;
    form.elements[campo].setAttribute("aria-invalid", texto ? "true" : "false");
  }

  // cada regra devolve o texto do erro ou "" quando está certo
  const regras = {
    nome: (v) => (v.trim().length >= 3 ? "" : "Digite o seu nome (mínimo 3 letras)."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Digite um e-mail válido, como nome@exemplo.com."),
    assunto: (v) => (v ? "" : "Escolha um assunto."),
    mensagem: (v) => (v.trim().length >= 10 ? "" : "Escreva a sua mensagem (mínimo 10 letras)."),
  };

  // valida um campo; devolve true se estiver ok
  function validar(campo) {
    const erro = regras[campo](form.elements[campo].value);
    setErro(campo, erro);
    return !erro;
  }

  // ao sair de um campo (ou ao corrigir um erro), revalida na hora
  Object.keys(regras).forEach((campo) => {
    const el = form.elements[campo];
    el.addEventListener("blur", () => validar(campo));
    el.addEventListener("input", () => {
      if (el.getAttribute("aria-invalid") === "true") validar(campo);
    });
  });

  /* 3. ENVIO ---------------------------------------------------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.hidden = true;

    // valida todos e foca no primeiro com erro
    let primeiroComErro = null;
    Object.keys(regras).forEach((campo) => {
      if (!validar(campo) && !primeiroComErro) primeiroComErro = form.elements[campo];
    });
    if (primeiroComErro) { primeiroComErro.focus(); return; }

    const nome = form.elements.nome.value.trim();
    const email = form.elements.email.value.trim();
    const assunto = form.elements.assunto.value;
    const mensagem = form.elements.mensagem.value.trim();

    if (EMAIL_DESTINO) {
      // MODO REAL: abre o e-mail do visitante com tudo preenchido
      const corpo = `Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`;
      window.location.href =
        `mailto:${EMAIL_DESTINO}?subject=${encodeURIComponent("[Site HelpTech] " + assunto)}&body=${encodeURIComponent(corpo)}`;
      status.textContent = "Abrimos o seu programa de e-mail com a mensagem pronta. Falta só clicar em enviar por lá.";
    } else {
      // MODO DEMONSTRAÇÃO: não envia nada
      status.textContent = `Obrigado, ${nome}! Esta é uma demonstração: sua mensagem não foi enviada nem guardada. Quando houver um e-mail oficial, o formulário passará a funcionar de verdade.`;
    }
    status.hidden = false;
    form.reset();
  });
})();