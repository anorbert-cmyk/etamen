/* === timeline.js === */
window.apokrif.register(function() {
  // Timeline — vertical crossfade / horizontal scrub pin
  (function() {
    var section = document.getElementById('timeline');
    if (!section) return;
    var track = section.querySelector('.timeline-track');
    var fill = section.querySelector('.progress-fill');
    var dot = section.querySelector('.progress-dot');
    if (!track) return;

    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

    gsap.matchMedia().add('(min-width:768px)', function() {
      var scrollDist = function() {return track.scrollWidth - window.innerWidth;};

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: function() {return '+=' + scrollDist();},
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      });
      tl.to(track, {x: function() {return -scrollDist();}, ease: 'none'});

      if (fill) {
        gsap.to(fill, {
          width: '100%', ease: 'none',
          scrollTrigger: {
            trigger: section, scrub: 1,
            start: 'top top',
            end: function() {return '+=' + scrollDist();}
          }
        });
      }

      if (dot) {
        gsap.to(dot, {
          left: '100%', ease: 'none',
          scrollTrigger: {
            trigger: section, scrub: 1,
            start: 'top top',
            end: function() {return '+=' + scrollDist();}
          }
        });
      }
    });
  })();
});
