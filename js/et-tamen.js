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

  // IntersectionObserver: pause autoplay when section is off-screen
  (function() {
    var etSection = document.getElementById('et');
    if (etSection && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) etStartAuto();
          else etStopAuto();
        });
      }, {threshold: 0.2});
      io.observe(etSection);
    }
  })();

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

  // Et Tamen — Lightbox (full-size responsive viewer)
  (function() {
    var lb = document.getElementById('etLightbox');
    var img = document.getElementById('etLbImg');
    var counter = document.getElementById('etLbCounter');
    var closeBtn = document.getElementById('etLbClose');
    var prevBtn = document.getElementById('etLbPrev');
    var nextBtn = document.getElementById('etLbNext');
    if (!lb || !img) return;

    var slideImgs = track.querySelectorAll('.slide img');
    var lbIndex = 0;
    var lbTotal = slideImgs.length;
    var lastFocused = null;

    function setLbIndex(i) {
      lbIndex = ((i % lbTotal) + lbTotal) % lbTotal;
      var src = slideImgs[lbIndex].getAttribute('src');
      var alt = slideImgs[lbIndex].getAttribute('alt') || '';
      img.setAttribute('src', src);
      img.setAttribute('alt', alt);
      if (counter) counter.textContent = (lbIndex + 1) + ' / ' + lbTotal;
    }

    // Focus trap: cycles Tab between focusable items inside the lightbox
    function focusable() {
      return lb.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    }
    function trapKey(e) {
      if (e.key !== 'Tab') return;
      var items = Array.prototype.slice.call(focusable()).filter(function(el) {
        return !el.hasAttribute('disabled') && el.offsetParent !== null;
      });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function openLb(i) {
      lastFocused = document.activeElement;
      setLbIndex(i);
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('lightbox-open');
      etStopAuto();
      lb.addEventListener('keydown', trapKey);
      // Focus first interactive item on open (next frame to let display:flex apply)
      setTimeout(function() {
        var btns = focusable();
        if (btns.length) btns[0].focus();
        else if (closeBtn) closeBtn.focus();
      }, 0);
    }

    function closeLb() {
      lb.removeEventListener('keydown', trapKey);
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('lightbox-open');
      etStartAuto();
      if (lastFocused && typeof lastFocused.focus === 'function') {
        try { lastFocused.focus(); } catch (e) {}
      }
    }

    slideImgs.forEach(function(el, i) {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', function(e) {
        e.preventDefault();
        openLb(i);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLb);
    if (prevBtn) prevBtn.addEventListener('click', function() { setLbIndex(lbIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { setLbIndex(lbIndex + 1); });

    // Click backdrop to close (only when clicking the container itself, not children)
    lb.addEventListener('click', function(e) { if (e.target === lb) closeLb(); });

    // Keyboard: Esc close, ArrowLeft/Right nav
    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLb(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setLbIndex(lbIndex - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); setLbIndex(lbIndex + 1); }
    });

    // Touch swipe inside lightbox
    var lbSx = 0;
    lb.addEventListener('touchstart', function(e) { lbSx = e.touches[0].clientX; }, {passive: true});
    lb.addEventListener('touchend', function(e) {
      if (!lb.classList.contains('is-open')) return;
      var dx = lbSx - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 40) setLbIndex(lbIndex + (dx > 0 ? 1 : -1));
    }, {passive: true});
  })();
});
