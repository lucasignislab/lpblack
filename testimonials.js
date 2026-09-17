(function () {
  const marquee = document.querySelector(".testimonial-marquee");
  const track = marquee?.querySelector(".testimonial-track");
  const sourceSet = track?.querySelector(".testimonial-set");
  if (!marquee || !track || !sourceSet) return;

  let frameId;

  function createClone() {
    const clone = sourceSet.cloneNode(true);
    clone.dataset.testimonialClone = "true";
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a").forEach((link) => link.setAttribute("tabindex", "-1"));
    return clone;
  }

  function rebuildTrack() {
    marquee.classList.remove("is-ready");
    track.querySelectorAll("[data-testimonial-clone]").forEach((clone) => clone.remove());

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const setWidth = sourceSet.getBoundingClientRect().width;
    if (!setWidth) return;

    const repeatCount = Math.ceil(marquee.clientWidth / (setWidth + gap)) + 2;
    for (let index = 1; index < repeatCount; index += 1) {
      track.appendChild(createClone());
    }

    track.style.setProperty("--testimonial-shift", `${-(setWidth + gap)}px`);
    marquee.classList.add("is-ready");
  }

  function scheduleRebuild() {
    window.cancelAnimationFrame(frameId);
    frameId = window.requestAnimationFrame(rebuildTrack);
  }

  scheduleRebuild();
  window.addEventListener("resize", scheduleRebuild, { passive: true });
})();
