/* === gallery.js === */
window.apokrif.register(function() {
  // Community gallery dot click handler
  (function() {
    var dots = document.querySelectorAll('.gallery-dot');
    if (!dots.length) return;

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        dots.forEach(function(d) {
          d.classList.remove('active');
          d.setAttribute('aria-current', 'false');
        });
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      });
    });
  })();

  // Gallery Print Quality — clip-path reveal (desktop)
  (function() {
    var mm = gsap.matchMedia();
    mm.add('(min-width:769px)', function() {
      var gis = document.querySelectorAll('.gallery-section .gi');
      if (!gis.length) return;
      gsap.set(gis, {clipPath: 'inset(0 0 100% 0)'});
      gsap.set('.gallery-section .gi img', {scale: 1.12, transformOrigin: 'center center'});
      ScrollTrigger.batch(gis, {
        start: 'top 88%',
        onEnter: function(els) {
          gsap.to(els, {clipPath: 'inset(0 0 0% 0)', duration: 1.65, ease: 'power3.inOut', stagger: .25});
          gsap.to(Array.from(els).map(function(el) {return el.querySelector('img');}),
            {scale: 1, duration: 1.65, ease: 'power3.inOut', stagger: .25});
        },
        once: true
      });
    });
    mm.add('(max-width:768px)', function() {
      document.querySelectorAll('.gallery-section .gi').forEach(function(el) {
        el.style.clipPath = '';
        var img = el.querySelector('img');
        if (img) img.style.transform = '';
      });
    });
  })();
});
