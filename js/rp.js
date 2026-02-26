/* === rp.js === */
window.apokrif.register(function() {
  // #rp BASE SCROLL ANIMATION
  (function() {
    var mm = gsap.matchMedia();

    mm.add('(min-width:769px)', function() {
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#rp .rp-master', start: 'top bottom', end: 'bottom bottom', scrub: 0.5
        }
      });
      tl.to('#rp .rp-card._1', {opacity: 1, duration: 0.5, ease: 'power1.in'}, 0)
        .to('#rp .rp-card._1 .rp-card-label', {opacity: 1, y: '0px', duration: 0.4}, 0.1)
        .to('#rp .rp-card._1 .rp-card-label', {opacity: 0, y: '-10px', duration: 0.4}, 3)
        .to('#rp .rp-card._1', {opacity: 0, duration: 0.3}, 3)
        .to('#rp .rp-card._2', {opacity: 1, duration: 0.5}, 3.2)
        .to('#rp .rp-card._2 .rp-card-label', {opacity: 1, y: '0px', duration: 0.4}, 3.5)
        .to('#rp .rp-card._2 .rp-card-label', {opacity: 0, y: '-10px', duration: 0.4}, 6.5)
        .to('#rp .rp-card._2', {opacity: 0, duration: 0.3}, 6.5)
        .to('#rp .rp-card._3', {opacity: 1, duration: 0.5}, 6.7)
        .to('#rp .rp-card._3 .rp-card-label', {opacity: 1, y: '0px', duration: 0.4}, 7)
        .to('#rp .rp-card._3 .rp-card-label', {opacity: 0, y: '-10px', duration: 0.4}, 9.5)
        .to('#rp .rp-card._3', {opacity: 0, duration: 0.3}, 9.5)
        .to('#rp .rp-card._4', {opacity: 1, duration: 0.5}, 9.7)
        .to('#rp .rp-card._4 .rp-card-label', {opacity: 1, y: '0px', duration: 0.4}, 10)
        .to('#rp .rp-card._4 .rp-card-label', {opacity: 0, duration: 0.4}, 13)
        .to('#rp .rp-card._4', {opacity: 0, duration: 0.3}, 14);

      // rp-bsi entrance reveal — clip-path bottom-up
      gsap.set('#rp .rp-bsi', {clipPath: 'inset(0 0 100% 0)', scale: 1.08});
      ScrollTrigger.batch('#rp .rp-bsi', {
        start: 'top 88%',
        onEnter: function(els) {
          gsap.to(els, {clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.4, ease: 'power3.inOut', stagger: 0.18});
        },
        once: true
      });

      document.querySelectorAll('#rp .rp-bsi').forEach(function(el, i) {
        var speed = (i % 3 === 0) ? -15 : (i % 3 === 1) ? 10 : -8;
        gsap.to(el, {yPercent: speed, ease: 'none',
          scrollTrigger: {trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1}});
      });
    });

    mm.add('(max-width:768px)', function() {
      document.querySelectorAll('#rp .rp-bsi').forEach(function(el) {el.style.clipPath = ''; el.style.transform = '';});
      document.querySelectorAll('#rp .rp-card').forEach(function(card) {
        gsap.set(card, {opacity: 1, y: 0, clearProps: 'all'});
      });
      document.querySelectorAll('#rp .rp-card-label').forEach(function(lbl) {
        gsap.set(lbl, {opacity: 1, y: 0, clearProps: 'all'});
      });
      document.querySelectorAll('#rp .rp-bsi').forEach(function(el) {
        gsap.set(el, {opacity: 0, y: 18});
        ScrollTrigger.create({
          trigger: el, start: 'top 92%',
          onEnter: function() {gsap.to(el, {opacity: 1, y: 0, duration: 0.55, ease: 'power2.out'});},
          once: true
        });
      });
    });
  })();
});
