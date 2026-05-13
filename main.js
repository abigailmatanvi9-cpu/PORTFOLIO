(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var y = document.querySelector(".footer-year");
  if (y) {
    y.textContent = String(new Date().getFullYear());
  }

  document.querySelectorAll("img.project-shot").forEach(function (img) {
    var raw = img.getAttribute("data-fallbacks");
    var paths = raw
      ? raw
          .split(",")
          .map(function (s) {
            return s.trim();
          })
          .filter(Boolean)
      : [];
    var i = 0;
    function onError() {
      if (i >= paths.length) {
        img.removeEventListener("error", onError);
        var fig = img.closest("figure");
        if (fig) {
          fig.classList.add("shot-missing");
        }
        img.setAttribute("hidden", "");
        return;
      }
      img.src = paths[i];
      i += 1;
    }
    img.addEventListener("error", onError);
  });
})();
