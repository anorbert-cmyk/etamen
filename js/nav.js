/* === nav.js === */
window.apokrif.register(function() {
  // Nav scroll-progress fill
  // 'timeline' handled separately below (GSAP pin extends scroll distance)
  // 'factions' handled separately below — endTrigger:#rp covers the gallery dead zone
  var tabMap = {'et': '#et', 'team': '#team'};
  Object.keys(tabMap).forEach(function(key) {
    var link = document.querySelector('.nav-link.tab-link[data-s="' + key + '"]');
    var bg = link ? link.querySelector('.nav-link-bg') : null;
    if (!link || !bg) return;
    ScrollTrigger.create({
      trigger: tabMap[key], start: 'top top', end: 'bottom top',
      onUpdate: function(self) {bg.style.width = (self.progress * 100) + '%'},
      onLeave: function() {bg.style.width = '100%'},
      onLeaveBack: function() {bg.style.width = '0%'}
    });
  });

  // Factions + Gallery(rp) combined — #rp has no nav tab, extending factions to cover it
  (function() {
    var link = document.querySelector('.nav-link.tab-link[data-s="factions"]');
    var bg = link ? link.querySelector('.nav-link-bg') : null;
    if (!link || !bg) return;
    ScrollTrigger.create({
      trigger: '#factions', endTrigger: '#rp', start: 'top top', end: 'bottom top',
      onUpdate: function(self) {bg.style.width = (self.progress * 100) + '%'},
      onLeave: function() {bg.style.width = '100%'},
      onLeaveBack: function() {bg.style.width = '0%'}
    });
  })();

  // Timeline nav indicator — synced with GSAP pin scroll distance
  (function() {
    var link = document.querySelector('.nav-link.tab-link[data-s="timeline"]');
    var bg = link ? link.querySelector('.nav-link-bg') : null;
    if (!link || !bg) return;
    ScrollTrigger.create({
      trigger: '#timeline', start: 'top top',
      end: function() {
        var track = document.querySelector('.timeline-track');
        return '+=' + Math.max(0, track ? track.scrollWidth - window.innerWidth : 0);
      },
      invalidateOnRefresh: true,
      onUpdate: function(self) {bg.style.width = (self.progress * 100) + '%'},
      onLeave: function() {bg.style.width = '100%'},
      onLeaveBack: function() {bg.style.width = '0%'}
    });
  })();

  // The Novel progress spans #novel, #novel2 and #novel3
  (function() {
    var link = document.querySelector('.nav-link.tab-link[data-s="novel"]');
    var bg = link ? link.querySelector('.nav-link-bg') : null;
    if (!link || !bg) return;
    ScrollTrigger.create({
      trigger: '#novel', start: 'top top',
      endTrigger: '#novel3', end: 'bottom top',
      onUpdate: function(self) {bg.style.width = (self.progress * 100) + '%'},
      onLeave: function() {bg.style.width = '100%'},
      onLeaveBack: function() {bg.style.width = '0%'}
    });
  })();

  // Cached nav refs
  var mm = document.getElementById('mm');
  var hb = document.querySelector('.hb');

  // Smooth scroll — use offsetTop for sticky sections that stay at top:0
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    var href = a.getAttribute('href');
    if (!href || href === '#') return; // skip bare "#" anchors (e.g. Kickstarter button)
    a.addEventListener('click', function(e) {
      e.preventDefault();
      try {var t = document.querySelector(href)} catch(ex) {return}
      if (t) {
        var y = t.offsetTop - 60;
        gsap.to(window, {scrollTo: {y: Math.max(0, y), autoKill: false}, duration: .8, ease: 'power2.inOut'});
        if (mm) mm.classList.remove('open');
        if (hb) hb.classList.remove('active');
      }
    });
  });

  // Mobile menu
  if (hb) hb.addEventListener('click', function() {this.classList.toggle('active'); if (mm) mm.classList.toggle('open')});
});
