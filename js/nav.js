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
    var endTrigger = (key === 'novel') ? '#novel3' : null;

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
      end: endTrigger ? 'bottom 40%' : 'bottom 40%',
      toggleClass: { targets: link, className: 'active' }
    });
  });

  // ── Smooth scroll on anchor click with dynamic offset ────────────────
  var mm = document.getElementById('mm');
  var hb = document.querySelector('.hb');

  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    var href = a.getAttribute('href');
    if (!href || href === '#') return; // skip bare "#" (Kickstarter placeholder)
    a.addEventListener('click', function(e) {
      e.preventDefault();
      var t;
      try { t = document.querySelector(href); } catch (ex) { return; }
      if (!t) return;
      var y = t.getBoundingClientRect().top + window.pageYOffset - scrollOffset();
      gsap.to(window, {
        scrollTo: { y: Math.max(0, y), autoKill: false },
        duration: 0.8,
        ease: 'power2.inOut'
      });
      if (mm) mm.classList.remove('open');
      if (hb) hb.classList.remove('active');
    });
  });

  // ── Mobile menu toggle ────────────────────────────────────────────────
  if (hb) hb.addEventListener('click', function() {
    this.classList.toggle('active');
    if (mm) mm.classList.toggle('open');
  });
});
