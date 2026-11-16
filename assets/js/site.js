// Small progressive enhancements. Everything works without this file.
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Gentle fade-in for blocks marked .reveal (skipped for reduced motion)
  var reveals = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // 2. Case-study chapter nav: mark the chapter currently being read
  var nav = document.querySelector(".chapters");
  if (nav && "IntersectionObserver" in window) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var current = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var a = byId[e.target.id];
        if (!a || a === current) return;
        if (current) current.removeAttribute("aria-current");
        a.setAttribute("aria-current", "true");
        current = a;
        // keep the active item visible when the nav scrolls sideways on phones
        var list = a.closest("ol");
        if (list && list.scrollWidth > list.clientWidth) {
          list.scrollTo({ left: a.offsetLeft - 24, behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(byId).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  // 3. Footer year
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());
})();
