const form = document.querySelector(".lead-form");
const phoneInput = document.querySelector("#whatsapp");
const ddiSelect = document.querySelector("#ddi");
const stickyCta = document.querySelector(".mobile-cta");
const offerSection = document.querySelector("#oferta");
const heroCta = document.querySelector(".button--primary");
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

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
  UTM_KEYS.forEach((key) => {
    const input = form.elements.namedItem(key);
    if (input instanceof HTMLInputElement) input.value = params.get(key) || "";
  });
}

function getFormUtms() {
  return Object.fromEntries(UTM_KEYS.map((key) => {
    const input = form?.elements.namedItem(key);
    return [key, input instanceof HTMLInputElement ? input.value : ""];
  }));
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
  const utms = getFormUtms();
  const qualificationParams = new URLSearchParams({ lead_id: leadId });
  UTM_KEYS.forEach((key) => {
    if (utms[key]) qualificationParams.set(key, utms[key]);
  });
  const qualificationUrl = `/qualificacao.html?${qualificationParams.toString()}`;
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
      leadId,
      utms
    }));
  } catch (_) {
    trackEvent("lead_storage_unavailable");
  }

  // Registra o lead sem permitir que uma falha do endpoint interrompa o fluxo.
  event.preventDefault();

  fetch(form.dataset.webhook || form.action, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(new FormData(form)).toString(),
    keepalive: true
  })
    .then((response) => {
      if (!response.ok) trackEvent("lead_form_delivery_failed", { status: response.status });
    })
    .catch(() => trackEvent("lead_form_delivery_failed", { status: "network_error" }));

  window.location.assign(qualificationUrl);
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
