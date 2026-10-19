
/* Colorado Bounce Club - quote calculator, filters, copy, reveal, service worker */
(function () {
  function calc() {
    var u = document.getElementById('qUnit'), z = document.getElementById('qZone'), c = document.getElementById('qCombo'), out = document.getElementById('qOut');
    if (!u || !z || !c || !out) return;
    var price = parseInt(u.value || '175', 10), zone = parseInt(z.value || '0', 10), combo = parseInt(c.value || '1', 10);
    var disc = combo === 1 ? 25 : 0, total = price + zone - disc, comp = price + 75 + zone, saved = comp - total;
    if ((document.documentElement.lang || 'en') === 'es') {
      out.textContent = 'Total estimado: $' + total + ' (incluye $' + zone + ' de entrega' + (disc ? ' y -$25 del Combo Fiesta' : '') + '). Ahorra ~$' + saved + ' vs. tarifas publicadas de la competencia.';
    } else {
      out.textContent = 'Estimated total: $' + total + ' (includes $' + zone + ' delivery' + (disc ? ' and -$25 Feed and Bounce combo discount' : '') + '). Save ~$' + saved + ' vs. published competitor rates.';
    }
  }
  ['qUnit', 'qZone', 'qCombo'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('change', calc);
  });
  calc();

  var btns = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var f = b.getAttribute('data-filter');
      Array.prototype.slice.call(document.querySelectorAll('.unit-card')).forEach(function (card) {
        card.style.display = (f === 'all' || card.getAttribute('data-cat') === f) ? '' : 'none';
      });
    });
  });

  var copyBtn = document.getElementById('copySms');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var tpl = document.querySelector('.sms-tpl');
      if (!tpl || !navigator.clipboard) return;
      navigator.clipboard.writeText(tpl.textContent).then(function () {
        copyBtn.textContent = (document.documentElement.lang === 'es') ? 'Copiado' : 'Copied';
      });
    });
  }

  var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  if ('serviceWorker' in navigator) {
    var m = document.querySelector('link[rel="manifest"]');
    var base = m ? m.href.replace(/manifest\.json$/, '') : '/';
    navigator.serviceWorker.register(base + 'sw.js').catch(function () {});
  }
})();
