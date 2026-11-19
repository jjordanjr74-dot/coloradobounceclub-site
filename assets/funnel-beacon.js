/* First-party conversion-intent beacon (Colorado Bounce Club).
 * CBC's only conversion path is a tap-to-call. Nothing could see whether anyone ever
 * tapped one, so "phone didn't ring" and "nobody visited" looked identical in the data.
 * Records {venture, event, page-path} only: no cookies, no ids, no IP, no third party.
 * Transport is an image pixel on purpose: several Tru sites are served with
 * `connect-src 'self'`, where fetch()/sendBeacon() are blocked silently, but `img-src https:`
 * lets the pixel through. Collector: https://app.thesoapbook.com/t
 * (see D:/Hermes_Core/scripts/funnel_collector.py and install_funnel_beacons.py).
 */
(function () {
  var V = "cbc";
  var URL = "https://app.thesoapbook.com/t";
  function send(ev) {
    try {
      var img = new Image(1, 1);
      img.src = URL + "/px.gif?v=" + encodeURIComponent(V)
              + "&e=" + encodeURIComponent(ev)
              + "&p=" + encodeURIComponent(location.pathname)
              + "&_=" + Date.now();
    } catch (e) {}
  }
  document.addEventListener("click", function (ev) {
    var el = ev.target;
    var a = el && el.closest ? el.closest("a") : null;
    if (!a) { return; }
    var h = a.getAttribute("href") || "";
    if (h.indexOf("tel:") === 0) { send("tel_click"); }
    else if (h.indexOf("mailto:") === 0) { send("email_click"); }
    else if (h.indexOf("buy.stripe.com") > -1 || h.indexOf("checkout.stripe.com") > -1) { send("checkout_click"); }
  }, true);
  window.addEventListener("load", function () { send("view"); });
})();