/* === gallery.js === */
window.apokrif.register(function() {
  // Community gallery dot click handler
  (function() {
    var dots = document.querySelectorAll('.gallery-dot');
    if (!dots.length) return;
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        dots.forEach(function(d) {
          d.classList.remove('active');
          d.setAttribute('aria-current', 'false');
        });
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      });
    });
  })();

  // Gallery Print Quality — Image Reveal (overlay slide + scale zoom-out)
  (function() {
    var books = document.querySelectorAll('.pq-book');
    if (!books.length) return;

    books.forEach(function(book) {
      gsap.set(book.querySelector('img'), {scale: 1.2, transformOrigin: 'center center'});
      gsap.set(book.querySelector('.pq-overlay'), {yPercent: 0});
    });

    ScrollTrigger.batch(books, {
      start: 'top 80%',
      onEnter: function(els) {
        els.forEach(function(book, i) {
          var delay = i * 0.15;
          gsap.to(book.querySelector('.pq-overlay'), {
            yPercent: 100,
            duration: 1,
            ease: 'power3.inOut',
            delay: delay
          });
          gsap.to(book.querySelector('img'), {
            scale: 1,
            duration: 1,
            ease: 'power3.inOut',
            delay: delay
          });
        });
      },
      once: true
    });
  })();
});
