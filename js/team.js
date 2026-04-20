/* === team.js — Green BASE-style scroll animation with backdrop crossfade === */
window.apokrif.register(function() {
  var section = document.getElementById('team');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (reduce) return;

  var mm = gsap.matchMedia();

  mm.add('(min-width:769px)', function() {
    // Sticky card cycle through Aron → Conor, synced to scroll
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#team .team-master',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 0.5,
      }
    });
    tl.to('#team .team-card._1', {opacity: 1, duration: 0.5, ease: 'power1.in'}, 0)
      .to('#team .team-card._1 .team-card-pill', {opacity: 1, y: '0px', duration: 0.4}, 0.1)
      .to('#team .team-card._1 .team-card-pill', {opacity: 0, y: '-10px', duration: 0.4}, 4)
      .to('#team .team-card._1', {opacity: 0, duration: 0.3}, 4)
      .to('#team .team-card._2', {opacity: 1, duration: 0.5}, 4.2)
      .to('#team .team-card._2 .team-card-pill', {opacity: 1, y: '0px', duration: 0.4}, 4.5)
      .to('#team .team-card._2 .team-card-pill', {opacity: 0, y: '-10px', duration: 0.4}, 8)
      .to('#team .team-card._2', {opacity: 0, duration: 0.3}, 8.3);

    // Image entrance — clip-path bottom-up reveal
    gsap.set('#team .team-img', {clipPath: 'inset(0 0 100% 0)', scale: 1.08});
    ScrollTrigger.batch('#team .team-img', {
      start: 'top 88%',
      onEnter: function(els) {
        gsap.to(els, {clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.4, ease: 'power3.inOut', stagger: 0.18});
      },
      once: true,
    });

    // Parallax drift on team images
    document.querySelectorAll('#team .team-img').forEach(function(el, i) {
      var speed = (i % 3 === 0) ? -15 : (i % 3 === 1) ? 10 : -8;
      gsap.to(el, {
        yPercent: speed, ease: 'none',
        scrollTrigger: {trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1},
      });
    });

    // Backdrop crossfade: map section scroll 1:1 so layer transitions align
    var layers = section.querySelectorAll('.team-bg-layer');
    if (layers.length === 3) {
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
            l1 = 1 - t; l2 = t; l3 = 0;
          } else {
            var t2 = (p - 0.5) / 0.5;
            l1 = 0; l2 = 1 - t2; l3 = t2;
          }
          layers[0].style.opacity = l1.toFixed(3);
          layers[1].style.opacity = l2.toFixed(3);
          layers[2].style.opacity = l3.toFixed(3);
        },
      });
    }
  });

  mm.add('(max-width:768px)', function() {
    // Mobile: cards always visible, images fade up as they enter
    document.querySelectorAll('#team .team-img').forEach(function(el) {
      el.style.clipPath = ''; el.style.transform = '';
    });
    document.querySelectorAll('#team .team-card').forEach(function(card) {
      gsap.set(card, {opacity: 1, y: 0, clearProps: 'all'});
    });
    document.querySelectorAll('#team .team-card-pill').forEach(function(pill) {
      gsap.set(pill, {opacity: 1, y: 0, clearProps: 'all'});
    });
    document.querySelectorAll('#team .team-img').forEach(function(el) {
      gsap.set(el, {opacity: 0, y: 18});
      ScrollTrigger.create({
        trigger: el, start: 'top 92%',
        onEnter: function() {gsap.to(el, {opacity: 1, y: 0, duration: 0.55, ease: 'power2.out'});},
        once: true,
      });
    });
  });
});
