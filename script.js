/**
 * Birthday site — vanilla JS
 * Edit LETTER_TEXT, GATE_PASSWORD, and SESSION_KEY as needed. Surprise copy is in index.html (#surprisePanel).
 */

const LETTER_TEXT = `Hey Gauri,

Happy birthday. I hope your day feels as soft and bright as you make ordinary moments feel.

Thank you for your laugh, your patience, and the way you make the world a little kinder just by being in it.

This is placeholder text — replace everything above with your own words. Read it out loud once; if it sounds like you, it's perfect.

Forever cheering for you. ❤️`;

/** Password for the front gate (change this) */
const GATE_PASSWORD = "Besties";

const GATE_ERROR = "Hmm… that's not it 🥺 try again";

/** Remember unlock for this browser tab session (value must match GATE_PASSWORD) */
const SESSION_KEY = "gb_site_unlocked";

/**
 * Auto-unlock only if sessionStorage matches the *current* password.
 * Clears legacy "1" and any old password so changing GATE_PASSWORD in code takes effect.
 */
function syncGateFromSession() {
  try {
    let stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "1") {
      sessionStorage.removeItem(SESSION_KEY);
      stored = null;
    }
    if (stored && stored !== GATE_PASSWORD) {
      sessionStorage.removeItem(SESSION_KEY);
      return;
    }
    if (stored === GATE_PASSWORD) {
      document.documentElement.classList.add("gate-unlocked");
      document.body.classList.add("gate-unlocked");
      const g = document.getElementById("gate");
      if (g) g.classList.add("gate--instant");
    }
  } catch (e) {
    /* private mode / quota */
  }
}

