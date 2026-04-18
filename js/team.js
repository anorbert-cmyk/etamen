/* === team.js — Scroll-linked backdrop crossfade + member entrance anims === */
window.apokrif.register(function() {
  var section = document.getElementById('team');
  if (!section) return;

  var layers = section.querySelectorAll('.team-bg-layer');
  if (!layers.length) return;

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  // Crossfade runs only on viewports tall enough for the 3-frame scroll to breathe.
  var isDesktop = window.matchMedia('(min-width:769px)').matches;

  if (!reduce && isDesktop && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Map scroll progress 1:1 to the section so crossfade boundaries align
    // with the three frames: [0 → 0.5] = frame1→frame2, [0.5 → 1] = frame2→frame3.
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: function(self) {
        var p = self.progress;
        var l1, l2, l3;
        if (p < 0.5) {
          var t = p / 0.5;
          l1 = 1 - t;
          l2 = t;
          l3 = 0;
        } else {
          var t2 = (p - 0.5) / 0.5;
          l1 = 0;
          l2 = 1 - t2;
          l3 = t2;
        }
        layers[0].style.opacity = l1.toFixed(3);
        if (layers[1]) layers[1].style.opacity = l2.toFixed(3);
        if (layers[2]) layers[2].style.opacity = l3.toFixed(3);
      }
    });

    // Per-frame entrance: art slides in from left, right column fades up
    gsap.utils.toArray('.team-frame').forEach(function(frame) {
      var art = frame.querySelector('.tf-art');
      var content = frame.querySelector('.tf-content');
      var trig = {trigger: frame, start: 'top 75%', once: true};

      if (art) gsap.from(art, {opacity: 0, x: -50, duration: 0.9, ease: 'power3.out', scrollTrigger: trig});
      if (content) gsap.from(content, {opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', scrollTrigger: trig, delay: 0.15});
    });
  }
});
