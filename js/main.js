/* === main.js === */
(function() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.gsap-hidden').forEach(function(el) {
      el.style.opacity = '1';
    });
    return;
  }
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  window.apokrif._inits.forEach(function(fn) { fn(); });
})();
