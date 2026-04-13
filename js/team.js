/* === team.js === */
window.apokrif.register(function() {
  // Team section entrance animations
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  gsap.from('.team-heading', {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#team',
      start: 'top 75%',
      once: true
    }
  });

  ScrollTrigger.batch('.team-card', {
    start: 'top 85%',
    onEnter: function(els) {
      gsap.from(els, {
        opacity: 0,
        y: 50,
        scale: 0.97,
        duration: 0.85,
        stagger: 0.18,
        ease: 'power2.out'
      });
    },
    once: true
  });

  // Subtle background parallax
  gsap.to('.team-bg', {
    y: '12%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#team',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  });
});
