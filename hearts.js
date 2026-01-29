(() => {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReducedMotion) return;

  const HEART = "💗";
  const MAX = 24;
  const hearts = new Set();

  function spawnHeart() {
    if (hearts.size >= MAX) return;

    const el = document.createElement("div");
    el.className = "heart";
    el.textContent = HEART;

    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 30;
    const size = 18 + Math.random() * 22;
    const drift = (Math.random() - 0.5) * 140;
    const duration = 4500 + Math.random() * 2500;

    el.style.fontSize = `${size}px`;
    el.style.transform = `translate(${startX}px, ${startY}px)`;
    document.body.appendChild(el);
    hearts.add(el);

    const start = performance.now();
    function tick(now) {
      const t = (now - start) / duration; // 0..1
      if (t >= 1) {
        cleanup();
        return;
      }
      const y = startY - t * (window.innerHeight + 200);
      const x = startX + drift * Math.sin(t * Math.PI);
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.opacity = String(1 - t);
      requestAnimationFrame(tick);
    }

    function cleanup() {
      hearts.delete(el);
      el.remove();
    }

    requestAnimationFrame(tick);
  }

  setInterval(spawnHeart, 220);
})();
