(function () {
  const marquees = Array.from(document.querySelectorAll(".testimonial-marquee"));
  if (!marquees.length) return;

  const frameIds = new Map();

  function createClone(sourceSet) {
    const clone = sourceSet.cloneNode(true);
    clone.dataset.testimonialClone = "true";
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a").forEach((link) => link.setAttribute("tabindex", "-1"));
    return clone;
  }

  function rebuildTrack(marquee) {
    const track = marquee.querySelector(".testimonial-track");
    const sourceSet = track?.querySelector(".testimonial-set:not([data-testimonial-clone])");
    if (!track || !sourceSet) return;

    marquee.classList.remove("is-ready");
    track.querySelectorAll("[data-testimonial-clone]").forEach((clone) => clone.remove());

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const setWidth = sourceSet.getBoundingClientRect().width;
    if (!setWidth) return;

    const repeatCount = Math.ceil(marquee.clientWidth / (setWidth + gap)) + 2;
    for (let index = 1; index < repeatCount; index += 1) {
      track.appendChild(createClone(sourceSet));
    }

    const shift = setWidth + gap;
    track.style.setProperty("--testimonial-shift", `${-shift}px`);
    track.style.setProperty("--testimonial-duration", `${Math.max(40, shift / 28)}s`);
    marquee.classList.add("is-ready");
  }

  function scheduleRebuild(marquee) {
    window.cancelAnimationFrame(frameIds.get(marquee));
    frameIds.set(marquee, window.requestAnimationFrame(() => rebuildTrack(marquee)));
  }

  marquees.forEach(scheduleRebuild);
  window.addEventListener("resize", () => marquees.forEach(scheduleRebuild), { passive: true });
})();
