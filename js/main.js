/* ============================================
   SeedShelter — Main JavaScript (Earth Edition)
   ============================================ */

(function () {
  'use strict';

  // ---- Config ----
  const WAITLIST_ENDPOINT = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

  // ---- Scroll Animations ----
  function initScrollAnimations() {
    const targets = document.querySelectorAll('.fade-in');
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((el) => observer.observe(el));
  }

  // ---- Field Guide Toggle ----
  function initFieldGuides() {
    document.querySelectorAll('.field-guide-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const panel = btn.nextElementSibling;
        const isOpen = btn.classList.contains('open');
        btn.classList.toggle('open');
        panel.classList.toggle('open');
        btn.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  // ---- Waitlist Form ----
  function initWaitlistForm() {
    const form = document.getElementById('waitlist-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const messageEl = document.getElementById('form-message');
      const email = emailInput.value.trim();
      if (!email) return;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      messageEl.textContent = '';
      messageEl.className = 'form-message';

      try {
        if (WAITLIST_ENDPOINT === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
          await new Promise((r) => setTimeout(r, 800));
          messageEl.textContent = "✓ You're on the list! We'll email you when Batch #001 drops.";
          messageEl.classList.add('success');
          emailInput.value = '';
        } else {
          await fetch(WAITLIST_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            mode: 'no-cors',
          });
          messageEl.textContent = "✓ You're on the list! We'll email you when Batch #001 drops.";
          messageEl.classList.add('success');
          emailInput.value = '';
        }
      } catch (err) {
        messageEl.textContent = 'Something went wrong. Please try again.';
        messageEl.classList.add('error');
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });
  }

  // ---- Organic Seed/Leaf Particles ----
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    const earthColors = ['#6b8f5e', '#537a45', '#8db87a', '#c4a35a', '#c4723a'];

    function createParticle() {
      const type = Math.random();
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: Math.random() * 4 + 1.5,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.25 + 0.05,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.5,
        color: earthColors[Math.floor(Math.random() * earthColors.length)],
        isLeaf: type > 0.6,
      };
    }

    function drawLeaf(ctx, p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      // Simple leaf shape
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.2);
      ctx.bezierCurveTo(p.size, -p.size * 0.6, p.size, p.size * 0.6, 0, p.size * 1.2);
      ctx.bezierCurveTo(-p.size, p.size * 0.6, -p.size, -p.size * 0.6, 0, -p.size * 1.2);
      ctx.fill();
      ctx.restore();
    }

    function drawSeed(ctx, p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.025 && particles.length < 35) {
        particles.push(createParticle());
      }
      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;
        if (p.isLeaf) drawLeaf(ctx, p);
        else drawSeed(ctx, p);
        if (p.y < -15) particles.splice(i, 1);
      });
      requestAnimationFrame(draw);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resize();
      window.addEventListener('resize', resize);
      draw();
    }
  }

  // ---- Smooth Scroll (nav-aware) ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navH = document.getElementById('site-nav')?.offsetHeight || 60;
          const y = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top: y, behavior: 'smooth' });

          // Close mobile menu if open
          const links = document.getElementById('nav-links');
          const toggle = document.getElementById('nav-toggle');
          if (links && links.classList.contains('open')) {
            links.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }
        }
      });
    });
  }

  // ---- Table Sorting ----
  function initTableSorting() {
    const table = document.getElementById('seed-table');
    if (!table) return;

    const headers = table.querySelectorAll('th[data-sort]');
    let currentSort = { column: -1, asc: true };

    headers.forEach((header, index) => {
      header.addEventListener('click', () => {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        // Reset other headers
        headers.forEach(h => h.textContent = h.textContent.replace(/[↑↓]/, '↕'));

        // Determine sort direction
        let isAsc = (currentSort.column === index) ? !currentSort.asc : true;
        currentSort = { column: index, asc: isAsc };

        // Update header icon
        header.textContent = header.textContent.replace('↕', isAsc ? '↑' : '↓');

        // Sort rows
        rows.sort((a, b) => {
          let aVal = a.cells[index].textContent.trim();
          let bVal = b.cells[index].textContent.trim();

          // Handle numeric sorting for Cal/lb and Days
          if (index === 2 || index === 3) {
            aVal = parseFloat(aVal.replace(/[^0-9.-]+/g, '')) || 0;
            bVal = parseFloat(bVal.replace(/[^0-9.-]+/g, '')) || 0;
            return isAsc ? aVal - bVal : bVal - aVal;
          }

          return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });

        // Re-append rows
        rows.forEach(row => tbody.appendChild(row));
      });
    });
  }

  // ---- Sticky Nav ----
  function initStickyNav() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    let lastY = 0;
    const heroH = document.querySelector('.hero')?.offsetHeight || 600;

    function onScroll() {
      const y = window.scrollY;

      if (y < 80) {
        nav.classList.add('at-top');
        nav.classList.remove('visible');
      } else if (y < heroH * 0.5) {
        nav.classList.remove('at-top');
        nav.classList.add('visible');
      } else {
        nav.classList.remove('at-top');
        // Show on scroll up, hide on scroll down
        if (y < lastY || y < 200) {
          nav.classList.add('visible');
        } else {
          nav.classList.remove('visible');
        }
      }
      lastY = y;
    }

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = nav.querySelectorAll('.nav-links a[href^="#"]');

    function updateActive() {
      const navH = nav.offsetHeight + 20;
      let current = '';
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - navH - 100) {
          current = sec.getAttribute('id');
        }
      });
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }

    window.addEventListener('scroll', () => { onScroll(); updateActive(); }, { passive: true });
    onScroll();
    updateActive();
  }

  // ---- Mobile Hamburger ----
  function initHamburger() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initFieldGuides();
    initWaitlistForm();
    initParticles();
    initSmoothScroll();
    initTableSorting();
    initStickyNav();
    initHamburger();
  });
})();

