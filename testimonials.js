(function () {
  const marquee = document.querySelector(".testimonial-marquee");
  const track = marquee?.querySelector(".testimonial-track");
  const sourceSet = track?.querySelector(".testimonial-set");
  if (!marquee || !track || !sourceSet) return;

  const clone = sourceSet.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  track.appendChild(clone);
  marquee.classList.add("is-ready");
})();
