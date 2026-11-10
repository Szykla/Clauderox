(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var slides = [].slice.call(document.querySelectorAll('[data-slide]'));

  // reveal on scroll
  var items = [].slice.call(document.querySelectorAll('[data-reveal], .tl'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // typed assignment in the hero
  var typed = document.getElementById('typed');
  var foot = document.getElementById('promptFoot');
  var text = typed.getAttribute('data-text');
  if (reduce) {
    typed.classList.add('done'); foot.classList.add('show');
  } else {
    typed.textContent = '';
    var i = 0;
    setTimeout(function tick() {
      i += 1;
      typed.textContent = text.slice(0, i);
      if (i < text.length) {
        var ch = text.charAt(i - 1);
        setTimeout(tick, ch === '.' || ch === ':' ? 260 : ch === ',' ? 120 : 22);
      } else {
        setTimeout(function () { typed.classList.add('done'); foot.classList.add('show'); }, 500);
      }
    }, 900);
  }

  // progress bar and active chapter
  var bar = document.getElementById('progress');
  var links = [].slice.call(document.querySelectorAll('.bar nav a'));
  var ticking = false;
  function current() {
    var mid = window.scrollY + window.innerHeight * 0.35, idx = 0;
    slides.forEach(function (s, n) { if (s.offsetTop <= mid) idx = n; });
    return idx;
  }
  function update() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    var id = slides[current()].id;
    links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + id); });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();

  // left and right arrow keys page through the chapters
  window.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA') return;
    var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    var next = Math.max(0, Math.min(slides.length - 1, current() + dir));
    slides[next].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  // click a screenshot to see it large
  var box = document.getElementById('lightbox');
  var boxImg = box.querySelector('img');
  function openBox(img) { boxImg.src = img.src; boxImg.alt = img.alt; box.hidden = false; }
  [].slice.call(document.querySelectorAll('img.zoom')).forEach(function (img) {
    img.addEventListener('click', function () { openBox(img); });
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBox(img); } });
  });
  box.addEventListener('click', function () { box.hidden = true; });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.hidden = true; });

  // the approval card
  var pill = document.getElementById('apPill');
  var out = document.getElementById('apOut');
  [].slice.call(document.querySelectorAll('#approve button')).forEach(function (b) {
    b.addEventListener('click', function () {
      var yes = b.getAttribute('data-ans') === 'yes';
      pill.textContent = yes ? 'Erlaubt' : 'Abgelehnt';
      pill.className = 'pill ' + (yes ? 'ok' : 'no');
      out.textContent = yes
        ? 'Erlaubt. Erst jetzt gibt sie die 40 Cent aus und sucht weiter.'
        : 'Abgelehnt. Sie gibt nichts aus und arbeitet mit dem weiter, was sie hat.';
    });
  });
})();
