(function () {
  /**
   * GitHub Pages « projet » : …/github.io/NOM-DEPOT/ — chemins relatifs
   * (ex. hairconnect-1.png) en absolu pour éviter les 404.
   */
  function githubPagesRoot() {
    var host = location.hostname;
    if (!host.endsWith("github.io")) return "";
    var path = location.pathname.replace(/\/index\.html$/i, "");
    var parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return "";
    var repo = parts[0];
    if (!repo) return "";
    return location.origin + "/" + repo + "/";
  }

  function absolutizeAssetPath(relative) {
    var r = (relative || "").trim();
    if (!r || /^https?:\/\//i.test(r)) return r;
    var root = githubPagesRoot();
    if (!root) return r;
    return root + r.replace(/^\//, "");
  }

  var root = githubPagesRoot();

  if (root) {
    var cvFile = "CV-Abigail-Matanvi.pdf";
    var cvUrl = absolutizeAssetPath(cvFile);
    document.querySelectorAll('a[href="' + cvFile + '"]').forEach(function (a) {
      a.setAttribute("href", cvUrl);
    });
  }

  document.querySelectorAll("img.project-shot").forEach(function (img) {
    var fallbackRaw = img.getAttribute("data-fallbacks");
    var paths = [];
    if (fallbackRaw) {
      paths = fallbackRaw
        .split(",")
        .map(function (s) {
          var t = s.trim();
          return root ? absolutizeAssetPath(t) : t;
        })
        .filter(Boolean);
      if (root) {
        img.setAttribute("data-fallbacks", paths.join(","));
      }
    }

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

    var srcAttr = img.getAttribute("src");
    var firstSrc = root ? absolutizeAssetPath(srcAttr) : srcAttr;
    if (firstSrc) {
      img.src = firstSrc;
    }
  });

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
})();
