/* Wizard de qualificação — Black Friday Ratoeira
   Uma pergunta por vez, sem reload; respostas enviadas ao Netlify ao final. */
(function () {
  const form = document.getElementById("quiz-form");
  if (!form) return;

  const steps = Array.from(form.querySelectorAll(".quiz__step"));
  const dots = Array.from(document.querySelectorAll(".quiz__dot"));
  const barFill = document.getElementById("quiz-bar-fill");
  const countCurrent = document.getElementById("quiz-current");
  const prevBtn = document.getElementById("quiz-prev");
  const nextBtn = document.getElementById("quiz-next");
  const nextLabel = nextBtn?.querySelector("span:first-child");
  const error = document.getElementById("quiz-error");

  const TOTAL = steps.length;
  let current = 1;
  let maxReached = 1;

  // ---------- Lead da página 1 ----------
  form.elements.lead_id.value = new URLSearchParams(window.location.search).get("lead_id") || "";
  try {
    const lead = JSON.parse(localStorage.getItem("bf_lead") || "{}");
    form.elements.lead_id.value = lead.leadId || form.elements.lead_id.value;
    form.elements.lead_nome.value = lead.nome || "";
    form.elements.lead_email.value = lead.email || "";
    form.elements.lead_whatsapp.value = lead.whatsapp || "";
    form.elements.lead_vendas.value = lead.vendas || "";
  } catch (_) {}

  // ---------- Helpers ----------
  function stepEl(n) {
    return steps.find((s) => s.dataset.step === String(n));
  }

  function checkedInputs(step) {
    return Array.from(step.querySelectorAll("input:checked"));
  }

  function isStepValid(step) {
    const checked = checkedInputs(step);
    const min = parseInt(step.dataset.min || "1", 10);
    if (step.dataset.type === "radio") return checked.length >= 1;
    return checked.length >= min;
  }

  function refreshNav() {
    const step = stepEl(current);
    if (nextBtn) nextBtn.disabled = !isStepValid(step);
    if (prevBtn) prevBtn.hidden = current === 1;
    if (nextLabel) {
      nextLabel.textContent = current === TOTAL ? "Confirmar minha participação" : "Continuar";
    }
    if (error) error.textContent = "";
  }

  function render() {
    steps.forEach((s) => s.classList.toggle("is-active", s.dataset.step === String(current)));
    dots.forEach((dot) => {
      const n = parseInt(dot.dataset.goto, 10);
      dot.classList.toggle("is-current", n === current);
      dot.classList.toggle("is-done", n <= maxReached && n !== current);
      dot.disabled = n > maxReached;
    });
    if (barFill) barFill.style.transform = `scaleX(${current / TOTAL})`;
    if (countCurrent) countCurrent.textContent = String(current);
    refreshNav();
  }

  function goTo(n) {
    if (n < 1 || n > TOTAL || n > maxReached) return;
    current = n;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- Regras de checkboxes (exclusivas, "Outras", máx.) ----------
  form.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const step = input.closest(".quiz__step");
    if (!step) return;

    if (input.type === "checkbox") {
      const boxes = Array.from(step.querySelectorAll('input[type="checkbox"]'));
      const exclusive = boxes.find((b) => b.hasAttribute("data-exclusive"));

      if (input.hasAttribute("data-exclusive") && input.checked) {
        boxes.forEach((b) => {
          if (b !== input) b.checked = false;
        });
      } else if (exclusive && input.checked && !input.hasAttribute("data-exclusive")) {
        exclusive.checked = false;
      }

      // Limite máximo (ex.: pergunta 4 — até 2)
      const max = parseInt(step.dataset.max || "0", 10);
      if (max > 0) {
        const checked = boxes.filter((b) => b.checked);
        if (checked.length > max) {
          input.checked = false;
          if (error) error.textContent = `Escolha no máximo ${max} opções.`;
          return;
        }
      }

      // Campo "Outras/Outro"
      if (input.dataset.other) {
        const wrap = document.getElementById("wrap-" + input.dataset.other);
        const field = document.getElementById(input.dataset.other);
        if (wrap) wrap.hidden = !input.checked;
        if (!input.checked && field) field.value = "";
        if (input.checked && field) field.focus();
      }
    }

    refreshNav();
  });

  // ---------- Navegação ----------
  nextBtn?.addEventListener("click", async () => {
    const step = stepEl(current);
    if (!isStepValid(step)) {
      if (error) error.textContent = "Selecione ao menos uma resposta para continuar.";
      return;
    }

    if (current < TOTAL) {
      maxReached = Math.max(maxReached, current + 1);
      goTo(current + 1);
      return;
    }

    // Última etapa: enviar ao Netlify via AJAX
    nextBtn.setAttribute("aria-busy", "true");
    nextBtn.setAttribute("disabled", "");
    if (nextLabel) nextLabel.textContent = "Enviando...";

    try {
      form.elements.qualified_at.value = new Date().toISOString();
      const body = new URLSearchParams(new FormData(form)).toString();
      const resp = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!resp.ok) throw new Error("HTTP " + resp.status);

      try { localStorage.setItem("bf_quiz_done", new Date().toISOString()); } catch (_) {}
      window.location.assign("/obrigado.html");
    } catch (e) {
      if (error) error.textContent = "Não foi possível enviar. Verifique sua conexão e tente novamente.";
      nextBtn.removeAttribute("aria-busy");
      nextBtn.removeAttribute("disabled");
      if (nextLabel) nextLabel.textContent = "Confirmar minha participação";
    }
  });

  prevBtn?.addEventListener("click", () => goTo(current - 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => goTo(parseInt(dot.dataset.goto, 10)));
  });

  render();
})();
