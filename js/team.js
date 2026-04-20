/* === team.js — cinematic team section (intro reveal + per-slide entrance) ===
 * Performance-tuned: one ScrollTrigger per slide (once:true), no scrub parallax,
 * no persistent will-change, force3D globally.
 * Desktop ScrollTrigger budget: 1 intro + 2 slide entries = 3 triggers total.
 */
window.apokrif.register(function() {
  var section = document.getElementById('team');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Global force3D — ensures all transform tweens hit the compositor */
  if (window.gsap && gsap.config) {
    gsap.config({ force3D: true });
  }

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
          frag.appendChild(document.createTextNode(ch));
          continue;
        }
        var span = document.createElement('span');
        span.className = 'char' + (strong ? ' char--strong' : '');
        span.style.display = 'inline-block';
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
    gsap.set('#team .team-card-pill', { opacity: 1, y: 0, clearProps: 'willChange' });
    gsap.set('#team .team-card-name', { opacity: 1, y: 0, clearProps: 'willChange' });
    gsap.set('#team .team-card-glyph', { opacity: 0.9, scale: 1, rotation: 0, y: 0 });
    gsap.set('#team .team-card-portrait', { clipPath: 'none', opacity: 1, clearProps: 'willChange' });
    gsap.set('#team .team-thumb', { clipPath: 'none', opacity: 1, y: 0, clearProps: 'transform,willChange' });
    gsap.set('#team .team-thumb img', { scale: 1, rotation: 0, clearProps: 'willChange' });
    gsap.set('#team .team-hero-art img', { clipPath: 'none', scale: 1, clearProps: 'willChange' });
    gsap.set('#team .team-intro-glyph', { opacity: 0.9, scale: 1, rotation: 0 });
    gsap.set('#team .team-intro-triangles span', { opacity: 1 });
    gsap.set('#team .team-intro-label-text, #team .team-intro-arrows span', { opacity: 1, y: 0 });
    return;
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
      if (paraChars.length) gsap.set(paraChars, { y: 40, opacity: 0, force3D: true });

      ScrollTrigger.create({
        trigger: introTile,
        start: 'top 70%',
        once: true,
        onEnter: function() {
          var tl = gsap.timeline({ defaults: { ease: 'power3.out', force3D: true } });

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
              stagger: 0.012,
              onComplete: function() { gsap.set(paraChars, { clearProps: 'willChange' }); }
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

    /* -- Per-slide ONE-SHOT entrance timeline (Aron + Conor) --------- */
    var slides = section.querySelectorAll('.team-slide');
    slides.forEach(function(slide) {
      var nameEl = slide.querySelector('.team-card-name');
      var pill = slide.querySelector('.team-card-pill');
      var glyph = slide.querySelector('.team-card-glyph');
      var portrait = slide.querySelector('.team-card-portrait');
      var work1 = slide.querySelector('.team-work-1');
      var work2 = slide.querySelector('.team-work-2');

      // Portrait wipes from the side it sits on:
      //   - Aron: portrait is on the LEFT half → wipe from 'left'
      //   - Conor: portrait is on the RIGHT half → wipe from 'right'
      var portraitDir = slide.id === 'teamConor' ? 'right' : 'left';
      // Works cluster on the OPPOSITE side → wipe from the opposite direction
      var worksDir = slide.id === 'teamConor' ? 'left' : 'right';

      // Pre-state: name chars split + hidden, pill + glyph hidden, clip-paths closed.
      var nameChars = nameEl ? splitChars(nameEl) : [];
      if (nameChars.length) {
        gsap.set(nameEl, { perspective: 600 });
        gsap.set(nameChars, {
          y: 60,
          opacity: 0,
          rotationX: -30,
          transformOrigin: '50% 50% -30px',
          force3D: true
        });
      }
      if (pill) gsap.set(pill, { y: 15, opacity: 0 });
      if (glyph) gsap.set(glyph, { scale: 0.5, y: -20, opacity: 0, transformOrigin: '50% 50%' });

      if (portrait) {
        var portraitInsets = revealInset(portraitDir);
        gsap.set(portrait, { clipPath: portraitInsets.from });
      }
      if (work1) {
        var w1Insets = revealInset(worksDir);
        gsap.set(work1, { clipPath: w1Insets.from });
        var w1Img = work1.querySelector('img');
        if (w1Img) gsap.set(w1Img, { scale: 1.1 });
      }
      if (work2) {
        var w2Insets = revealInset(worksDir);
        gsap.set(work2, { clipPath: w2Insets.from });
        var w2Img = work2.querySelector('img');
        if (w2Img) gsap.set(w2Img, { scale: 1.1 });
      }

      // ONE ScrollTrigger per slide — all reveals fire from a single timeline.
      ScrollTrigger.create({
        trigger: slide,
        start: 'top 60%',
        once: true,
        onEnter: function() {
          var tl = gsap.timeline({ defaults: { force3D: true, ease: 'power3.out' } });

          // 0.0s — pill fade + slide-up
          if (pill) {
            tl.to(pill, {
              y: 0,
              opacity: 1,
              duration: 0.6
            }, 0.0);
          }

          // 0.2s — name char-split
          if (nameEl) {
            tl.set(nameEl, { opacity: 1 }, 0.2);
          }
          if (nameChars.length) {
            tl.to(nameChars, {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 0.9,
              ease: 'power4.out',
              stagger: 0.02,
              onComplete: function() { gsap.set(nameChars, { clearProps: 'willChange' }); }
            }, 0.2);
          }

          // 0.4s — portrait clip-path reveal (from the creator's own side)
          if (portrait) {
            var portraitTo = revealInset(portraitDir).to;
            tl.to(portrait, {
              clipPath: portraitTo,
              duration: 1.0,
              ease: 'power3.inOut'
            }, 0.4);
          }

          // 0.5s — work1 clip-path reveal (opposite side from portrait)
          if (work1) {
            var w1To = revealInset(worksDir).to;
            tl.to(work1, {
              clipPath: w1To,
              duration: 1.1,
              ease: 'power3.inOut'
            }, 0.5);
            var w1ImgInner = work1.querySelector('img');
            if (w1ImgInner) {
              tl.to(w1ImgInner, {
                scale: 1.0,
                duration: 1.4,
                ease: 'power3.out'
              }, 0.5);
            }
          }

          // 0.6s — work2 clip-path reveal (same direction as work1)
          if (work2) {
            var w2To = revealInset(worksDir).to;
            tl.to(work2, {
              clipPath: w2To,
              duration: 1.1,
              ease: 'power3.inOut'
            }, 0.6);
            var w2ImgInner = work2.querySelector('img');
            if (w2ImgInner) {
              tl.to(w2ImgInner, {
                scale: 1.0,
                duration: 1.4,
                ease: 'power3.out'
              }, 0.6);
            }
          }

          // 0.8s — glyph fade/scale-in
          if (glyph) {
            tl.to(glyph, {
              scale: 1,
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'back.out(1.8)'
            }, 0.8);
          }
        }
      });
    });
  });

  /* ================================================================== *
   *  MOBILE  (max-width: 768px)
   * ================================================================== */
  mm.add('(max-width:768px)', function() {
    // Pills always visible
    gsap.set('#team .team-card-pill', { opacity: 1, y: 0, clearProps: 'transform,willChange' });

    // Name: simple fade-up per slide (no char-split on mobile)
    var slides = section.querySelectorAll('.team-slide');
    slides.forEach(function(slide) {
      var nameEl = slide.querySelector('.team-card-name');
      var glyph = slide.querySelector('.team-card-glyph');
      var portrait = slide.querySelector('.team-card-portrait');
      if (portrait) gsap.set(portrait, { clipPath: 'none', opacity: 0, y: 16 });
      if (nameEl) {
        gsap.set(nameEl, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: slide,
          start: 'top 70%',
          once: true,
          onEnter: function() {
            gsap.to(nameEl, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', force3D: true });
            if (portrait) {
              gsap.to(portrait, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1, force3D: true });
            }
            if (glyph) {
              gsap.fromTo(glyph,
                { opacity: 0, scale: 0.7 },
                { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)', delay: 0.2, force3D: true }
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
          gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', force3D: true });
        }
      });
    });

    // Intro: simple reveal (no char-split)
    var introTile = section.querySelector('.team-intro-tile');
    if (introTile) {
      var heroImg = introTile.querySelector('.team-hero-art img');
      var introPara = introTile.querySelector('.team-intro');
      var teaseImgs = introTile.querySelectorAll('.team-intro-tease img');
      if (heroImg) gsap.set(heroImg, { opacity: 0, scale: 1.05 });
      if (introPara) gsap.set(introPara, { opacity: 0, y: 20 });
      if (teaseImgs.length) gsap.set(teaseImgs, { opacity: 0, y: 16 });
      ScrollTrigger.create({
        trigger: introTile,
        start: 'top 80%',
        once: true,
        onEnter: function() {
          if (heroImg) gsap.to(heroImg, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', force3D: true });
          if (introPara) gsap.to(introPara, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.15, force3D: true });
          if (teaseImgs.length) gsap.to(teaseImgs, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.25, stagger: 0.1, force3D: true });
        }
      });
    }
  });
});
