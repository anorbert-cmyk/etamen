/* === team.js — Green scroll-linked backdrop with crossfading layers === */
window.apokrif.register(function() {
  var section = document.getElementById('team');
  if (!section) return;

  var layers = section.querySelectorAll('.team-bg-layer');
  if (!layers.length) return;

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  // Skip the crossfade on small viewports — panels compress so progress finishes
  // in a couple hundred pixels and the effect has no room to breathe.
  var isDesktop = window.matchMedia('(min-width:769px)').matches;

  if (!reduce && isDesktop && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Map scroll progress 1:1 to the section so crossfade boundaries line up
    // with the three panels: [0 → 0.5] = panel 1→2, [0.5 → 1] = panel 2→3.
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

    // Member entrance animations — name slides up, photo reveals, bio fades in
    gsap.matchMedia().add('(min-width:769px)', function() {
      gsap.utils.toArray('.panel-member').forEach(function(panel) {
        var name = panel.querySelector('.member-name');
        var banner = panel.querySelector('.member-role-banner');
        var photo = panel.querySelector('.member-photo');
        var bio = panel.querySelector('.member-bio');
        var work = panel.querySelector('.member-work');

        var trig = {trigger: panel, start: 'top 70%', once: true};

        if (banner) gsap.from(banner, {opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', scrollTrigger: trig});
        if (name) gsap.from(name, {opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', scrollTrigger: trig, delay: 0.1});
        if (photo) gsap.from(photo, {opacity: 0, x: -40, duration: 0.9, ease: 'power3.out', scrollTrigger: trig, delay: 0.25});
        if (bio) gsap.from(bio, {opacity: 0, y: 30, duration: 0.85, ease: 'power2.out', scrollTrigger: trig, delay: 0.35});
        if (work) gsap.from(work, {opacity: 0, y: 30, duration: 0.85, ease: 'power2.out', scrollTrigger: trig, delay: 0.5});
      });

      var intro = document.querySelector('.team-intro');
      if (intro) {
        gsap.from(intro, {
          opacity: 0, y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: {trigger: '.panel-intro', start: 'top 75%', once: true}
        });
      }
    });
  }
});
