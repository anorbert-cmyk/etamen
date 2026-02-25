/* === coordinator.js === */
window.apokrif = {
  _inits: [],
  register: function(fn) { this._inits.push(fn); },
  _sliders: [],
  registerSlider: function(pause, resume) {
    this._sliders.push({ pause: pause, resume: resume });
  }
};
document.addEventListener('visibilitychange', function() {
  window.apokrif._sliders.forEach(function(s) {
    if (document.hidden) s.pause(); else s.resume();
  });
});
