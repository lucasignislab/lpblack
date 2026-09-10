const form = document.querySelector(".lead-form");
const phoneInput = document.querySelector("#whatsapp");
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

function setUtmFields() {
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
    const input = form.elements.namedItem(key);
    if (input instanceof HTMLInputElement) input.value = params.get(key) || "";
  });
}

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => trackEvent("cta_click", { placement: element.dataset.track }));
});

phoneInput?.addEventListener("input", (event) => {
  event.target.value = formatPhone(event.target.value);
  event.target.removeAttribute("aria-invalid");
  const phoneError = document.querySelector("#whatsapp-error");
  if (phoneError) phoneError.textContent = "";
});

form?.addEventListener("submit", (event) => {
  const message = form.querySelector(".form-message");
  const submit = form.querySelector("button[type='submit']");
  const digits = phoneInput?.value.replace(/\D/g, "") || "";

  form.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
  message?.classList.remove("is-visible");

  if (!form.checkValidity() || digits.length < 10) {
    event.preventDefault();
    if (digits.length < 10 && phoneInput) {
      phoneInput.setAttribute("aria-invalid", "true");
      const phoneError = document.querySelector("#whatsapp-error");
      if (phoneError) phoneError.textContent = "Informe o DDD e um número válido.";
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
  const product = form.elements.namedItem("product");
  trackEvent("lead_form_submit", { product: product instanceof HTMLSelectElement ? product.value : "" });
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
