/* === et-tamen.js === */
window.apokrif.register(function() {
  // Et Tamen comic slider
  var track = document.getElementById('sTrack');
  if (!track) return; // guard: bail if slider not in DOM
  var slides = track.querySelectorAll('.slide');
  var dotsC = document.getElementById('sDots');
  var cur = 0;
  var total = slides.length;

  // Build dots
  for (var i = 0; i < total; i++) {
    var d = document.createElement('button');
    d.className = 'slide-dot' + (i === 0 ? ' active' : '');
    d.dataset.i = i;
    d.setAttribute('type', 'button');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    d.addEventListener('click', function() {goTo(parseInt(this.dataset.i, 10))});
    dotsC.appendChild(d);
  }
  var allDots = dotsC.querySelectorAll('.slide-dot'); // cache once after building

  function goTo(n) {
    cur = ((n % total) + total) % total; // wrap around consistently
    track.style.transform = 'translateX(-' + (cur * 100) + '%)';
    allDots.forEach(function(d, i) {
      d.classList.toggle('active', i === cur);
      d.setAttribute('aria-current', i === cur ? 'true' : 'false');
    });
  }

  document.getElementById('sPrev').addEventListener('click', function() {etStopAuto(); goTo(cur - 1); etStartAuto()});
  document.getElementById('sNext').addEventListener('click', function() {etStopAuto(); goTo(cur + 1); etStartAuto()});

  // Auto-play (safe start/stop prevents interval stacking)
  var etAutoIv = null;
  function etStartAuto() {clearInterval(etAutoIv); etAutoIv = setInterval(function() {goTo(cur + 1)}, 6000)}
  function etStopAuto() {clearInterval(etAutoIv); etAutoIv = null}
  etStartAuto();

  // Touch swipe
  var sx = 0;
  var frame = document.getElementById('sFrame');
  frame.addEventListener('touchstart', function(e) {sx = e.touches[0].clientX; etStopAuto()}, {passive: true});
  frame.addEventListener('touchend', function(e) {
    var dx = sx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) {dx > 0 ? goTo(cur + 1) : goTo(cur - 1)}
    etStartAuto();
  }, {passive: true});

  // Pause on hover (desktop)
  frame.addEventListener('mouseenter', function() {etStopAuto()});
  frame.addEventListener('mouseleave', function() {etStartAuto()});

  // Register slider for centralized visibilitychange handling
  window.apokrif.registerSlider(etStopAuto, etStartAuto);

  // Build bottom chevrons (14 decorative triangles)
  (function() {var c = document.getElementById('etChevs'); if (c) {for (var j = 0; j < 14; j++) {var s = document.createElement('span'); c.appendChild(s)}}})();

  // Et Tamen entrance anims
  gsap.from('.et-title-img', {opacity: 0, y: 30, duration: .6, scrollTrigger: {trigger: '#et', start: 'top 70%', toggleActions: 'play none none reverse'}});
  gsap.from('.et-ep0-img', {opacity: 0, duration: .4, delay: .15, scrollTrigger: {trigger: '#et', start: 'top 70%', toggleActions: 'play none none reverse'}});
  gsap.from('.et-body', {opacity: 0, y: 15, duration: .5, delay: .25, scrollTrigger: {trigger: '#et', start: 'top 65%', toggleActions: 'play none none reverse'}});
  gsap.from('.et-cta', {opacity: 0, duration: .4, delay: .35, scrollTrigger: {trigger: '#et', start: 'top 65%', toggleActions: 'play none none reverse'}});
  gsap.from('.slider-frame', {x: 80, opacity: 0, duration: .7, ease: 'power2.out', scrollTrigger: {trigger: '#et', start: 'top 60%', toggleActions: 'play none none reverse'}});

  // Et Tamen — Slide images scroll-reveal (clip-path + scale)
  (function() {
    var slideImgs = document.querySelectorAll('#sTrack .slide img');
    if (slideImgs.length) {
      gsap.set(slideImgs, {clipPath: 'inset(100% 0 0 0)', scale: 1.12, transformOrigin: 'center center'});
      ScrollTrigger.create({
        trigger: '#et',
        start: 'top 55%',
        once: true,
        onEnter: function() {
          gsap.to(slideImgs, {
            clipPath: 'inset(0% 0 0 0)',
            scale: 1,
            duration: 1.4,
            ease: 'power3.inOut',
            stagger: 0.15
          });
        }
      });
    }
  })();

  // Et Tamen — Brand-green glow on hover (GSAP)
  (function() {
    var slideImgs = document.querySelectorAll('#sTrack .slide img');
    slideImgs.forEach(function(img) {
      img.addEventListener('mouseenter', function() {
        gsap.to(img, {
          boxShadow: '0 0 30px rgba(168,216,48,0.6), 0 0 60px rgba(168,216,48,0.3)',
          scale: 1.03,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      img.addEventListener('mouseleave', function() {
        gsap.to(img, {
          boxShadow: '0 0 0px rgba(168,216,48,0)',
          scale: 1,
          duration: 0.35,
          ease: 'power2.inOut'
        });
      });
    });
  })();
});
