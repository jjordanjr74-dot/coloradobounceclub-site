/* First-party conversion-intent beacon (Colorado Bounce Club).
 * CBC's only conversion path is a tap-to-call. Nothing could see whether anyone ever
 * tapped one, so "phone didn't ring" and "nobody visited" looked identical in the data.
 * This records {venture, event, page-path} only: no cookies, no ids, no IP, no third
 * party. Collector: https://app.thesoapbook.com/t (see scripts/funnel_collector.py).
 */
(function () {
  var V = "cbc";
  var URL = "https://app.thesoapbook.com/t";
  function send(ev) {
    try {
      var body = JSON.stringify({ v: V, e: ev, p: location.pathname });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(URL, new Blob([body], { type: "text/plain;charset=UTF-8" }));
      } else {
        fetch(URL, { method: "POST", body: body, headers: { "Content-Type": "application/json" }, keepalive: true, mode: "cors" });
      }
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