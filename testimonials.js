(function () {
  const bento = document.querySelector(".testimonial-bento");
  const cards = Array.from(bento?.querySelectorAll("[data-testimonial-pool]") || []);
  if (!bento || !cards.length) return;

  const pools = {
    landscape: [
      { src: "assets/testimonial-francisco.jpeg", alt: "Francisco elogia a plataforma e o suporte após voltar a vender com a Ratoeira.", label: "Abrir o depoimento de Francisco em tamanho completo" },
      { src: "assets/testimonial-antidio-souza.jpeg", alt: "Antídio Souza comenta que as configurações da Ratoeira são fáceis e rápidas de usar.", label: "Abrir o depoimento de Antídio Souza em tamanho completo" },
      { src: "assets/testimonial-roberto-junior.jpeg", alt: "Roberto Junior recomenda a ferramenta da Ratoeira e deseja sucesso à equipe.", label: "Abrir o depoimento de Roberto Junior em tamanho completo" },
      { src: "assets/testimonial-otair-oliveira.jpeg", alt: "Otair Oliveira relata que configurou a Ratoeira como ensinado e recebeu uma venda imediatamente.", label: "Abrir o depoimento de Otair Oliveira em tamanho completo" },
      { src: "assets/testimonial-larissa-gomes.jpeg", alt: "Larissa Gomes recomenda a Ratoeira e relata conversões em campanhas internacionais.", label: "Abrir o depoimento de Larissa Gomes em tamanho completo" },
      { src: "assets/testimonial-jaique.jpeg", alt: "Jaique comenta como foi fácil configurar notificações e scripts da Ratoeira.", label: "Abrir o depoimento de Jaique em tamanho completo" },
      { src: "assets/testimonial-andre-campelo.jpeg", alt: "André Campelo agradece ao suporte da Ratoeira por esclarecer todas as dúvidas.", label: "Abrir o depoimento de André Campelo em tamanho completo" },
      { src: "assets/testimonial-feedback-fantasticos.webp", alt: "Cliente agradece a ajuda recebida e afirma que a equipe da Ratoeira é fantástica.", label: "Abrir o depoimento sobre o atendimento em tamanho completo" },
      { src: "assets/testimonial-edson-suporte.webp", alt: "Edson elogia a atenção e a qualidade do suporte prestado pela equipe.", label: "Abrir o depoimento de Edson em tamanho completo" },
      { src: "assets/testimonial-luise-atendimento.webp", alt: "Cliente compara o atendimento da Ratoeira com outra ferramenta e dá nota máxima à equipe.", label: "Abrir o depoimento sobre o atendimento de Luise em tamanho completo" }
    ],
    portrait: [
      { src: "assets/testimonial-vendas-buygoods.webp", alt: "Notificações de vendas aprovadas em dólar pela Ratoeira na plataforma BuyGoods.", label: "Abrir o registro de vendas aprovadas na BuyGoods em tamanho completo" },
      { src: "assets/testimonial-faturamento-carlos.webp", alt: "Resultado compartilhado por Carlos com mais de três milhões de reais faturados em 2026.", label: "Abrir o resultado de faturamento de Carlos em tamanho completo" },
      { src: "assets/testimonial-vendas-gurumedia.webp", alt: "Sequência de notificações de vendas aprovadas em dólar pela Ratoeira na plataforma GuruMedia.", label: "Abrir o registro de vendas aprovadas na GuruMedia em tamanho completo" },
      { src: "assets/testimonial-julliver-atendimento.webp", alt: "Julliver demonstra confiança na Ratoeira e agradece pelo atendimento recebido.", label: "Abrir o depoimento de Julliver em tamanho completo" }
    ]
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeSlot = 0;
  let timerId;
  let isPaused = false;
  let isVisible = !("IntersectionObserver" in window);

  function clearRotation() {
    window.clearTimeout(timerId);
  }

  function scheduleRotation() {
    clearRotation();
    if (reduceMotion || isPaused || !isVisible || document.hidden) return;
    timerId = window.setTimeout(() => {
      const card = cards[activeSlot];
      activeSlot = (activeSlot + 1) % cards.length;
      swapCard(card);
      scheduleRotation();
    }, 4000);
  }

  function swapCard(card) {
    if (card.dataset.swapping === "true") return;

    const pool = pools[card.dataset.testimonialPool];
    const nextIndex = (Number(card.dataset.testimonialIndex) + 1) % pool.length;
    const next = pool[nextIndex];
    const current = card.querySelector(".testimonial-card__image");
    const incoming = new Image();

    card.dataset.swapping = "true";
    incoming.className = "testimonial-card__image testimonial-card__image--incoming";
    incoming.alt = next.alt;
    incoming.decoding = "async";
    incoming.addEventListener("load", () => {
      current.alt = "";
      card.appendChild(incoming);
      window.requestAnimationFrame(() => {
        current.classList.add("is-leaving");
        incoming.classList.add("is-visible");
        card.href = next.src;
        card.setAttribute("aria-label", next.label);
        card.dataset.testimonialIndex = String(nextIndex);
      });

      window.setTimeout(() => {
        current.remove();
        incoming.classList.remove("testimonial-card__image--incoming", "is-visible");
        delete card.dataset.swapping;
      }, 520);
    }, { once: true });
    incoming.addEventListener("error", () => delete card.dataset.swapping, { once: true });
    incoming.src = next.src;
  }

  bento.addEventListener("pointerenter", () => {
    isPaused = true;
    clearRotation();
  });
  bento.addEventListener("pointerleave", () => {
    isPaused = false;
    scheduleRotation();
  });
  bento.addEventListener("focusin", () => {
    isPaused = true;
    clearRotation();
  });
  bento.addEventListener("focusout", (event) => {
    if (bento.contains(event.relatedTarget)) return;
    isPaused = false;
    scheduleRotation();
  });
  document.addEventListener("visibilitychange", scheduleRotation);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      scheduleRotation();
    }, { threshold: 0.2 });
    observer.observe(bento);
  }

  scheduleRotation();
})();
