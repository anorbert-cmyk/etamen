/* === team.js — two-slide cinematic team section (intro + per-person reveal) === */
window.apokrif.register(function () {
  var section = document.getElementById('team');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- helpers ------------------------------------------------- */

  // Splits an element's innerHTML into per-character <span class="char">,
  // preserving <strong> tags (chars inside gain .char--strong) and whitespace.
  function splitChars(el) {
    if (!el) return [];
    var chars = [];
    function wrapTextNode(textNode, parent, strong) {
      var text = textNode.nodeValue;
      if (!text) return;
      var frag = document.createDocumentFragment();
      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        if (ch === ' ' || ch === '\u00a0') {
          frag.appendChild(document.createTextNode(ch));
          continue;
        }
        var span = document.createElement('span');
        span.className = 'char' + (strong ? ' char--strong' : '');
        span.style.display = 'inline-block';
        span.style.willChange = 'transform, opacity';
        span.textContent = ch;
        frag.appendChild(span);
        chars.push(span);
      }
      parent.replaceChild(frag, textNode);
    }
    function walk(node, strong) {
      var kids = Array.prototype.slice.call(node.childNodes);
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i];
        if (n.nodeType === 3) {
          wrapTextNode(n, node, strong);
        } else if (n.nodeType === 1) {
          var isStrong = strong || n.tagName === 'STRONG' || n.tagName === 'B';
          walk(n, isStrong);
        }
      }
    }
    walk(el, false);
    return chars;
  }

  function revealInset(dir) {
    switch (dir) {
      case 'left':   return { from: 'inset(0 100% 0 0)', to: 'inset(0 0 0 0)' };
      case 'right':  return { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0)' };
      case 'bottom': return { from: 'inset(100% 0 0 0)', to: 'inset(0 0 0 0)' };
      case 'top':    return { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0 0)' };
      default:       return { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0 0)' };
    }
  }

  /* ---------- reduced-motion: set final state and bail ---------------- */
  if (reduce) {
    gsap.set('#team .team-card-pill', { opacity: 1, y: 0 });
    gsap.set('#team .team-card-name', { opacity: 1, y: 0 });
    gsap.set('#team .team-card-glyph', { opacity: 0.9, scale: 1, rotation: 0, y: 0 });
    gsap.set('#team .team-thumb', { clipPath: 'none', opacity: 1, y: 0 });
    gsap.set('#team .team-thumb img', { scale: 1 });
    gsap.set('#team .team-intro-glyph', { opacity: 0.9, scale: 1, rotation: 0 });
    gsap.set('#team .team-intro-triangles span', { opacity: 1 });
    gsap.set('#team .team-intro-label-text, #team .team-intro-arrows span', { opacity: 1, y: 0 });
    return;
  }

  /* ---------- desktop vs mobile split --------------------------------- */
  var mm = gsap.matchMedia();

  /* ========================== DESKTOP ============================== */
  mm.add('(min-width:769px)', function () {

    /* ---- Intro tile reveal (once) ---------------------------------- */
    var introTile = section.querySelector('.team-intro-tile');
    if (introTile) {
      var introPara    = introTile.querySelector('.team-intro');
      var labelText    = introTile.querySelector('.team-intro-label-text');
      var labelArrows  = introTile.querySelectorAll('.team-intro-arrows span');
      var introGlyph   = introTile.querySelector('.team-intro-glyph');
      var triangles    = introTile.querySelectorAll('.team-intro-triangles span');

      if (labelText)      gsap.set(labelText, { y: 20, opacity: 0 });
      if (labelArrows.length) gsap.set(labelArrows, { y: -15, opacity: 0 });
      if (introGlyph)     gsap.set(introGlyph, { scale: 0.4, rotation: -12, opacity: 0, transformOrigin: '50% 50%' });
      if (triangles.length) gsap.set(triangles, { opacity: 0, scale: 0.7 });

      var paraChars = introPara ? splitChars(introPara) : [];
      if (paraChars.length) gsap.set(paraChars, { y: 40, opacity: 0 });

      ScrollTrigger.create({
        trigger: introTile,
        start: 'top 75%',
        once: true,
        onEnter: function () {
          var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          if (labelText)       tl.to(labelText,   { y: 0, opacity: 1, duration: 0.8 }, 0.1);
          if (labelArrows.length) tl.to(labelArrows, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, 0.3);
          if (paraChars.length) {
            tl.to(paraChars, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.012 }, 0.25);
            var strongChars = paraChars.filter(function (c) { return c.classList.contains('char--strong'); });
            if (strongChars.length) {
              tl.fromTo(strongChars,
                { color: 'rgba(255,255,255,0.55)' },
                { color: '#ffffff', duration: 0.6, ease: 'power2.out', stagger: 0.01 },
                0.7);
            }
          }
          if (introGlyph)      tl.to(introGlyph, { scale: 1, rotation: 0, opacity: 0.9, duration: 1.1, ease: 'elastic.out(1, 0.7)' }, 0.6);
          if (triangles.length) tl.to(triangles, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', stagger: 0.04 }, 0.9);
        }
      });
    }

    /* ---- Per-slide animations (Aron + Conor) ----------------------- */
    var slides = section.querySelectorAll('.team-slide');
    slides.forEach(function (slide) {
      var nameEl = slide.querySelector('.team-card-name');
      var pill   = slide.querySelector('.team-card-pill');
      var glyph  = slide.querySelector('.team-card-glyph');

      // Name char split with 3D tilt entrance.
      var nameChars = nameEl ? splitChars(nameEl) : [];
      if (nameEl) gsap.set(nameEl, { perspective: 600 });
      if (nameChars.length) {
        gsap.set(nameChars, {
          y: 60, opacity: 0, rotationX: -30,
          transformOrigin: '50% 50% -30px'
        });
      }
      if (pill)  gsap.set(pill,  { y: 15, opacity: 0 });
      if (glyph) gsap.set(glyph, { scale: 0.5, y: -20, opacity: 0, transformOrigin: '50% 50%' });

      ScrollTrigger.create({
        trigger: slide,
        start: 'top 60%',
        once: true,
        onEnter: function () {
          var tl = gsap.timeline();
          if (nameEl) tl.set(nameEl, { opacity: 1 }, 0);
          if (pill)   tl.to(pill,  { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0);
          if (nameChars.length) {
            tl.to(nameChars, {
              y: 0, opacity: 1, rotationX: 0,
              duration: 0.9, ease: 'power4.out', stagger: 0.025
            }, 0.15);
          }
          if (glyph) tl.to(glyph, { scale: 1, y: 0, opacity: 0.9, duration: 0.8, ease: 'back.out(1.8)' }, 0.55);
        }
      });

      /* Thumbs: clip-path reveal + parallax drift + img breath */
      var thumbs = slide.querySelectorAll('.team-thumb');
      var driftSpeeds = [-18, 24, -14, 20, -12, 18, -20, 16];
      thumbs.forEach(function (thumb, i) {
        var dir = thumb.getAttribute('data-reveal') || 'bottom';
        var insets = revealInset(dir);
        gsap.set(thumb, { clipPath: insets.from });

        gsap.to(thumb, {
          clipPath: insets.to,
          duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: thumb, start: 'top 88%', once: true }
        });

        gsap.fromTo(thumb,
          { yPercent: 0 },
          {
            yPercent: driftSpeeds[i % driftSpeeds.length], ease: 'none',
            scrollTrigger: { trigger: thumb, start: 'top bottom', end: 'bottom top', scrub: 1 }
          });

        var img = thumb.querySelector('img');
        if (img) {
          gsap.fromTo(img,
            { scale: 1.18 },
            {
              scale: 1, ease: 'none',
              scrollTrigger: { trigger: thumb, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
            });
        }
      });
    });
  });

  /* ========================== MOBILE =============================== */
  mm.add('(max-width:768px)', function () {
    gsap.set('#team .team-card-pill', { opacity: 1, y: 0, clearProps: 'transform' });

    var slides = section.querySelectorAll('.team-slide');
    slides.forEach(function (slide) {
      var nameEl = slide.querySelector('.team-card-name');
      var glyph  = slide.querySelector('.team-card-glyph');
      if (nameEl) {
        gsap.set(nameEl, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: slide, start: 'top 70%', once: true,
          onEnter: function () {
            gsap.to(nameEl, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
            if (glyph) {
              gsap.fromTo(glyph,
                { opacity: 0, scale: 0.7 },
                { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)', delay: 0.2 });
            }
          }
        });
      }
    });

    var thumbs = section.querySelectorAll('.team-thumb');
    gsap.set(thumbs, { opacity: 0, y: 30, clipPath: 'none' });
    ScrollTrigger.batch(thumbs, {
      start: 'top 85%',
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 });
      }
    });
  });

  /* ---------- refresh on image load so late-decoded thumbs re-layout - */
  var imgs = section.querySelectorAll('img');
  imgs.forEach(function (img) {
    if (!img.complete) {
      img.addEventListener('load',  function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); }, { once: true });
      img.addEventListener('error', function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); }, { once: true });
    }
  });
  window.addEventListener('load', function () {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }, { once: true });

  /* ---------- SAFETY-NET: pill + name must never stay invisible ------ */
  // If ScrollTrigger onEnter didn't fire (fast scroll, sticky quirk, etc.),
  // force banners visible after 2.8s on both slides.
  function ensureVisible(slideId) {
    var slide = document.getElementById(slideId);
    if (!slide) return;
    var pill  = slide.querySelector('.team-card-pill');
    var name  = slide.querySelector('.team-card-name');
    var chars = slide.querySelectorAll('.team-card-name .char');
    var glyph = slide.querySelector('.team-card-glyph');

    setTimeout(function () {
      if (pill && getComputedStyle(pill).opacity === '0') {
        gsap.to(pill, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
      }
      if (name && getComputedStyle(name).opacity === '0') {
        gsap.set(name, { opacity: 1 });
      }
      if (chars.length && getComputedStyle(chars[0]).opacity === '0') {
        gsap.to(chars, {
          y: 0, opacity: 1, rotationX: 0,
          duration: 0.9, ease: 'power4.out',
          stagger: 0.02, overwrite: 'auto'
        });
      }
      if (glyph && getComputedStyle(glyph).opacity === '0') {
        gsap.to(glyph, { scale: 1, y: 0, opacity: 0.9, duration: 0.8, ease: 'back.out(1.8)', overwrite: 'auto' });
      }
    }, 2800);
  }
  ensureVisible('teamAron');
  ensureVisible('teamConor');
});
