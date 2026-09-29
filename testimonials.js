(function () {
  const marquees = Array.from(document.querySelectorAll(".testimonial-marquee"));
  if (!marquees.length) return;

  const frameIds = new Map();
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const pixelsPerSecond = isMobile ? 34 : 28;
    const minimumDuration = isMobile ? 32 : 40;
    track.style.setProperty("--testimonial-shift", `${-shift}px`);
    track.style.setProperty("--testimonial-duration", `${Math.max(minimumDuration, shift / pixelsPerSecond)}s`);
    marquee.classList.add("is-ready");
  }

  function scheduleRebuild(marquee) {
    window.cancelAnimationFrame(frameIds.get(marquee));
    frameIds.set(marquee, window.requestAnimationFrame(() => rebuildTrack(marquee)));
  }

  function getTrackAnimation(track) {
    return track.getAnimations().find((animation) => animation.animationName === "testimonial-marquee");
  }

  function moveAnimation(animation, marquee, distance) {
    if (!animation) return;

    const track = animation.effect?.target;
    const shift = Math.abs(Number.parseFloat(getComputedStyle(track).getPropertyValue("--testimonial-shift")));
    const duration = Number(animation.effect?.getTiming().duration);
    if (!shift || !duration) return;

    const direction = marquee.classList.contains("testimonial-marquee--portrait") ? 1 : -1;
    const currentTime = Number(animation.currentTime) || 0;
    const nextTime = currentTime + (direction * distance * duration) / shift;
    animation.currentTime = ((nextTime % duration) + duration) % duration;
  }

  function enableTouchDrag(marquee) {
    const track = marquee.querySelector(".testimonial-track");
    if (!track) return;

    let pointerId = null;
    let startX = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let moved = false;
    let blockClicksUntil = 0;
    let inertiaFrame = 0;

    function resume(animation) {
      if (!reducedMotionQuery.matches) animation.play();
    }

    function finishDrag(event, cancelled = false) {
      if (event.pointerId !== pointerId) return;

      const animation = getTrackAnimation(track);
      pointerId = null;
      marquee.classList.remove("is-dragging");

      if (marquee.hasPointerCapture(event.pointerId)) {
        marquee.releasePointerCapture(event.pointerId);
      }

      if (!animation) return;
      if (!moved || cancelled || reducedMotionQuery.matches) {
        resume(animation);
        return;
      }

      blockClicksUntil = performance.now() + 450;
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

      let previousTime = performance.now();
      function applyInertia(now) {
        const elapsed = Math.min(now - previousTime, 32);
        previousTime = now;
        moveAnimation(animation, marquee, velocity * elapsed);
        velocity *= Math.pow(0.9, elapsed / 16);

        if (Math.abs(velocity) > 0.02) {
          inertiaFrame = window.requestAnimationFrame(applyInertia);
        } else {
          resume(animation);
        }
      }

      inertiaFrame = window.requestAnimationFrame(applyInertia);
    }

    marquee.addEventListener("pointerdown", (event) => {
      if (!mobileQuery.matches || event.pointerType === "mouse") return;

      const animation = getTrackAnimation(track);
      if (!animation) return;

      window.cancelAnimationFrame(inertiaFrame);
      animation.pause();
      pointerId = event.pointerId;
      startX = event.clientX;
      lastX = event.clientX;
      lastTime = performance.now();
      velocity = 0;
      moved = false;
      marquee.classList.add("is-dragging");
      marquee.setPointerCapture(event.pointerId);
    });

    marquee.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;

      const now = performance.now();
      const distance = event.clientX - lastX;
      const elapsed = Math.max(now - lastTime, 1);
      moved ||= Math.abs(event.clientX - startX) > 6;
      if (moved) event.preventDefault();

      moveAnimation(getTrackAnimation(track), marquee, distance);
      velocity = velocity * 0.65 + (distance / elapsed) * 0.35;
      lastX = event.clientX;
      lastTime = now;
    });

    marquee.addEventListener("pointerup", (event) => finishDrag(event));
    marquee.addEventListener("pointercancel", (event) => finishDrag(event, true));
    marquee.addEventListener("click", (event) => {
      if (performance.now() >= blockClicksUntil) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);
  }

  marquees.forEach((marquee) => {
    scheduleRebuild(marquee);
    enableTouchDrag(marquee);
  });
  window.addEventListener("resize", () => marquees.forEach(scheduleRebuild), { passive: true });
})();
