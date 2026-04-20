/* === team.js — per-person parallax + image-reveal (BASE-green) === */
window.apokrif.register(function() {
  var section = document.getElementById('team');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (reduce) {
    gsap.set('#team .team-card-pill', {opacity: 1, y: 0});
    gsap.set('#team .team-thumb img', {scale: 1, clearProps: 'transform'});
    return;
  }

  // Backdrop crossfade — always on (ambience, regardless of breakpoint)
  var layers = section.querySelectorAll('.team-bg-layer');
  if (layers.length === 3) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
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
      }
    });
  }

  var mm = gsap.matchMedia();

  // Desktop: full parallax + clip-path reveal
  mm.add('(min-width:769px)', function() {
    var thumbs = section.querySelectorAll('.team-thumb');
    thumbs.forEach(function(el, i) {
      // Initial clipped state
      gsap.set(el, {clipPath: 'inset(0 0 100% 0)'});

      // Reveal on enter
      gsap.to(el, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      });

      // Parallax drift
      var speeds = [-12, 14, -8];
      var speed = speeds[i % 3];
      gsap.to(el, {
        yPercent: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Inner image scale-down
      var img = el.querySelector('img');
      if (img) {
        gsap.fromTo(img,
          {scale: 1.15},
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8
            }
          }
        );
      }
    });

    // Pills fade-up per slide
    var slides = section.querySelectorAll('.team-slide');
    slides.forEach(function(slide) {
      var pill = slide.querySelector('.team-card-pill');
      if (pill) {
        gsap.to(pill, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: slide,
            start: 'top 60%',
            once: true
          }
        });
      }
    });

    // Hero art subtle parallax
    var heroArt = section.querySelector('.team-hero-art img');
    if (heroArt) {
      gsap.to(heroArt, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.team-intro-tile',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  });

  // Mobile: simplified fade-up, pills always visible
  mm.add('(max-width:768px)', function() {
    // Pills visible immediately
    gsap.set('#team .team-card-pill', {opacity: 1, y: 0, clearProps: 'transform'});

    // Reset image scale
    gsap.set('#team .team-thumb img', {scale: 1, clearProps: 'transform'});

    // Thumbs fade up on enter
    var thumbs = section.querySelectorAll('.team-thumb');
    thumbs.forEach(function(el) {
      gsap.set(el, {clipPath: 'none', opacity: 0, y: 20});
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: function() {
          gsap.to(el, {opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'});
        },
        once: true
      });
    });
  });
});
