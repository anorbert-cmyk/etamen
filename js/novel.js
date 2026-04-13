/* === novel.js === */
window.apokrif.register(function() {
  // The Novel — Reusable Fluid Letter-Stagger Toggle
  function initNovelToggle(cfg) {
    function splitChars(el) {
      var text = el.textContent; el.textContent = '';
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span'); span.className = 'char';
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i]; el.appendChild(span);
      }
      return el.querySelectorAll('.char');
    }

    var btn = document.getElementById(cfg.btn);
    var circle = document.getElementById(cfg.circle);
    var visTxt = document.getElementById(cfg.btnVis);
    var hidTxt = document.getElementById(cfg.btnHid);
    var imgDef = document.querySelector('#' + cfg.panel + ' .img-cover.default');
    var imgAlt = document.querySelector('#' + cfg.panel + ' .img-cover.alt');
    var s1 = document.getElementById(cfg.s1);
    var s2 = document.getElementById(cfg.s2);
    var desc1 = document.getElementById(cfg.desc1);
    var desc2 = document.getElementById(cfg.desc2);
    var label = document.getElementById(cfg.label);

    var chars1 = splitChars(s1);
    var chars2 = splitChars(s2);
    gsap.set(chars2, {opacity: 0, y: 50, scale: 0.6, rotateX: -60});
    gsap.set(s2, {opacity: 1});

    var isActive = false;
    var busy = false;

    var tlForward = gsap.timeline({paused: true, defaults: {ease: 'power3.out'}});
    tlForward
      .to(circle, {x: function() {return btn.offsetWidth - circle.offsetWidth - 8}, duration: .45, ease: 'power2.inOut'}, 0)
      .to(visTxt, {opacity: 0, duration: .2}, 0)
      .to(hidTxt, {opacity: 1, duration: .2}, .15)
      .to(imgDef, {opacity: 0, duration: .6, ease: 'power2.inOut'}, .05)
      .to(imgAlt, {opacity: 1, duration: .6, ease: 'power2.inOut'}, .05)
      .to(chars1, {opacity: 0, y: -60, scale: 0.4, rotateX: 90, duration: .5, stagger: {each: .03, from: 'center'}, ease: 'power3.in'}, .05)
      .to(chars2, {opacity: 1, y: 0, scale: 1, rotateX: 0, duration: .6, stagger: {each: .035, from: 'edges'}, ease: 'back.out(1.4)'}, .25)
      .to(desc1, {opacity: 0, y: -15, duration: .35}, .15)
      .to(desc2, {opacity: 1, y: 0, duration: .4}, .3)
      .to(label, {opacity: 0, duration: .12, onComplete: function() {label.textContent = cfg.labelAlt}}, .15)
      .to(label, {opacity: 1, duration: .12}, .35);

    var tlReverse = gsap.timeline({paused: true, defaults: {ease: 'power3.out'}});
    tlReverse
      .to(circle, {x: 0, duration: .45, ease: 'power2.inOut'}, 0)
      .to(hidTxt, {opacity: 0, duration: .2}, 0)
      .to(visTxt, {opacity: 1, duration: .2}, .15)
      .to(imgAlt, {opacity: 0, duration: .6, ease: 'power2.inOut'}, .05)
      .to(imgDef, {opacity: 1, duration: .6, ease: 'power2.inOut'}, .05)
      .to(chars2, {opacity: 0, y: 50, scale: 0.6, rotateX: -60, duration: .5, stagger: {each: .03, from: 'center'}, ease: 'power3.in'}, .05)
      .to(chars1, {opacity: 1, y: 0, scale: 1, rotateX: 0, duration: .6, stagger: {each: .035, from: 'edges'}, ease: 'back.out(1.4)'}, .25)
      .to(desc2, {opacity: 0, y: 15, duration: .35}, .15)
      .to(desc1, {opacity: 1, y: 0, duration: .4}, .3)
      .to(label, {opacity: 0, duration: .12, onComplete: function() {label.textContent = cfg.labelDef}}, .15)
      .to(label, {opacity: 1, duration: .12}, .35);

    gsap.from('#' + cfg.panel, {y: 40, opacity: 0, duration: .7, ease: 'power2.out', scrollTrigger: {trigger: '#' + cfg.section, start: 'top 70%', once: true}});
    gsap.from(chars1, {opacity: 0, y: 80, scale: 0.5, duration: .8, stagger: {each: .04, from: 'random'}, ease: 'back.out(1.7)', scrollTrigger: {trigger: '#' + cfg.section, start: 'top 65%', once: true}});

    btn.addEventListener('click', function() {
      if (busy) return;
      busy = true;
      isActive = !isActive;
      var tl = isActive ? tlForward : tlReverse;
      tl.eventCallback('onComplete', function() {busy = false});
      tl.restart();
    });
  }

  // Init both novel panels
  initNovelToggle({
    section: 'novel', panel: 'novelPanel',
    btn: 'novelBtn', circle: 'novelCircle',
    btnVis: 'novelBtnVis', btnHid: 'novelBtnHid',
    s1: 'novelS1', s2: 'novelS2',
    desc1: 'novelDesc1', desc2: 'novelDesc2',
    label: 'novelLabel',
    labelAlt: '',
    labelDef: ''
  });
  initNovelToggle({
    section: 'novel2', panel: 'novel2Panel',
    btn: 'novel2Btn', circle: 'novel2Circle',
    btnVis: 'novel2BtnVis', btnHid: 'novel2BtnHid',
    s1: 'novel2S1', s2: 'novel2S2',
    desc1: 'novel2Desc1', desc2: 'novel2Desc2',
    label: 'novel2Label',
    labelAlt: '',
    labelDef: ''
  });
  initNovelToggle({
    section: 'novel3', panel: 'novel3Panel',
    btn: 'novel3Btn', circle: 'novel3Circle',
    btnVis: 'novel3BtnVis', btnHid: 'novel3BtnHid',
    s1: 'novel3S1', s2: 'novel3S2',
    desc1: 'novel3Desc1', desc2: 'novel3Desc2',
    label: 'novel3Label',
    labelAlt: '',
    labelDef: ''
  });
});
