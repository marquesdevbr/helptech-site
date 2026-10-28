# HelpTech — Site institucional
🔗 **Demonstração online:** https://marquesdevbr.github.io/helptech-website/

Site institucional da **HelpTech**, projeto empresarial acadêmico de soluções em tecnologia
(criação de sites, automação de processos, suporte técnico e otimização de computadores,
com venda complementar de componentes e periféricos).

> Projeto acadêmico. Os projetos e produtos exibidos são **demonstrativos**, com nomes
> fictícios, e não representam clientes reais.

## Páginas

| Página | Arquivo | O que tem |
|---|---|---|
| Início | `index.html` | Apresentação, serviços em destaque e processo de atendimento |
| Serviços | `pages/servicos.html` | Os quatro serviços, com o que o cliente recebe e os cuidados |
| Produtos | `pages/produtos.html` | Componentes e periféricos, com filtro por categoria (preços "sob consulta") |
| Projetos | `pages/projetos.html` | 8 projetos demonstrativos, com filtro por segmento |
| Sobre | `pages/sobre.html` | Missão, visão, valores e equipe |
| Contato | `pages/contato.html` | Formulário com validação (modo demonstração) |

## Sites demonstrativos (`demos/`)

Cada pasta é um site fictício completo, com visual e função próprios:

| Pasta | Negócio fictício | Destaque |
|---|---|---|
| `sabor-e-brasa` | Restaurante | Cardápio em abas e reserva de mesa |
| `pao-de-praca` | Padaria | Vitrine com filtro e calculadora de encomenda de bolo |
| `studio-aurora` | Salão de beleza | Galeria e agendamento em 4 etapas |
| `corte-nobre` | Barbearia | Agenda com horários livres e ocupados |
| `casa-viva` | Loja virtual | Carrinho, frete por CEP, cupom e checkout fictício |
| `patas-e-cia` | Pet shop | Agendamento com estimativa de preço |
| `ritmo-fit` | Academia | Grade de horários, planos mensal/anual e aula experimental |
| `auto-center-estrela` | Oficina | Orçamento ao vivo e acompanhamento do carro (código `DEMO-123`) |

Todos têm a faixa "Projeto demonstrativo", usam dados inventados e **não enviam nada**.

## Tecnologias

HTML5, CSS3 e JavaScript puro (sem frameworks nem build). Fontes do Google Fonts.

## Estrutura

```
HelpTech-Site/
├── index.html
├── assets/        logo
├── css/           style.css (base) e responsive.css (telas menores)
├── js/            layout.js (menu e rodapé), main.js, interactions.js (filtros), contato.js
├── pages/         servicos, produtos, projetos, sobre, contato
└── demos/         8 sites demonstrativos (cada um com index.html, style.css e script.js)
```

## Como abrir no computador

1. Baixe ou clone o repositório.
2. Abra o `index.html` no navegador (ou use a extensão **Live Server** no VS Code).

## Como publicar (GitHub Pages)

1. No GitHub, abra o repositório → **Settings** → **Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)` → **Save**.
4. Aguarde 1 a 2 minutos. O endereço aparece na mesma tela.

## Formulário de contato

Está em **modo demonstração**: valida os campos, mas não envia nada. Quando houver um
e-mail oficial, escreva-o na constante `EMAIL_DESTINO` no início de `js/contato.js`; a
partir daí o formulário abre o e-mail do visitante com a mensagem pronta.

## Decisões de conteúdo

- Sem preços oficiais: produtos aparecem como "sob consulta".
- Sem clientes, depoimentos, números de faturamento ou certificações inventados.
- Equipe com nome e cargo apenas; sem telefones ou WhatsApp pessoais.

## Equipe

- **Gabriel** — Sócio Administrador / Diretor-Geral
- **Kamilly** — Diretora Administrativa e Financeira
- **Kauane** — Diretora de Atendimento e Marketing
