/* === factions.js === */
window.apokrif.register(function() {
  // Factions carousel — fix panel + clip-path reveal transition
  (function() {
    var bgSlides = document.querySelectorAll('.fac-bg');
    var facTotal = bgSlides.length;
    if (!facTotal) return;
    var facCur = 0;
    var facBusy = false;

    // DOM refs — közös elemek
    var facFrontA = document.getElementById('facFrontA');
    var facFrontB = document.getElementById('facFrontB');
    var facActive = facFrontA; // melyik img az aktív (látható)
    var facTitle = document.getElementById('facTitle');
    var facDesc = document.getElementById('facDesc');
    var facLogo = document.getElementById('facLogo');
    var facLogoImg = facLogo ? facLogo.querySelector('img') : null;
    var facDotsEl = document.getElementById('facDots');
    var facPrevBtn = document.getElementById('facPrev');
    var facNextBtn = document.getElementById('facNext');

    var CDN_ACTIVE = 'https://cdn.prod.website-files.com/69028effd790024be3c8c4fd/69028effd790024be3c8c737_apokrif_web_landing_4_factions_layered19.png';
    var CDN_INACTIVE = 'https://cdn.prod.website-files.com/69028effd790024be3c8c4fd/69028effd790024be3c8c734_apokrif_web_landing_4_factions_layered16.png';

    // Faction adatok
    var facData = [
      {
        title: 'Ex<br>Sanguis',
        desc: 'Ex Sanguis is a religious cult founded during the madness of the Purge that has sworn to destroy all of vampirekind. The Peace provides sustenance and spiritual guidance to all who seek it, while the warlike knights and Inquisitors of the Path hunt down every vampiric whisper, stopping at nothing to cleanse the world of their corruption.',
        logo: 'https://cdn.prod.website-files.com/69028effd790024be3c8c4fd/69028effd790024be3c8c731_apokrif_web_landing_4_factions_layere13.png',
        front: 'images/gallerybg1.webp',
        frontAlt: 'Ex Sanguis warrior'
      },
      {
        title: 'Cradle',
        desc: 'A small settlement nestled in the ageing shell of a hydroelectric dam, Cradle is home to a few thousand survivors whose days are spent sourcing the food, energy, and materials they need to get through the day. Life isn\'t easy here, but they\'ve found a sense of community and camaraderie here that has made this place home.',
        logo: 'images/cradle.png',
        front: 'images/gallerybg2.webp',
        frontAlt: 'Cradle warrior'
      },
      {
        title: 'House<br>Mallat',
        desc: 'An ancient aristocratic house that once ruled over all the vampiric bloodlines, House Mallat has been left grasping the dregs of their former glory, having been unseated by the great Emperor Kastus, then decimated during the Purge. Now, they have vacated the small holding they maintained in North America, and seem to be in the midst of an exodus to the north of the continent.',
        logo: 'images/mallat.png',
        front: 'images/gallerybg3.webp',
        frontAlt: 'House Mallat warrior'
      }
    ];

    // Dot frissítés (egyetlen közös #facDots)
    function updateDots() {
      if (!facDotsEl) return;
      var imgs = facDotsEl.querySelectorAll('img');
      for (var d = 0; d < imgs.length; d++) {
        imgs[d].src = (d === facCur) ? CDN_ACTIVE : CDN_INACTIVE;
      }
    }

    // Fő váltó függvény
    function facGoTo(n) {
      if (facBusy) return;
      var next = ((n % facTotal) + facTotal) % facTotal;
      if (next === facCur) return;
      facBusy = true;
      var prev = facCur;
      facCur = next;

      // A) Háttér crossfade (Apple: lassú, sima)
      var bgTl = gsap.timeline();
      bgTl.to(bgSlides[prev], {opacity: 0, duration: 1.4, ease: 'power1.inOut'}, 0);
      bgTl.set(bgSlides[next], {zIndex: 2}, 0);
      bgTl.to(bgSlides[next], {opacity: 1, duration: 1.4, ease: 'power1.inOut'}, 0);
      bgTl.set(bgSlides[prev], {zIndex: 1}, 1.5);
      bgTl.call(function() {
        bgSlides[prev].classList.remove('active');
        bgSlides[next].classList.add('active');
      }, null, 0.1);

      // B) Front kép — Apple-stílusú crossfade (tiszta opacity + finom scale)
      var nextImg = (facActive === facFrontA) ? facFrontB : facFrontA;
      var prevImg = facActive;

      // Új kép előkészítése: láthatatlan, enyhén nagyítva (fog bezoomolni)
      nextImg.src = facData[next].front;
      nextImg.alt = facData[next].frontAlt;
      gsap.set(nextImg, {opacity: 0, scale: 1.04, zIndex: 2, clearProps: 'clipPath'});
      gsap.set(prevImg, {zIndex: 1, scale: 1});

      var frontTl = gsap.timeline();
      // Régi kép: nagyon finom zoom out + elhalványul
      frontTl.to(prevImg, {scale: 1.02, opacity: 0, duration: 1.6, ease: 'power1.inOut'}, 0);
      // Új kép: finom zoom in nullába + felhalványul — Apple-selymes crossfade
      frontTl.to(nextImg, {opacity: 1, scale: 1, duration: 1.8, ease: 'power1.inOut',
        onComplete: function() {
          gsap.set(prevImg, {opacity: 0, scale: 1, zIndex: 1});
          facActive = nextImg;
          facBusy = false;
        }
      }, 0);

      // C) Szürke sáv tartalom crossfade (sáv maga MINDIG fix)
      var cTl = gsap.timeline();
      cTl.to(facTitle, {opacity: 0, y: -8, duration: 0.25}, 0);
      cTl.to(facDesc, {opacity: 0, y: -8, duration: 0.25}, 0);
      if (facLogoImg) cTl.to(facLogoImg, {opacity: 0, scale: 0.85, duration: 0.25}, 0);
      cTl.call(function() {
        facTitle.innerHTML = facData[next].title;
        facDesc.textContent = facData[next].desc;
        if (facLogoImg) {facLogoImg.src = facData[next].logo; facLogoImg.alt = facData[next].title.replace(/<br>/g, ' ') + ' logo'}
        updateDots();
      }, null, 0.28);
      cTl.to(facTitle, {opacity: 1, y: 0, duration: 0.35, ease: 'power2.out'}, 0.32);
      cTl.to(facDesc, {opacity: 1, y: 0, duration: 0.35, ease: 'power2.out'}, 0.32);
      if (facLogoImg) cTl.to(facLogoImg, {opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out'}, 0.35);
    }

    // Arrow handlerek (egyetlen pár)
    if (facPrevBtn) facPrevBtn.addEventListener('click', function() {facStopAuto(); facGoTo(facCur - 1); facStartAuto()});
    if (facNextBtn) facNextBtn.addEventListener('click', function() {facStopAuto(); facGoTo(facCur + 1); facStartAuto()});

    // Auto-play
    var facAutoIv = null;
    function facStartAuto() {clearInterval(facAutoIv); facAutoIv = setInterval(function() {facGoTo(facCur + 1)}, 7000)}
    function facStopAuto() {clearInterval(facAutoIv); facAutoIv = null}
    facStartAuto();

    // Touch swipe
    var facSx = 0;
    var facEl = document.getElementById('factions');
    facEl.addEventListener('touchstart', function(e) {facSx = e.touches[0].clientX; facStopAuto()}, {passive: true});
    facEl.addEventListener('touchend', function(e) {
      var dx = facSx - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 40) {dx > 0 ? facGoTo(facCur + 1) : facGoTo(facCur - 1)}
      facStartAuto();
    });

    // Pause on hover
    facEl.addEventListener('mouseenter', function() {facStopAuto()});
    facEl.addEventListener('mouseleave', function() {facStartAuto()});

    // Register slider for centralized visibilitychange handling
    window.apokrif.registerSlider(facStopAuto, facStartAuto);

    // ScrollTrigger entrance
    var stConfig = {trigger: '#factions', start: 'top 75%', toggleActions: 'play none none reverse'};
    gsap.from(bgSlides[0], {scale: 1.1, duration: 1.4, ease: 'power2.out', scrollTrigger: stConfig});
    gsap.from(facActive, {y: 60, opacity: 0, scale: 1.05, duration: 1, ease: 'power2.out', scrollTrigger: Object.assign({}, stConfig, {start: 'top 65%'})});
  })();
});
