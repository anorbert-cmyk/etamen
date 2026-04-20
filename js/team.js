/* === team.js — cinematic team section (intro reveal + per-slide scroll drama) === */
window.apokrif.register(function() {
  var section = document.getElementById('team');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */

  // Splits an element's innerHTML into per-character <span class="char">,
  // preserving <strong> tags (chars inside gain .char--strong) and whitespace.
  // Returns the collected array of .char spans.
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
          // preserve spaces as real whitespace so wrapping works naturally
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
      // collect childNodes into array first (live list mutates during replace)
      var kids = Array.prototype.slice.call(node.childNodes);
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i];
        if (n.nodeType === 3 /* text */) {
          wrapTextNode(n, node, strong);
        } else if (n.nodeType === 1 /* element */) {
          var isStrong = strong || n.tagName === 'STRONG' || n.tagName === 'B';
          walk(n, isStrong);
        }
      }
    }

    walk(el, false);
    return chars;
  }

  // Reveal clip-path map based on which edge the image bleeds from.
  // direction = the edge the image is anchored to; reveal wipes FROM that edge.
  function revealInset(dir) {
    switch (dir) {
      case 'left':
        return { from: 'inset(0 100% 0 0)', to: 'inset(0 0 0 0)' };
      case 'right':
        return { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0)' };
      case 'bottom':
        return { from: 'inset(100% 0 0 0)', to: 'inset(0 0 0 0)' };
      case 'top':
        return { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0 0)' };
      default:
        return { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0 0)' };
    }
  }

  /* ------------------------------------------------------------------ *
   * Reduced-motion path — set final state, no ScrollTriggers.
   * ------------------------------------------------------------------ */
  if (reduce) {
    var bgLayers = section.querySelectorAll('.team-bg-layer');
    if (bgLayers[0]) bgLayers[0].style.opacity = '1';
    if (bgLayers[1]) bgLayers[1].style.opacity = '0';
    if (bgLayers[2]) bgLayers[2].style.opacity = '0';

    gsap.set('#team .team-card-pill', { opacity: 1, y: 0 });
    gsap.set('#team .team-card-name', { opacity: 1, y: 0 });
    gsap.set('#team .team-card-glyph', { opacity: 0.9, scale: 1, rotation: 0, y: 0 });
    gsap.set('#team .team-thumb', { clipPath: 'none', opacity: 1, y: 0 });
    gsap.set('#team .team-thumb img', { scale: 1, rotation: 0 });
    gsap.set('#team .team-hero-art img', { clipPath: 'none', scale: 1 });
    gsap.set('#team .team-intro-glyph', { opacity: 0.9, scale: 1, rotation: 0 });
    gsap.set('#team .team-intro-triangles span', { opacity: 1 });
    gsap.set('#team .team-intro-label-text, #team .team-intro-arrows span', { opacity: 1, y: 0 });
    return;
  }

  /* ------------------------------------------------------------------ *
   * Backdrop crossfade (ambience) — 3-layer opacity scrub.
   * ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ *
   * Responsive split (desktop vs mobile) — gsap.matchMedia auto-cleans.
   * ------------------------------------------------------------------ */
  var mm = gsap.matchMedia();

  /* ================================================================== *
   *  DESKTOP  (min-width: 769px)
   * ================================================================== */
  mm.add('(min-width:769px)', function() {

    /* -- Intro tile reveal (once, as tile enters) -------------------- */
    var introTile = section.querySelector('.team-intro-tile');
    if (introTile) {
      var heroImg = introTile.querySelector('.team-hero-art img');
      var introPara = introTile.querySelector('.team-intro');
      var labelText = introTile.querySelector('.team-intro-label-text');
      var labelArrows = introTile.querySelectorAll('.team-intro-arrows span');
      var introGlyph = introTile.querySelector('.team-intro-glyph');
      var introTriangles = introTile.querySelectorAll('.team-intro-triangles span');

      // Pre-set initial states (avoid FOUC)
      if (heroImg) gsap.set(heroImg, { clipPath: 'inset(0 100% 0 0)', scale: 1.15, transformOrigin: '50% 50%' });
      if (labelText) gsap.set(labelText, { y: 20, opacity: 0 });
      if (labelArrows.length) gsap.set(labelArrows, { y: -15, opacity: 0 });
      if (introGlyph) gsap.set(introGlyph, { scale: 0.4, rotation: -12, opacity: 0, transformOrigin: '50% 50%' });
      if (introTriangles.length) gsap.set(introTriangles, { opacity: 0, scale: 0.7 });

      // Split paragraph chars (preserves <strong>)
      var paraChars = introPara ? splitChars(introPara) : [];
      if (paraChars.length) gsap.set(paraChars, { y: 40, opacity: 0 });

      ScrollTrigger.create({
        trigger: introTile,
        start: 'top 70%',
        once: true,
        onEnter: function() {
          var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          if (heroImg) {
            tl.to(heroImg, {
              clipPath: 'inset(0 0 0 0)',
              scale: 1,
              duration: 1.4,
              ease: 'power4.out'
            }, 0);
          }

          if (labelText) {
            tl.to(labelText, { y: 0, opacity: 1, duration: 0.8 }, 0.3);
          }

          if (labelArrows.length) {
            tl.to(labelArrows, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1
            }, 0.5);
          }

          if (paraChars.length) {
            tl.to(paraChars, {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'power3.out',
              stagger: 0.012
            }, 0.45);

            // Accent highlight on <strong> chars
            var strongChars = paraChars.filter(function(c) { return c.classList.contains('char--strong'); });
            if (strongChars.length) {
              tl.fromTo(strongChars,
                { color: 'rgba(255,255,255,0.55)' },
                { color: '#ffffff', duration: 0.6, ease: 'power2.out', stagger: 0.01 },
                0.9
              );
            }
          }

          if (introGlyph) {
            tl.to(introGlyph, {
              scale: 1,
              rotation: 0,
              opacity: 0.9,
              duration: 1.2,
              ease: 'elastic.out(1, 0.7)'
            }, 0.8);
          }

          if (introTriangles.length) {
            tl.to(introTriangles, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'power3.out',
              stagger: 0.04
            }, 1.1);
          }
        }
      });
    }

    /* -- Per-slide animations (Aron + Conor) ------------------------- */
    var slides = section.querySelectorAll('.team-slide');
    slides.forEach(function(slide) {
      var card = slide.querySelector('.team-card');
      var nameEl = slide.querySelector('.team-card-name');
      var pill = slide.querySelector('.team-card-pill');
      var glyph = slide.querySelector('.team-card-glyph');

      // Name: split chars with 3D tilt. Parent stays opacity:0 (set in CSS) to prevent
      // pre-hydration FOUC of the saw-tooth banner, then unmask at timeline start.
      var nameChars = nameEl ? splitChars(nameEl) : [];
      if (nameChars.length) {
        gsap.set(nameEl, { perspective: 600 });
        gsap.set(nameChars, {
          y: 60,
          opacity: 0,
          rotationX: -30,
          transformOrigin: '50% 50% -30px'
        });
      }
      if (pill) gsap.set(pill, { y: 15, opacity: 0 });
      if (glyph) gsap.set(glyph, { scale: 0.5, y: -20, opacity: 0, transformOrigin: '50% 50%' });

      ScrollTrigger.create({
        trigger: slide,
        start: 'top 55%',
        once: true,
        onEnter: function() {
          var tl = gsap.timeline();
          if (nameEl) {
            tl.set(nameEl, { opacity: 1 }, 0);
          }
          if (nameChars.length) {
            tl.to(nameChars, {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 0.9,
              ease: 'power4.out',
              stagger: 0.02
            }, 0);
          }
          if (pill) {
            tl.to(pill, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out'
            }, 0.3);
          }
          if (glyph) {
            tl.to(glyph, {
              scale: 1,
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'back.out(1.8)'
            }, 0.6);
          }
        }
      });

      /* -- Thumbs: clip-path reveal + parallax + inner img breath ---- */
      var thumbs = slide.querySelectorAll('.team-thumb');
      var driftSpeeds = [-18, 24, -14];
      thumbs.forEach(function(thumb, i) {
        var dir = thumb.getAttribute('data-reveal') || 'bottom';
        var insets = revealInset(dir);

        // Initial clipped state
        gsap.set(thumb, { clipPath: insets.from });

        // 1) Clip-path reveal (once)
        gsap.to(thumb, {
          clipPath: insets.to,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: thumb,
            start: 'top 82%',
            once: true
          }
        });

        // 2) Parallax drift (scrub)
        gsap.fromTo(thumb,
          { yPercent: 0 },
          {
            yPercent: driftSpeeds[i % 3],
            ease: 'none',
            scrollTrigger: {
              trigger: thumb,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          }
        );

        // 3) Inner img scale + subtle rotate (scrub)
        var img = thumb.querySelector('img');
        if (img) {
          gsap.fromTo(img,
            { scale: 1.2, rotation: -2 },
            {
              scale: 1,
              rotation: 2,
              ease: 'none',
              scrollTrigger: {
                trigger: thumb,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8
              }
            }
          );
        }
      });
    });
  });

  /* ================================================================== *
   *  MOBILE  (max-width: 768px)
   * ================================================================== */
  mm.add('(max-width:768px)', function() {
    // Pills always visible
    gsap.set('#team .team-card-pill', { opacity: 1, y: 0, clearProps: 'transform' });

    // Name: simple fade-up per slide (no char-split on mobile)
    var slides = section.querySelectorAll('.team-slide');
    slides.forEach(function(slide) {
      var nameEl = slide.querySelector('.team-card-name');
      var glyph = slide.querySelector('.team-card-glyph');
      if (nameEl) {
        gsap.set(nameEl, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: slide,
          start: 'top 70%',
          once: true,
          onEnter: function() {
            gsap.to(nameEl, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
            if (glyph) {
              gsap.fromTo(glyph,
                { opacity: 0, scale: 0.7 },
                { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)', delay: 0.2 }
              );
            }
          }
        });
      }
    });

    // Thumbs: fade-up on enter (no clip-path, no parallax scrub)
    var thumbs = section.querySelectorAll('.team-thumb');
    thumbs.forEach(function(el) {
      gsap.set(el, { clipPath: 'none', opacity: 0, y: 24 });
      gsap.set(el.querySelectorAll('img'), { scale: 1, rotation: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: function() {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
        }
      });
    });

    // Intro: simple reveal (no char-split)
    var introTile = section.querySelector('.team-intro-tile');
    if (introTile) {
      var heroImg = introTile.querySelector('.team-hero-art img');
      var introPara = introTile.querySelector('.team-intro');
      if (heroImg) gsap.set(heroImg, { opacity: 0, scale: 1.05 });
      if (introPara) gsap.set(introPara, { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: introTile,
        start: 'top 80%',
        once: true,
        onEnter: function() {
          if (heroImg) gsap.to(heroImg, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' });
          if (introPara) gsap.to(introPara, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.15 });
        }
      });
    }
  });
});