(function () {
  "use strict";

  syncGateFromSession();

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isNarrow = window.matchMedia("(max-width: 40rem)").matches;

  let siteInitialized = false;

  /* --- Password gate --- */
  function initGate(onUnlock) {
    const gate = document.getElementById("gate");
    const form = document.getElementById("gateForm");
    const input = document.getElementById("gateInput");
    const err = document.getElementById("gateError");
    const main = document.getElementById("main");

    if (!gate || !form || !input) {
      onUnlock();
      return;
    }

    if (document.body.classList.contains("gate-unlocked")) {
      gate.setAttribute("aria-hidden", "true");
      if (main) main.removeAttribute("aria-hidden");
      onUnlock();
      return;
    }

    if (main) main.setAttribute("aria-hidden", "true");

    seedGateFloat(document.getElementById("gateFloat"));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = (input.value || "").trim();
      if (val === GATE_PASSWORD) {
        if (err) {
          err.hidden = true;
          err.textContent = "";
        }
        try {
          sessionStorage.setItem(SESSION_KEY, GATE_PASSWORD);
        } catch (ignore) {
          /* ignore quota / private mode */
        }
        document.body.classList.add("gate-unlocked");
        gate.classList.remove("gate--instant");
        gate.classList.add("gate--hidden");
        gate.setAttribute("aria-hidden", "true");
        if (main) main.removeAttribute("aria-hidden");
        input.blur();
        window.setTimeout(onUnlock, 50);
      } else {
        if (err) {
          err.textContent = GATE_ERROR;
          err.hidden = false;
        }
        input.focus();
      }
    });
  }

  function seedGateFloat(container) {
    if (!container || prefersReducedMotion) return;
    const symbols = ["❀", "✿", "♥", "💗", "🌸", "❤", "·"];
    const n = 18;
    for (let i = 0; i < n; i += 1) {
      const span = document.createElement("span");
      span.textContent = symbols[i % symbols.length];
      span.style.left = `${5 + (i * 17) % 90}%`;
      span.style.top = `${8 + (i * 13) % 75}%`;
      span.style.animationDelay = `${(i % 7) * 0.6}s`;
      span.style.animationDuration = `${10 + (i % 5)}s`;
      container.appendChild(span);
    }
  }

  /* --- Landing fade-in --- */
  function initLanding() {
    requestAnimationFrame(() => {
      document.body.classList.add("is-loaded");
    });
  }

  /* --- Scroll reveal --- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    if (prefersReducedMotion) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    els.forEach((el) => io.observe(el));
  }

  /* --- Gallery modal --- */
  function initModal() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const gallery = document.getElementById("gallery");
    if (!modal || !modalImg || !gallery) return;

    function openModal(src, alt) {
      modalImg.src = src;
      modalImg.alt = alt || "";
      modal.hidden = false;
      document.body.classList.add("modal-open");
    }

    function closeModal() {
      modal.hidden = true;
      modalImg.removeAttribute("src");
      modalImg.alt = "";
      document.body.classList.remove("modal-open");
    }

    gallery.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-modal-open]");
      if (!btn) return;
      const src = btn.getAttribute("data-src");
      const alt = btn.getAttribute("data-alt") || "";
      if (src) openModal(src, alt);
    });

    modal.addEventListener("click", (e) => {
      if (e.target.closest("[data-modal-close]")) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  /* --- Typewriter letter --- */
  function initLetter() {
    const box = document.getElementById("letterBox");
    const el = document.getElementById("letterText");
    if (!box || !el) return;

    if (prefersReducedMotion) {
      el.textContent = LETTER_TEXT;
      return;
    }

    box.classList.add("letter--typing");
    const chars = Array.from(LETTER_TEXT);
    let i = 0;
    const speed = 28;

    function tick() {
      if (i >= chars.length) {
        box.classList.remove("letter--typing");
        return;
      }
      el.textContent += chars[i];
      i += 1;
      window.setTimeout(tick, speed);
    }

    const letterSection = document.getElementById("letter");
    if (!letterSection) {
      tick();
      return;
    }

    const startTyping = () => {
      if (el.textContent.length > 0) return;
      tick();
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTyping();
            io.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    io.observe(letterSection);
  }

  /* --- Background music --- */
  function initMusic() {
    const audio = document.getElementById("bg-music");
    const btn = document.getElementById("musicToggle");
    if (!audio || !btn) return;

    function setPlaying(playing) {
      btn.classList.toggle("music-fab--playing", playing);
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        playing ? "Pause background music" : "Play background music"
      );
      const label = btn.querySelector(".music-fab__label");
      if (label) label.textContent = playing ? "Pause" : "Music";
    }

    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => setPlaying(true)).catch(() => {
          setPlaying(false);
        });
      } else {
        audio.pause();
        setPlaying(false);
      }
    });

    audio.addEventListener("ended", () => setPlaying(false));

    audio.addEventListener("error", () => {
      btn.disabled = true;
      btn.title = "Add audio/birthday.mp3 to enable music";
      setPlaying(false);
    });
  }

  /* --- Floating hearts (finale section) --- */
  function initHearts() {
    if (prefersReducedMotion) return;

    const container = document.getElementById("heartsContainer");
    if (!container) return;

    const count = isNarrow ? 8 : 14;
    const symbols = ["❤", "♥", "💕"];

    for (let n = 0; n < count; n += 1) {
      const span = document.createElement("span");
      span.textContent = symbols[n % symbols.length];
      span.style.left = `${8 + ((n * 7) % 84)}%`;
      span.style.animationDuration = `${12 + (n % 5) * 2}s`;
      span.style.animationDelay = `${n * 0.7}s`;
      container.appendChild(span);
    }
  }

  /* --- Ambient floating particles (site-wide) --- */
  function initAmbientParticles() {
    if (prefersReducedMotion) return;

    const root = document.getElementById("ambientParticles");
    if (!root) return;

    const symbols = ["❀", "✿", "♥", "·", "🌸", "💗"];
    const count = isCoarsePointer || isNarrow ? 14 : 28;

    for (let i = 0; i < count; i += 1) {
      const span = document.createElement("span");
      span.textContent = symbols[i % symbols.length];
      span.style.left = `${(i * 37) % 100}%`;
      span.style.animationDuration = `${18 + (i % 9) * 2}s`;
      span.style.animationDelay = `${(i % 12) * 0.8}s`;
      root.appendChild(span);
    }
  }

  /* --- Subtle section parallax --- */
  function initParallax() {
    if (prefersReducedMotion || isNarrow) return;

    const sections = document.querySelectorAll("[data-parallax]");
    if (!sections.length) return;

    let ticking = false;

    function update() {
      ticking = false;
      const vh = window.innerHeight;
      sections.forEach((section) => {
        const speed = parseFloat(section.dataset.parallax) || 0;
        const rect = section.getBoundingClientRect();
        const centerDist = rect.top + rect.height / 2 - vh / 2;
        const y = centerDist * speed * -0.12;
        section.style.setProperty("--parallax-y", `${y}px`);
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  /* --- Click burst: tiny floating hearts --- */
  function initClickHearts() {
    if (prefersReducedMotion || isCoarsePointer) return;

    document.addEventListener(
      "click",
      (e) => {
        if (!document.body.classList.contains("gate-unlocked")) return;
        const modalEl = document.getElementById("imageModal");
        if (modalEl && !modalEl.hidden && modalEl.contains(e.target)) return;

        const hearts = ["💕", "✨", "♥", "💖"];
        const el = document.createElement("span");
        el.className = "click-heart";
        el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(el);
        window.setTimeout(() => el.remove(), 900);
      },
      false
    );
  }

  /* --- Surprise panel --- */
  function initSurprise() {
    const btn = document.getElementById("surpriseBtn");
    const panel = document.getElementById("surprisePanel");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const open = panel.hasAttribute("hidden");
      if (open) {
        panel.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
      } else {
        panel.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
      }
    });

  }

  /* --- Occasional sparkles --- */
  function initSparkles() {
    if (prefersReducedMotion) return;

    const layer = document.getElementById("sparkleLayer");
    if (!layer) return;

    function spawn() {
      if (!document.body.classList.contains("gate-unlocked")) return;
      const s = document.createElement("i");
      s.textContent = "✦";
      s.style.left = `${10 + Math.random() * 80}%`;
      s.style.top = `${15 + Math.random() * 55}%`;
      s.style.color = "rgba(255, 200, 230, 0.85)";
      layer.appendChild(s);
      window.setTimeout(() => s.remove(), 2200);
    }

    window.setInterval(spawn, 4800);
    spawn();
  }

  function initSite() {
    if (siteInitialized) return;
    siteInitialized = true;

    initLanding();
    initReveal();
    initModal();
    initLetter();
    initMusic();
    initHearts();
    initAmbientParticles();
    initParallax();
    initClickHearts();
    initSurprise();
    initSparkles();
  }

  function boot() {
    initGate(initSite);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
