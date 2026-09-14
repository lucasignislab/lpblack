/* Wizard de qualificação — Black Friday Ratoeira
   Uma pergunta por vez, sem reload; respostas enviadas ao webhook ao final. */
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
  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  function inputField(name) {
    const field = form.elements.namedItem(name);
    return field instanceof HTMLInputElement ? field : null;
  }

  const TOTAL = steps.length;
  let current = 1;
  let maxReached = 1;

  const params = new URLSearchParams(window.location.search);
  const leadIdFromUrl = params.get("lead_id") || "";
  const leadIdField = inputField("lead_id");
  if (leadIdField) leadIdField.value = leadIdFromUrl;
  let lead = {};
  try {
    const storedLead = JSON.parse(localStorage.getItem("bf_lead") || "{}");
    if (storedLead && typeof storedLead === "object") lead = storedLead;
  } catch (_) {
    lead = {};
  }
  const matchesLead = Boolean(lead.leadId) && (!leadIdFromUrl || lead.leadId === leadIdFromUrl);
  if (matchesLead) {
    if (leadIdField) leadIdField.value = leadIdFromUrl || lead.leadId;
    const leadFields = {
      lead_nome: lead.nome,
      lead_email: lead.email,
      lead_whatsapp: lead.whatsapp,
      lead_vendas: lead.vendas,
    };
    Object.entries(leadFields).forEach(([name, value]) => {
      const field = inputField(name);
      if (field) field.value = value || "";
    });
  }
  UTM_KEYS.forEach((key) => {
    const field = inputField(key);
    if (field) field.value = params.get(key) || (matchesLead ? lead.utms?.[key] || "" : "");
  });

  function nextPageUrl(path) {
    const nextParams = new URLSearchParams();
    if (leadIdField?.value) nextParams.set("lead_id", leadIdField.value);
    UTM_KEYS.forEach((key) => {
      const value = inputField(key)?.value;
      if (value) nextParams.set(key, value);
    });
    const query = nextParams.toString();
    return query ? `${path}?${query}` : path;
  }

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

  nextBtn?.addEventListener("click", () => {
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

    // Última etapa: enviar ao webhook via AJAX
    nextBtn.setAttribute("aria-busy", "true");
    nextBtn.setAttribute("disabled", "");
    if (nextLabel) nextLabel.textContent = "Enviando...";

    const qualifiedAtField = inputField("qualified_at");
    if (qualifiedAtField) qualifiedAtField.value = new Date().toISOString();
    const body = new URLSearchParams(new FormData(form)).toString();
    try {
      localStorage.setItem("bf_quiz_done", new Date().toISOString());
      localStorage.setItem("bf_quiz_pending", body);
    } catch (_) {
      window.dispatchEvent(new CustomEvent("ratoeira:qualification_storage_failed"));
    }

    fetch(form.dataset.webhook || form.action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      keepalive: true,
    }).then((response) => {
      if (response.ok) {
        try {
          localStorage.removeItem("bf_quiz_pending");
        } catch (_) {
          window.dispatchEvent(new CustomEvent("ratoeira:qualification_storage_failed"));
        }
      }
    }).catch(() => {
      window.dispatchEvent(new CustomEvent("ratoeira:qualification_delivery_failed"));
    });

    window.location.assign(nextPageUrl("/obrigado.html"));
  });

  prevBtn?.addEventListener("click", () => goTo(current - 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => goTo(parseInt(dot.dataset.goto, 10)));
  });

  render();
})();
