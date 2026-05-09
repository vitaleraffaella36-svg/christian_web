/* ═══════════════════════════════════════
   CHRISTIAN CHIACCHIO – script.js
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── SCROLL: nav shadow ── */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 24) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE BURGER ── */
  var burger = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    // Animate burger → X
    var spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      var spans = burger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  /* ── SCROLL REVEAL ── */
  var reveals = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navH = nav ? nav.offsetHeight : 68;
      var top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── CONTACT FORM ── */
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(input, show) {
    var group = input.closest('.form-group');
    if (show) {
      group.classList.add('has-error');
      input.classList.add('error');
    } else {
      group.classList.remove('has-error');
      input.classList.remove('error');
    }
  }

  // Live validation on blur
  form.querySelectorAll('input[required], textarea[required]').forEach(function (el) {
    el.addEventListener('blur', function () {
      if (el.type === 'email') {
        setError(el, !validateEmail(el.value.trim()));
      } else {
        setError(el, el.value.trim() === '');
      }
    });
    el.addEventListener('input', function () {
      if (el.classList.contains('error')) {
        if (el.type === 'email') {
          setError(el, !validateEmail(el.value.trim()));
        } else {
          setError(el, el.value.trim() === '');
        }
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nome = form.querySelector('#nome');
    var email = form.querySelector('#email');
    var messaggio = form.querySelector('#messaggio');
    var btnText = form.querySelector('.btn__text');
    var btnLoading = form.querySelector('.btn__loading');

    var valid = true;

    if (nome.value.trim() === '') { setError(nome, true); valid = false; }
    else { setError(nome, false); }

    if (!validateEmail(email.value.trim())) { setError(email, true); valid = false; }
    else { setError(email, false); }

    if (messaggio.value.trim() === '') { setError(messaggio, true); valid = false; }
    else { setError(messaggio, false); }

    if (!valid) return;

    // Simulate submission
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    form.querySelector('button[type="submit"]').disabled = true;

    setTimeout(function () {
      btnText.style.display = '';
      btnLoading.style.display = 'none';
      form.querySelector('button[type="submit"]').disabled = false;
      formSuccess.style.display = 'flex';
      form.reset();
      // scroll to success message
      var top = formSuccess.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }, 1400);
  });

  /* ── TWEAKS PANEL ── */
  var TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accentColor": "oklch(52% 0.20 252)",
    "heroTitle": "Soluzioni complete per la sicurezza sul lavoro",
    "ctaText": "Richiedi una consulenza",
    "darkNav": false
  }/*EDITMODE-END*/;

  var tweakState = Object.assign({}, TWEAK_DEFAULTS);
  var tweakPanel = null;
  var tweakVisible = false;

  function applyTweaks(state) {
    // Accent color
    if (state.accentColor) {
      document.documentElement.style.setProperty('--blue', state.accentColor);
    }
    // Hero title
    var heroTitle = document.querySelector('.hero__title');
    if (heroTitle && state.heroTitle) {
      var parts = state.heroTitle.split(' ');
      var last = parts.pop();
      heroTitle.innerHTML = parts.join(' ') + '<br /><em>' + last + '</em>';
    }
    // CTA text
    document.querySelectorAll('.hero__actions .btn--primary').forEach(function (btn) {
      if (state.ctaText) btn.textContent = state.ctaText;
    });
    // Dark nav
    if (state.darkNav) {
      nav.style.background = 'oklch(22% 0.07 252)';
      nav.querySelectorAll('a, .nav__logo-name').forEach(function (el) {
        el.style.color = '#fff';
      });
    } else {
      nav.style.background = '';
      nav.querySelectorAll('a, .nav__logo-name').forEach(function (el) {
        el.style.color = '';
      });
    }
  }

  function buildTweakPanel() {
    tweakPanel = document.createElement('div');
    tweakPanel.id = 'tweakPanel';
    tweakPanel.style.cssText = [
      'position:fixed', 'bottom:96px', 'right:28px',
      'width:280px', 'background:#fff',
      'border:1px solid oklch(88% 0.015 252)',
      'border-radius:14px',
      'box-shadow:0 12px 40px oklch(20% 0.07 252 / 0.18)',
      'padding:20px', 'z-index:2000',
      'font-family:DM Sans,sans-serif',
      'font-size:13px', 'color:oklch(20% 0.03 252)',
      'display:none'
    ].join(';');

    tweakPanel.innerHTML = [
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">',
        '<strong style="font-size:14px;font-family:Syne,sans-serif">Tweaks</strong>',
        '<button id="tweakClose" style="background:none;border:none;cursor:pointer;font-size:18px;line-height:1;color:oklch(60% 0.02 252)">&#215;</button>',
      '</div>',
      '<label style="display:block;margin-bottom:8px;font-weight:600;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:oklch(55% 0.04 252)">Colore principale</label>',
      '<div style="display:flex;gap:8px;margin-bottom:18px">',
        '<div class="t-swatch" data-color="oklch(52% 0.20 252)" title="Blu" style="width:28px;height:28px;border-radius:50%;background:oklch(52% 0.20 252);cursor:pointer;outline:2px solid oklch(52% 0.20 252);outline-offset:2px"></div>',
        '<div class="t-swatch" data-color="oklch(50% 0.20 160)" title="Verde" style="width:28px;height:28px;border-radius:50%;background:oklch(50% 0.20 160);cursor:pointer"></div>',
        '<div class="t-swatch" data-color="oklch(50% 0.20 290)" title="Viola" style="width:28px;height:28px;border-radius:50%;background:oklch(50% 0.20 290);cursor:pointer"></div>',
        '<div class="t-swatch" data-color="oklch(48% 0.18 30)" title="Rosso scuro" style="width:28px;height:28px;border-radius:50%;background:oklch(48% 0.18 30);cursor:pointer"></div>',
      '</div>',
      '<label style="display:block;margin-bottom:6px;font-weight:600;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:oklch(55% 0.04 252)">Testo hero</label>',
      '<input id="tweakHeroTitle" type="text" value="' + tweakState.heroTitle + '"',
        'style="width:100%;padding:8px 10px;border:1.5px solid oklch(88% 0.015 252);border-radius:7px;font-size:12px;font-family:inherit;outline:none;margin-bottom:16px">',
      '<label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:4px;font-weight:500">',
        '<input id="tweakDarkNav" type="checkbox"' + (tweakState.darkNav ? ' checked' : '') + ' style="accent-color:var(--blue)">',
        'Navbar scura',
      '</label>'
    ].join('');

    document.body.appendChild(tweakPanel);

    // Swatch click
    tweakPanel.querySelectorAll('.t-swatch').forEach(function (sw) {
      sw.addEventListener('click', function () {
        tweakPanel.querySelectorAll('.t-swatch').forEach(function (s) {
          s.style.outlineColor = 'transparent';
          s.style.outline = 'none';
        });
        sw.style.outline = '2px solid ' + sw.dataset.color;
        sw.style.outlineOffset = '2px';
        tweakState.accentColor = sw.dataset.color;
        applyTweaks(tweakState);
        postEdits({ accentColor: tweakState.accentColor });
      });
    });

    // Hero title input
    document.getElementById('tweakHeroTitle').addEventListener('input', function () {
      tweakState.heroTitle = this.value;
      applyTweaks(tweakState);
      postEdits({ heroTitle: tweakState.heroTitle });
    });

    // Dark nav toggle
    document.getElementById('tweakDarkNav').addEventListener('change', function () {
      tweakState.darkNav = this.checked;
      applyTweaks(tweakState);
      postEdits({ darkNav: tweakState.darkNav });
    });

    // Close button
    document.getElementById('tweakClose').addEventListener('click', function () {
      tweakPanel.style.display = 'none';
      tweakVisible = false;
    });
  }

  function postEdits(edits) {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: edits }, '*');
  }

  // Listen for host messages
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === '__activate_edit_mode') {
      if (!tweakPanel) buildTweakPanel();
      tweakVisible = true;
      tweakPanel.style.display = 'block';
    }
    if (e.data && e.data.type === '__deactivate_edit_mode') {
      if (tweakPanel) tweakPanel.style.display = 'none';
      tweakVisible = false;
    }
  });

  window.parent.postMessage({ type: '__edit_mode_available' }, '*');

})();
