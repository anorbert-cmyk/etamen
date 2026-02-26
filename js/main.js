/* === main.js === */
(function() {
  if (typeof gsap === 'undefined') {
    // Reveal any gsap-hidden elements
    document.querySelectorAll('.gsap-hidden').forEach(function(el) {
      el.style.opacity = '1';
    });
    // Fallback smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var href = a.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        try { var t = document.querySelector(href); if (t) t.scrollIntoView({behavior: 'smooth'}); } catch(ex) {}
      });
    });
    // Fallback hamburger toggle
    var hbFallback = document.querySelector('.hb');
    if (hbFallback) hbFallback.addEventListener('click', function() {
      this.classList.toggle('active');
      var mmFb = document.getElementById('mm'); if (mmFb) mmFb.classList.toggle('open');
    });
    // Collapse horizontal timeline track to prevent 300vw page overflow
    var track = document.querySelector('.timeline-track');
    if (track) { track.style.cssText = 'display:flex;flex-direction:column;width:100%;transform:none;'; }
    console.warn('GSAP not loaded — animations disabled, basic navigation active.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  window.apokrif._inits.forEach(function(fn) { fn(); });
})();
