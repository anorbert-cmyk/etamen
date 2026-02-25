/* === hero.js === */
window.apokrif.register(function() {
  // Entrance anims
  gsap.from('.navbar', {y: -50, duration: .5, ease: 'power2.out', delay: .3});
  gsap.from('.heading-405', {opacity: 0, y: 40, duration: .8, ease: 'power3.out', delay: .5});
  gsap.from('.kickstarter-button', {opacity: 0, x: -30, duration: .5, delay: .9});
  gsap.from('.hero-bottom-div', {opacity: 0, y: 20, duration: .6, delay: 1.1});

  // Hero background — Ken Burns + scroll parallax
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    // Entrance: lassú zoom-in homályból
    gsap.from(heroBg, {scale: 1.14, opacity: 0.55, duration: 2.8, ease: 'power3.out'});
    // Ken Burns légzés — ismétlődő lassú pan+zoom (entrance után indul)
    gsap.to(heroBg, {
      scale: 1.07, x: '-1.8%', y: '-0.8%',
      duration: 16, ease: 'sine.inOut',
      repeat: -1, yoyo: true, delay: 2.8
    });
    // Scroll parallax — a háttér lassan felfelé csúszik görgetéskor
    gsap.to(heroBg, {
      y: '18%', ease: 'none',
      scrollTrigger: {trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5}
    });
  }
});
