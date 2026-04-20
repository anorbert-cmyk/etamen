/* === nav.js === */
window.apokrif.register(function() {
  var navEl = document.querySelector('.navbar');

  // Resolve scroll offset dynamically: nav height + reading-progress strip height.
  function scrollOffset() {
    var navH = navEl ? navEl.getBoundingClientRect().height : 60;
    return Math.max(0, navH + 4);
  }

  // ── Active-tab indicator via ScrollTrigger.toggleClass ─────────────────
  // Each tab lights up its ::after underline while the matching section
  // spans the viewport mid-band.
  var tabMap = {
    'et': '#et',
    'novel': '#novel',
    'factions': '#factions',
    'timeline': '#timeline',
    'team': '#team'
  };
  Object.keys(tabMap).forEach(function(key) {
    var link = document.querySelector('.nav-link.tab-link[data-s="' + key + '"]');
    var target = document.querySelector(tabMap[key]);
    if (!link || !target) return;

    // 'novel' spans 3 consecutive sections — end on #novel3 instead of #novel.
    var endTrigger = (key === 'novel') ? document.querySelector('#novel3') : null;

    // 'timeline' uses pin-distance = track scrollWidth - viewport.
    if (key === 'timeline') {
      ScrollTrigger.create({
        trigger: '#timeline',
        start: 'top 40%',
        end: function() {
          var track = document.querySelector('.timeline-track');
          return '+=' + Math.max(0, track ? track.scrollWidth - window.innerWidth : 0);
        },
        invalidateOnRefresh: true,
        toggleClass: { targets: link, className: 'active' }
      });
      return;
    }

    ScrollTrigger.create({
      trigger: target,
      endTrigger: endTrigger || target,
      start: 'top 40%',
      end: 'bottom 40%',
      toggleClass: { targets: link, className: 'active' }
    });
  });

  // ── Mobile menu helpers ──────────────────────────────────────────────
  var mm = document.getElementById('mm');
  var hb = document.querySelector('.hb');

  // Initial ARIA wiring (idempotent — safe if attributes already present).
  if (hb) {
    hb.setAttribute('aria-expanded', 'false');
    if (mm && mm.id && !hb.getAttribute('aria-controls')) hb.setAttribute('aria-controls', mm.id);
    if (!hb.getAttribute('type')) hb.setAttribute('type', 'button');
  }
  if (mm) {
    mm.setAttribute('role', 'dialog');
    mm.setAttribute('aria-modal', 'false'); // non-modal overlay
    mm.setAttribute('aria-hidden', 'true');
  }

  function openMenu() {
    if (!mm || !hb) return;
    mm.classList.add('open');
    hb.classList.add('active');
    hb.setAttribute('aria-expanded', 'true');
    mm.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mm-open');
  }

  function closeMenu() {
    if (!mm || !hb) return;
    mm.classList.remove('open');
    hb.classList.remove('active');
    hb.setAttribute('aria-expanded', 'false');
    mm.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mm-open');
  }

  // ── Smooth scroll on anchor click with dynamic offset ────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    var href = a.getAttribute('href');
    if (!href || href === '#') return; // skip bare "#" (Kickstarter placeholder)
    a.addEventListener('click', function(e) {
      e.preventDefault();
      var t;
      try { t = document.querySelector(href); } catch (ex) { return; }
      if (!t) return;
      // Close menu BEFORE measuring, so the offset reflects the collapsed nav height.
      closeMenu();
      var y = t.getBoundingClientRect().top + window.pageYOffset - scrollOffset();
      gsap.to(window, {
        scrollTo: { y: Math.max(0, y), autoKill: true },
        duration: 0.8,
        ease: 'power2.inOut'
      });
    });
  });

  // ── Mobile menu toggle ────────────────────────────────────────────────
  if (hb) hb.addEventListener('click', function(e) {
    e.stopPropagation();
    if (mm && mm.classList.contains('open')) closeMenu();
    else openMenu();
  });

  // Close on ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mm && mm.classList.contains('open')) closeMenu();
  });

  // Close on outside click (tap outside menu + hamburger)
  document.addEventListener('click', function(e) {
    if (!mm || !mm.classList.contains('open')) return;
    var t = e.target;
    if (mm.contains(t) || (hb && hb.contains(t))) return;
    closeMenu();
  });

  // Close if viewport grows past the mobile breakpoint while menu is open.
  var mqDesktop = window.matchMedia('(min-width: 1025px)');
  var onMqChange = function(ev) { if (ev.matches) closeMenu(); };
  if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', onMqChange);
  else if (mqDesktop.addListener) mqDesktop.addListener(onMqChange); // legacy Safari
});
