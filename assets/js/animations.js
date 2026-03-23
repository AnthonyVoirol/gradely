/**
 * Gradely — animations.js
 * Strictly visual entry animations. No logic, no state, no interactivity.
 */

(function () {
  "use strict";

  /* ── Staggered reveal on load ──────────────── */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay || 0;
            setTimeout(() => {
              el.classList.add("visible");
            }, Number(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => observer.observe(el));
  }

  /* ── Stagger children of .stagger-parent ───── */
  function initStagger() {
    const parents = document.querySelectorAll(".stagger-parent");
    parents.forEach((parent) => {
      const children = parent.querySelectorAll(":scope > *");
      children.forEach((child, i) => {
        child.classList.add("reveal");
        child.dataset.delay = i * 60;
      });
    });
  }

  /* ── Count-up animation for stat numbers ───── */
  function initCountUp() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const isDecimal = String(target).includes(".");
          const decimals = isDecimal ? 1 : 0;
          const duration = 900;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          let step = 0;

          const timer = setInterval(() => {
            step++;
            current = Math.min(current + increment, target);
            el.textContent = current.toFixed(decimals);
            if (step >= steps) {
              el.textContent = target.toFixed(decimals);
              clearInterval(timer);
            }
          }, duration / steps);

          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* ── Progress bar entrance animation ───────── */
  function initProgressBars() {
    const bars = document.querySelectorAll(".progress-fill");
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.dataset.width || "0%";
            bar.style.width = width;
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.2 }
    );

    bars.forEach((bar) => {
      bar.style.width = "0%";
      observer.observe(bar);
    });
  }

  /* ── Subtle nav scroll shrink ───────────────── */
  function initNavScroll() {
    const nav = document.querySelector(".landing-nav");
    if (!nav) return;
    window.addEventListener("scroll", () => {
      if (window.scrollY > 30) {
        nav.style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)";
      } else {
        nav.style.boxShadow = "none";
      }
    }, { passive: true });
  }

  /* ── Hero card float animation ──────────────── */
  function initHeroFloat() {
    const card = document.querySelector(".hero-visual");
    if (!card) return;
    let tick = 0;
    function animate() {
      tick += 0.012;
      const y = Math.sin(tick) * 6;
      card.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  /* ── Stat cards entrance ─────────────────────── */
  function initStatCards() {
    const cards = document.querySelectorAll(".stat-card, .card, .feature-card");
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    cards.forEach((card, i) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(18px)";
      card.style.transition = `opacity 0.45s ease ${i * 40}ms, transform 0.45s ease ${i * 40}ms`;
      observer.observe(card);
    });
  }

  /* ── Quiz option hover ripple ───────────────── */
  function initQuizRipple() {
    const options = document.querySelectorAll(".quiz-option");
    options.forEach((opt) => {
      opt.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.style.cssText = `
          position:absolute; border-radius:50%;
          background:rgba(0,0,0,0.08); pointer-events:none;
          width:60px; height:60px;
          left:${e.clientX - rect.left - 30}px;
          top:${e.clientY - rect.top - 30}px;
          transform:scale(0); transition:transform 0.4s ease, opacity 0.4s ease;
          opacity:1;
        `;
        this.style.position = "relative";
        this.style.overflow = "hidden";
        this.appendChild(ripple);
        requestAnimationFrame(() => {
          ripple.style.transform = "scale(4)";
          ripple.style.opacity = "0";
        });
        setTimeout(() => ripple.remove(), 500);
      });
    });
  }

  /* ── AI input auto-resize ───────────────────── */
  function initAIInput() {
    const textarea = document.querySelector(".ai-input");
    if (!textarea) return;
    textarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 160) + "px";
    });
  }

  /* ── Page fade-in ───────────────────────────── */
  function initPageFade() {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.3s ease";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.opacity = "1";
      });
    });
  }

  /* ── Init all ────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initPageFade();
    initStagger();
    initReveal();
    initCountUp();
    initProgressBars();
    initNavScroll();
    initHeroFloat();
    initStatCards();
    initQuizRipple();
    initAIInput();
  });
})();
