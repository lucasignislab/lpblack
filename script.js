const form = document.querySelector(".lead-form");
const phoneInput = document.querySelector("#whatsapp");
const ddiSelect = document.querySelector("#ddi");
const stickyCta = document.querySelector(".mobile-cta");
const offerSection = document.querySelector("#oferta");
const heroCta = document.querySelector(".button--primary");

function trackEvent(name, details = {}) {
  const payload = { event: name, ...details };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("ratoeira:track", { detail: payload }));
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const isBrazil = () => !ddiSelect || ddiSelect.value === "+55";

function setUtmFields() {
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
    const input = form.elements.namedItem(key);
    if (input instanceof HTMLInputElement) input.value = params.get(key) || "";
  });
}

function createLeadId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => trackEvent("cta_click", { placement: element.dataset.track }));
});

phoneInput?.addEventListener("input", (event) => {
  event.target.value = isBrazil()
    ? formatPhone(event.target.value)
    : event.target.value.replace(/[^\d\s-]/g, "").slice(0, 17);
  event.target.removeAttribute("aria-invalid");
  const phoneError = document.querySelector("#whatsapp-error");
  if (phoneError) phoneError.textContent = "";
});

ddiSelect?.addEventListener("change", () => {
  if (!phoneInput) return;
  phoneInput.value = "";
  phoneInput.placeholder = isBrazil() ? "(00) 00000-0000" : "Número com código de área";
  phoneInput.focus();
});

form?.addEventListener("submit", (event) => {
  const message = form.querySelector(".form-message");
  const submit = form.querySelector("button[type='submit']");
  const digits = phoneInput?.value.replace(/\D/g, "") || "";
  const minDigits = isBrazil() ? 10 : 6;

  form.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
  message?.classList.remove("is-visible");

  if (!form.checkValidity() || digits.length < minDigits) {
    event.preventDefault();
    if (digits.length < minDigits && phoneInput) {
      phoneInput.setAttribute("aria-invalid", "true");
      const phoneError = document.querySelector("#whatsapp-error");
      if (phoneError) {
        phoneError.textContent = isBrazil()
          ? "Informe o DDD e um número válido."
          : "Informe um número válido com o código de área.";
      }
      phoneInput.focus();
    }
    if (message) {
      message.textContent = "Revise os campos destacados e tente novamente.";
      message.classList.add("is-visible");
    }
    form.reportValidity();
    return;
  }

  submit?.setAttribute("aria-busy", "true");
  submit?.setAttribute("disabled", "");
  const submitLabel = submit?.querySelector("span:first-child");
  if (submitLabel) submitLabel.textContent = "Enviando...";
  const vendas = form.elements.namedItem("vendas");
  const leadIdInput = form.elements.namedItem("lead_id");
  const leadId = createLeadId();
  if (leadIdInput instanceof HTMLInputElement) leadIdInput.value = leadId;
  const qualificationUrl = `/qualificacao.html?lead_id=${encodeURIComponent(leadId)}`;
  form.action = qualificationUrl;
  trackEvent("lead_form_submit", {
    vendas: vendas instanceof HTMLSelectElement ? vendas.value : "",
    ddi: ddiSelect?.value || "+55"
  });

  // Guarda o lead para associar às respostas da página de qualificação
  try {
    localStorage.setItem("bf_lead", JSON.stringify({
      nome: form.elements.namedItem("name")?.value || "",
      email: form.elements.namedItem("email")?.value || "",
      whatsapp: (ddiSelect?.value || "+55") + " " + (phoneInput?.value || ""),
      vendas: vendas instanceof HTMLSelectElement ? vendas.value : "",
      leadId
    }));
  } catch (_) {}

  // Envia ao Netlify via AJAX e redireciona para a página de qualificação
  event.preventDefault();

  // Garante que a página de qualificação já está no ar antes de navegar
  // (evita 404 se o CDN ainda estiver propagando o deploy)
  let attempts = 0;
  const goToQuiz = async () => {
    attempts += 1;
    try {
      const check = await fetch("/qualificacao.html?cb=" + Date.now(), {
        method: "HEAD",
        cache: "no-store"
      });
      if (check.ok) {
        window.location.assign(qualificationUrl);
        return;
      }
    } catch (_) {}
    if (attempts < 10) {
      setTimeout(goToQuiz, 2000);
    } else {
      // Última tentativa: navega mesmo assim
      window.location.assign(qualificationUrl);
    }
  };

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(new FormData(form)).toString()
  })
    .then((resp) => {
      if (!resp.ok && resp.type !== "opaque") throw new Error("HTTP " + resp.status);
      goToQuiz();
    })
    .catch(() => {
      // Fallback: tenta o envio nativo (o action também aponta para a qualificação)
      form.submit();
      setTimeout(goToQuiz, 1500);
    });
});

if (stickyCta && offerSection && heroCta) {
  const visibility = { hero: true, offer: false };
  const updateStickyCta = () => stickyCta.classList.toggle("is-hidden", visibility.hero || visibility.offer);
  const heroObserver = new IntersectionObserver(([entry]) => {
    visibility.hero = entry.isIntersecting;
    updateStickyCta();
  });
  const offerObserver = new IntersectionObserver(([entry]) => {
    visibility.offer = entry.isIntersecting;
    updateStickyCta();
  }, { threshold: 0.08 });
  heroObserver.observe(heroCta);
  offerObserver.observe(offerSection);
}

setUtmFields();
trackEvent("page_view", { page: "black_friday" });
