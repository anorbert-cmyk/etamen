/* === reading-progress.js ===
   Drives the #reading-progress span width from 0%..100% as the page scrolls.
   Uses GSAP ScrollTrigger tied to document.body (page-level), not a section.
   Respects prefers-reduced-motion: reduce. */
(function(){
  if (!window.apokrif || typeof window.apokrif.register !== 'function') return;

  window.apokrif.register(function(){
    var host = document.getElementById('reading-progress');
    if (!host) return;
    var bar = host.querySelector('span');
    if (!bar) return;

    // Respect reduced-motion: hide the bar entirely (better than leaving a broken-looking 0% strip).
    var prefersReduced = false;
    try {
      prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) { prefersReduced = false; }
    if (prefersReduced) {
      host.style.display = 'none';
      return;
    }

    if (typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: function(self){
        bar.style.width = (self.progress * 100) + '%';
      }
    });
  });
})();
