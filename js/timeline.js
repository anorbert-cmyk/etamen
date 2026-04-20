/* === timeline.js === */
window.apokrif.register(function() {
  // Timeline — horizontal scrub pin (9 slides, 900vw track)
  // Progress bar lives OUTSIDE .timeline-track, as a direct child of #timeline.
  // It stays anchored to the pinned viewport (left:10vw/right:10vw/bottom:8vh)
  // and does NOT translate with the track. Only .progress-fill width and
  // .progress-dot.moving left animate 0→100% via GSAP, scrubbed to the same
  // ScrollTrigger window that drives the track translate.
  (function() {
    var section = document.getElementById('timeline');
    if (!section) return;
    var track = section.querySelector('.timeline-track');
    var fill = section.querySelector('.progress-fill');
    var dot = section.querySelector('.progress-dot.moving');
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
