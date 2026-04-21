/* === gallery.js === */
window.apokrif.register(function() {
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
