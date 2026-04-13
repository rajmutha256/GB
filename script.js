/**
 * EDIT: letter shown with typewriter effect (use \n for line breaks)
 */
const LETTER_TEXT = `My love,

Happy birthday. I hope your day feels as soft and bright as you make ordinary moments feel.

Thank you for your laugh, your patience, and the way you make the world a little kinder just by being in it.

This is placeholder text — replace everything above with your own words. Read it out loud once; if it sounds like you, it's perfect.

Forever cheering for you. ❤️`;

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* --- Floating hearts (finale) --- */
  function initHearts() {
    if (prefersReducedMotion) return;

    const container = document.getElementById("heartsContainer");
    if (!container) return;

    const count = 14;
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

  function init() {
    initLanding();
    initReveal();
    initModal();
    initLetter();
    initMusic();
    initHearts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
