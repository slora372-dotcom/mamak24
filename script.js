(function () {
  const S = window.SITE;
  const $ = (id) => document.getElementById(id);

  // ---------- Carousel ----------
  const track = $("carouselTrack");
  const dots = $("carouselDots");
  const count = track.children.length;
  dots.innerHTML = Array.from({ length: count }, (_, i) => `<button aria-label="Slide ${i + 1}"></button>`).join("");
  let slide = 0;
  const goTo = (i) => {
    slide = (i + count) % count;
    track.scrollTo({ left: slide * track.clientWidth, behavior: "smooth" });
  };
  const syncDots = () => {
    slide = Math.round(track.scrollLeft / track.clientWidth);
    [...dots.children].forEach((d, i) => d.classList.toggle("active", i === slide));
  };
  [...dots.children].forEach((d, i) => d.addEventListener("click", () => goTo(i)));
  track.addEventListener("scroll", syncDots, { passive: true });
  syncDots();
  // The first banner stays for 8s, then they rotate every 4s.
  let timer = setTimeout(() => {
    goTo(slide + 1);
    timer = setInterval(() => goTo(slide + 1), 4000);
  }, 8000);
  track.addEventListener("pointerdown", () => { clearTimeout(timer); clearInterval(timer); }, { once: true });

  // ---------- Game categories (side menu) ----------
  const tabs = [...document.querySelectorAll(".cat")];
  const tiles = [...document.querySelectorAll(".prov-grid .prov")];
  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => { const on = x === t; x.classList.toggle("on", on); x.setAttribute("aria-selected", String(on)); });
    tiles.forEach((g) => (g.hidden = g.dataset.cat !== t.dataset.cat));
  }));

  // ---------- Referral ----------
  const copyLink = () =>
    navigator.clipboard.writeText(S.referralUrl).then(() => toast("Link referral disalin"), () => toast(S.referralUrl));
  $("copyBtn").addEventListener("click", copyLink);
  $("shareBtn").addEventListener("click", () => {
    if (navigator.share) navigator.share({ title: S.brand.name, url: S.referralUrl }).catch(() => {});
    else copyLink();
  });

  // ---------- Floating badges ----------
  document.querySelectorAll("[data-close]").forEach((b) =>
    b.addEventListener("click", () => { $(b.dataset.close).hidden = true; })
  );

  // ---------- Links ----------
  document.querySelectorAll("[data-link]").forEach((el) => {
    el.href = S.links[el.dataset.link] || "#";
  });

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }
})();
