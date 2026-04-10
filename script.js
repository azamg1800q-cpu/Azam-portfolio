/**
 * GrowOnline — main script
 * Handles: smooth scroll, mobile nav, scroll animations, form UX, footer year
 * No build step required — open index.html in a browser or use Live Server
 */

(function () {
  "use strict";

  // --- Current year in footer (auto-updates) ---
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // --- Sticky header: subtle shadow when user scrolls ---
  var header = document.querySelector(".site-header");
  function updateHeaderShadow() {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();

  // --- Smooth scrolling for same-page anchor links ---
  // Uses native smooth scroll where supported; falls back to instant jump
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      var headerOffset = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 12;

      window.scrollTo({
        top: top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });

      // Close mobile menu after navigation
      closeMobileNav();
    });
  });

  // --- Mobile navigation toggle ---
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.getElementById("nav-menu");

  function closeMobileNav() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openMobileNav() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "true");
    navMenu.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close menu on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });

    // Close when resizing to desktop
    window.addEventListener(
      "resize",
      function () {
        if (window.innerWidth > 768) closeMobileNav();
      },
      { passive: true }
    );
  }

  // --- Scroll reveal: fade + slide-up on sections/cards (see .reveal in CSS) ---
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    // Stagger: cards appear one-by-one (data-delay × multiplier)
    var staggerMs = 120;

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = el.getAttribute("data-delay");
          var ms = delay !== null ? parseInt(delay, 10) * staggerMs : 0;
          if (isNaN(ms)) ms = 0;

          window.setTimeout(function () {
            el.classList.add("is-visible");
          }, ms);

          obs.unobserve(el);
        });
      },
      {
        root: null,
        // Trigger slightly before the element is fully in view (feels smoother)
        rootMargin: "0px 0px -5% 0px",
        threshold: 0.05,
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // No IntersectionObserver (very old browsers): show everything
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // --- Contact form: client-side only (no backend) ---
  var form = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");

  if (form && formStatus) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var message = form.querySelector("#message");

      if (!name || !email || !message) return;

      // Basic validation
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.className = "form-note";
        return;
      }

      // Simple email pattern check (not exhaustive)
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!emailOk) {
        formStatus.textContent = "Please enter a valid email address.";
        formStatus.className = "form-note";
        return;
      }

      // Success state - replace with fetch() to your API or Formspree when ready
      formStatus.textContent = "Thanks! We will be in touch soon. (Demo form - no backend connected yet.)";
      formStatus.className = "form-note success";
      form.reset();
    });
  }
})();
