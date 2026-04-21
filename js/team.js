/* === team.js — cinematic team section (intro reveal + master-scroll) ===
 * Performance-tuned: one intro ScrollTrigger (once:true) + one master-scroll
 * scrub timeline on desktop; static on mobile. Reduced-motion bails early.
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

  /* ------------------------------------------------------------------ *
   * Reduced-motion path — set final state, no ScrollTriggers.
   * ------------------------------------------------------------------ */
  if (reduce) {
    gsap.set('#team .team-intro-glyph', { opacity: 0.9, scale: 1, rotation: 0 });
    gsap.set('#team .team-intro-triangles span', { opacity: 1 });
    gsap.set('#team .team-intro-label-text, #team .team-intro-arrows span', { opacity: 1, y: 0 });
    gsap.set('#team .ms-station', { opacity: 1, x: 0, y: 0, rotationX: 0, clearProps: 'transform' });
    gsap.set('#team .ms-station .char', { opacity: 1, x: 0, y: 0, rotationX: 0, clearProps: 'transform,willChange' });
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
      var introPara = introTile.querySelector('.team-intro');
      var labelText = introTile.querySelector('.team-intro-label-text');
      var labelArrows = introTile.querySelectorAll('.team-intro-arrows span');
      var introGlyph = introTile.querySelector('.team-intro-glyph');
      var introTriangles = introTile.querySelectorAll('.team-intro-triangles span');

      // Pre-set initial states (avoid FOUC)
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

    /* -- Master scroll — 3 stations, CSS sticky center, GSAP scrub --- */
    var masterScroll = document.querySelector('.master-scroll');
    if (masterScroll) {
      var stations = masterScroll.querySelectorAll('.ms-station');
      // Split ms-name AND ms-motto for each station; eyebrow stays whole.
      var stationChars = Array.prototype.map.call(stations, function(st) {
        var targets = st.querySelectorAll('.ms-name, .ms-motto');
        var chars = [];
        targets.forEach(function(t) { chars.push.apply(chars, splitChars(t)); });
        return chars;
      });

      // Initial state: station 1 visible + chars at rest; stations 2,3 hidden with chars offset.
      gsap.set(stations[0], { opacity: 1 });
      gsap.set(stationChars[0], { y: 0, opacity: 1, rotationX: 0 });
      gsap.set([stations[1], stations[2]], { opacity: 0 });
      [stationChars[1], stationChars[2]].forEach(function(chars) {
        gsap.set(chars, { y: 60, opacity: 0, rotationX: -30 });
      });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: masterScroll,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Station 1 exit (unit 0.20 -> 0.30)
      tl.to(stationChars[0], {
        y: -60, opacity: 0, rotationX: 20,
        duration: 0.1, stagger: { each: 0.005 }, ease: 'power2.in',
      }, 0.20);
      tl.to(stations[0], { opacity: 0, duration: 0.05 }, 0.28);

      // Station 2 enter (unit 0.33 -> 0.45)
      tl.to(stations[1], { opacity: 1, duration: 0.05 }, 0.33);
      tl.to(stationChars[1], {
        y: 0, opacity: 1, rotationX: 0,
        duration: 0.12, stagger: { each: 0.006 }, ease: 'power3.out',
      }, 0.33);

      // Station 2 exit (unit 0.55 -> 0.65)
      tl.to(stationChars[1], {
        y: -60, opacity: 0, rotationX: 20,
        duration: 0.1, stagger: { each: 0.005 }, ease: 'power2.in',
      }, 0.55);
      tl.to(stations[1], { opacity: 0, duration: 0.05 }, 0.63);

      // Station 3 enter (unit 0.68 -> 0.80)
      tl.to(stations[2], { opacity: 1, duration: 0.05 }, 0.68);
      tl.to(stationChars[2], {
        y: 0, opacity: 1, rotationX: 0,
        duration: 0.12, stagger: { each: 0.006 }, ease: 'power3.out',
      }, 0.68);

      // Lazy images extend the column height after first paint — refresh once all have decoded.
      const mcImgs = masterScroll.querySelectorAll('.mc-slot img');
      let pending = mcImgs.length;
      const maybeRefresh = () => { if (--pending === 0) ScrollTrigger.refresh(); };
      mcImgs.forEach(img => {
        if (img.complete && img.naturalWidth > 0) maybeRefresh();
        else {
          img.addEventListener('load', maybeRefresh, { once: true });
          img.addEventListener('error', maybeRefresh, { once: true });
        }
      });
      // Failsafe: also refresh on window 'load' in case of cache quirks.
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    }
  });

  /* ================================================================== *
   *  MOBILE  (max-width: 768px)
   * ================================================================== */
  mm.add('(max-width:768px)', function() {
    // Intro: simple reveal (no char-split)
    var introTile = section.querySelector('.team-intro-tile');
    if (introTile) {
      var introPara = introTile.querySelector('.team-intro');
      var teaseImgs = introTile.querySelectorAll('.team-intro-tease img');
      if (introPara) gsap.set(introPara, { opacity: 0, y: 20 });
      if (teaseImgs.length) gsap.set(teaseImgs, { opacity: 0, y: 16 });
      ScrollTrigger.create({
        trigger: introTile,
        start: 'top 80%',
        once: true,
        onEnter: function() {
          if (introPara) gsap.to(introPara, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.15, force3D: true });
          if (teaseImgs.length) gsap.to(teaseImgs, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.25, stagger: 0.1, force3D: true });
        }
      });
    }
  });
});
